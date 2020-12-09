import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//import { Console } from 'console';

import { DataService } from '../data.service';

@Component({
  selector: 'app-survey',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {

  // Holds the questions
  reviewSurveyQuestions = [];
  returnSurveyQuestions = [];
  // Holds the selectable options
  reviewSurveyOptions = [];
  returnSurveyOptions = [];
  // Holds the users answers
  // initialSurveyAnswers = [];
  reviewSurveyAnswers: any;
  returnSurveyAnswers = [];
  // Holds booleans that indicates if a questions is multiple choice(checkbox) or single choice(radio).
  //    For example, if our question array is [single choice, multiple choice, single choice], 
  //    this should be [true, false, true]
  radioIndicators = [];
  textAreaIndicators = [];
  // Indicates the question the user is currently on
  currentQuestion: number;
  // Indicates if the current survey is the users initial survey
  isInitial: boolean;
  // Indicates if the current question is single or multiple choice
  isRadio: boolean;
  // Indicates if the current question is text area
  isTextArea: boolean;
  // Holds the options selected by the user when they finish a question
  radioSelected: any;
  textAreaValue: any;
  // Indicate end of survey
  isComplete: boolean;
  errorMessage: string;
  recommendedRecipe = [];
  recipe = [];
  
  constructor(
    private dataService: DataService,
    private router: Router
    ) {
  }

  ngOnInit(): void {
    this.getRecipe(this.router.url.split('/').pop());
    this.currentQuestion = 0;
    this.isComplete = false;
    this.dataService.getRecipe(this.router.url.split('/').pop());
    var recipeID = this.router.url.split('/').pop()
    console.log(recipeID)
    // Check if user has taken previous surveys...
    // this.populateReturnSurvey();
    // If not, get the initial survey ready.
    
    setTimeout(() => this.populateInitialSurvey(), 300);
    // this.populateInitialSurvey()
  }

  /*
  getRecipe(id: String) {
    this.dataService.recipe(id).subscribe((data: any) => {
      console.log(data);
      data[0].submitted = this.dateSubmit(data[0].submitted);
      this.ingredients = data[0].ingredients;
      data[0].ingredients = this.ingredients.replace(/'/g, "");
      this.steps = data[0].steps_text;
      data[0].steps_text = this.steps.replace(/'/g, "");
      data[1] = this.arrayItize(data[0].ingredients);
      data[2] = this.arrayItize(data[0].steps_text);
      this.recipe = data;
    })
  }
  */

  populateInitialSurvey() {
    this.isInitial = true
    this.isRadio = true
    this.isTextArea = false
    this.reviewSurveyAnswers = {
      "rating": null,
      "realCookTime": null,
      "substitutes": null,
      "prefMatch": null,
      "difficulty": null,
      "improvement": null,
      "recommend": null,
      "prefChange": null,
      "newCuisine": null,
      "newProtien": null,
      "newCookTime": null
    };
    console.log(this.recipe[0]);

    this.reviewSurveyQuestions[0] = "How did you like your last meal? How did you like " + this.recipe[0].name + "?";
    this.reviewSurveyOptions[0] = ['1', '2','3','4','5'];

    this.reviewSurveyQuestions[1] = "What was your total cooking time? " + this.recipe[0].name + " cook time is listed as " +
      this.recipe[0].minutes + ", was this accurate? If not, how long did it take? ";
    this.reviewSurveyOptions[1] = ['15-minutes-or-less', '30-minutes-or-less', '60-minutes-or-less', '4-hours-or-less'];

    this.reviewSurveyQuestions[2] = 'Please list all substitutions used within this recipe.';
    this.reviewSurveyOptions[2] = [""];

    this.reviewSurveyQuestions[3] = 'Did the recipes match your preferences?';
    this.reviewSurveyOptions[3] = ['Yes','Mostly','Kind Of','Not Really','No'];
    
    this.reviewSurveyQuestions[4] = 'How difficult was the recipe to follow?';
    this.reviewSurveyOptions[4] = ['Easy','Somewhat','Difficult','Impossible'];
    
    this.reviewSurveyQuestions[5] = 'Please describe how this recipe can be improved.';
    this.reviewSurveyOptions[5] = [""];
    
    this.reviewSurveyQuestions[6] = 'Would you recommend this recipe to a friend?';
    this.reviewSurveyOptions[6] = ['Yes','No'];

    this.reviewSurveyQuestions[7] = 'Would you like to change your preferences?';
    this.reviewSurveyOptions[7] = ['Yes','No'];

    this.reviewSurveyQuestions[8] = "What cuisines do you like?";
    // We can expand on this list
    this.reviewSurveyOptions[8] = [
      {
        title: 'Mexican',
        checked: false,
      },
      {
        title: 'Chinese',
        checked: false,
      },
      {
        title: 'American',
        checked: false,
      },
      {
        title: 'Italian',
        checked: false,
      },
      {
        title: 'Japanese',
        checked: false,
      },
      {
        title: 'Spanish',
        checked: false,
      },
      {
        title: 'No Preference',
        checked: false,
      },
    ];

    this.reviewSurveyQuestions[9] = "What main source of meat do you prefer?";
    this.reviewSurveyOptions[9] = [
      {
        title: 'Beef',
        checked: false,
      },
      {
        title: 'Chicken',
        checked: false,
      },
      {
        title: 'Pork',
        checked: false,
      },
      {
        title: 'No Preference',
        checked: false,
      },
    ];

    this.reviewSurveyQuestions[10] = "Which length of cooking do you prefer?";
    this.reviewSurveyOptions[10] = ['15-minutes-or-less', '30-minutes-or-less', '60-minutes-or-less', '4-hours-or-less'];


    // Always this for review survey
    this.radioIndicators =    [true, true, false, true, true, false, true, true, false, false, true]
    this.textAreaIndicators = [false, false, true, false, false, true, false, false, false, false, false]
  }

  /**
   * This function will tell the backend to generate a new survey. The backend should provide
   * a question, option, and radioIndicator array. A survey can take a bit of time, so the 
   * backend should ?store these questions in the DB? and when the user is done, reference the 
   * stored questions to relate to their new survey results
   */
  populateReturnSurvey() {
    this.isInitial = false;
  }

  getNextQuestion() { //TODO: Remove redundent else condition
    this.currentQuestion++;
    this.radioSelected = undefined;
    this.textAreaValue = null;
    this.errorMessage = undefined;
    if (this.isInitial) {
      // Survey complete
      if (this.currentQuestion == this.reviewSurveyQuestions.length) {
        // Finish the survey
        this.completeSurvey();
        return;
      }   

      if(this.currentQuestion == 8 && this.reviewSurveyAnswers.prefChange == 'No'){
        this.completeSurvey();
        return;
      }
    // } else {
    //   if (this.currentQuestion == this.reviewSurveyQuestions.length) {
    //     // Finish the survey
    //     this.completeSurvey();
    //     return;
    //   }  
    }

    // Check if next question is single or multiple choice
    if (this.radioIndicators[this.currentQuestion]) {
      this.isRadio = true;
    } else {
      this.isRadio = false;
    }

    // Check if next question is single or multiple choice
    if (this.textAreaIndicators[this.currentQuestion]) {
      this.isTextArea = true;
    } else {
      this.isTextArea = false;
    }
  }

  // Place radio selection into answers array, continue to next question
  submitRadio() {
      console.log(this.radioSelected);
      if (this.radioSelected == undefined) {
        this.errorMessage = "You must select an option before continuing";
        return;
      }
      if (this.isInitial) {
        // this.initialSurveyAnswers[this.currentQuestion] = this.radioSelected;
        if (this.currentQuestion == 0) {
          this.reviewSurveyAnswers.rating = this.radioSelected;
        }
        if (this.currentQuestion == 1) {
          this.reviewSurveyAnswers.realCookTime = this.radioSelected;
        }
        // if (this.currentQuestion == 2) {
        //   this.reviewSurveyAnswers.substitutes = this.radioSelected;
        // }
        if (this.currentQuestion == 3) {
          this.reviewSurveyAnswers.prefMatch = this.radioSelected;
        }
        if (this.currentQuestion == 4) {
          this.reviewSurveyAnswers.difficulty = this.radioSelected;
        }
        if (this.currentQuestion == 5) {
          this.reviewSurveyAnswers.improvement = this.radioSelected;
        }
        if (this.currentQuestion == 6) {
          this.reviewSurveyAnswers.recommend = this.radioSelected;
        }
        // Completes the survey if user answers no
        if (this.currentQuestion == 7) {
          this.reviewSurveyAnswers.prefChange = this.radioSelected;
        }
        if (this.currentQuestion == 10) {
          this.reviewSurveyAnswers.newCookTime = this.radioSelected;
          /*TODO: call new recipe recommendation */
        }
      } else {
        this.returnSurveyAnswers[this.currentQuestion] = this.radioSelected;
      }
    this.getNextQuestion();
  }

  submitCheckbox() {
    let answersList = this.reviewSurveyOptions[this.currentQuestion].filter(item => item.checked);
    let answers = [];
    for (let i = 0; i < answersList.length; i++) {
      answers[i] = answersList[i].title;
    }
    if (answers.length == 0) {
      this.errorMessage = "You must select an option before continuing";
      return;
    }
    console.log(answers);
    if (this.isInitial) {
      // this.initialSurveyAnswers[this.currentQuestion] = answers;
      if (this.currentQuestion == 8) {
        if (answers.includes("No Preference")) {
          this.reviewSurveyAnswers.newCuisine = ["No Preference"];
        } else {
          this.reviewSurveyAnswers.newCuisine = answers;
        }
      }
      if (this.currentQuestion == 9) {
        if (answers.includes("No Preference")) {
          this.reviewSurveyAnswers.newProtien = ["No Preference"];
        } else {
          this.reviewSurveyAnswers.newProtien = answers;
        }
      }
    } else {
      this.returnSurveyAnswers[this.currentQuestion] = answers;
    }
    this.getNextQuestion();
  }

  submitTextArea() {
    //var textAreaResponse = document.getElementById('textarea')[0].value
    //var textAreaValue = textAreaResponse.value

    if (this.currentQuestion == 2) {
      this.reviewSurveyAnswers.substitutes = this.textAreaValue
      console.log(this.reviewSurveyAnswers.substitutes)
    }

    if (this.currentQuestion == 5) {
      this.reviewSurveyAnswers.improvement = this.textAreaValue
      console.log(this.reviewSurveyAnswers.improvement)
    }

    this.getNextQuestion()
  }
  
  completeSurvey() {
    //console.log(document.cookie)
    this.isComplete = true;
    if (this.isInitial) {
      this.dataService.putReviewResults(JSON.stringify(this.reviewSurveyAnswers), this.recipe[0].recipe_id).subscribe((data: any[]) => {
        console.log(data);
        this.recommendedRecipe = data;
      });
    } else {
      // this.dataService.putSurveyResults(this.returnSurveyAnswers, 10).subscribe((data: any[]) => {
      //   console.log(data);
      // });
    }
  }

  getRecipe(id: String) {
    this.dataService.recipe(id).subscribe((data: any) => {
      console.log(data);
      this.recipe = data;
    })
  }

  goToRecipe(recipe_id: number) {
    this.router.navigateByUrl('/recipe/' + recipe_id);
  }
}
