import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CreateNewFormService {

  componentToShow: string = 'create-survey';

  constructor() { }

  toggleComponent(): void {
    if (this.componentToShow === 'create-survey') {
      this.componentToShow = 'add-question';
    } else {
      this.componentToShow = 'create-survey';
    }
  }

  reset(): void {
    this.componentToShow = 'create-survey';
  }

  success(): void {
    this.componentToShow = 'survey-created';
  }

  enabledComponent(): string {
    return this.componentToShow;
  }
}
