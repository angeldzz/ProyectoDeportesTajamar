// import { Component, OnInit } from '@angular/core';
// import { ProductService } from '@/service/productservice';
// import { Carousel } from 'primeng/carousel';
// import { ButtonModule } from 'primeng/button';
// import { Tag } from 'primeng/tag';
// import {Deporte} from '../../../models/Deportes';
//
// @Component({
//   selector: 'carousel-circular-demo',
//   templateUrl: './carousel-circular-demo.html',
//   standalone: true,
//   imports: [Carousel, ButtonModule, Tag],
//   providers: [ProductService]
// })
// export class CarouselCircularDemo implements OnInit{
//   deportes: Deporte[] | undefined;
//
//   responsiveOptions: any[] | undefined;
//
//   constructor(private productService: ProductService) {}
//
//   ngOnInit() {
//     this.productService.getProductsSmall().then(data => {
//       this.products = data.slice(0, 9);
//     });
//
//     this.responsiveOptions = [
//       {
//         breakpoint: '1400px',
//         numVisible: 2,
//         numScroll: 1
//       },
//       {
//         breakpoint: '1199px',
//         numVisible: 3,
//         numScroll: 1
//       },
//       {
//         breakpoint: '767px',
//         numVisible: 2,
//         numScroll: 1
//       },
//       {
//         breakpoint: '575px',
//         numVisible: 1,
//         numScroll: 1
//       }
//     ]
//   }
//
//   getSeverity(status: string) {
//     switch (status) {
//       case 'INSTOCK':
//         return 'success';
//       case 'LOWSTOCK':
//         return 'warn';
//       case 'OUTOFSTOCK':
//         return 'danger';
//     }
//   }
// }
