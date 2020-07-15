import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { environment } from '../../environments/environment';

import { User } from './user.model';
import { PersonalDetails } from './personal-details.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  selectedUser: User = {
    first_name: '',
    last_name: '',
    email: '',
    password: ''
  };

  personalDetails: PersonalDetails = {
    // user: this.selectedUser.email,
    user: '',
    goal: '',
    age: null,
    gender: '',
    height: null,
    current_weight: null,
    desired_weight: null,
    activity_level: null
  };

  noAuthHeader = {
    headers: new HttpHeaders({ 'NoAuth': 'True' })
  };

  constructor(private http: HttpClient) { }

  //http methods
  postUser(user: User) {
    console.log(user);
    return this.http.post(environment.apiBaseUrl + '/register', user, this.noAuthHeader);

  }

  postPersonalDetails(personalDetails: PersonalDetails) {
    console.log(personalDetails);
    console.log("post to: " + environment.apiBaseUrl);
    return this.http.post(environment.apiBaseUrl + '/personalDetails', personalDetails, this.noAuthHeader);
  }

  //use this.noAuthHeader if user doesn't need authentication to view this page
  login(authCredentials) {
    return this.http.post(environment.apiBaseUrl + '/authenticate', authCredentials, this.noAuthHeader);
  }

  getUserProfile() {
    return this.http.get(environment.apiBaseUrl + '/userProfile');
  }

  getUserId() {
    return this.http.get(environment.apiBaseUrl + '/userProfileId');
  }

  getPersonalDetails() {
    return this.http.get(environment.apiBaseUrl + '/userPersonalDetails');
  }

  //helper methods
  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  deleteToken() {
    localStorage.removeItem('token');
  }

  getUserPayload() {
    var token = this.getToken();
    if (token) {
      //decode encoded data
      var userPayload = atob(token.split('.')[1]); //second item will be the payload
      return JSON.parse(userPayload);
    } else {
      return null;
    }
  }

  isLoggedIn() {
    var userPayload = this.getUserPayload();
    if (userPayload) {
      return userPayload.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  postCheckInData(data) {
    return this.http.post(environment.apiBaseUrl + '/checkIn', data);
  }

  getCheckInDoneData(userId, date) {
    // console.log(date);
    let httpParams = new HttpParams().set('userId', userId).set('date', date);
    return this.http.get(environment.apiBaseUrl + '/getCheckInDoneData', { params: httpParams });
  }

  getFoodPublished(userId) {
    let httpParams = new HttpParams().set('userId', userId);
    return this.http.get(environment.apiBaseUrl + '/foodPublished', { params: httpParams });
  }

  getMealsAdded(userId) {
    let httpParams = new HttpParams().set('userId', userId);
    return this.http.get(environment.apiBaseUrl + '/mealsAdded', { params: httpParams });
  }

  getCheckIns(userId) {
    let httpParams = new HttpParams().set('userId', userId);
    return this.http.get(environment.apiBaseUrl + '/checkIns', { params: httpParams });
  }
}