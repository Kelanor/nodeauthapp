import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
	name: String;
	username: String;
	email: String;
	password: String;

	constructor(private validateService: ValidateService,
				private authService: AuthService,
				private flashMessagesService: FlashMessagesService,
				private router: Router) { 
	}

	ngOnInit() {
	}

	onRegisterSubmit() {
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

		//console.log("Register new user...");
		this.authService.registerUser(user).subscribe(data => {
			if (data.success) {
				this.flashMessagesService.show(data.msg, { cssClass: 'alert-success', timeout: 3000});
				this.router.navigate(['/login']);
			} else {
				this.flashMessagesService.show(data.msg, { cssClass: 'alert-danger', timeout: 3000});
				this.router.navigate(['/register']);
			}
		});
	}
}
