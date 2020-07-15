import { Component, OnInit, Input } from '@angular/core';
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
  public isAdmin = false;
  showSuccessMessage = false;
  showErrorMessage = false;
  @Input() state;
  @Input() display;
  @Input() col;
  @Input() permission;
  ngOnInit(): void {
    if (typeof this.col === "undefined") {
      this.col = "col-xl-6 col-md-6 col-lg-6";
      this.isUserAdmin();
    }
  console.log(this.permission);
  console.log(this.isAdmin);
   }
  
  submitFood(form: NgForm) {

    this.userService.getUserProfile().subscribe(
      res => {
        form.value.addedBy = res['user'].email;
        this.isAdmin = res['user'].role == 'admin';
        console.log(this.isAdmin);
        if(typeof this.state === 'undefined') {
          // form.value.state = "published";
          this.state = "published";
        }
        form.value.state = this.state;
        console.log(this.state);
        
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

  isUserAdmin() {
    this.userService.getUserProfile().subscribe(
      res => {
        this.isAdmin = res['user'].role == 'admin';
      },
      err => {}
    );}

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
