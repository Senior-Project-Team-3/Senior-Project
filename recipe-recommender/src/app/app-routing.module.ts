import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { MyRecipesComponent } from './my-recipes/my-recipes.component';
import { SurveyComponent } from './survey/survey.component';
import { TopRecipesComponent } from './top-recipes/top-recipes.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'my-recipes', component: MyRecipesComponent },
  { path: 'survey', component: SurveyComponent },
  { path: 'top-recipes', component: TopRecipesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
