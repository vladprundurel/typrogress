import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  getAllUsers() {
    return this.http.get(environment.apiBaseUrl + '/getAllUsers');
  }

  updateRole(data) {
    return this.http.post(environment.apiBaseUrl + '/updateRole', data);
  }
}
