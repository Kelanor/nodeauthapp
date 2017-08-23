import { Injectable, isDevMode } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from '../../environments/environment';

@Injectable()
export class HttpHelperService {
	  serverUrl: String = '';

  	constructor(private http: Http) {
      if (isDevMode()) {
        console.log('In development branch! Setting host to ' + environment.serverUrl);
        this.serverUrl = environment.serverUrl;
      }
    }

  	post (url, body, headers) {
  		return this.http.post(
  				this.serverUrl + url,
  				body,
  				{ headers: headers })
  			.map(res => res.json());
  	}

  	get (url, headers) {
  		return this.http.get(
  				this.serverUrl + url,
  				{ headers: headers })
  			.map(res => res.json());
  	}
}
