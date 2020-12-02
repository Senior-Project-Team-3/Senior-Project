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
    return this.httpClient.put(this.REST_API_SERVER + '/survey_results/' + userID, {"data": results}, { withCredentials: true});
  }

  public putReviewResults(results: String, userID: number) {
    return this.httpClient.put(this.REST_API_SERVER + '/review_results/' + userID, {"data": results}, { withCredentials: true});
  }

  public getMyRecipes(userID: String) {
    console.log(userID);
    return this.httpClient.get(this.REST_API_SERVER + '/recipes/' + userID + '/my_recipes', { withCredentials: true});
  }

  public getUserRecentRecipe() {
    return this.httpClient.put(this.REST_API_SERVER + '/review/user/recent', { withCredentials: true});
  }
}
