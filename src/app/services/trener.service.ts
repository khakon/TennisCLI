import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { Trener } from './models/trener';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class TrenersHttpService {
    private baseUrl = 'api/treners/';
    constructor(private http: Http) { }
    getTreners(): Observable<Trener[]> {
        return this.http.get(this.baseUrl)
            .map(response => response.json().model)
            .catch((error: any) => { return Observable.throw(error); });
    }
    getTrener(id: number): Observable<Trener> {
        return this.http.get(this.baseUrl + 'GetById/' + id)
            .map((resp: Response) => {
                return resp.json().model;
            })
            .catch((error: any) => { return Observable.throw(error); });
    }
    getTrenersByMonth(month: number): Observable<any[]> {
        return this.http.get(this.baseUrl + 'GetByMonth/' + month)
            .map(response => response.json().model)
            .catch((error: any) => { return Observable.throw(error); });
    }
    addTrener(item: Trener): Observable<Trener[]> {
        var url = this.baseUrl;
        return this.http.post(this.baseUrl, JSON.stringify(item), this.getRequestOptions())
            .map((resp: Response) => {
                console.log(resp.json().message);
                return resp.json().model;
            })
            .catch((error: any) => { return Observable.throw(error); });
    }
    deleteTrener(id: number): Observable<Trener[]> {
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