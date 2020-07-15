import { Component, OnInit } from '@angular/core';
import {NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/shared/user.service';
@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.css']
})
export class CheckInComponent implements OnInit {

  constructor(public userService: UserService, private ngbCalendar: NgbCalendar, private dateAdapter: NgbDateAdapter<string>) { }

  public userId;
  public model: NgbDateStruct;
  public checkInData = {
    weight: null,
    neck: null,
    waist: null,
    hips: null
  };
  public successfullySaved = false;

  public checkInDoneData;

  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }

  ngOnInit(): void {
    this.userService.getUserId().subscribe(
      res => {this.userId = res['user']._id;}
    );
  }

  dateChanged() {
    console.log(this.model);
    var date = this.model.day + "-" + this.model.month + "-" + this.model.year;
    this.getCheckInDoneData(this.userId, date);
    console.log(date);
  }

  submitCheckInData(data) {
    this.successfullySaved = true;
    data.value.date = this.model.day + "-" + this.model.month + "-" + this.model.year;
    // this.meal.date = this.model.day + "-" + this.model.month + "-" + this.model.year;
    if(!data.value.weight) {
      data.value.weight = 0;
    }
    if(!data.value.neck) {
      data.value.neck = 0;
    }
    if(!data.value.waist) {
      data.value.waist = 0;
    }
    if(!data.value.hips) {
      data.value.hips =0;
    }
    this.userService.getUserId().subscribe(
      res => {
        // console.log(res['user']._id);
        data.value.userId = res['user']._id;
        this.userService.postCheckInData(data.value).subscribe(
          res=> {},
          err=> {}
        );
      },
      err => {}
    );

    

  }

  getCheckInDoneData(userId, date) {
    this.userService.getCheckInDoneData(userId, date).subscribe(
      res => {
        this.checkInDoneData = res;
        console.log(this.checkInDoneData);
      },
      err => {
        
      }
    );
  }

}
