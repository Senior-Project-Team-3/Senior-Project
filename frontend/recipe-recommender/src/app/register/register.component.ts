import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { faCheck, faKey, faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  faCheck = faCheck;
  faKey = faKey;
  faUser = faUser;

  goToLogin() {
    this.router.navigateByUrl('/login')
  }
}
