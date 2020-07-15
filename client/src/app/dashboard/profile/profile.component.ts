import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(public userService: UserService) { }
  personalDetails;
  accountDetails;
  goalString;
  age;
  foodPublished;
  mealsAdded;
  checkIns;
  // profile.personalDetails
  // personalDetails;


  ngOnInit(): void {

    this.userService.getPersonalDetails().subscribe(
      res => {
        this.personalDetails = res['personalDetails'];
        this.age = this.personalDetails.age;

        this.personalDetails.goal = this.personalDetails.goal.split("_");
        this.goalString = this.personalDetails.goal[0] + " " + this.personalDetails.goal[1];
        // console.log(this.personalDetails);
      },
      err => { }
    );

    this.userService.getUserProfile().subscribe(
      res => {
        this.accountDetails = res['user'];
        this.getFoodPublished(this.accountDetails.email);
        this.getMealsAdded(this.accountDetails._id);
        this.getCheckIns(this.accountDetails._id);
      },
      err => { }
    );


  }

  getFoodPublished(userId) {
    this.userService.getFoodPublished(userId).subscribe(
      res => {
        this.foodPublished = res["count"];
        console.log(this.foodPublished);
      },
      err => { console.log(err); }
    );



  }

  getMealsAdded(userId) {
    this.userService.getMealsAdded(userId).subscribe(
      res => {
        this.mealsAdded = res["count"];
        // console.log(this.foodPublished);
      },
      err => { console.log(err); }
    );

  }

  getCheckIns(userId) {
    this.userService.getCheckIns(userId).subscribe(
      res => {
        this.checkIns = res["count"];
        // console.log(this.foodPublished);
      },
      err => { console.log(err); }
    );

  }
}
