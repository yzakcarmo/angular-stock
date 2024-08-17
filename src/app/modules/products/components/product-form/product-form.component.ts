import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {CategoriesService} from "../../../../services/categories/categories.service";
import {FormBuilder, Validators} from "@angular/forms";
import {MessageService} from "primeng/api";
import {Router} from "@angular/router";
import {GetCategoriesResponse} from "../../../../models/interfaces/categories/responses/GetCategoriesResponse";
import {CreateProductRequest} from "../../../../models/interfaces/products/request/CreateProductRequest";
import {ProductsService} from "../../../../services/products/products.service";

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: []
})
export class ProductFormComponent implements OnInit, OnDestroy{

  private readonly destroy$ = new Subject<void>();
  public categoriesDatas: Array<GetCategoriesResponse> = [];
  public selectedCategories: Array<{name: string; code: string}> = [];

  public addProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    category_id: ['', Validators.required],
    amount: [0, Validators.required]
  })

  constructor(
    private categoriesService: CategoriesService,
    private productService: ProductsService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(){
    this.getAllCategories();
  }

  getAllCategories(){
    this.categoriesService.getAllCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if(response.length > 0) {
            this.categoriesDatas = response;
          }
        }
      })
  }

  handleSubmitAddProduct(){
    if(this.addProductForm?.value && this.addProductForm?.valid){
      const requestCreateProduct: CreateProductRequest = {
        amount: Number(this.addProductForm.value.amount),
        category_id: this.addProductForm.value.category_id as string,
        description: this.addProductForm.value.description as string,
        name: this.addProductForm.value.name as string,
        price: this.addProductForm.value.price as string
      };

      this.productService.createProduct(requestCreateProduct)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if(response) {
              this.messageService.add({
                severity: "success",
                summary: "Sucesso",
                detail: 'Produto criado com sucesso',
                life: 2500
              })
            }
          }, error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro na criação',
              life: 2500
            })
          }
        })
    }

    this.addProductForm.reset();
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }

}
