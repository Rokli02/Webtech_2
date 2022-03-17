import { Component} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-login-menu',
  templateUrl: './login-menu.component.html',
  styleUrls: ['./login-menu.component.css']
})
export class LoginMenuComponent {
  logForm = new FormGroup({
    name: new FormControl('',[Validators.minLength(6)]),
    password: new FormControl('', [Validators.minLength(8)])
  });
  fieldsNotValid : string[] = new Array(2);

  constructor(private userService: UserService,
              private router: Router) { }


  async login() {
    this.checkValues();

    if(this.areFieldValid()){
      try {
        await this.userService.login(this.logForm.value.name, this.logForm.value.password);
        this.router.navigate(['']);
      }catch(err) {
        alert('Could not login!');
      }
    }
  }

  checkValues() {
    for(let i = 0; i < this.fieldsNotValid.length; i++){
      this.fieldsNotValid[i] = '';
    }

    if(!this.logForm.get('name')?.valid){
      this.fieldsNotValid[0] = 'You must choose a valid username! Must be atleast 6 character long!';
    }
    if(!this.logForm.get('password')?.valid) {
      this.fieldsNotValid[1] = 'You must choose a valid password! Must be atleast 8 character long!';
    }
  }

  areFieldValid() : boolean {
    for(let text of this.fieldsNotValid){
      if(text) return false;
    }
    return true;
  }
}
