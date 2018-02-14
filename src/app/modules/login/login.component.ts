import { Component } from '@angular/core';
import { User } from './user';
import { AuthenticationService } from './authenticate.service';

@Component({
    selector: 'login',
    templateUrl:'app/modules/login/login.html',
	  providers: [AuthenticationService]
})
export class LoginComponent {

   userName: string;
   password: string;
  
   constructor(private _authService: AuthenticationService){
     console.log("constructor called..");
   }

   loginUser() {
   	   let user = {userName: this.userName, password: btoa(this.password)};
        if(user.userName && user.password){
           this._authService.login(user);   
        }else{
                      
        }
   }
}