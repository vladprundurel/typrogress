import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { Router } from '@angular/router';
// import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  userDetails;
  isAdmin = false;
  // url: string = 'https://getbootstrap.com/docs/4.5/getting-started/download/';
  // urlSafe: SafeResourceUrl;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe(
      res => {
        this.userDetails = res['user'];
        this.isAdmin = this.userDetails.role == 'admin';
      },
      err => {}
    );

    // this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }

  onLogout(){
    this.userService.deleteToken();
    this.router.navigate(['/login']);
  }

}
