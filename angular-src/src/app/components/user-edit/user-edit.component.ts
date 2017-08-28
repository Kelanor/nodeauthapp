import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersService } from '../../services/users/users.service';
import { ValidateService } from '../../services/validate.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
	id: String;

	name: String;
	username: String;
	email: String;

	isPasswordChange: boolean = false;
	password: String = "";
	newPassword: String = "";

  	constructor(private validateService: ValidateService,
  				private userService: UsersService,
  				private flashMessagesService: FlashMessagesService,
  				private activatedRoute: ActivatedRoute) { }

  	ngOnInit() {
  		this.activatedRoute.params.subscribe(params => {
	  		this.id = params['id'];

	  		this.userService.getUserById(this.id).subscribe(user => {

				this.name = user.name;
				this.username = user.username;
				this.email = user.email;

				//console.log(user);
			},
			err => {
				console.error(err);
				return false;
			})

	  		//console.log(this.id);
	  	});
  	}

  	onEditSubmit() {
  		var user = {
			name: this.name,
			username: this.username,
			email: this.email,
			changePassword: this.isPasswordChange,
			oldPassword: this.password,
			newPassword: this.newPassword
		};

		if (!this.validateService.validateEmail(user.email)) {
			this.flashMessagesService.show("Please use a valid email", { cssClass: 'alert-danger', timeout: 3000});
			return false;
		}

		if (this.isPasswordChange) {
			if (this.password == "" || this.newPassword == "") {
				this.flashMessagesService.show("Please fill all fields", { cssClass: 'alert-danger', timeout: 3000});
				return false;
			}
		}

		//console.log("Register new user...");
		this.userService.editUser(this.id, user).subscribe(data => {
			if (data.success) {
				this.flashMessagesService.show("User edited!", { cssClass: 'alert-success', timeout: 3000});
			} else {
				this.flashMessagesService.show(data.msg, { cssClass: 'alert-danger', timeout: 3000});
			}
		});
  	}
}
