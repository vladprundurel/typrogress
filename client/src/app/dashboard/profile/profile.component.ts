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
  // profile.personalDetails
  // personalDetails;
  ngOnInit(): void {
    this.userService.getPersonalDetails().subscribe(
      res => {
        this.personalDetails = res['personalDetails'];
      
        this.personalDetails.goal = this.personalDetails.goal.split("_");
        this.goalString = this.personalDetails.goal[0] + " " + this.personalDetails.goal[1];
        // console.log(this.personalDetails);
      },
      err => {}
    );

    this.userService.getUserProfile().subscribe(
      res=> {
        this.accountDetails = res['user'];
        console.log(this.accountDetails);
      },
      err => {}
    );
    }
}
