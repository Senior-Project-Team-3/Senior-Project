import { Component, OnInit } from '@angular/core';

import { DataService } from '../data.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {

  recipe = [];

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
  }

  recipeSearch(input: String) {
    this.dataService.getRecipe(input).subscribe((data: any[]) => {
      console.log(data);
      this.recipe = data;
    })
  }
}
