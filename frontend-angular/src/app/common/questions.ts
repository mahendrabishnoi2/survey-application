import { QuestionsOptions } from './questions-options';
import { InputTypes } from './input-types';

export class Questions {
    constructor(id: number, questionName: string) {
        this.id = id;
        this.question = questionName;
    }
    id: number;
    question: string;
    type: InputTypes;
    options: QuestionsOptions[];
}
