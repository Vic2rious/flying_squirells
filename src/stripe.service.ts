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

  // Create a Checkout Session
  async createCheckoutSession() {
    try {
      return await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [
          {
            price: 'price_1Pw7KiIN2EVz5Vx3b0IVL9vf', // Example product ID
            quantity: 1,
          },
        ],
        success_url: 'http://localhost:3000/success', // Success page URL
        cancel_url: 'http://localhost:3000/cancel', // Cancel page URL
      });
    } catch (error) {
      throw new Error(`Error creating checkout session: ${error.message}`);
    }
  }

  // Create a Payment Intent
  async createPaymentIntent(amount: number) {
    try {
      return await this.stripe.paymentIntents.create({
        amount: amount * 100, // Stripe expects amount in cents
        currency: 'usd',
        payment_method_types: ['card'],
      });
    } catch (error) {
      throw new Error(`Error creating payment intent: ${error.message}`);
    }
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
