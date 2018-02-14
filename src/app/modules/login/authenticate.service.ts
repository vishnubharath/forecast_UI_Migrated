import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './user'
import {Http, Response, Headers, RequestOptions, URLSearchParams} from "@angular/http";
import 'rxjs/Rx';
import { Observable }     from 'rxjs/Observable';

@Injectable()
export class AuthenticationService {
  
  users: User[];

  constructor(private _router: Router, private _http: Http){}
 
  logout() {
    localStorage.removeItem("user");
    this._router.navigate(['login']);
  }

  login(user) {
    this._router.navigate(['leaveModule']);

    /*let loginUrl = "http://localhost:8080/Auth/authenticate"+"?password="+user.password+"&"+"username="+user.userName;
    let router = this._router;
    this._http
      .post(loginUrl,null)
      .toPromise()
      .then(function(res){
         if (res && JSON.parse(res['_body']).userId === user.userName){
             localStorage.setItem("user", JSON.stringify(JSON.parse(res['_body']).userId));
             router.navigate(['home']);    
          }
      })
      .catch(error=>{
          let errMsg = (error.message) ? error.message :
          error.status ? `${error.status} - ${error.statusText}` : 'Server error';
          console.error(errMsg);
      });*/

      /*
         addHero (name: string): Observable<Hero> {
          let headers = new Headers({ 'Content-Type': 'application/json' });
          let options = new RequestOptions({ headers: headers });

          return this.http.post(this.heroesUrl, { name }, options)
                          .map(this.extractData)
                          .catch(this.handleError);
        }
      */
  }

  checkCredentials(){
    if (localStorage.getItem("user") === null){
        this._router.navigate(['login']);
        return false;
    }else{
      return true;
    }
  } 
}