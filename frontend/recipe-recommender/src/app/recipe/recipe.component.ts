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

  constructor(
    private router: Router,
    private dataService: DataService
    ) { }

  ngOnInit(): void {
    this.getRecipe(this.router.url.split('/').pop());
  }

  getRecipe(id: String) {
    this.dataService.recipe(id).subscribe((data: any) => {
      console.log(data);
      this.recipe = data;
    })
  }
}
