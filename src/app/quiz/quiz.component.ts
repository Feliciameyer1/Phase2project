import { Component, OnInit } from '@angular/core';
import { Option } from '../models/Option';
import { Questions } from '../models/Questions';
import { quiz } from '../models/quiz';
import { QuizConfiguration } from '../models/quizconfiguration';
import { QuizService } from '../services/quiz-services';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  quizes: any[];
  quiz: quiz = new quiz(null);
  mode = 'quiz';
  quizName: string;
  configuration: QuizConfiguration = {
    'allowBack': true,
    'allowReview': true,   
    'autoMove': false,  // if true, it will move to next question automatically when answered.
    'duration': 600,  // indicates the time (in secs) in which quiz needs to be completed. 0 means unlimited.
    'pageSize': 1,
    'requiredAll': false,  // indicates if you must answer all the questions before submitting.
    'richText': false,
    'shuffleQuestions': false,
    'shuffleOptions': false,
    'showClock': false,
    'showPager': true,
    'theme': 'none'
  };
  pager = {
    index: 0,
    size: 1,
    count: 1
  };
  timer: any = null;
  startTime: Date;
  endTime: Date;
  ellapsedTime = '00:00';
  duration = '';

  constructor(private qs:QuizService) { }

  ngOnInit(): void {
    this.quizes = this.qs.getAll();
    this.quizName = this.quizes[0].id;
    this.loadQuiz(this.quizName);
  }
  loadQuiz(quizName: string) {
    this.qs.get(quizName).subscribe(res => {
      this.quiz = new quiz(res);
      this.pager.count = this.quiz.questions.length;
      this.startTime = new Date();
      this.ellapsedTime = '00:00';
      this.timer = setInterval(() => { this.tick(); }, 1000);
      this.duration = this.parseTime(this.configuration.duration);
    });
    this.mode = 'quiz';
  }
  tick() {
    const now = new Date();
    const diff = (now.getTime() - this.startTime.getTime()) / 1000;
    if (diff >= this.configuration.duration) {
      this.onSubmit();
    }
    this.ellapsedTime = this.parseTime(diff);
  }

  parseTime(totalSeconds: number) {
    let mins: string | number = Math.floor(totalSeconds / 60);
    let secs: string | number = Math.round(totalSeconds % 60);
    mins = (mins < 10 ? '0' : '') + mins;
    secs = (secs < 10 ? '0' : '') + secs;
    return `${mins}:${secs}`;
  }
  onSubmit() {
    let answers = [];
    this.quiz.questions.forEach(x => answers.push({ 'quizId': this.quiz.id, 'questionId': x.id, 'answered': x.answered }));

    // Post your data to the server here. answers contains the questionId and the users' answer.
    console.log(this.quiz.questions);
    this.mode = 'result';
  }
  
  goTo(index: number) {
    if (index >= 0 && index < this.pager.count) {
      this.pager.index = index;
      this.mode = 'quiz';
    } else if(index>this.pager.count){
      alert("there are no more questions after this one");
    }
  }
  isAnswered(question: Questions) {
    return question.options.find(x => x.selected) ? 'Answered' : 'Not Answered';
  };

  isCorrect(question: Questions) {
    return question.options.every(x => x.selected === x.isAnswer) ? 'correct' : 'wrong';
  };
  onSelect(question: Questions, option: Option) {
    if (question.questionTypeId === 1) {
      question.options.forEach((x) => { if (x.id !== option.id) x.selected = false; });
    }

    if (this.configuration.autoMove) {
      this.goTo(this.pager.index + 1);
    }
  }
  get filteredQuestions() {
    return (this.quiz.questions) ?
      this.quiz.questions.slice(this.pager.index, this.pager.index + this.pager.size) : [];
  }
}
