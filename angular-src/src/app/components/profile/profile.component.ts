import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
	user: Object;

	constructor(private userService: UsersService,
				private router: Router) { }

	ngOnInit() {
		this.userService.getProfile().subscribe(profile => {
			this.user = profile.user;
		},
		err => {
			console.error(err);
			return false;
		})
	}
}
