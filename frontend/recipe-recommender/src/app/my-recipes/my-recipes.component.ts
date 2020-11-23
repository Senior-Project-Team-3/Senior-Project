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
    
    console.log("test");
    this.dataService.getMyRecipes('38094').subscribe((data: any[]) => {
      console.log(data);
      console.log("test");
      console.log(data[0]);
      this.recipes = data[0];
      console.log(Math.ceil(this.recipes.length/3));
      console.log(this.recipes);
      for (let index = 0; index < (3 - (this.recipes.length % 3) + this.recipes.length)/3 ; index++) {
        this.recipesSmall.push("test");
      } 
    })
    
  }
}
