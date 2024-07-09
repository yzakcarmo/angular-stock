import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { DashboardHomeComponent } from './page/dashboard-home/dashboard-home.component';
import {RouterModule} from "@angular/router";
import {DASHBOARD_ROUTES} from "./dashboard.routing";
import {SidebarModule} from "primeng/sidebar";



@NgModule({
  declarations: [
    DashboardHomeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(DASHBOARD_ROUTES),
    //PrimeNg
    SidebarModule
  ]
})
export class DashboardModule { }
