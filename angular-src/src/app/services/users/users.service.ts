import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpHelperService } from '../http-helper.service';

@Injectable()
export class UsersService {

  	constructor(private authService: AuthService,
  				private httpHelper: HttpHelperService) { }

  	getUsers() {
		this.authService.loadToken();
		this.authService.loadAuthHeaders();

		return this.httpHelper.get('/users/list', this.authService.headers);
	}

	getUserById(id) {
		this.authService.loadToken();
		this.authService.loadAuthHeaders();

		return this.httpHelper.get('/users/' + id, this.authService.headers);
	}

	getProfile() {
		this.authService.loadToken();
		this.authService.loadAuthHeaders();

		return this.httpHelper.get('/users/profile', this.authService.headers);
	}

	editUser(id, user) {
		this.authService.loadToken();
		this.authService.loadAuthHeaders();

		return this.httpHelper.put('/users/', id, user, this.authService.headers);
	}
}
