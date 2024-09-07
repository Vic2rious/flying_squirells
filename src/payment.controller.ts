import {
  Controller,
  Post,
  Headers,
  Req,
  RawBodyRequest,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: StripeService) {}

  @Post('checkout/:orderId')
  async createCheckoutSession(@Param('orderId') orderId: string) {
    try {
      const session = await this.paymentsService.createCheckoutSession(orderId);
      return { url: session.url }; // NestJS automatically serializes to JSON
    } catch (error) {
      throw new HttpException(
        `Error creating checkout session: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('webhook')
  async handleWebhook(
    @Req() req: RawBodyRequest<any>, // Using NestJS request abstraction
    @Headers('stripe-signature') signature: string,
  ) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; // Fetch webhook secret from environment

    try {
      // Pass rawBody and signature to the service for verification
      await this.paymentsService.handleWebhookEvent(
        signature,
        req.rawBody,
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
}
