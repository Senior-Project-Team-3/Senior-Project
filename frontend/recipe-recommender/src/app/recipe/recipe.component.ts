import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent implements OnInit {

  recipe = []

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.recipe = params['data'];
      console.log(params['data'])
    })
  }

}
