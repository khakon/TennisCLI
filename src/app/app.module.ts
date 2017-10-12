import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule } from "@angular/router";
import { DxDataGridModule, DxButtonModule, DxLoadPanelModule, DxPopupModule, DxSelectBoxModule, DxTextAreaModule, DxFormModule, DxSchedulerModule, DxTemplateModule, DxChartModule,} from 'devextreme-angular';
import { AppComponent } from './app.component';
import { DashboardComponent } from "./dashboard.component";
import { PlayersComponent } from "./players.component";
import { OrdersComponent } from "./orders.component";
import { PaymentsComponent } from "./payments.component";
import { ReservationsComponent } from "./reservations.component";
import { TrenersComponent } from "./treners.component";
import { CourtsComponent } from "./courts.component";
import { SubscriptionsComponent } from "./subscriptions.component";
import { RoutingConfig } from "./app.routing";

@NgModule({
  declarations: [
      AppComponent,
      CourtsComponent,
      DashboardComponent,
      PlayersComponent,
      OrdersComponent,
      PaymentsComponent,
      ReservationsComponent,
      TrenersComponent,
      SubscriptionsComponent
  ],
  imports: [
      BrowserModule,
      HttpModule,
      RouterModule,
      RoutingConfig,
      DxButtonModule,
      DxDataGridModule,
      DxLoadPanelModule,
      DxPopupModule,
      DxSelectBoxModule,
      DxTextAreaModule,
      DxFormModule,
      DxTemplateModule,
      DxSchedulerModule,
      DxChartModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
