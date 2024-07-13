import {Component, OnInit} from '@angular/core';
import {ProductsService} from "../../../../services/products/products.service";
import {MessageService} from "primeng/api";
import {GetAllProductsResponse} from "../../../../models/interfaces/products/response/GetAllProductsResponse";
import {ProductsDataTransferService} from "../../../../shared/services/products/products-data-transfer.service";

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: []
})
export class DashboardHomeComponent implements OnInit{
  public productsList: Array<GetAllProductsResponse> = [];

  constructor(
    private productsService: ProductsService,
    private messageService: MessageService,
    private productsDtService: ProductsDataTransferService
  ) {}

  ngOnInit() {
    this.getProductsData();
  }

  getProductsData(){
    this.productsService.getAllProducts()
      .subscribe({
        next: (response) => {
          if(response.length > 0) {
            this.productsList = response;
            this.productsDtService.setProductsDatas(this.productsList)
          }
        },
        error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao buscar produtos',
            life: 2000
          })
        }
      })
  }
}
