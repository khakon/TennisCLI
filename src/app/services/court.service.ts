import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { Court } from './models/court';
import { CourtItem } from './models/courtItem';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import "rxjs/add/observable/throw";

@Injectable()
export class CourtHttpService {
    private baseUrl = 'api/courts/';
    constructor(private http: Http) { }
    getListCourts(): Observable<CourtItem[]> {
        return this.http.get(this.baseUrl)
            .map(response => response.json().model)
            .catch((error: any) => { return Observable.throw(error); });
    }
    getCourts(month: number): Observable<Court[]> {
        return this.http.get(this.baseUrl + 'GetByMonth/' + month)
            .map(response => response.json().model)
            .catch((error: any) => { return Observable.throw(error); });
    }
    getCourt(id: number): Observable<CourtItem> {
        return this.http.get(this.baseUrl + 'GetById/' + id)
            .map((resp: Response) => {
                return resp.json().model;
            })
            .catch((error: any) => { return Observable.throw(error); });
    }
    addCourt(item: CourtItem): Observable<Court[]> {
        var url = this.baseUrl;
        return this.http.post(this.baseUrl, JSON.stringify(item), this.getRequestOptions())
            .map((resp: Response) => {
                console.log(resp.json().message);
                return resp.json().model;
            })
            .catch((error: any) => { return Observable.throw(error); });
    }
    deleteCourt(id: number): Observable<Court[]> {
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