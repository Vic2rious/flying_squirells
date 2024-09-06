import {
  Controller,
  Post,
  Param,
  Res,
  Get,
  NotFoundException,
  HttpException,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrdersService } from './orders.service';
import Stripe from 'stripe';
import { Response, Request } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  private stripe: Stripe;

  constructor(
    private readonly ordersService: OrdersService,
    private readonly configService: ConfigService,
  ) {
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    this.stripe = new Stripe(stripeSecretKey);
  }

  @Post('checkout/:orderId')
  @ApiOperation({ summary: 'Create a checkout session' })
  @ApiParam({ name: 'orderId', description: 'ID of the order' })
  @ApiResponse({
    status: 200,
    description: 'Returns the URL of the checkout session',
    schema: {
      example: { url: 'https://checkout.stripe.com/.../checkout' },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Error creating checkout session',
  })
  async createCheckoutSession(
    @Param('orderId') orderId: string,
    @Res() res: Response,
  ) {
    const order = await this.ordersService.getOrderById(Number(orderId));
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Order #${orderId}`,
              },
              unit_amount: Number(order.price) * 100, // Price in cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: 'http://localhost:3000/payments/success',
        cancel_url: 'http://localhost:3000/payments/cancel',
      });

      return res.json({ url: session.url });
    } catch (error) {
      throw new HttpException(
        `Error creating checkout session: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Handle Stripe webhook events' })
  @ApiResponse({
    status: 200,
    description: 'Webhook received and processed',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid webhook signature',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
      const endpointSecret = this.configService.get<string>(
        'STRIPE_WEBHOOK_SECRET',
      ); // Store the webhook secret in the .env file

      // Convert the ReadableStream to Buffer
      const chunks: Buffer[] = [];
      req.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      req.on('end', () => {
        const body = Buffer.concat(chunks);
        try {
          event = this.stripe.webhooks.constructEvent(
            body, // Raw request body as Buffer
            sig, // Stripe signature
            endpointSecret, // Your webhook signing secret
          );

          // Handle different event types
          switch (event.type) {
            case 'checkout.session.completed':
              const session = event.data.object as Stripe.Checkout.Session;
              // Payment was successful
              console.log(`Payment was successful for session ${session.id}`);
              break;
            case 'payment_intent.payment_failed':
              const paymentIntent = event.data.object as Stripe.PaymentIntent;
              // Payment failed
              console.log(`Payment failed for intent ${paymentIntent.id}`);
              break;
            default:
              console.log(`Unhandled event type ${event.type}`);
          }

          res.status(200).json({ received: true });
        } catch (err) {
          console.log(
            `⚠️  Webhook signature verification failed.`,
            err.message,
          );
          res.status(400).send(`Webhook Error: ${err.message}`);
        }
      });
    } catch (err) {
      console.log(`⚠️  Webhook error`, err.message);
      res.status(500).send(`Webhook Error: ${err.message}`);
    }
  }

  @Get('success')
  @ApiOperation({ summary: 'Payment success page' })
  @ApiResponse({
    status: 200,
    description: 'Payment was successful',
  })
  getSuccessPage(@Res() res: Response) {
    res.send(`
      <html>
        <body>
          <h1>Payment Successful!</h1>
          <p>Your order has been successfully processed.</p>
        </body>
      </html>
    `);
  }

  @Get('cancel')
  @ApiOperation({ summary: 'Payment cancel page' })
  @ApiResponse({
    status: 200,
    description: 'Payment was cancelled',
  })
  getCancelPage(@Res() res: Response) {
    res.send(`
      <html>
        <body>
          <h1>Payment Cancelled</h1>
          <p>Your payment was not processed. Please try again.</p>
        </body>
      </html>
    `);
  }
}
