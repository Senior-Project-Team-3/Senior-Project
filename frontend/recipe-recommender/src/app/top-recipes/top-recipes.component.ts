import { Component, OnInit } from '@angular/core';

import {faChevronLeft, faChevronRight} from '@fortawesome/free-solid-svg-icons'
import { DataService } from '../data.service';

@Component({
  selector: 'app-top-recipes',
  templateUrl: './top-recipes.component.html',
  styleUrls: ['./top-recipes.component.css']
})
export class TopRecipesComponent implements OnInit {

  recipes = [];
  recipesSmall = [];
  
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.getTopRecipes();
  }

  getTopRecipes() {
    this.dataService.getTopRecipes().subscribe((data: any[]) => {
      console.log(data);
      this.recipes = data;
      for (let index = 0; index < (3 - (this.recipes.length % 3) + this.recipes.length)/3 ; index++) {
        this.recipesSmall.push("test");
      }
    })
    
  }

}
