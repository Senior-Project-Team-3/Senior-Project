import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopRecipesComponent } from './top-recipes/top-recipes.component';
import { LoginComponent } from './login/login.component';
import { SurveyComponent } from './survey/survey.component';
import { LandingComponent } from './landing/landing.component';
import { HomepageComponent } from './homepage/homepage.component';

@NgModule({
  declarations: [
    AppComponent,
    TopRecipesComponent,
    LoginComponent,
    SurveyComponent,
    LandingComponent,
    HomepageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
