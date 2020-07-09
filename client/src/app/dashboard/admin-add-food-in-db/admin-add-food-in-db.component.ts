import { Component, OnInit } from '@angular/core';
import { FoodService } from 'src/app/shared/food.service';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-admin-add-food-in-db',
  templateUrl: './admin-add-food-in-db.component.html',
  styleUrls: ['./admin-add-food-in-db.component.css']
})
export class AdminAddFoodInDbComponent implements OnInit {

  constructor(public foodService: FoodService, public userService: UserService) { }

  showSuccessMessage = false;
  showErrorMessage = false;
  ngOnInit(): void { }
  
  submitFood(form: NgForm) {

    this.userService.getUserProfile().subscribe(
      res => {
        form.value.addedBy = res['user'].email;
        this.foodService.postFoodAsAdmin(form.value).subscribe(
          res => {
            this.showSuccessMessage = true;
            setTimeout(() => this.showSuccessMessage = false, 1500);
            this.resetForm(form);
          },
          err => {
            this.showErrorMessage = true;
          }
        );
      },
      err => { }
    );
  }

  updateCalories() {
    this.foodService.food.calories = this.foodService.food.proteins * 4 + this.foodService.food.carbs * 4 + this.foodService.food.fats * 9;
  }

  resetForm(form: NgForm) {
    this.foodService.food = {
      name: '',
      quantity: null,
      unit: '',
      calories: null,
      proteins: null,
      carbs: null,
      fats: null,
      addedBy: ''
    };
    form.resetForm();
  }

}
