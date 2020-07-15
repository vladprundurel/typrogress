import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Food } from './food.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  food: Food = {
    name: '',
    quantity: null,
    unit: '',
    calories: null,
    proteins: null,
    carbs: null,
    fats: null,
    addedBy: ''
  };

  constructor(private http: HttpClient) { }

  noAuthHeader = { 
    headers: new HttpHeaders({ 'NoAuth': 'True'}) 
  };

  postFoodAsAdmin(food: Food) {
    return this.http.post(environment.apiBaseUrl + '/addFood', food, this.noAuthHeader);
  }

  getAllFood() {
    return this.http.get(environment.apiBaseUrl + '/getAllFood');
  }

  postMealAsUser(meal) {
    console.log(meal);
    return this.http.post(environment.apiBaseUrl + '/addMeal', meal, this.noAuthHeader);
  }

  getMealsAsUserByDate(date, userId) {
    let httpParams = new HttpParams().set('date', date).set('userId', userId);
    // console.log(environment.apiBaseUrl + '/getMealsByDate/:' + date + "/:" + userId);
    // console.log(environment.apiBaseUrl + '/getMealsByDate/' + date);
    return this.http.get(environment.apiBaseUrl + '/getMealsByDate', {params: httpParams});
  }

  postUserNutritionData(userNutritionData) {
    return this.http.post(environment.apiBaseUrl + '/addUserNutritionData', userNutritionData);
  }

  getUserNutritionData(userId) {
    let httpParams = new HttpParams().set('userId', userId);
    return this.http.get(environment.apiBaseUrl + '/getUserNutritionData', {params: httpParams});
  }

  updateUserNutritionData(userNutritionData) {
    // let httpParams = new HttpParams().set('userId', userId);
    return this.http.post(environment.apiBaseUrl + '/updateUserNutritionData', userNutritionData);
  }

  getRequestedFood() {
    return this.http.get(environment.apiBaseUrl + '/requestedFood');
  }

  updateFoodState(data) {
    // let httpParams = new HttpParams().set('food_id', food_id).set('state', state);
    return this.http.post(environment.apiBaseUrl + '/updateFoodState', data);
  }

}


