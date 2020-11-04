import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-recipes',
  templateUrl: './my-recipes.component.html',
  styleUrls: ['./my-recipes.component.css']
})
export class MyRecipesComponent implements OnInit {

  constructor() { }
  
  recipes = [];

  ngOnInit(): void {
    this.myRecipeSearch();
  }

  myRecipeSearch() {
    this.dataService.getTopRecipes().subscribe((data: any[]) => {
      console.log(data);
      this.recipes = data;
    })
  }

}
