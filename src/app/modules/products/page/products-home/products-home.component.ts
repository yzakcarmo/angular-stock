import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {ProductsService} from "../../../../services/products/products.service";
import {ProductsDataTransferService} from "../../../../shared/services/products/products-data-transfer.service";
import {Router} from "@angular/router";
import {GetAllProductsResponse} from "../../../../models/interfaces/products/response/GetAllProductsResponse";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-products-home',
  templateUrl: './products-home.component.html',
  styleUrls: []
})
export class ProductsHomeComponent implements OnInit,OnDestroy{
  private readonly destroy$ = new Subject<void>();
  public productsData: Array<GetAllProductsResponse> = [];

  constructor(
    private productsService: ProductsService,
    private productsDtService: ProductsDataTransferService,
    private router: Router,
    private messageService: MessageService

  ) {}

  ngOnInit() {
    this.getServiceProductsData();
  }

  getServiceProductsData(){
    const productsLoaded = this.productsDtService.getProductsDatas();

    if(productsLoaded.length > 0) {
      this.productsData = productsLoaded;
    } else this.getAPIProductsData();

    console.log(this.productsData)
  }

  getAPIProductsData() {
    this.productsService
      .getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if(response.length > 0) {
            this.productsData = response;
          }
        },
        error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao busccar produtos',
            life: 2500
          })
          this.router.navigate(['/dashboard']);
        }
      })
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
