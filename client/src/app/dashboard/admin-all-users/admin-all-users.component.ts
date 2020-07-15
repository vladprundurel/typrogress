import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/shared/admin.service';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-admin-all-users',
  templateUrl: './admin-all-users.component.html',
  styleUrls: ['./admin-all-users.component.css']
})
export class AdminAllUsersComponent implements OnInit {

  public users;
  public isAdmin = false;
  // public columnNames;
  
  constructor(public adminService: AdminService, public userService: UserService) { }

  ngOnInit(): void {
    this.adminService.getAllUsers().subscribe(
      res => {
        this.setAllUsers(res);
      },
      err => {}
    );
    this.isUserAdmin();

  }

  public columnNames = [
    {title: "First name", field: "first_name", width:150, headerFilter:"input"}, 
    {title: "Last name", field: "last_name", headerFilter:"input"},
    {title: "Email address", field: "email", headerFilter:"input"},
    {title: "Role", field: "role", headerFilter:"input", editor: "select", editorParams: 
      {
        values: {"user": "user", "admin": "admin"}
      }, 
    cellEdited: (e, row) => this.updateRole(e, row)
  } ];

  setAllUsers(res) {
    this.users = res;
  }

  updateRole(e, row) {
    var user_id = e.getData()._id;
    var role = e.getData().role;
    var data = {
      "user_id": user_id,
      "role": role
    };
    this.adminService.updateRole(data).subscribe(
      succ => {},
      err => {}
    );
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
