import { Questions } from './questions';

export class SurveyFull {
    id: number;
    name: string;
    questions: Questions[];
    created: Date;
    validTill: Date;
    description: string;
}
