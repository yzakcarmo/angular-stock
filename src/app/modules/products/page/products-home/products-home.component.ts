import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {ProductsService} from "../../../../services/products/products.service";
import {ProductsDataTransferService} from "../../../../shared/services/products/products-data-transfer.service";
import {Router} from "@angular/router";
import {GetAllProductsResponse} from "../../../../models/interfaces/products/response/GetAllProductsResponse";
import {ConfirmationService, MessageService} from "primeng/api";
import {EventAction} from "../../../../models/interfaces/products/event/EventAction";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {ProductFormComponent} from "../../components/product-form/product-form.component";

@Component({
  selector: 'app-products-home',
  templateUrl: './products-home.component.html',
  styleUrls: []
})
export class ProductsHomeComponent implements OnInit,OnDestroy{
  private readonly destroy$ = new Subject<void>();
  private ref!: DynamicDialogRef;
  public productsData: Array<GetAllProductsResponse> = [];

  constructor(
    private productsService: ProductsService,
    private productsDtService: ProductsDataTransferService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService
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

  handleProductAction(event: EventAction){
    if(event) {
      this.ref = this.dialogService.open(ProductFormComponent, {
        header: event?.action,
        width: '70%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: true,
        data: {
          event: event,
          productsDatas: this.productsData,

        }
      });
      this.ref.onClose
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => this.getAPIProductsData(),
        })
    }
  }

  handleDeleteProductAction(event: {product_id: string, product_name: string}) {
    if(event) {
      this.confirmationService.confirm({
        message: `Confirmar a exclusáo do produto: ${event?.product_name}?`,
        header: `Confirmação de exclusão`,
        icon: `pi pi-exclamation-triangle`,
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => this.deleteProduct(event?.product_id)
      })
    }
  }

  deleteProduct(product_id: string){
    if(product_id){
      this.productsService.deleteProduct(product_id)
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe({
          next: (response) => {
            if(response) {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Produto Removido',
                life: 2500
              })

              this.getAPIProductsData();
            }
          }, error: (err) => {
            console.log(err)
            this.messageService.add({
              severity:'error',
              summary: 'Erro',
              detail: 'Erro na Remocao',
              life: 2500,
            })
          }
        })
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
