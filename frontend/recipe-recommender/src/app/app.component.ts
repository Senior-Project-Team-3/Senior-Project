import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { DataService } from './data.service';
import { SearchResultsComponent } from './search-results/search-results.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'recipe-recommender';

  constructor(
    private dataService: DataService,
    private router: Router,
  ) { }

  recipeSearch(input) {
    this.router.navigate(['/home/'], { skipLocationChange: true }).then(() =>{this.router.navigate(['/search-results/'+input])});
  }

}
