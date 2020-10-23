import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';

import { DataService } from '../data.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {

  recipe = [];

  form: FormGroup;
  // Data: Array<any> = [
  //   { name: 'Pear', value: 'pear' },
  //   { name: 'Plum', value: 'plum' },
  //   { name: 'Kiwi', value: 'kiwi' },
  //   { name: 'Apple', value: 'apple' },
  //   { name: 'Lime', value: 'lime' }
  // ];

  // Hold our questions
  questions = new Map();
  // Hold posssible responses to question
  responses = new Map();
  // Keep track of which question the user is on
  currQuestion: number;



  constructor(
    private dataService: DataService,
    private formBuilder: FormBuilder) {
      this.form = this.formBuilder.group({
        checkArray: this.formBuilder.array([], Validators.required)
      })
     }

  ngOnInit(): void {
    this.getSurveyData();
    this.currQuestion = 1;
  }

  onCheckboxChange(e) {
    const checkArray: FormArray = this.form.get('checkArray') as FormArray;

    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  // Pass selections along, continue to next question
  submitForm() {
    console.log(this.form.value);
    

    this.currQuestion++;
  }

  // Here we should pass along user info, if logged in, to grab previous
  // responses from backened and generate a new survey. Otherwise, just 
  // provide the generic survey for unregistered users.
  getSurveyData() {
    this.questions.set(1, "What are you in the mood for tonight?");
    this.responses.set(1, ["Mexican", "Chinese", "Italian"]);
    this.questions.set(2, "How comfortable are you in the kitchen?")
    this.responses.set(2, ["Not at all", "A little", "Average", "Very"])
    
  }

  // recipeSearch(input: String) {
  //   this.dataService.getRecipe(input).subscribe((data: any[]) => {
  //     console.log(data);
  //     this.recipe = data;
  //   })
  // }
}
