import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {ProductsService} from "../../services/products.service";
import {Product} from "../../models/product";
import {HeaderComponent} from "../layout/header/header.component";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit{
  @ViewChild(HeaderComponent) headerComponent!: HeaderComponent; // Get reference to app-header
  productId!: number;
  product!: Product;
  products!: Array<Product>
  productSizes!: Array<string>;
  productColors!: Array<string>;
  quantity: number = 1;  // Initial quantity
  currentSize!: string;
  currentColor!: string;
  additionalImages!: Array<any>;

  ngOnInit() {
    this.fetchProduct();
    this.fetchProducts();
  }

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService
  ) { }

  fetchProduct(){
    this.route.params.subscribe((params: Params) => {
      this.productId = params['id'];
    })

    this.productsService.getProduct(this.productId).subscribe(res => {
      this.product = res;
      console.log(res);
      this.productSizes = this.product.sizes;
      this.productColors = this.product.colors;
      this.additionalImages = this.product.additional_photos;
      console.log(this.additionalImages);
    })
  }
  fetchProducts() {
    this.productsService.getProducts("0", "4").subscribe( res => {
      this.products = res.data;
    })
  }

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  changeSize(i:number) {
    this.currentSize = this.productSizes[i];
  }

  changeColor(color:string) {
    this.currentColor = color;
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
    this.headerComponent.productAddedToCart = true;

  }
}
