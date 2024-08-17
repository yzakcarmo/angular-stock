import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {CategoriesService} from "../../../../services/categories/categories.service";
import {FormBuilder, Validators} from "@angular/forms";
import {MessageService} from "primeng/api";
import {Router} from "@angular/router";
import {GetCategoriesResponse} from "../../../../models/interfaces/categories/responses/GetCategoriesResponse";

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

  handleSubmitAddProduct(){}

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }

}
