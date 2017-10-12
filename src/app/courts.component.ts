import { Component, OnInit } from "@angular/core";
import { CourtHttpService } from './services/court.service';
import { Court } from './services/models/court';
import { CourtItem } from './services/models/courtItem';
import { RegionHttpService } from './services/region.service';
import { Region } from './services/models/region';
import notify from 'devextreme/ui/notify';

@Component({
    selector: "courts",
    templateUrl: './courts.component.html',
    styleUrls: ['./courts.component.css'],
    providers: [CourtHttpService, RegionHttpService]
})

export class CourtsComponent {
    title = "Courts";
    courts: Court[];
    court: CourtItem;
    regions: any[];
    error: any;
    months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    month: number = new Date().getMonth() + 1;
    monthName: string = this.months[this.month - 1];
/////////////////////////////////////////////////////////////////
    loadingVisible: boolean = false;
    popupVisibleDelete: boolean = false;
    popupVisibleAdd: boolean = false;
    editActionOptions = {
    onClick: this.edit.bind(this)//() => notify("The edit button was clicked")
    };
    deleteActionOptions = {
        onClick: this.delete.bind(this)//() => notify("The delete button was clicked")
    };
    viewActionOptions = {
        onClick: this.viewStat.bind(this)//() => notify("The view button was clicked")
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
    saveButtonOptions = {
        text: "Save",
        type: "success",
        onClick: this.confirmSave.bind(this)//() => notify("The delete button was clicked")
    };
    cancelSaveButtonOptions = {
        text: "Cancel",
        type: "default",
        onClick: this.cancelSave.bind(this)//() => notify("The delete button was clicked")
    };
    selectRatingOptions = {
        items: [1, 2, 3, 4, 5],
    }
/////////////////////////////////////////////////////////////////////
    constructor(private serviceCourt: CourtHttpService, private serviceRegion: RegionHttpService) {}
    ngOnInit() {
        this.month = new Date().getMonth() + 1;
        this.setMonthName();
        this.loadingVisible = true;
        this.serviceCourt.getCourts(this.month).subscribe(
            data => {
                this.courts = data;
                this.loadingVisible = false;
            },
            error => {
                this.error = error;
                console.log(error);
                this.loadingVisible = false;
            }
        );
        this.serviceRegion.getRegions().subscribe(
            data => {
                this.regions = data;
            },
            error => {
                this.error = error;
                console.log(error);
                this.loadingVisible = false;
            }
        );
        this.court = new CourtItem();
    }
    onToolbarPreparing(e): void {
        let toolbarItems = e.toolbarOptions.items;
        toolbarItems.push({
            widget: 'dxButton',
            options: { icon: 'pulldown', onClick: this.refresh.bind(this) },
            location: 'before'
        }, {
                widget: 'dxButton',
                options: { icon: 'plus', onClick: this.add.bind(this) },
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
    add(): void {
        this.court = new CourtItem();
        this.popupVisibleAdd = true;
    }
    edit(data: any) {
        this.loadingVisible = true;
        this.serviceCourt.getCourt(data.id).subscribe(
            data => {
                this.court = data;
                this.loadingVisible = false;
                this.popupVisibleAdd = true;
            },
            error => {
                this.error = error;
                console.log(error);
                this.loadingVisible = false;
            }
        );
    };
    delete(data: any) {
        this.serviceCourt.getCourt(data.id).subscribe(
            data => {
                this.court = data;
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
        //this.loadingVisible = true;
        //this.serviceCourt.deleteCourt(this.court.id).subscribe(
        //    data => {
        //        this.courts = data;
        //        this.loadingVisible = false;
        //        this.popupVisibleDelete = false;
        //    },
        //    error => {
        //        this.error = error;
        //        console.log(error);
        //        this.loadingVisible = false;
        //    }
        //);
        this.popupVisibleDelete = false;
        notify('court was deleted');
    }
    cancelSave(): void { this.popupVisibleAdd = false; };
    confirmSave(): void {
        this.loadingVisible = true;
        this.serviceCourt.addCourt(this.court).subscribe(
            data => {
                this.courts = data;
                this.loadingVisible = false;
                this.popupVisibleAdd = false;
            },
            error => {
                this.error = error;
                console.log(error);
                this.loadingVisible = false;
            }
        );
    }
//////////////////////////////////////////////////////////////
    refresh(): void {
        this.loadingVisible = true;
        this.serviceCourt.getCourts(this.month).subscribe(
            data => {
                this.courts = data;
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
        this.monthName = this.months[this.month-1];
    }
}
