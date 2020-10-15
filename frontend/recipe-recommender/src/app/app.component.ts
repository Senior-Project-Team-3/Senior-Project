import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'recipe-recommender';

  constructor(
    private dataService: DataService,
    private router: Router
    ) { } 

  recipeSearch(input: String) {
    this.dataService.getRecipe(input).subscribe((data: any[]) => {
      console.log(data);
      let recipe = [];
      recipe = data;
      if (recipe.length > 0) {
        console.log(recipe[0].recipe_name)
        this.router.navigate(['/recipe', { 'data': recipe }]);
      }
    });
  }

}
