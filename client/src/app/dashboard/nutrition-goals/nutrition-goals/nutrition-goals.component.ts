import { Component, OnInit } from '@angular/core';
import { FoodService } from 'src/app/shared/food.service';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-nutrition-goals',
  templateUrl: './nutrition-goals.component.html',
  styleUrls: ['./nutrition-goals.component.css']
})
export class NutritionGoalsComponent implements OnInit {

  public userId: any;
  public userNutritionData: any;
  public dailyNutritionGoals: any;
  public nutritionByMeal: any;
  public value = {
    "0.05": "5%",
    "0.10": "10%",
    "0.15": "15%",
    "0.20": "20%",
    "0.25": "25%",
    "0.3": "30%",
    "0.35": "35%",
    "0.4": "40%",
    "0.45": "45%",
    "0.5": "50%",
    "0.55": "55%",
    "0.60": "60%",
    "0.65": "65%",
    "0.70": "70%",
    "0.75": "75%",
    "0.80": "80%",
    "0.85": "85%",
    "0.90": "90%"
  }

  public valid_perc = {
    "breakfast": true,
    "lunch": true,
    "dinner": true,
    "snacks": true
  }

  public saveButtonAction = 'enabled';
  public successfullySaved = false;


  constructor(public foodService: FoodService, public userService: UserService) {
   }

  ngOnInit(): void {
    this.getUserNutritionData();

  }

  getUserNutritionData() {
    var userId;
    this.userService.getUserId().subscribe(
      res => {
        userId = res["user"]._id;
        this.foodService.getUserNutritionData(userId).subscribe(
          res => {
            this.showUserNutritionData(res);
            this.getUserId(userId);
          },
          err => {}
        );
      }
    );
    }

    showUserNutritionData(res) {
      console.log(res[0]);
      this.userNutritionData = res[0];
      this.dailyNutritionGoals = this.userNutritionData.dailyNutritionGoals;
      this.nutritionByMeal = this.userNutritionData.nutritionByMeal;
    }

    selectChangeHandler(mealTime, macro, v, event: any) {
      // this.nutritionByMeal.breakfast.proteins.number = 0;
      var new_percentage = event.target.value;
      var mealTime = mealTime;
      var oldNumber = v.number;
      var old_calories_mealTime = this.userNutritionData.nutritionByMeal[mealTime].calories;

      this.userNutritionData.nutritionByMeal[mealTime][macro].percentage = new_percentage;
      if (macro == 'fats') {
        this.userNutritionData.nutritionByMeal[mealTime][macro].number = Math.round(old_calories_mealTime * new_percentage / 9);
      } else if(macro == 'proteins' || macro == 'carbs') {
        this.userNutritionData.nutritionByMeal[mealTime][macro].number = Math.round(old_calories_mealTime * new_percentage / 4);
      }

      var p = this.userNutritionData.nutritionByMeal[mealTime]['proteins'].percentage;
      var c = this.userNutritionData.nutritionByMeal[mealTime]['carbs'].percentage;
      var f = this.userNutritionData.nutritionByMeal[mealTime]['fats'].percentage;

      if (this.checkPercentage(p, c, f) == false) {
        this.valid_perc[mealTime] = false;
        this.saveButtonAction = 'disabled';
      } else {
        this.valid_perc[mealTime] = true;
        this.saveButtonAction = 'enabled';
      }
      console.log(this.valid_perc);
    }

    checkPercentage(p, c, f) {
      var sum = Number(p)+Number(c)+Number(f);
      if(sum != 1) {
        return false;
      }
      return true;
    }

    order = (a, b) => {
      if(a.key == "dinner" && b.key == "lunch") return b.key;
    }

    orderValue = (a, b) => {
      if(a.key == "5" && b.key == "10") return a.key;
    }

    getUserId(id) {
      this.userId = id;
    }

    saveNutritionGoals() {
      this.successfullySaved = true;
      this.foodService.updateUserNutritionData(this.userNutritionData).subscribe(
        res => {},
        err => {}
      );
    }

}
