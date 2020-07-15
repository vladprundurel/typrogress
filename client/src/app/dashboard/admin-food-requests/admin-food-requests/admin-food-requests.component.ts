import { Component, OnInit } from '@angular/core';
import { TabulatorTableComponent } from 'tabulator-tables';
import { FoodService } from 'src/app/shared/food.service';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-admin-food-requests',
  templateUrl: './admin-food-requests.component.html',
  styleUrls: ['./admin-food-requests.component.css']
})
export class AdminFoodRequestsComponent implements OnInit {

  constructor(private foodService: FoodService, public userService: UserService) { }

  public height = "292px";
  public data;
  public isAdmin = false;

  ngOnInit(): void {
    this.isUserAdmin();
    this.getRequestedFood();
  }

  public columnNames = [
    {title: "Name", field: "name", width:150, headerFilter:"input"}, 
    {title: "Quantity", field: "quantity", headerFilter:"input"},
    {title: "Unit", field: "unit", headerFilter:"input"},
    {title: "Calories", field: "calories", headerFilter:"input"},
    {title: "Proteins", field: "proteins", headerFilter:"input"},
    {title: "Carbs", field: "carbs", headerFilter:"input"},
    {title: "Fats", field: "fats", headerFilter:"input"},
    {title: "Requested by", field: "addedBy", headerFilter:"input"},
    {title: "State", field: "state", headerFilter:"input", editor: "select", editorParams: 
      {
        values: {"requested": "requested", "published": "published", "remove": "remove"}
      }, 
    cellEdited: (e, row) => this.updateFoodState(e, row)
  } ];

  getRequestedFood() {
    this.foodService.getRequestedFood().subscribe(
      res => {
        this.data = res;
        console.log(res);
        
      },
      err => {}
    );
  }

  public updateFoodState(e, cell) {

    var food_id = e.getData()._id;
    var state = e.getData().state;
    // if (state == 'published' || state == 'remove') {
    //   this.getRequestedFood();
    // }
    var data = {
      "food_id": food_id,
      "state": state
    };
    this.foodService.updateFoodState(data).subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.log(err);
      }
    )
  }

  isUserAdmin() {
    this.userService.getUserProfile().subscribe(
      res => {
        this.isAdmin = res['user'].role == 'admin';
        console.log(this.isAdmin);
      },
      err => {}
    );}


}
