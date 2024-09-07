import { Component, OnInit } from '@angular/core';
import {CategoriesService} from "../../services/categories.service";
import { ProductsService } from '../../services/products.service';
import {Product} from "../../models/product";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
  productsPerPage: number = 8;
  categories: Array<any> = [];
  products: Product[] = [];
  slides: Array<any> = [
    {imageUrl: "/assets/images/carousel.svg", heading: "New Year"},
    {imageUrl: "/assets/images/carousel.svg", heading: "New Year"},
    {imageUrl: "/assets/images/carousel.svg", heading: "New Year"}
  ]
  currentIndex: number = 0;

  constructor(
    private categoriesService: CategoriesService,
    private productsService: ProductsService
  ){}

  ngOnInit(): void {
    this.fetchCategories();

    this.productsService.getProducts("0", "8").subscribe( res => {
      this.products = res.data;
      console.log(res)
    })
  }

 fetchCategories() {
    this.categoriesService.getGategories().subscribe( res => {
      this.categories = res;
    })
 }


 nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
 }
}
