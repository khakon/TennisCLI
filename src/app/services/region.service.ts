import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { Region } from './models/region';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class RegionHttpService {
    private baseUrl = 'api/regions';
    constructor(private http: Http) { }
    getRegions(): Observable<Region[]> {
        return this.http.get(this.baseUrl)
            .map(response => response.json().model)
            .catch((error: any) => { return Observable.throw(error); });
    }
}