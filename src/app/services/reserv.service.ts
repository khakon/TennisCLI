import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { Reserv } from './models/reserv';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ReservHttpService {
    private baseUrl = 'api/reservs/';
    constructor(private http: Http) { }
    getReservs(id: number): Observable<any[]> {
        return this.http.get(this.baseUrl + id)
            .map(response => response.json().model)
            .catch((error: any) => { return Observable.throw(error); });
    }
    getReservesByMonth(month: number): Observable<any[]> {
        return this.http.get(this.baseUrl + 'GetByMonth/' + month)
            .map(response => response.json().model)
            .catch((error: any) => { return Observable.throw(error); });
    }
    getReserve(id: number): Observable<any> {
        return this.http.get(this.baseUrl + 'GetById/' + id)
            .map((resp: Response) => {
                return resp.json().model;
            })
            .catch((error: any) => { return Observable.throw(error); });
    }
    getCustomers(id: number): Observable<any[]> {
        return this.http.get(this.baseUrl + 'GetCustomers/' + id)
            .map((resp: Response) => {
                return resp.json().model;
            })
            .catch((error: any) => { return Observable.throw(error); });
    }
    addReserv(item: Reserv): Observable<any[]> {
        var url = this.baseUrl;
        return this.http.post(this.baseUrl, JSON.stringify(item), this.getRequestOptions())
            .map((resp: Response) => {
                console.log(resp.json().message);
                return resp.json().model;
            })
            .catch((error: any) => { return Observable.throw(error); });
    }
    deleteReserv(id: number): Observable<any[]> {
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