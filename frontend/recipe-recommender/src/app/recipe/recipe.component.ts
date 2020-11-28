import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router'
import { DataService } from '../data.service';
@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent implements OnInit {

  recipe = {}
  ingredients = ""
  steps = ""
  formattedSubmitted = ""
  value: any;
  
  constructor(
    private router: Router,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.getRecipe(this.router.url.split('/').pop());
    //Edit things here
  }

  ngAfterContentInit(): void {

  }

  getRecipe(id: String) {
    this.dataService.recipe(id).subscribe((data: any) => {
      console.log(data);
      data[0].submitted = this.dateSubmit(data[0].submitted);
      this.ingredients = data[0].ingredients;
      data[0].ingredients = this.ingredients.replace(/'/g, "");
      this.steps = data[0].steps_text;
      data[0].steps_text = this.steps.replace(/'/g, "");
      data[1] = this.arrayItize(data[0].ingredients);
      data[2] = this.arrayItize(data[0].steps_text);
      this.recipe = data;
    })
  }

  dateSubmit(str) {
    var newstr = str.substring(5,10)+'-'+str.substring(0,4)
    return newstr;
  }

  arrayItize(str){
    return str.split(", ");
  }


}
