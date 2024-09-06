import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  HttpException,
  HttpStatus,
  Headers,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Request, Response } from 'express';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-payment-intent')
  async createPaymentIntent(
    @Body() body: { amount: number; currency?: string },
  ) {
    const { amount, currency = 'usd' } = body;

    try {
      const paymentIntent = await this.stripeService.createPaymentIntent(
        amount,
        currency,
      );
      return { clientSecret: paymentIntent.client_secret };
    } catch (error) {
      throw new HttpException(
        'Error creating payment intent: ' + error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('confirm-payment')
  async confirmPayment(
    @Body() body: { paymentIntentId: string; paymentMethodId: string },
  ) {
    const { paymentIntentId, paymentMethodId } = body;

    try {
      const paymentIntent = await this.stripeService.confirmPayment(
        paymentIntentId,
        paymentMethodId,
      );
      return { paymentIntent };
    } catch (error) {
      throw new HttpException(
        'Error confirming payment: ' + error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('webhook')
  async handleWebhook(
    @Req() request: Request,
    @Res() response: Response,
    @Headers('stripe-signature') stripeSignature: string,
  ) {
    const event = request.body;

    try {
      await this.stripeService.handleWebhookEvent(event);
      response.status(HttpStatus.OK).send('Webhook received');
    } catch (error) {
      response
        .status(HttpStatus.BAD_REQUEST)
        .send(`Webhook Error: ${error.message}`);
    }
  }
}
