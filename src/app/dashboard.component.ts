import { Component, OnInit } from "@angular/core";
import { ViewChild } from '@angular/core';
import { DxSchedulerComponent } from 'devextreme-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import "rxjs/add/observable/zip";
import "rxjs/add/observable/from";
import 'rxjs/add/operator/map';
import { Reserv } from './services/models/reserv';
import { Trener } from './services/models/trener';
import { Player } from './services/models/player';
import { CourtItem } from './services/models/courtItem';
import { Price } from './services/models/price';
import { ReservHttpService } from './services/reserv.service';
import { TrenersHttpService } from './services/trener.service';
import { CourtHttpService } from './services/court.service';
import { PriceHttpService } from './services/price.service';
import { DashboardHttpService } from './services/dashboard.service';
import { PlayersHttpService } from './services/player.service';
import notify from 'devextreme/ui/notify';
import Query from 'devextreme/data/query';

@Component({
    selector: "dashboard",
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    providers: [CourtHttpService, ReservHttpService, TrenersHttpService, PriceHttpService, DashboardHttpService, PlayersHttpService]
})

export class DashboardComponent {
    title = "Dashboard";
    @ViewChild(DxSchedulerComponent) scheduler: DxSchedulerComponent;
    currentMonth: number;
    reservs: Reserv[];
    treners: Trener[];
    playersSelect: Player[];
    prices: Price[];
    courts: CourtItem[];
    data: any[] = [];
    error: any;
    month: number = new Date().getMonth() + 1;
    courtsIndex: number[] = [14, 12, 15, 18, 17];
    currentIndex: number;
    currentDate: Date = new Date(2017, 8, 24);
    courtName: string;
    customers: any[];
    customersRes: any[];
    reserv: any;
    ///////////////////////totals and chart data////////////////////////////
    payments: any[];
    subscribes: any[];
    orders: any[];
    players: any[];
    totalPays: number;
    totalSubs: number;
    totalOrds: number;
    totalPlays: number;
    graphOptions: any;
    chartOptions: any;
    ///////////////////////////////////////////////////////////////////////////
    //////////////////////visible load panel and popup///////////////////////////////////////////
    loadingVisible: boolean = false;
    popupVisibleDelete: boolean = false;
    popupVisibleAdd: boolean = false;
    popupVisibleTrener: boolean = false;
    popupVisiblePlayer: boolean = false;
    ////////////////////////////////////////////////////////////////
    constructor(private serviceReserv: ReservHttpService, private serviceTrener: TrenersHttpService,
        private serviceCourt: CourtHttpService, private servicePrice: PriceHttpService, private dashboardService: DashboardHttpService, private servicePlayers:PlayersHttpService) { }
    ngOnInit() {
        this.currentIndex = 0;
        this.currentMonth = 10;
        this.totalPays = 0;
        this.totalSubs = 0;
        this.totalOrds = 0;
        this.totalPlays = 0;
        this.loadingVisible = true;
        this.graphOptions = {
            title: 'Payments',
            data: this.payments,
        }
        Observable.zip(
            this.serviceReserv.getReservs(this.courtsIndex[this.currentIndex]),
            this.serviceTrener.getTreners(),
            this.servicePrice.getPrices(),
            this.serviceCourt.getListCourts(),
            this.serviceReserv.getCustomers(this.courtsIndex[this.currentIndex]),
            this.dashboardService.getPayments(),
            this.dashboardService.getSubscribes(),
            this.dashboardService.getOrders(),
            this.dashboardService.getPlayers(),
            this.servicePlayers.getPlayers()
        ).subscribe(([reservs, treners, prices, courts, customers, pays, subs, orders, plays, players]) => {
            this.reservs = reservs;
            this.treners = treners;
            this.prices = prices;
            this.courts = courts;
            this.customers = customers;
            this.payments = pays;
            this.subscribes = subs;
            this.orders = orders;
            this.players = plays;
            this.playersSelect = players;
            this.setCourtName();
            this.createData();
            this.DataForTotalsAndChart();
            this.loadingVisible = false;
            },
            err => console.error(err));

    }
    ///////////////////////////data for sheduler///////////////////////////////////
    createData(): void {
        let res = this.reservs
        this.data = [];
        for (let index in res) {
            let item = res[index];
            this.data.push({ id:item.id, startDate: new Date(item.start), endDate: new Date(item.start + item.range), courtId: item.courtId, priceId: item.priceId, trenerId: item.trenerId, total: item.total, count: item.playerCount });
            }
    }
//////////////////////////////////////////////////////////////////////////////////
    cancelButtonOptions = {
        text: "Cancel",
        type: "default",
        onClick: this.cancel.bind(this)//() => notify("The delete button was clicked")
    };
    subscribeButtonOptions = {
        text: "Subscribe",
        type: "success",
        onClick: this.SubscribePlayer.bind(this)
    };
    trenerButtonOptions = {
        text: "Coach",
        type: "success",
        onClick: this.ChangeTrener.bind(this)
    };
    saveTrenerButtonOptions = {
        text: "Change",
        type: "success",
        onClick: this.ConfirmChangeTrener.bind(this)
    };
    cancelSaveTrenerButtonOptions = {
        text: "Cancel",
        type: "default",
        onClick: this.CancelChangeTrener.bind(this)
    };
    savePlayerButtonOptions = {
        text: "Change",
        type: "success",
        onClick: this.ConfirmSubscribePlayer.bind(this)
    };
    cancelSavePlayerButtonOptions = {
        text: "Cancel",
        type: "default",
        onClick: this.CancelSubscribePlayer.bind(this)
    };
///////////////////////////////////////////////////////////////////////////
    getPriceById(id) {
        return Query(this.prices).filter(["id", "=", id]).toArray()[0];
    }
    getTrenerById(id) {
        return Query(this.treners).filter(["id", "=", id]).toArray()[0];
    }
    prevCourt(): void {
        if (this.currentIndex == 0) this.currentIndex = 4;
        else this.currentIndex--;
        this.refresh();
    }
    nextCourt(): void {
        if (this.currentIndex == 4) this.currentIndex = 0;
        else this.currentIndex++;
        this.refresh();
    }
    setCourtName(): void {
        this.courtName = Query(this.courts).filter(["id", "=", this.courtsIndex[this.currentIndex]]).toArray()[0].name;
    }
    /////////////////players by lesson
    getCustomers(id): string {
        let res = Query(this.customers).filter(["reservationId", "=", id]).select("name").toArray();
        if (res.length === 0) return 'No subscribe';
        else {
            let dt = [];
            for (let index in res) {
                let item = res[index];
                dt.push(item.name);
            }
            return dt.join();
        }
    }
    refresh(): void {
        this.loadingVisible = true;
        Observable.zip(
            this.serviceReserv.getReservs(this.courtsIndex[this.currentIndex]),
            this.serviceReserv.getCustomers(this.courtsIndex[this.currentIndex]),
        ).subscribe(([reservs, customers]) => {
            this.reservs = reservs;
            this.customers = customers;
            this.setCourtName();
            this.createData();
            this.loadingVisible = false;
        },
            err => console.error(err));
    }
    DataForTotalsAndChart(): void {
        let payments = this.payments.filter(item => item.month === this.currentMonth);
        let subscribes = this.subscribes.filter(item => item.month === this.currentMonth);
        let orders = this.orders.filter(item => item.month === this.currentMonth);
        let players = this.players.filter(item => item.month === this.currentMonth);
        payments.forEach(s => this.totalPays += s.total);
        subscribes.forEach(s => this.totalSubs += s.total);
        orders.forEach(s => this.totalOrds += s.total);
        players.forEach(s => this.totalPlays += s.total);
        this.setGraphOptions('pays');
    }
    setGraphOptions(key:string): void {
        let options = {
            pays: {
                title: 'Payments',
                data: this.payments,
            },
            subs: {
                title: 'Subscribes',
                data: this.subscribes,
            },
            ords: {
                title: 'Orders',
                data: this.orders,
            },
            plays: {
                title: 'Players',
                data: this.players,
            },
        }
        this.graphOptions = options[key];
    }
    ChangeTrener(): void {
        this.cancel();
        this.popupVisibleTrener = true;
    }
    ConfirmChangeTrener(): void {
        notify('coach was changed')
        this.popupVisibleTrener = false;
    }
    CancelChangeTrener(): void {
        this.popupVisibleTrener = false;
    }
    SubscribePlayer(): void {
        this.cancel();
        this.popupVisiblePlayer = true;
    }
    ConfirmSubscribePlayer(): void {
        notify('player was subscribed')
        this.popupVisiblePlayer = false;
    }
    CancelSubscribePlayer(): void {
        this.popupVisiblePlayer = false;
    }
    onAppointmentClick(e): void {
        let item = e.appointmentData;
        this.reserv = {
            start: item.start,
            end: item.end,
            court: Query(this.courts).filter(["id", "=", item.courtId]).toArray()[0].name,
            lesson: Query(this.prices).filter(["id", "=", item.priceId]).toArray()[0].name,
            trener: item.trenerId,
            player:''
        }
    }
    cancel(): void {
        this.scheduler.instance.hideAppointmentTooltip();
    }
    onAppointmentFormCreated(data) { }
}

