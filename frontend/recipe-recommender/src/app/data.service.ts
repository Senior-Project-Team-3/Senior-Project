import { HttpClient } from '@angular/common/http';
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
}
