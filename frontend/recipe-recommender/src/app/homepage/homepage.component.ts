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

  loading = true;

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
      this.loading = false;
    })
  }

  goToSurvey() {
    this.router.navigateByUrl('/survey');
  }

  goToRecipe(recipeId) {
    console.log(recipeId);
    this.router.navigateByUrl('/recipe/' + recipeId);
  }

}
