import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { MainRoutingModule } from './main-routing.module';
import { CategoriesService } from './services/categories.service';
import { HttpClientModule } from '@angular/common/http';
import { ProductCardComponent } from './components/common/product-card/product-card.component'; // <-- Import HttpClientModule
import { ProductsService } from './services/products.service';
import { ShopComponent } from './components/shop/shop.component';
import { PageHeadingComponent } from './components/common/page-heading/page-heading.component';
import {NgRepeatDirective} from "./directives/ng-repeat.directive";
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import {ReactiveFormsModule} from "@angular/forms";
import {OrderService} from "./services/order.service";
import {PaymentsService} from "./services/payments.service";



@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    ProductCardComponent,
    ProductCardComponent,
    ShopComponent,
    PageHeadingComponent,
    NgRepeatDirective,
    ProductDetailsComponent,
    CartComponent,
    CheckoutComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [CategoriesService, ProductsService, OrderService, PaymentsService],
})
export class MainModule { }
