import { Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY'),
    );
  }

  async createPaymentIntent(amount: number, currency: string = 'usd') {
    return this.stripe.paymentIntents.create({
      amount,
      currency,
    });
  }

  async confirmPayment(paymentIntentId: string, paymentMethodId: string) {
    return this.stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId,
    });
  }

  async handleWebhookEvent(event: Stripe.Event) {
    // Handle webhook events (e.g., payment_intent.succeeded)
    // Add your webhook handling logic here
  }
}
