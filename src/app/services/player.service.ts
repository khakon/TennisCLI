import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { Player } from './models/player';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class PlayersHttpService {
    private baseUrl = 'api/players/';
    constructor(private http: Http) { }
    getPlayers(): Observable<Player[]> {
        return this.http.get(this.baseUrl)
            .map(response => response.json().model)
            .catch((error: any) => { return Observable.throw(error); });
    }
    getPlayersByMonth(month: number): Observable<any[]> {
        return this.http.get(this.baseUrl + 'GetByMonth/' + month)
            .map(response => response.json().model)
            .catch((error: any) => { return Observable.throw(error); });
    }
    getPlayer(id: number): Observable<Player> {
        return this.http.get(this.baseUrl + 'GetById/' + id)
            .map((resp: Response) => {
                return resp.json().model;
            })
            .catch((error: any) => { return Observable.throw(error); });
    }
    addPlayer(item: Player): Observable<any[]> {
        var url = this.baseUrl;
        return this.http.post(this.baseUrl, JSON.stringify(item), this.getRequestOptions())
            .map((resp: Response) => {
                console.log(resp.json().message);
                return resp.json().model;
            })
            .catch((error: any) => { return Observable.throw(error); });
    }
    deletePlayer(id: number): Observable<any[]> {
        console.log(id);
        var url = this.baseUrl + id;
        return this.http.delete(url, new RequestOptions())
            .map((resp: Response) => {
                console.log(resp.json().message);
                return resp.json().model;
            })
            .catch((error: any) => { return Observable.throw(error); });
    }
    // returns a viable RequestOptions object to handle Json requests
    private getRequestOptions() {
        return new RequestOptions({
            headers: new Headers({
                "Content-Type": "application/json"
            })
        });
    }
}