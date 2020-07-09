import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  userDetails;
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe(
      res=> {
        this.userDetails = res['user'];
        console.log(this.userDetails);
      },
      err => {}
    );
  }

}
