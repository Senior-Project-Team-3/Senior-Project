import { Component, OnInit } from '@angular/core';

import { DataService } from '../data.service';

import {faChevronLeft, faChevronRight, faAngleDoubleLeft, faAngleDoubleRight} from '@fortawesome/free-solid-svg-icons'
import { Router } from '@angular/router';
@Component({
  selector: 'app-my-recipes',
  templateUrl: './my-recipes.component.html',
  styleUrls: ['./my-recipes.component.css']
})
export class MyRecipesComponent implements OnInit {

  recipes = [];
  recipesSmall = [];
  slides = [];

  slideLength = 3;
  slideCounter = 0;
  
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faAngleDoubleLeft = faAngleDoubleLeft;
  faAngleDoubleRight = faAngleDoubleRight;

  loading = true;

  constructor(
    private dataService: DataService,
    private router: Router
    ) { }
  

  ngOnInit(): void {
    this.myRecipeSearch();
  }

  myRecipeSearch() {
    console.log("test");
    this.dataService.getMyRecipes().subscribe((data: any[]) => {
      this.loading = true;
      console.log(data);
      console.log(data[0]);
      this.recipes = data[0];
      if(window.innerWidth < 768) {
        this.slideLength = 1;
      }
      for (let index = 0; index < Math.ceil(this.recipes.length/this.slideLength) ; index++) {
        this.recipesSmall.push("test");
      } 
      for(let index = 0; index < this.slideLength; index++){
        this.slides.push("test");
      }
      this.loading = false;
    })
    
  }

  checkliIndex(index: number) {
    //console.log(document.getElementsByClassName('0 active'));
    //document.getElementsByClassName('isFirst')
    var testreturn = true;
    if(index == 3) {
      testreturn = false;
    }
    console.log(index);
    console.log(document.getElementsByClassName('active'));
    console.log(document.getElementsByClassName('active')[0]);
    console.log(document.getElementsByClassName('active')[0].getAttribute('data-slide-to'));
    return testreturn;
  }

  timeoutSetSlideLength(newLength: string) {
    setTimeout(() => this.setSlideLength(newLength), 100);
  }

  //Changes the number of recipes per slide
  setSlideLength(newLength: string) {
    this.slideCounter = 0;
    this.slideLength = parseInt(newLength);
    console.log(this.slideLength + this.slideLength);
    this.recipesSmall.length = 0;
    this.slides.length = 0;
    console.log(this.slides);
    for (let index = 0; index < Math.ceil(this.recipes.length/this.slideLength) ; index++) {
      this.recipesSmall.push("test");
    } 
    for(let index = 0; index < this.slideLength; index++){
      this.slides.push("test");
    }
  }

  //updates the counter for the current slide.
  changeCounter(slideChange: string) {
    switch(slideChange) {
      case('first'): 
        this.slideCounter = 0;
        break;
      case('last'): 
        this.slideCounter = this.recipesSmall.length - 1;
        break;
      case('prev'): 
        if(this.slideCounter <= 0) {
          this.slideCounter = this.recipesSmall.length - 1;
        }
        else {
          this.slideCounter = this.slideCounter - 1;
        };
        break;
      case('next'): 
        if(this.slideCounter >= this.recipesSmall.length - 1) {
          this.slideCounter = 0;
        }
        else {
          this.slideCounter = this.slideCounter + 1;
        };
        break;
      default: 
       this.slideCounter = parseInt(slideChange) - 1;

    }
    
  }

  goToRecipe(recipeId) {
    console.log(recipeId);
    this.router.navigateByUrl('/recipe/' + recipeId);
  }

  goToReview(recipeId) {
    console.log(recipeId);
    this.router.navigateByUrl('/review/' + recipeId);
  }
}
