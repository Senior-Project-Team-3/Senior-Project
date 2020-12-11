import { Component, OnInit } from '@angular/core';

import { DataService } from '../data.service';

import {faChevronLeft, faChevronRight, faAngleDoubleLeft, faAngleDoubleRight, faEllipsisH, faTimes} from '@fortawesome/free-solid-svg-icons'
import { Router } from '@angular/router';
@Component({
  selector: 'app-my-recipes',
  templateUrl: './my-recipes.component.html',
  styleUrls: ['./my-recipes.component.css']
})
export class MyRecipesComponent implements OnInit {

  //the list of recipes for this user
  recipes = [];

  //needed to generate the slides in the carousel
  recipesSmall = [];

  //needed to generate the individual cards in each slide
  slides = [];

  //how many cards per slide
  slideLength = 3;

  //which clide is currently displayed
  slideCounter = 0;
  
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faAngleDoubleLeft = faAngleDoubleLeft;
  faAngleDoubleRight = faAngleDoubleRight;
  faEllipsisH = faEllipsisH;
  faTimes = faTimes;

  //flag for if still recieving recipe info
  loading = true;

  constructor(
    private dataService: DataService,
    private router: Router
    ) { }
  

  ngOnInit(): void {
    this.myRecipeSearch();
  }

  // calls the current user's saved recipes, 
  // and initializes the arrays to be used in displaying the carousel.
  myRecipeSearch() {
    //console.log("test");
    this.dataService.getMyRecipes().subscribe((data: any[]) => {
      this.loading = true;
      // console.log(data);
      console.log(data[0]);
      this.recipes = data[0];
      if (this.recipes){
        //for small screen sizes, sets only card per slide. Otherwise keep default.
        if(window.innerWidth < 768) {
          this.slideLength = 1;
        }
        //generate arrays for carousel
        for (let index = 0; index < Math.ceil(this.recipes.length/this.slideLength) ; index++) {
          this.recipesSmall.push("test");
        } 
        for(let index = 0; index < this.slideLength; index++){
          this.slides.push("test");
        }
      } else {
        this.recipes = []
      }
      this.loading = false;
    })
    
  }

  // checkliIndex(index: number) {
  //   //console.log(document.getElementsByClassName('0 active'));
  //   //document.getElementsByClassName('isFirst')
  //   var testreturn = true;
  //   if(index == 3) {
  //     testreturn = false;
  //   }
  //   console.log(index);
  //   console.log(document.getElementsByClassName('active'));
  //   console.log(document.getElementsByClassName('active')[0]);
  //   console.log(document.getElementsByClassName('active')[0].getAttribute('data-slide-to'));
  //   return testreturn;
  //}

  //set a timeout otherwise carousel goes blank
  timeoutSetSlideLength(newLength: string) {
    setTimeout(() => this.setSlideLength(newLength), 100);
  }

  //Changes the number of recipes per slide
  setSlideLength(newLength: string) {
    this.slideCounter = 0;
    this.slideLength = parseInt(newLength);
    if (this.slideLength > 10) {
      this.slideLength = 10;
      var tempInput = (<HTMLInputElement>document.getElementById("slideLengthForm"));
      tempInput.value = "10";
    } else if(this.slideLength < 1) {
      this.slideLength = 1;
      var tempInput = (<HTMLInputElement>document.getElementById("slideLengthForm"));
      tempInput.value = "1";
    }
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

  changeCounterCheck(slideChange: string) {
    var tempCounter = parseInt(slideChange);
    if(tempCounter > this.recipesSmall.length - 1) {
      tempCounter = this.recipesSmall.length - 1;
      var tempInput = (<HTMLInputElement>document.getElementById("slideSearchForm"));
      tempInput.value = this.recipesSmall.length.toString();
    } else if(tempCounter < 0) {
      tempCounter = 0;
      var tempInput = (<HTMLInputElement>document.getElementById("slideSearchForm"));
      tempInput.value = "0";
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
        var tempCounter = parseInt(slideChange);
        if(tempCounter > this.recipesSmall.length - 1) {
          tempCounter = this.recipesSmall.length - 1;
        } else if(tempCounter < 0) {
          tempCounter = 0;
        }
        this.slideCounter = tempCounter;
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

  deleteRecipe(recipeId) {
    this.dataService.deleteUserRecipe(recipeId).subscribe((data: any[]) => {
      // Remove from view if its successful
      try {
        console.log(data['affectedRows']);
        if (data['affectedRows'] == 1) {
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/my-recipes']); // navigate to same route
          }); 
        }
      } catch (error) {
        
      }
      console.log(data['affectedRows']);
    
    });
  }
}
