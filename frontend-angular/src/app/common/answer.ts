export class Answer {
    questionId: number;
    questionText: string;
    questionTypeText: string;
    answerText: string;
    selectedOptionIds: string;

    constructor(qId = 0, qText = "", qTypeText = "", ansText = "", selOptionIds = "") {
        this.questionId = qId;
        this.questionText = qText;
        this.questionTypeText = qTypeText;
        this.answerText = ansText;
        this.selectedOptionIds = selOptionIds;
    }
}
