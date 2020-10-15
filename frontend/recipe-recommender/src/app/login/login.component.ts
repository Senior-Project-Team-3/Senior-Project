import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { faKey, faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  faKey = faKey;
  faUser = faUser;

  constructor(
    private router: Router) { }

  ngOnInit(): void {
  }

  goToRegister() {
    this.router.navigateByUrl('/register')
  }
}
