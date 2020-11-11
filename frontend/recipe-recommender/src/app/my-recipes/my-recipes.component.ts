import { Component, OnInit } from '@angular/core';

import { DataService } from '../data.service';

import {faChevronLeft, faChevronRight} from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-my-recipes',
  templateUrl: './my-recipes.component.html',
  styleUrls: ['./my-recipes.component.css']
})
export class MyRecipesComponent implements OnInit {

  recipes = [];
  recipesSmall = [];
  
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;

  constructor(private dataService: DataService) { }
  

  ngOnInit(): void {
    this.myRecipeSearch();
  }

  myRecipeSearch() {
    this.dataService.getTopRecipes().subscribe((data: any[]) => {
      console.log(data);
      this.recipes = data;
      for (let index = 0; index < (3 - (this.recipes.length % 3) + this.recipes.length)/3 ; index++) {
        this.recipesSmall.push("test");
      }
    })
    
  }
}
