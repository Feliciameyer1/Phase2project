import { Option } from './Option';

export class Questions{
    id: number;
    name: string;
    questionTypeId: number;
    options: Option[];
    answered: boolean;
    constructor(data:any){
        data = data || {};
        this.id=data.id;
        this.name=data.name;
        this.questionTypeId=data.questionTypeId;
        this.options=[];
        data.options.forEach(o => {
            this.options.push(new Option(o));
        });
    }
}