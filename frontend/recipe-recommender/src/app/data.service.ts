import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private REST_API_SERVER = "http://localhost:3000";

  constructor(private httpClient: HttpClient) { }

  public getRecipe(recipeName: String) {
    return this.httpClient.get(this.REST_API_SERVER + '/recipes/' + recipeName + '/search');
  }

  public getTopRecipes() {
    return this.httpClient.get(this.REST_API_SERVER + '/recipes/review/top_rated');
  }

  public getRandomRecipes(amount: number) {
    return this.httpClient.get(this.REST_API_SERVER + '/recipes/random/' + amount);
  }

  public putSurveyResults(results: String, userID: number) {
    return this.httpClient.put(this.REST_API_SERVER + '/survey_results/' + userID, {"data": results});
  }
}
