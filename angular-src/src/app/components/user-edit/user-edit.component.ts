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
	password: String;
	confirmPassword: String;

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

				console.log(user);
			},
			err => {
				console.error(err);
				return false;
			})

	  		//console.log(this.id);
	  	});
  	}

  	onEditSubmit() {
  		const user = {
			name: this.name,
			username: this.username,
			email: this.email,
			password: this.password
		};

		if (!this.validateService.validateRegister(user)) {
			//console.error("Please fill in all fields");
			this.flashMessagesService.show("Please fill in all fields", { cssClass: 'alert-danger', timeout: 3000});
			return false;
		}

		if (!this.validateService.validateEmail(user.email)) {
			//console.error("Please use a valid email");
			this.flashMessagesService.show("Please use a valid email", { cssClass: 'alert-danger', timeout: 3000});
			return false;
		}
  	}
}
