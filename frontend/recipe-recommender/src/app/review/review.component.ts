import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  // Indicates the question the user is currently on
  currentQuestion: number;
  // Indicates if the current survey is the users initial survey
  isInitial: boolean;
  // Indicates if the current question is single or multiple choice
  isRadio: boolean;
  // Holds the options selected by the user when they finish a question
  radioSelected: any;
  // Indicate end of survey
  isComplete: boolean;
  errorMessage: string;
  recommendedRecipe = [];
  
  constructor(
    private dataService: DataService,
    private router: Router
    ) {
  }

  ngOnInit(): void {
    this.currentQuestion = 0;
    this.isComplete = false;
    //this.dataService.getUserRecentRecipe()
    // Check if user has taken previous surveys...
    // this.populateReturnSurvey();
    // If not, get the initial survey ready.
    this.populateInitialSurvey()
  }

  populateInitialSurvey() {
    this.isInitial = true
    this.isRadio = true
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
      "newCookTime": null,
    };

    this.reviewSurveyQuestions[0] = "Are  How did you like your last meal? How did you like {recipe.name}?";
    this.reviewSurveyOptions[0] = ['1', '2','3','4','5'];

    this.reviewSurveyQuestions[1] = "What was your total cooking time? {recipe.name} cook time is listed as {recipe.minutes}, was this accurate? If not, how long did it take? ";
    this.reviewSurveyOptions[1] = ['15-minutes-or-less', '30-minutes-or-less', '60-minutes-or-less', '4-hours-or-less'];

    this.reviewSurveyQuestions[2] = 'Did you use any substitutes?';
    this.reviewSurveyOptions[2] = ['Yes/if so what','No'];

    this.reviewSurveyQuestions[3] = 'Did the recipes match your preferences?';
    this.reviewSurveyOptions[3] = ['Yes','Mostly','Kind Of','Not Really','No'];
    
    this.reviewSurveyQuestions[4] = 'How difficult was the recipe to follow?';
    this.reviewSurveyOptions[4] = ['Easy','Somewhat','Difficult','Impossible'];
    
    this.reviewSurveyQuestions[5] = 'Could the recipe be improved?';
    this.reviewSurveyOptions[5] = ['Yes (with reason?)', 'No'];
    
    this.reviewSurveyQuestions[6] = 'Would you recommend this recipe to a friend?';
    this.reviewSurveyOptions[6] = ['Yes (if yes ask if they want to provide a review?)','No'];

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

    this.reviewSurveyQuestions[9] = "Which length of cooking do you prefer?";
    this.reviewSurveyOptions[9] = ['15-minutes-or-less', '30-minutes-or-less', '60-minutes-or-less', '4-hours-or-less'];

    // Always this for review survey
    this.radioIndicators = [true, true, true, true, true, true, true, true,false, true];
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

  getNextQuestion() {
    this.currentQuestion++;
    this.radioSelected = undefined;
    this.errorMessage = undefined;
    if (this.isInitial) {
      // Survey complete
      if (this.currentQuestion == this.reviewSurveyQuestions.length) {
        // Finish the survey
        this.completeSurvey();
        return;
      }   

      if(this.currentQuestion == 7 && this.reviewSurveyAnswers.prefChange == 'No'){
        this.getNextQuestion();
        return;
      }
    } else {
      if (this.currentQuestion == this.reviewSurveyQuestions.length) {
        // Finish the survey
        this.completeSurvey();
        return;
      }  
    }

    // Check if next question is single or multiple choice
    if (this.radioIndicators[this.currentQuestion]) {
      this.isRadio = true;
    } else {
      this.isRadio = false;
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
        if (this.currentQuestion == 2) {
          this.reviewSurveyAnswers.substitutes = this.radioSelected;
        }
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
        if (this.currentQuestion == 9) {
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
      /*if (this.currentQuestion == 4) {
        this.reviewSurveyAnswers.appliances = answers;
      }*/
    } else {
      this.returnSurveyAnswers[this.currentQuestion] = answers;
    }
    this.getNextQuestion();
  }
  
  completeSurvey() {
    // /* This post call us used past the access and refresh tokens generated */
    // //FETCH METHOD that works to pass the user a cookie
    // const userInfo = "Kyle"
    // const urlPOST = 'http://localhost:3000/survey' // /auth/login
    // const optionsPOST = {
    //   method: 'POST',
    //   body: JSON.stringify({userInfo}), // {} is used to store objects
    //   header: {'Content-Type': 'application/json'},
    //   credentials: 'include' //need to fix promise errors, but this allows for cookies to be created
    // }
    // fetch(urlPOST,optionsPOST)
    //   .then (console.error)
    
    // /* Further method needs to fix bugs to GET request from server
    // .then(fetchUsers)
    // .then (console.log)
    // .then (console.error)

    // function fetchUser() {
    //   const urlGET = 'http://localhost:3000/posts'
    //   method: 'GET',
    //   const optionsGET = {
    //     credentials: 'include'
    //   }
    //   fetch(urlGET, optionsGET)
    //   .then(response => response.json())
    //   .then (console.error)
    // }*/
    console.log(document.cookie)
    this.isComplete = true;
    if (this.isInitial) {
      this.dataService.putReviewResults(JSON.stringify(this.reviewSurveyAnswers), 10).subscribe((data: any[]) => {
        console.log(data);
        this.recommendedRecipe = data;
      });
    } else {
      // this.dataService.putSurveyResults(this.returnSurveyAnswers, 10).subscribe((data: any[]) => {
      //   console.log(data);
      // });
    }
  }

  goToRecipe(recipe_id: number) {
    this.router.navigateByUrl('/recipe/' + recipe_id);
  }
}
