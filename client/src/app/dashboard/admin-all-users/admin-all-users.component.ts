import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/shared/admin.service';

@Component({
  selector: 'app-admin-all-users',
  templateUrl: './admin-all-users.component.html',
  styleUrls: ['./admin-all-users.component.css']
})
export class AdminAllUsersComponent implements OnInit {

  public users;
  
  constructor(public adminService: AdminService) { }

  ngOnInit(): void {
    this.adminService.getAllUsers().subscribe(
      res => {
        this.setAllUsers(res);
      },
      err => {}
    );
  }

  setAllUsers(res) {
    this.users = res;
  }

}
