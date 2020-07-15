import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';
import { NgForm } from '@angular/forms';
import { FoodService } from 'src/app/shared/food.service';

@Component({
  selector: 'app-personaldata',
  templateUrl: './personaldata.component.html',
  styleUrls: ['./personaldata.component.css']
})
export class PersonaldataComponent implements OnInit {

  //variables
  public personalDetails: any;
  public successfullySaved = false;
  @Input() age;

  public dailyNutritionGoals = {
    "calories": null,
    "proteins": {"number": null, "percentage": null},
    "carbs": {"number": null, "percentage": null},
    "fats": {"number": null, "percentage": null}
  };
  public userNutritionData = {
    "userId": null,
    "dateUpdated": null,
    "dailyNutritionGoals": this.dailyNutritionGoals,
    "nutritionByMeal": {}
  };

  // public nutritionByMeal
  //mealTime with total calories for each mealtime


  //methods
  constructor(public userService: UserService, public foodService: FoodService) { }

  userId;

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe(
      res => {
      this.userId = res["user"]._id;
    },
      err => {}
    );

    this.userService.getPersonalDetails().subscribe(
      res => {
        this.personalDetails = res['personalDetails'];
        // console.log(this.personalDetails);
      },
      err => {}
    );

    // this.calculateNutritionFacts();
  }

  submitPersonalDetailsForm(form: NgForm){
    this.successfullySaved = true;
    this.calculateNutritionFacts(form.value);
    console.log(form.value);
    form.value.user = this.userId;
    this.userService.postPersonalDetails(form.value).subscribe(
      res => {},
      err => {}
    );
  }

  cal = {
    "proteins": 4,
    "carbs": 4,
    "fats": 9
  };

  calculateNutritionFacts(details) {
    var perc = {
      "proteins": 0.2,
      "carbs": 0.5,
      "fats": 0.3
    };

    //Total calories
    this.dailyNutritionGoals.calories = Math.round(details.current_weight * 2.2 * details.activity_level);

    //Total proteins
    this.dailyNutritionGoals.proteins.number = Math.round(this.dailyNutritionGoals.calories * perc.proteins / this.cal.proteins);
    this.dailyNutritionGoals.proteins.percentage = perc.proteins;

    //Total carbs
    this.dailyNutritionGoals.carbs.number = Math.round(this.dailyNutritionGoals.calories * perc.carbs / this.cal.carbs);
    this.dailyNutritionGoals.carbs.percentage = perc.carbs;

    //Total fats
    this.dailyNutritionGoals.fats.number = Math.round(this.dailyNutritionGoals.calories * perc.fats / this.cal.fats);
    this.dailyNutritionGoals.fats.percentage = perc.fats;

    var mealTime = {
      "breakfast": Math.round(0.35 * this.dailyNutritionGoals.calories),
      "lunch": Math.round(0.30 * this.dailyNutritionGoals.calories),
      "dinner": Math.round(0.25 * this.dailyNutritionGoals.calories),
      "snacks": Math.round(0.10 * this.dailyNutritionGoals.calories)
    };
    
    for (var key in mealTime){
      this.userNutritionData.nutritionByMeal[key]=this.calculateNutritionByMeal(mealTime[key], perc.proteins, perc.carbs, perc.fats);
    }

    this.userNutritionData.userId = this.userId;
    this.userNutritionData.dateUpdated = new Date();
    console.log(this.userNutritionData);
    //add this.userNutritionData in database

    this.foodService.postUserNutritionData(this.userNutritionData).subscribe(
      res => {},
      err => {}
    );

  }

   calculateNutritionByMeal = (calories, perc_prot, perc_carb, perc_fat) => {
     var result = {
          "calories": Math.round(calories),
          "proteins": {
            "number": Math.round(calories * perc_prot / this.cal.proteins),
            "percentage": perc_prot
          },
          "carbs": {
            "number": Math.round(calories * perc_carb / this.cal.carbs),
            "percentage": perc_carb
          },
          "fats": {
            "number": Math.round(calories * perc_fat / this.cal.fats),
            "percentage": perc_fat
          }
     }
    

    return result;
  }
}
