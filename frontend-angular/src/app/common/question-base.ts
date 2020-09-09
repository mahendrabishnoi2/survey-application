export class QuestionBase<T> {
    value: T;   // default value
    key: string;    // we can keep it as id of question
    label: string;  // question itself
    required: boolean;
    validation: string;
    // order: number;
    controlType: string;       // text or radio or checkbox
    type: string;   // input type such as email or anything else
    options: { key: string, value: string }[]; // key: option id, value: option text   // if radio or checkbox, then options

    constructor(options: {
        value?: T;
        key?: string;
        label?: string;
        required?: boolean;
        validation?: string;
        // order?: number;
        controlType?: string;
        type?: string;
        options?: { key: string, value: string }[];
    } = {}) {
        this.value = options.value;
        this.key = options.key || '';
        this.label = options.label || '';
        this.required = !!options.required;
        this.validation = options.validation || '';
        //   this.order = options.order === undefined ? 1 : options.order;
        this.controlType = options.controlType || '';
        this.type = options.type || '';
        this.options = options.options || [];
    }
}
