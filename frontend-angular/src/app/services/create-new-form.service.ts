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

  enabledComponent(): string {
    return this.componentToShow;
  }
}
