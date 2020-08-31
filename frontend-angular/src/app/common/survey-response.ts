import { Answer } from './answer';

export class SurveyResponse {
    id: number; // survey id
    fullName: string;
    email: string;
    submitDate: Date;
    answers: Answer[];
}
