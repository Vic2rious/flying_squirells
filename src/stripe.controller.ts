import {
  Controller,
  Post,
  Body,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Response } from 'express';

@Controller('payments')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  // Create a Checkout Session
  @Post('checkout')
  async createCheckoutSession(@Res() res: Response) {
    try {
      const session = await this.stripeService.createCheckoutSession();
      res.json({ url: session.url });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Create a Payment Intent
  @Post('payment-intent')
  async createPaymentIntent(
    @Body() body: { amount: number },
    @Res() res: Response,
  ) {
    const { amount } = body;
    try {
      const paymentIntent =
        await this.stripeService.createPaymentIntent(amount);
      res.json(paymentIntent);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
