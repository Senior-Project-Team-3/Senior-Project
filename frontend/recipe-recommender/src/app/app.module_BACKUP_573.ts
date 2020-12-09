import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TopRecipesComponent } from './top-recipes/top-recipes.component';
import { LoginComponent } from './login/login.component';
import { SurveyComponent } from './survey/survey.component';
import { LandingComponent } from './landing/landing.component';
import { HomepageComponent } from './homepage/homepage.component';
import { RegisterComponent } from './register/register.component';
import { MyRecipesComponent } from './my-recipes/my-recipes.component';
import { RecipeComponent } from './recipe/recipe.component';
import { ReviewComponent } from './review/review.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
<<<<<<< HEAD
import { SearchResultsComponent } from './search-results/search-results.component';
=======
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
>>>>>>> 08028dd13d39c199fc30bc439ebd4071fce999a4

@NgModule({
  declarations: [
    AppComponent,
    TopRecipesComponent,
    LoginComponent,
    SurveyComponent,
    LandingComponent,
    HomepageComponent,
    RegisterComponent,
    MyRecipesComponent,
    RecipeComponent,
    ReviewComponent,
    SearchResultsComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FontAwesomeModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
