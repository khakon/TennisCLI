import { Component, OnInit } from "@angular/core";
import { ReservHttpService } from './services/reserv.service';
import notify from 'devextreme/ui/notify';

@Component({
    selector: "reservations",
    templateUrl: './reservations.component.html',
    styleUrls: ['./reservations.component.css'],
    providers: [ReservHttpService]
})

export class ReservationsComponent {
    title = "Reservations";
    reserves: any[];
    reserve: any;
    error: any;
    months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    month: number = new Date().getMonth() + 1;
    monthName: string = this.months[this.month - 1];
    /////////////////////////////////////////////////////////////////
    loadingVisible: boolean = false;
    popupVisibleDelete: boolean = false;
    popupVisibleAdd: boolean = false;
    deleteActionOptions = {
        onClick: this.delete.bind(this)//() => notify("The delete button was clicked")
    };
    deleteButtonOptions = {
        text: "Delete",
        type: "danger",
        onClick: this.confirmDelete.bind(this)//() => notify("The delete button was clicked")
    };
    cancelDeleteButtonOptions = {
        text: "Cancel",
        type: "default",
        onClick: this.cancelDelete.bind(this)//() => notify("The delete button was clicked")
    };
    /////////////////////////////////////////////////////////////////////
    constructor(private serviceReserv: ReservHttpService) { }
    ngOnInit() {
        this.month = new Date().getMonth() + 1;
        this.setMonthName();
        this.loadingVisible = true;
        this.serviceReserv.getReservesByMonth(this.month).subscribe(
            data => {
                this.reserves = data;
                this.SetTime();
                this.loadingVisible = false;
            },
            error => {
                this.error = error;
                console.log(error);
                this.loadingVisible = false;
            }
        );
    }
    onToolbarPreparing(e): void {
        let toolbarItems = e.toolbarOptions.items;
        toolbarItems.push({
            widget: 'dxButton',
            options: { icon: 'pulldown', onClick: this.refresh.bind(this) },
            location: 'before'
        }, 
            {
                widget: 'dxButton',
                options: {
                    icon: 'chevronleft', onClick: () => {
                        this.month = new Date().getMonth();
                        this.setMonthName();
                        this.refresh();
                    }
                },
                location: 'before'
            },
            {
                widget: 'dxButton',
                options: {
                    icon: 'chevronright', onClick: () => {
                        this.month = (new Date().getMonth() + 1);
                        this.setMonthName();
                        this.refresh();
                    }
                },
                location: 'before'
            }, {
                location: "before",
                template: "currentMonth"
            });
    };
    onRowPrepared(e): void {
        if (e.rowType == "data" && e.data.end < new Date())
            e.rowElement.addClass("bg-gray-active");
    }
    delete(data: any) {
        this.serviceReserv.getReserve(data.id).subscribe(
            data => {
                this.reserve = data;
                this.SetTimeItem();
                this.loadingVisible = false;
                this.popupVisibleDelete = true;
            },
            error => {
                this.error = error;
                console.log(error);
                this.loadingVisible = false;
            }
        );
    };
    viewStat(data: any) { console.log(data); };
    cancelDelete(): void { this.popupVisibleDelete = false; };
    confirmDelete(): void {
        this.popupVisibleDelete = false;
        notify('reserve was deleted');
    }
    cancelSave(): void { this.popupVisibleAdd = false; };
    SetTime(): void {
        this.reserves.forEach(s => {
            let start = s.start;
            s.start = new Date(s.start);
            s.end = new Date(start + s.range);
        });
    }
    SetTimeItem(): void {
        let start = this.reserve.start;
        this.reserve.start = new Date(this.reserve.start);
        this.reserve.end = new Date(start + this.reserve.range);
    }
    //////////////////////////////////////////////////////////////
    refresh(): void {
        this.loadingVisible = true;
        this.serviceReserv.getReservesByMonth(this.month).subscribe(
            data => {
                this.reserves = data;
                this.SetTime();
                this.loadingVisible = false;
            },
            error => {
                this.error = error;
                console.log(error);
                this.loadingVisible = false;
            }
        );
    };
    setMonthName(): void {
        this.monthName = this.months[this.month - 1];
    }
}
