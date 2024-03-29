import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomepageComponent } from './homepage/homepage.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { MyRecipesComponent } from './my-recipes/my-recipes.component';
import { RecipeComponent } from './recipe/recipe.component';
import { RegisterComponent } from './register/register.component';
import { SurveyComponent } from './survey/survey.component';
import { TopRecipesComponent } from './top-recipes/top-recipes.component';
import { ReviewComponent } from './review/review.component';
import { SearchResultsComponent } from './search-results/search-results.component';

const routes: Routes = [
  // { path: '', pathMatch: 'full', redirectTo: '/' },
  { path: '', component: LandingComponent },
  { path: 'home', component: HomepageComponent },
  { path: 'top-recipes', component: TopRecipesComponent },
  { path: 'survey', component: SurveyComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'recipe/:recipe_id', component: RecipeComponent },
  { path: 'my-recipes', component: MyRecipesComponent },
  { path: 'review/:recipe_id', component: ReviewComponent },
  { path: 'search-results/:str', component: SearchResultsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
