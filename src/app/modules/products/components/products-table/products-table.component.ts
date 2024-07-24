import {Component, EventEmitter, Input, Output} from '@angular/core';
import {GetAllProductsResponse} from "../../../../models/interfaces/products/response/GetAllProductsResponse";
import {ProductEvent} from "../../../../models/enums/products/productEvent";
import {EventAction} from "../../../../models/interfaces/products/event/EventAction";
import {DeleteProductAction} from "../../../../models/interfaces/products/event/DeleteProductAction";

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
  styleUrls: []
})
export class ProductsTableComponent {
  @Input() products: Array<GetAllProductsResponse> = [];
  @Output() productEvent = new EventEmitter<EventAction>();
  @Output() deleteProductEvent = new EventEmitter<DeleteProductAction>

  public productSelected!: GetAllProductsResponse;
  public addProductEvent = ProductEvent.ADD_PRODUCT_EVENT;
  public editProductEvent = ProductEvent.EDIT_PRODUCT_EVENT;

  handleProductEvent(action: string, id?: string ):void {
    if(action && action !== '') {
      const productEventData = id && id !== '' ? {action, id} : {action};
      this.productEvent.emit(productEventData)
    }
  }

  handleDeleteProduct(product_id: string, product_name: string): void {
    if(product_id !== '' && product_name !== ''){
      this.deleteProductEvent.emit({
        product_id,
        product_name
      })
    }
  }
}
