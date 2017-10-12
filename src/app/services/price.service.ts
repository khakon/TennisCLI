import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { Price } from './models/price';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class PriceHttpService {
    private baseUrl = 'api/prices';
    constructor(private http: Http) { }
    getPrices(): Observable<Price[]> {
        return this.http.get(this.baseUrl)
            .map(response => response.json().model)
            .catch((error: any) => { return Observable.throw(error); });
    }
    getPrice(id: number): Observable<Price> {
        return this.http.get(this.baseUrl + '/GetById/' + id)
            .map((resp: Response) => {
                return resp.json().model;
            })
            .catch((error: any) => { return Observable.throw(error); });
    }
    addPrice(item: Price): Observable<Price[]> {
        var url = this.baseUrl;
        return this.http.post(this.baseUrl, JSON.stringify(item), this.getRequestOptions())
            .map((resp: Response) => {
                console.log(resp.json().message);
                return resp.json().model;
            })
            .catch((error: any) => { return Observable.throw(error); });
    }
    deletePrice(id: number): Observable<Price[]> {
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