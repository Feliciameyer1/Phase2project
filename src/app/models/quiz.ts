import { Questions } from './Questions';
import { QuizConfiguration } from './quizconfiguration';


export class quiz{
    id:number
    name:string
    description:string
    configuration:QuizConfiguration
    questions:Questions[];
    constructor(data: any) {
        if (data) {
            this.id = data.id;
            this.name = data.name;
            this.description = data.description;
            this.configuration = new QuizConfiguration(data.configuration);
            this.questions = [];
            data.questions.forEach(q => {
                this.questions.push(new Questions(q));
            });
        }
    }
}