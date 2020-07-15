import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChartsService {

  constructor(private http: HttpClient) { }

  getCaloriesByDate(from_date, to_date, userId) {

    let httpParams = new HttpParams().set('from_date', from_date).set('to_date', to_date).set('user_id', userId);
    return this.http.get(environment.apiChartsBaseUrl + "/getCaloriesByDate", {params: httpParams});

  }

  getMeasurementsData(from_date, to_date, userId) {
    let httpParams = new HttpParams().set('from_date', from_date).set('to_date', to_date).set('user_id', userId);
    return this.http.get(environment.apiChartsBaseUrl + "/getMeasurementsData", {params: httpParams});
  }
}
