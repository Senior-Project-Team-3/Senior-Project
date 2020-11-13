import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  recipes = [];

  constructor(
    private router: Router,
    private dataService: DataService
    ) { }

  ngOnInit(): void {
    this.getRandomRecipes(8);
  }

  getRandomRecipes(amount: number) {
    this.dataService.getRandomRecipes(amount).subscribe((data: any[]) => {
      console.log(data);
      this.recipes = data;
    })
  }

  goToSurvey() {
    this.router.navigateByUrl('/survey');
  }

}
