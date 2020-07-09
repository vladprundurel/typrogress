import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../../shared/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  constructor(public userService: UserService, public router: Router) { }

  model = {
    email: '',
    password: ''
  };
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  serverErrorMessage: string;

  ngOnInit(): void {
    if(this.userService.isLoggedIn()) {
      // this.router.navigateByUrl('/userprofile');
      this.router.navigateByUrl('/dashboard');
    }
  }

  onSubmit(form: NgForm){
    this.userService.login(form.value).subscribe(
      res => {
        this.userService.setToken(res['token']);
        // this.router.navigateByUrl('/userprofile');
        this.router.navigateByUrl('/dashboard');
      },
      err => {
        this.serverErrorMessage = err.error.message;
      }
    );
  }

}
