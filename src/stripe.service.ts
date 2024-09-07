import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import Stripe from 'stripe';
import { OrdersService } from './orders.service';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private ordersService: OrdersService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  // Create a Checkout Session with a dynamic price
  async createCheckoutSession(
    orderId: string,
  ): Promise<Stripe.Checkout.Session> {
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
              unit_amount: Number(order.price) * 100, // Stripe expects amount in cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: 'http://localhost:3000/payments/success',
        cancel_url: 'http://localhost:3000/payments/cancel',
      });

      return session;
    } catch (error) {
      throw new HttpException(
        `Error creating checkout session: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async handleWebhookEvent(
    signature: string,
    rawBody: Buffer,
    endpointSecret: string,
  ) {
    let event: Stripe.Event;

    try {
      // Verify the webhook signature
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        endpointSecret,
      );

      // Process the event based on its type
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;
          // Handle successful payment
          console.log(`Payment was successful for session ${session.id}`);
          break;
        }
        case 'payment_intent.payment_failed': {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          // Handle failed payment
          console.log(`Payment failed for intent ${paymentIntent.id}`);
          break;
        }
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      throw new Error(`Webhook Error: ${err.message}`);
    }
  }
}
