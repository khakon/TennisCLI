import { Component } from "@angular/core";
import { PaysHttpService } from './services/payments.service';
import notify from 'devextreme/ui/notify';

@Component({
    selector: "payments",
    templateUrl: './payments.component.html',
    styleUrls: ['./payments.component.css'],
    providers: [PaysHttpService]
})

export class PaymentsComponent {
    title = "Payments";
    pays: any[];
    pay: any;
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
    constructor(private servicePays: PaysHttpService) { }
    ngOnInit() {
        this.month = new Date().getMonth() + 1;
        this.setMonthName();
        this.loadingVisible = true;
        this.servicePays.getPaysByMonth(this.month).subscribe(
            data => {
                this.pays = data;
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
        if (e.rowType == "data" && e.data.state == 'skip')
            e.rowElement.addClass("bg-red disabled");
    }
    delete(data: any) {
        this.servicePays.getPay(data.id).subscribe(
            data => {
                this.pay = data;
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
        notify('payment was deleted');
    }
    cancelSave(): void { this.popupVisibleAdd = false; };
    SetTime(): void {
        this.pays.forEach(s => {
            let start = s.start
            s.start = new Date(s.start);
            s.end = new Date(start + s.range);
            if (s.order) s.state = "order";
            if (!s.order && s.end < new Date()) s.state = "skip"
        });
    }
    SetTimeItem(): void {
        let start = this.pay.start;
        this.pay.start = new Date(this.pay.start);
        this.pay.end = new Date(start + this.pay.range);
    }
    //////////////////////////////////////////////////////////////
    refresh(): void {
        this.loadingVisible = true;
        this.servicePays.getPaysByMonth(this.month).subscribe(
            data => {
                this.pays = data;
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
