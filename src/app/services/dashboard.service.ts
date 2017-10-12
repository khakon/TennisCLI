import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class DashboardHttpService {
    private baseUrl = 'api/dashboard/';
    constructor(private http: Http) { }
    getPayments(): Observable<any[]> {
        return this.http.get(this.baseUrl + 'Payments')
            .map(response => response.json().model)
            .catch((error: any) => { return Observable.throw(error); });
    }
    getSubscribes(): Observable<any[]> {
        return this.http.get(this.baseUrl + 'Subscribes')
            .map(response => response.json().model)
            .catch((error: any) => { return Observable.throw(error); });
    }
    getOrders(): Observable<any[]> {
        return this.http.get(this.baseUrl + 'Orders')
            .map(response => response.json().model)
            .catch((error: any) => { return Observable.throw(error); });
    }
    getPlayers(): Observable<any[]> {
        return this.http.get(this.baseUrl + 'Customers')
            .map(response => response.json().model)
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