import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-reg-menu',
  templateUrl: './reg-menu.component.html',
  styleUrls: ['./reg-menu.component.css']
})
export class RegMenuComponent {
  regForm = new FormGroup({
    name: new FormControl('', [Validators.minLength(6)]),
    password: new FormControl('', [Validators.minLength(8)]),
    passwordAgain: new FormControl('', [Validators.minLength(8)]),
    email: new FormControl('', [Validators.email]),
    emailAgain: new FormControl('', [Validators.email]),
    gender: new FormControl('female')
  });
  fieldNotValid : string[] = new Array(5);
  constructor(private userService: UserService,
              private router : Router) { }

  async signUp() {
    this.checkValues();

    if(this.areFieldsValid()){
      try {
        await this.userService.signup(this.regForm.value.name, this.regForm.value.email, this.regForm.value.password, this.regForm.value.gender);
        this.router.navigate(['']);
      } catch(err) {
        alert('Could not sign up!');
        console.log(err);
      }
    }
  }

  private emailAgainIsCorrect() : boolean {
    return (this.regForm.value.email === this.regForm.value.emailAgain);
  }

  private passwordAgainIsCorrect() : boolean {
    return (this.regForm.value.password === this.regForm.value.passwordAgain);
  }

  private checkValues(){
    for(let i = 0; i < this.fieldNotValid.length; i++) {
      this.fieldNotValid[i] = '';
    }

    if(!this.regForm.get('name')?.valid) {
      this.fieldNotValid[0] = 'You must choose a valid username! Must be atleast 6 character long!';
    }
    if(!this.regForm.get('password')?.valid) {
      this.fieldNotValid[1] = 'You must choose a valid password! Must be atleast 8 character long!';
    }
    if(!this.fieldNotValid[1] &&
      !this.regForm.get('passwordAgain')?.valid) {
      this.fieldNotValid[2] = 'You must repeat the password!';
    }
    if(!this.regForm.get('email')?.valid) {
      this.fieldNotValid[3] = 'You must choose an email!';
    }
    if(!this.fieldNotValid[3] &&
      !this.regForm.get('emailAgain')?.valid) {
      this.fieldNotValid[4] = 'You must repeat the email!';
    }

    if(!this.fieldNotValid[2] &&
      !this.fieldNotValid[1] &&
      !this.passwordAgainIsCorrect()){
      this.fieldNotValid[2] = 'These passwords are not the same!';
    }
    if(!this.fieldNotValid[4] &&
      !this.fieldNotValid[3] &&
      !this.emailAgainIsCorrect()){
        this.fieldNotValid[4] = 'These emails are not the same!';
    }
  }

  areFieldsValid() : boolean {
    for(let text of this.fieldNotValid) {
      if(text) return false;
    }
    return true;
  }
}
