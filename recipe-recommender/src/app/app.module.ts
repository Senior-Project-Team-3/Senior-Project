import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { TopRecipesComponent } from './top-recipes/top-recipes.component';
import { SurveyComponent } from './survey/survey.component';
import { MyRecipesComponent } from './my-recipes/my-recipes.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TopRecipesComponent,
    SurveyComponent,
    MyRecipesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
