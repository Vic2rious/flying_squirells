import {Component, Input, OnInit} from '@angular/core';
import { ProductsService } from 'src/app/main/services/products.service';
import {Product} from "../../../models/product";
import {Router} from "@angular/router";

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent{
  @Input() product!: Product;
  products!: Array<Product>;
  currentSize: string = "S";
  quantity: number = 1;

  constructor(
    private router: Router,
    private productsService: ProductsService) {
  }
  redirectToProductDetails(id: number){
    this.productsService.getProduct(id).subscribe(res => {
      this.router.navigate(['/main/products/', id])
    })
  }

  addToCart() {
    const value = {
      id: this.product.id,
      size: this.currentSize,
      quanitity: this.quantity
    }

    let cart = [];
    const cartFromStorage = localStorage.getItem("cart");
    if(cartFromStorage) {
      try {
        cart = JSON.parse(cartFromStorage);
      }
      catch {}
    }
    cart.push(value);
    localStorage.setItem("cart", JSON.stringify(cart));
  }
}
