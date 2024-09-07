import {Component, Input, OnInit} from '@angular/core';
import {ProductsService} from "../../../services/products.service";
import {Product} from "../../../models/product";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
  @Input() productAddedToCart: boolean = false;
  isCardOpen: boolean = false;
  productsInCart: Array<Product> = [];


  ngOnInit() {
    this.getFromCart();
  }

  constructor(private productService: ProductsService) {
  }

  openCart() {
    this.isCardOpen = !this.isCardOpen
    this.productAddedToCart = false;
  }

  closeCart() {
    this.isCardOpen = false;
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
      this.productService.getProduct(cartItem.id).subscribe(res => {
        console.log(res);
        this.productsInCart.push(res);
      });
    });
  }
}
