import { Component, OnInit } from "@angular/core";
import { SubscrsHttpService } from './services/subscriptions.service';
import notify from 'devextreme/ui/notify';

@Component({
    selector: "subscriptions",
    templateUrl: './subscriptions.component.html',
    styleUrls: ['./subscriptions.component.css'],
    providers: [SubscrsHttpService]
})

export class SubscriptionsComponent {
    title = "Subscriptions";
    subscrs: any[];
    subscr: any;
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
    constructor(private serviceSubscrs: SubscrsHttpService) { }
    ngOnInit() {
        this.month = new Date().getMonth() + 1;
        this.setMonthName();
        this.loadingVisible = true;
        this.serviceSubscrs.getSubscrsByMonth(this.month).subscribe(
            data => {
                this.subscrs = data;
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
        this.serviceSubscrs.getSubscr(data.id).subscribe(
            data => {
                this.subscr = data;
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
        notify('subscription was deleted');
    }
    cancelSave(): void { this.popupVisibleAdd = false; };
    SetTime(): void {
        this.subscrs.forEach(s => {
            let start = s.start
            s.start = new Date(s.start);
            s.end = new Date(start + s.range);
            if (s.order) s.state = "order";
            if(!s.order && s.end < new Date()) s.state = "skip" 
        });
    }
    SetTimeItem(): void {
        let start = this.subscr.start;
        this.subscr.start = new Date(this.subscr.start);
        this.subscr.end = new Date(start + this.subscr.range);
    }
    //////////////////////////////////////////////////////////////
    refresh(): void {
        this.loadingVisible = true;
        this.serviceSubscrs.getSubscrsByMonth(this.month).subscribe(
            data => {
                this.subscrs = data;
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
