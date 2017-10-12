import { Component, OnInit } from "@angular/core";
import { PlayersHttpService } from './services/player.service';
import { Player } from './services/models/player';
import notify from 'devextreme/ui/notify';

@Component({
    selector: "players",
    templateUrl: './players.component.html',
    styleUrls: ['./players.component.css'],
    providers: [PlayersHttpService]
})

export class PlayersComponent {
    title = "Players";
    players: any[];
    player: Player;
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
    /////////////////////////////////////////////////////////////////////
    constructor(private servicePlayers: PlayersHttpService) { }
    ngOnInit() {
        this.month = new Date().getMonth() + 1;
        this.setMonthName();
        this.loadingVisible = true;
        this.servicePlayers.getPlayersByMonth(this.month).subscribe(
            data => {
                this.players = data;
                this.loadingVisible = false;
            },
            error => {
                this.error = error;
                console.log(error);
                this.loadingVisible = false;
            }
        );
        this.player = new Player();
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
        this.player = new Player();
        this.popupVisibleAdd = true;
    }
    edit(data: any) {
        this.loadingVisible = true;
        this.servicePlayers.getPlayer(data.id).subscribe(
            data => {
                this.player = data;
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
        this.servicePlayers.getPlayer(data.id).subscribe(
            data => {
                this.player = data;
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
        notify('player was deleted');
    }
    cancelSave(): void { this.popupVisibleAdd = false; };
    confirmSave(): void {
        notify('player was saved');
    }
    //////////////////////////////////////////////////////////////
    refresh(): void {
        this.loadingVisible = true;
        this.servicePlayers.getPlayersByMonth(this.month).subscribe(
            data => {
                this.players = data;
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
