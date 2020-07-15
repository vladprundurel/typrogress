import { Component, OnInit } from '@angular/core';
// import { UserService } from 'src/app/shared/user.service';
import { FoodService } from 'src/app/shared/food.service';
import { Food } from 'src/app/shared/food.model';
import { Router, NavigationEnd } from '@angular/router';
import { NgbModalConfig, NgbModal, ModalDismissReasons, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/shared/user.service';
import { FormArray } from '@angular/forms';



@Component({
  selector: 'app-add-meals',
  templateUrl: './add-meals.component.html',
  styleUrls: ['./add-meals.component.css']
})
export class AddMealsComponent implements OnInit {

 public state = "requested";
 display = "d-none";
 col = "";
  //Chart data
  chartOptions = {
    responsive: true
    // title: {
    //   text: "title",
    //   display: "true"
    // }
  };
  chartLabels = ['Proteins', 'Carbs', 'Fats'];
  // chartData = [300, 500, 100];
  chartLegend = true;
  chartPlugins = [];

  //variables
  model: NgbDateStruct;
  closeResult = '';
  public food: any;
  // public mealsReceiveFromServer: any;
  public separatedMealsByMealType: any;

  public filteredFood: any;
  public _searchTerm: string;
  public foodFound: boolean;
  public userId: any;
  public mealTime = [
    {type: 'breakfast'},
    {type: 'lunch'},
    {type: 'dinner'},
    {type: 'snacks'}
  ];
  public selectedFood = [];
  public nutritionFacts = {
    "totalCalories": 0,
    "totalProteins": 0,
    "totalCarbs": 0,
    "totalFats": 0
  };
  public editedQuantity;
  totalCaloriesForThisMeal = 0;
  totalProteinsForThisMeal = 0;
  totalCarbsForThisMeal = 0;
  totalFatsForThisMeal = 0;
  typeSelected;
  public meal = {
    "type": '',
    "userId": '',
    "date": '',
    "nutritionFacts": this.nutritionFacts,
    "food": this.selectedFood
  }
  public dailyNutritionGoals;
  public totalCaloriesByFoodAdded = 0;
  public permission = true;

  constructor(private foodService: FoodService, private userService: UserService, private router: Router, private modalService: NgbModal, config: NgbModalConfig, private calendar: NgbCalendar) { 
    config.windowClass = "addMealModal";
  }
  
  ngOnInit(): void {

    this.getAllFood();
    this.foodFound = true;
    this.model = this.calendar.getToday();
    this.getUser();
    this.meal.date = this.model.day + "-" + this.model.month + "-" + this.model.year;
    this.getMeals();
    
  }

  setDate() {
    this.meal.date = this.model.day + "-" + this.model.month + "-" + this.model.year;
    // this.meal.date = "10-09-2020";
    
    //this.getMeals();
    this.getMeals();
    
  }

  getMeals() {
    var userId;
    this.userService.getUserId().subscribe(
      res=> {
        userId = res["user"]._id;
        // console.log(this.meal.date);
        this.foodService.getMealsAsUserByDate(this.meal.date, userId).subscribe(
          res => {
            
            this.foodService.getUserNutritionData(userId).subscribe(
              userNutritionData => {
                // if(userNutritionData[0]) {
                  this.separateMealsByMealType(res, userNutritionData[0].nutritionByMeal);
                  this.dailyNutritionGoals = userNutritionData[0].dailyNutritionGoals;
                // }
                
                
                
              },
              err=> {}
            );
           

          },
          err => {}
        );
      
      }
    );



  }

  separateMealsByMealType(meals, userNutritionData) {
    var mt = this.mealTime;
    var separatedMeals = [];
    // separatedMeals[this.mealTime[0].type] = [];
    for(var i=0; i < mt.length; i++){
      
      separatedMeals[mt[i].type] = [];
    }
    this.totalCaloriesByFoodAdded = 0;
    console.log("INITIAL" + this.totalCaloriesByFoodAdded);
    meals.forEach(meal => {
      console.log(this.totalCaloriesByFoodAdded);
      this.totalCaloriesByFoodAdded += meal.mealByUser.nutritionFacts.totalCalories;
      separatedMeals[meal.mealByUser.type] = meal;
    });

    mt.forEach(mt => {
      separatedMeals[mt.type].macronutrients_goal = userNutritionData[mt.type];
    });
    this.separatedMealsByMealType = separatedMeals;

  }

    getUser() {
      var userId;
      
      this.userService.getUserProfile().subscribe(
        res => { userId = res['user']._id; this.meal.userId = userId 
      this.userId = userId },
        err => { userId = undefined; this.meal.userId = undefined } ); 
      }

  open(addMealModal, type) {
    this.typeSelected = type;
    this.meal.type=this.typeSelected;
    
    var sp = this.separatedMealsByMealType;
     console.log(this.separatedMealsByMealType);
    
    if(sp[type].mealByUser) {
      
      this.selectedFood = sp[type].mealByUser.food;
      this.totalCaloriesForThisMeal = sp[type].mealByUser.nutritionFacts.totalCalories;
      this.totalProteinsForThisMeal = sp[type].mealByUser.nutritionFacts.totalProteins;
      
      this.totalCarbsForThisMeal = sp[type].mealByUser.nutritionFacts.totalCarbs;
      this.totalFatsForThisMeal = sp[type].mealByUser.nutritionFacts.totalFats;
      // this.meal.food = [];
      this.meal.food = this.selectedFood;
    }

    
    this.modalService.open(addMealModal, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    // this.selectedFood = [];
    if (reason === ModalDismissReasons.ESC) {
      // this.router.navigateByUrl('/dashboard');
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      this.postMealInDb(this.meal);
      // this.totalCaloriesByFoodAdded = 0;
      this.setDate();
      // this.getMeals();
      // this.getAllFood();
      // this.foodFound = true;

      // this.getUser();
      this.getMeals();
      // this.separatedMealsByMealType = [];
      // this.selectedFood = [];
      // this.filteredFood = [];
      // this.foodFound = false;
      
      // location.reload();
      // this.router.navigateByUrl('/dashboard');
      return 'by clicking on a backdrop';
    } else {
      // this.router.navigateByUrl('/dashboard');
      return `with: ${reason}`;
    }
  }

  saveMeal() {
    this.postMealInDb(this.meal);
    this.setDate();
    this.getMeals();
    location.reload();
  }

  filterFood(searchString: string) {
    if (searchString){
      this.filteredFood = this.food;
      this.filteredFood = this.food.filter(res => res.name.toLocaleLowerCase().indexOf(searchString.toLocaleLowerCase()) !== -1);
      if(this.filteredFood.length != 0) {
        this.foodFound = true;
      } else {
        this.foodFound = false;
        // setTimeout(() => this.foodFound = true, 1500);
      }
    // return this.food.filter(res => res.name.toLocaleLowerCase().indexOf(searchString.toLocaleLowerCase()) !== -1);
    } else {
      this.filteredFood = null;
    }
  }

  getAllFood() {
    this.foodService.getAllFood().subscribe(
      res => {
        this.food = res;
        
      },
      err => {}
    );
    
  }

  addOrRemoveFood(selectedFoodByUser, type) {
    type = this.typeSelected;
    // selectedFoodByUser.selectedQty = selectedFoodByUser.quantity;
    if(this.selectedFood.find( ({_id}) => _id === selectedFoodByUser._id )){
      var index = this.selectedFood.map(e => e._id).indexOf(selectedFoodByUser._id);
      this.totalCaloriesForThisMeal -= selectedFoodByUser.calories;
      this.totalProteinsForThisMeal -= selectedFoodByUser.proteins;
      this.totalCarbsForThisMeal -= selectedFoodByUser.carbs;
      this.totalFatsForThisMeal -= selectedFoodByUser.fats;
      this.selectedFood.splice(index, 1);
    } else {
      this.totalCaloriesForThisMeal += selectedFoodByUser.calories;
      this.totalProteinsForThisMeal += selectedFoodByUser.proteins;
      this.totalCarbsForThisMeal += selectedFoodByUser.carbs;
      this.totalFatsForThisMeal += selectedFoodByUser.fats;
      
      // console.log(selectedFoodByUser);
      this.selectedFood.push(JSON.parse(JSON.stringify(selectedFoodByUser)));
    }

    this.nutritionFacts.totalCalories = this.totalCaloriesForThisMeal;
    this.nutritionFacts.totalProteins = this.totalProteinsForThisMeal;
    this.nutritionFacts.totalCarbs = this.totalCarbsForThisMeal;
    this.nutritionFacts.totalFats = this.totalFatsForThisMeal;

    
  }

  changeSelectedQuantity(selectedFoodWithEditedQty) {

    var newQuantity = selectedFoodWithEditedQty.quantity;

    var defaultQuantity = this.food.find( ({_id}) => _id === selectedFoodWithEditedQty._id ).quantity;
    this.selectedFood.find( ({_id}) => _id === selectedFoodWithEditedQty._id ).quantity = newQuantity;

    var defaultCalories = this.food.find( ({_id}) => _id === selectedFoodWithEditedQty._id ).calories;
    var defaultProteins = this.food.find( ({_id}) => _id === selectedFoodWithEditedQty._id ).proteins;
    var defaultCarbs = this.food.find( ({_id}) => _id === selectedFoodWithEditedQty._id ).carbs;
    var defaultFats = this.food.find( ({_id}) => _id === selectedFoodWithEditedQty._id ).fats;

    this.selectedFood.find( ({_id}) => _id === selectedFoodWithEditedQty._id ).calories = Math.floor((newQuantity / defaultQuantity) * defaultCalories);
    this.selectedFood.find( ({_id}) => _id === selectedFoodWithEditedQty._id ).proteins = Math.floor((newQuantity / defaultQuantity) * defaultProteins);
    this.selectedFood.find( ({_id}) => _id === selectedFoodWithEditedQty._id ).carbs = Math.floor((newQuantity / defaultQuantity) * defaultCarbs);
    this.selectedFood.find( ({_id}) => _id === selectedFoodWithEditedQty._id ).fats = Math.floor((newQuantity / defaultQuantity) * defaultFats);

    var totalCaloriesAfterUpdate = 0;
    var totalProteinsAfterUpdate = 0;
    var totalCarbsAfterUpdate = 0;
    var totalFatsAfterUpdate = 0;

    this.selectedFood.forEach(sF => {
      totalCaloriesAfterUpdate += sF.calories;
      
    });
    console.log(totalCaloriesAfterUpdate);
    this.totalCaloriesForThisMeal = totalCaloriesAfterUpdate;

    this.selectedFood.forEach(sF => {
      totalProteinsAfterUpdate += sF.proteins;
    });
    this.totalProteinsForThisMeal = totalProteinsAfterUpdate;

    this.selectedFood.forEach(sF => {
      totalCarbsAfterUpdate += sF.carbs;
    });
    this.totalCarbsForThisMeal = totalCarbsAfterUpdate;

    this.selectedFood.forEach(sF => {
      totalFatsAfterUpdate += sF.fats;
    });
    this.totalFatsForThisMeal = totalFatsAfterUpdate;
  
    this.nutritionFacts.totalCalories = this.totalCaloriesForThisMeal;
    this.nutritionFacts.totalProteins = this.totalProteinsForThisMeal;
    this.nutritionFacts.totalFats = this.totalFatsForThisMeal;
    this.nutritionFacts.totalCarbs = this.totalCarbsForThisMeal;
    
  }

  postMealInDb(meal) {
    
    this.foodService.postMealAsUser(meal).subscribe(
      res => {},
      err => {}
    )
  }

  showAddFoodComponent() {
    // this.showAddFoodComponent = "show";
    this.display = "";
  }
}
