import { Component, OnInit } from '@angular/core';

import { DataService } from '../data.service';

import {faChevronLeft, faChevronRight, faAngleDoubleLeft, faAngleDoubleRight, faEllipsisH} from '@fortawesome/free-solid-svg-icons'
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {

  recipes = [];

  loading = true;

  constructor(
    private router: Router,
    private dataService: DataService
    ) { }

  ngOnInit(): void {
    this.getSearchResults(this.router.url.split('/').pop());
  }

  ngOnChanges(): void {
    this.getSearchResults(this.router.url.split('/').pop());
  }



  getSearchResults(str: String) {
    this.dataService.getSearchResults(str).subscribe((data: any[]) => {
      console.log(data);
      this.recipes = data;
      this.loading = false;
    })
  }

  goToSurvey() {
    this.router.navigateByUrl('/survey');
  }

  goToRecipe(recipeId) {
    console.log(recipeId);
    this.router.navigateByUrl('/recipe/' + recipeId);
  }

  

}