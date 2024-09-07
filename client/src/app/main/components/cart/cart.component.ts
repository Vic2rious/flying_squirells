import {Component, OnInit} from '@angular/core';
import {ProductsService} from "../../services/products.service";
import {Product} from "../../models/product";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit{
  productsInCart: Array<Product> = [];
  subtotal: number = 0;
  constructor(private productService: ProductsService)
  { }

  ngOnInit() {
    this.getFromCart();
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
      this.subtotal = this.subtotal + cartItem.price;
      this.productService.getProduct(cartItem.id).subscribe(res => {
        this.productsInCart.push(res);
      });
    });
  }
}
