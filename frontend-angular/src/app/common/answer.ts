export class Answer {
    questionId: number;
    questionText: string;
    questionTypeText: string;
    answerText: string;
    selectedOptionIds: string;

    constructor(qId?: number, qText?: string, qTypeText?: string, ansText?: string, selOptionIds?: string) {
        this.questionId = qId;
        this.questionText = qText;
        this.questionTypeText = qTypeText;
        this.answerText = ansText;
        this.selectedOptionIds = selOptionIds;
    }
}
