import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DataService } from '../data.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {

  // Holds the questions
  initialSurveyQuestions = [];
  returnSurveyQuestions = [];
  // Holds the selectable options
  initialSurveyOptions = [];
  returnSurveyOptions = [];
  // Holds the users answers
  // initialSurveyAnswers = [];
  initialSurveyAnswers: any;
  returnSurveyAnswers = [];
  // Holds booleans that indicates if a questions is multiple choice(checkbox) or single choice(radio).
  //    For example, if our question array is [single choice, multiple choice, single choice], 
  //    this should be [true, false, true]
  radioIndicators = [];
  // Indicates the question the user is currently on
  currentQuestion: number;
  // Indicates if the current question is single or multiple choice
  isRadio: boolean;
  // Holds the options selected by the user when they finish a question
  radioSelected: any;
  // Indicate end of survey
  isComplete: boolean;
  // Indicate that the user forgot to select an option
  errorMessage: string;
  // Hold recipes that are recommended after survey completes
  recommendedRecipes = [];
  
  constructor(
    private dataService: DataService,
    private router: Router
    ) {
  }

  ngOnInit(): void {
    this.currentQuestion = 0;
    this.isComplete = false;
    // Check if user has taken previous surveys...
    // this.populateReturnSurvey();
    // If not, get the initial survey ready.
    this.populateInitialSurvey();
  }

  /**
   * Fill survey arrays with questions and options
   */
  populateInitialSurvey() {
    this.isRadio = true;
    this.initialSurveyAnswers = {
      "vegetarian": null,
      "proteins": null,
      "cuisines": null,
      "cookTime": null,
      "appliances": null,
      "intolerant": null,
      "intolerances": null
    };

    this.initialSurveyQuestions[0] = "Are you a vegetarian?";
    this.initialSurveyOptions[0] = ['Yes', 'No'];

    // Only ask if answer to 0 is "No"
    this.initialSurveyQuestions[1] = "What main source of meat do you prefer?";
    this.initialSurveyOptions[1] = [
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

    this.initialSurveyQuestions[2] = "What cuisines do you like?";
    // We can expand on this list
    this.initialSurveyOptions[2] = [
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

    this.initialSurveyQuestions[3] = "Which length of cooking do you prefer?";
    this.initialSurveyOptions[3] = ['15-minutes-or-less', '30-minutes-or-less', '60-minutes-or-less', '4-hours-or-less', 'No Preference'];
    
    // Unsure how to implement this effectively
    // this.initialSurveyQuestions[4] = "Do you care about nutrition in the recipe?";
    // this.initialSurveyOptions[4] = "Yes, No";
    
    this.initialSurveyQuestions[4] = "What appliances do you have access to?";
    this.initialSurveyOptions[4] = [
      {
        title: 'Oven',
        checked: false,
      },
      {
        title: 'Food Processor',
        checked: false,
      },
      {
        title: 'Microwave',
        checked: false,
      },
      {
        title: 'Stove',
        checked: false,
      },
      {
        title: 'Grill',
        checked: false,
      },
      {
        title: 'Pressure Cooker',
        checked: false,
      },
      {
        title: 'Crock-Pot',
        checked: false,
      },
    ];
    
    this.initialSurveyQuestions[5] = "Do you have an allergy or intolerance?";
    this.initialSurveyOptions[5] = ['Yes', 'No'];
    
    // Only ask if answer to 5 is "Yes"
    this.initialSurveyQuestions[6] = "Please select your allergies/intolerances:";
    this.initialSurveyOptions[6] = [
      {
        title: 'Peanut',
        checked: false,
      },
      {
        title: 'Tree Nut',
        checked: false,
      },
      {
        title: 'Lactose',
        checked: false,
      },
      {
        title: 'Gluten',
        checked: false,
      },
      {
        title: 'Wheat',
        checked: false,
      },
    ];

    // Always this for initial survey
    this.radioIndicators = [true, false, false, true, false, true, false];
  }

  /**
   * Run after user submits answers to a question, and figure out if there are any questions left.
   * Check if next question is a multiple or single choice.
   * Also checks for questions that should be skipped based on previous answers.
   */
  getNextQuestion() {
    this.currentQuestion++;
    this.radioSelected = undefined;
    this.errorMessage = undefined;

    // Survey complete
    if (this.currentQuestion == this.initialSurveyQuestions.length) {
      // Finish the survey
      this.completeSurvey();
      return;
    }

    // Check for dependant questions...
    // Skip preferred source of meat for vegetarians
    if (this.currentQuestion == 1 && this.initialSurveyAnswers.vegetarian == 'Yes') {
      this.getNextQuestion();
      return;
    }
    // Skip allergy intolerence question for those who select no
    if (this.currentQuestion == 6 && this.initialSurveyAnswers.intolerant == 'No') {
      this.initialSurveyAnswers[this.currentQuestion] = null;
      this.getNextQuestion();
      return;
    }
    
    // Check if next question is single or multiple choice
    if (this.radioIndicators[this.currentQuestion]) {
      this.isRadio = true;
    } else {
      this.isRadio = false;
    }
  }

  /**
   *  Place radio selection into answers array, continue to next question
   */
  submitRadio() {
    console.log(this.radioSelected);
    if (this.radioSelected == undefined) {
      this.errorMessage = "You must select an option before continuing";
      return;
    }
    // this.initialSurveyAnswers[this.currentQuestion] = this.radioSelected;
    if (this.currentQuestion == 0) {
      this.initialSurveyAnswers.vegetarian = this.radioSelected;
    }
    if (this.currentQuestion == 3) {
      this.initialSurveyAnswers.cookTime = this.radioSelected;
    }
    if (this.currentQuestion == 5) {
      this.initialSurveyAnswers.intolerant = this.radioSelected;
    }
    this.getNextQuestion();
  }

  /**
   * Place checkbox selections into answers array and continue to next question.
   */
  submitCheckbox() {
    // This filter figures out which checkboxes are selected. 
    let answersList = this.initialSurveyOptions[this.currentQuestion].filter(item => item.checked);
    let answers = [];
    for (let i = 0; i < answersList.length; i++) {
      answers[i] = answersList[i].title;
    }
    if (answers.length == 0) {
      this.errorMessage = "You must select an option before continuing";
      return;
    }
    console.log(answers);
    
    // this.initialSurveyAnswers[this.currentQuestion] = answers;
    if (this.currentQuestion == 1) {
      if (answers.includes("No Preference")) {
        this.initialSurveyAnswers.proteins = ["No Preference"];
      } else {
        this.initialSurveyAnswers.proteins = answers;
      }
    }
    if (this.currentQuestion == 2) {
      if (answers.includes("No Preference")) {
        this.initialSurveyAnswers.cuisines = ["No Preference"];
      } else {
        this.initialSurveyAnswers.cuisines = answers;
      }
    }         
    if (this.currentQuestion == 4) {
      this.initialSurveyAnswers.appliances = answers;
    }
    if (this.currentQuestion == 6) {
      this.initialSurveyAnswers.intolerances = answers;
    }
    this.getNextQuestion();
  }
  
  /**
   * Query DB based on provided answers and populate recommended array
   */
  completeSurvey() {
    console.log(document.cookie)
    this.isComplete = true;
    this.dataService.putSurveyResults(JSON.stringify(this.initialSurveyAnswers), 10).subscribe((data: any[]) => {
      console.log(data);
      this.recommendedRecipes = data;
    });
  }

  /**
   * Save selected recipe to users "My Recipes" page
   */
  addToMyRecipes(recipe_id: number) {
    this.dataService.saveRecipe(JSON.stringify(this.initialSurveyAnswers), recipe_id).subscribe((data: any[]) => {
      console.log(data);
    })
  }
}