import {
  Controller,
  Post,
  Get,
  Headers,
  Req,
  Param,
  HttpException,
  HttpStatus,
  RawBodyRequest,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBody,
  ApiHeader,
} from '@nestjs/swagger';
import { StripeService } from './stripe.service';

@ApiTags('Payments') // Grouping endpoints under 'payments'
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: StripeService) {}

  @Post('checkout/:orderId')
  @ApiOperation({ summary: 'Create a Stripe checkout session' }) // Endpoint summary
  @ApiParam({
    name: 'orderId',
    required: true,
    description: 'The ID of the order to create a checkout session for',
  })
  @ApiResponse({
    status: 200,
    description: 'Checkout session created successfully',
    schema: {
      example: {
        url: 'https://checkout.stripe.com/c/pay/cs_test_a1vTnaZZ3X3LYo8Ajk1rPFAjpnJgCwRICK3LTUJ8iOjYh3ZYb2osgDcJqC#fidkdWxOYHwnPyd1blpxYHZxWjA0VXIwVXdMSzdAU38wU302fXVRRzZwUFVTREZyUHNNaVVsZEFfRE9AQ1FCdm1gQGY8akQwSFN%2FSjZUbzJyRndRdjRQaDx8ZHJucmZuPWRvQTVAYUc0UFw0NTV0UEtGcVd3TCcpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async createCheckoutSession(@Param('orderId') orderId: string) {
    try {
      const session = await this.paymentsService.createCheckoutSession(orderId);
      return { url: session.url }; // Returning the checkout URL
    } catch (error) {
      throw new HttpException(
        `Error creating checkout session: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Handle Stripe webhook events' })
  @ApiHeader({
    name: 'stripe-signature',
    description: 'Stripe signature for webhook validation',
  })
  @ApiBody({ type: Buffer, description: 'Raw Stripe event payload as Buffer' }) // Expecting Buffer
  @ApiResponse({ status: 200, description: 'Webhook received successfully' })
  @ApiResponse({ status: 400, description: 'Webhook handling failed' })
  async handleWebhook(
    @Req() req: RawBodyRequest<Buffer>, // Correctly expecting raw body as Buffer
    @Headers('stripe-signature') signature: string,
  ) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; // Fetch webhook secret from environment

    try {
      // Pass rawBody and signature to the service for verification
      await this.paymentsService.handleWebhookEvent(
        signature,
        req.rawBody, // Using Buffer
        endpointSecret,
      );
      return { received: true }; // Acknowledge successful receipt
    } catch (error) {
      throw new HttpException(
        `Webhook handling failed: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('success')
  @ApiOperation({ summary: 'Handle successful payments' })
  @ApiResponse({ status: 200, description: 'Payment was successful!' })
  async paymentSuccess() {
    return { message: 'Payment was successful!' };
  }

  @Get('cancel')
  @ApiOperation({ summary: 'Handle canceled payments' })
  @ApiResponse({ status: 200, description: 'Payment was canceled!' })
  async paymentCancel() {
    return { message: 'Payment was canceled!' };
  }
}
