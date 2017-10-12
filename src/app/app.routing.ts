import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { PlayersComponent } from "./players.component";
import { OrdersComponent } from "./orders.component";
import { PaymentsComponent } from "./payments.component";
import { ReservationsComponent } from "./reservations.component";
import { TrenersComponent } from "./treners.component";
import { CourtsComponent } from "./courts.component";
import { SubscriptionsComponent } from "./subscriptions.component";
const routes: Routes = [
    { path: "dashboard", component: DashboardComponent },
    { path: "players", component: PlayersComponent },
    { path: "treners", component: TrenersComponent },
    { path: "orders", component: OrdersComponent },
    { path: "payments", component: PaymentsComponent },
    { path: "reservations", component: ReservationsComponent },
    { path: "courts", component: CourtsComponent },
    { path: "subscriptions", component: SubscriptionsComponent },
    { path: "", component: DashboardComponent }]
export const RoutingConfig = RouterModule.forRoot(routes);
