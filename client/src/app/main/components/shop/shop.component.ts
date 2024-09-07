import {Component, OnInit} from '@angular/core';
import {ProductsService} from "../../services/products.service";
import {Product} from "../../models/product";

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit{
  products: Product[] = [];
  totalProducts: number = 0;
  productsPerPage: number = 8;
  pagesNumber!: number;
  currentPage: number = 0;

  ngOnInit(): void {
    this.fetchProducts();
  }
  constructor(
    private productsService: ProductsService) {
  }
  fetchProducts() {
    this.productsService.getProducts("0", this.productsPerPage.toString()).subscribe( res => {
      this.products = res.data;
      console.log(this.products)
      this.totalProducts = res.pagination.total;
      this.pagesNumber = Math.ceil(this.totalProducts / this.productsPerPage)
    })
  }

  onEnter(inputValue: number):void {
    this.productsPerPage = inputValue;
    this.fetchProducts()
  }

  changePage(i: number) {
    this.currentPage = i;
    this.productsService.getProducts((this.productsPerPage*this.currentPage).toString(), this.productsPerPage.toString()).subscribe( res => {
      this.products = res.data;
    })
  }

  protected readonly Number = Number;
}
