import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';
import { HttpHelperService } from './http-helper.service';

@Injectable()
export class AuthService {
	authToken: any;
	user: any;

	headers: Headers;

	constructor(private httpHelper: HttpHelperService) { }

	registerUser(user) {
		this.loadHeaders();

		return this.httpHelper.post('/users/register', user, this.headers);
	}

	authenticateUser(user) {
		this.loadHeaders();

		return this.httpHelper.post('/users/authenticate', user, this.headers);
	}

	storeUserData(token, user) {
		localStorage.setItem('token', token);
		localStorage.setItem('user', JSON.stringify(user));

		this.authToken = token;
		this.user = user;
	}

	loadHeaders() {
		this.headers = new Headers();
		this.headers.append('Content-type', 'application/json');		
	}

	loadAuthHeaders() {
		this.loadHeaders();
		this.headers.append('Authorization', this.authToken);
	}

	loadToken() {
		const token = localStorage.getItem("token");
		this.authToken = token;
	}

	loggedIn() {
		return tokenNotExpired();
	}

	logout() {
		this.authToken = null;
		this.user = null;

		localStorage.clear();
	}
}
