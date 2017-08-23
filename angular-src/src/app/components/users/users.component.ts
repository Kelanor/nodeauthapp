import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
	users: Object[];

	constructor(private userService: UsersService,
				private router: Router) { }

	ngOnInit() {
		this.userService.getUsers().subscribe(users => {
			this.users = users;
			//console.log(this.users);
		},
		err => {
			console.error(err);
			return false;
		})
	}

	// Edit User => redirect to user/edit
	onEditClick(id) {
		this.router.navigate(['/users', id]);
		//console.log(id);
	}

	onDeleteClick(id) {
		//console.log(id);
	}

}
