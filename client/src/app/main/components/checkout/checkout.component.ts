import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {OrderService} from "../../services/order.service";
import {Product} from "../../models/product";
import {ProductsService} from "../../services/products.service";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit{
  billingForm!: FormGroup;
  productIds: Array<number> = [];
  amounts: Array<number> = [];
  productsInCart: Array<Product> = [];
  subtotal: number = 0;
  checkoutId!: number;
  constructor(
    private fb: FormBuilder,
    private ordersService: OrderService,
    private productService: ProductsService
    ) { }

  ngOnInit(): void {
    this.billingForm = this.fb.group({
      'first_name': ['', Validators.required],
      'last_name': ['', Validators.required],
      'company_name': [''],
      'country': ['', Validators.required],
      'city': ['', Validators.required],
      'address': ['', Validators.required],
      'postal_code': ['', Validators.required],
      'phone_number': ['', Validators.required],
      'email': ['', Validators.required],
      'product_ids': ['', Validators.required],
      'amounts': ['', Validators.required],
    })

    this.getFromCart();
    this.placeOrder();
  }

  getFromCart() {
    let cart = [];
    const cartFromStorage = localStorage.getItem("cart");
    if(cartFromStorage) {
      try {
        cart = JSON.parse(cartFromStorage);
      }
      catch {}
    }

    cart.forEach((cartItem: any) => {
      this.productIds.push(cartItem.id);
      this.amounts.push(cartItem.quanitity);
      this.productService.getProduct(cartItem.id).subscribe(res => {
        this.productsInCart.push(res);
        this.subtotal = this.subtotal + res.price;
      });
    });

    this.billingForm.patchValue({
      product_ids: this.productIds,
      amounts: this.amounts
    });

  }

  placeOrder() {
    this.ordersService.createOrder(this.billingForm.value).subscribe(res => {
      this.checkoutId = res.id;
    })
  }

  // get first_name() {
  //   return this.billingForm.get('first_name');
  // }
  //
  // get last_name() {
  //   return this.billingForm.get('last_name');
  // }
  //
  // get first_name() {
  //   return this.billingForm.get('first_name');
  // }
  //
  // get first_name() {
  //   return this.billingForm.get('first_name');
  // }
  //
  // get first_name() {
  //   return this.billingForm.get('first_name');
  // }
}
