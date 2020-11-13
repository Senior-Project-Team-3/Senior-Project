import { Component, OnInit } from '@angular/core';

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
  initialSurveyAnswers = [];
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
  
  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {
    this.currentQuestion = 0;
    this.isComplete = false;
    // Check if user has taken previous surveys...
    // this.populateReturnSurvey();
    // If not, get the initial survey ready.
    this.populateInitialSurvey();
  }

  populateInitialSurvey() {
    this.isInitial = true;
    this.isRadio = true;

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
        title: 'Steak',
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
        title: 'All',
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

    if (this.isInitial) {

      // Survey complete
      if (this.currentQuestion == this.initialSurveyQuestions.length) {
        // Finish the survey
        this.completeSurvey();
        return;
      }

      // Check for dependant questions...
      // Skip preferred source of meat for vegetarians
      if (this.currentQuestion == 1 && this.initialSurveyAnswers[0] == 'Yes') {
        this.getNextQuestion();
        return;
      }
      // Skip allergy intolerence question for those who select no
      if (this.currentQuestion == 6 && this.initialSurveyAnswers[5] == 'No') {
        this.getNextQuestion();
        return;
      }

    } else {

      // Survey complete
      if (this.currentQuestion == this.returnSurveyQuestions.length) {
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
      if (this.isInitial) {
        this.initialSurveyAnswers[this.currentQuestion] = this.radioSelected;
      } else {
        this.returnSurveyAnswers[this.currentQuestion] = this.radioSelected;
    }
    this.getNextQuestion();
  }

  submitCheckbox() {
    let answersList = this.initialSurveyOptions[this.currentQuestion].filter(item => item.checked);
    let answers = [];
    for (let i = 0; i < answersList.length; i++) {
      answers[i] = answersList[i].title;
    }
    console.log(answers);
    if (this.isInitial) {
      this.initialSurveyAnswers[this.currentQuestion] = answers;
    } else {
      this.returnSurveyAnswers[this.currentQuestion] = answers;
    }
    this.getNextQuestion();
  }

  completeSurvey() {
    this.isComplete = true;
    if (this.isInitial) {
      let kd = JSON.stringify(this.initialSurveyAnswers);
      console.log(kd);
      this.dataService.putSurveyResults(kd, 10).subscribe((data: any[]) => {
        console.log(data);
      });
    } else {
      // this.dataService.putSurveyResults(this.returnSurveyAnswers, 10).subscribe((data: any[]) => {
      //   console.log(data);
      // });
    }
  }
}
