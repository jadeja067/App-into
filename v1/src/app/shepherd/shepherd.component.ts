import { Component, AfterViewInit } from '@angular/core';
import { ShepherdService } from 'angular-shepherd';

@Component({
  selector: 'app-shepherd',
  templateUrl: './shepherd.component.html',
  styleUrls: [ './shepherd.component.scss']
})
export class ShepherdComponent implements AfterViewInit {
  hasSearchResults: boolean = false;
  searchResults: any[] = [];
  defaultSteps: any[] = [
    {
      id: 'intro',
      buttons: [
        {
          classes: 'shepherd-button-secondary',
          text: 'Exit',
          action: () => this.shepherdService.cancel(),
        },
        {
          classes: 'shepherd-button-primary',
          text: 'Next',
          action: () => this.shepherdService.next(),
        },
      ],
      title: 'Welcome to Angular-Shepherd!',
      text: [
        'Angular-Shepherd is a JavaScript library for guiding users through your Angular app.',
      ],
    },
    {
      id: 'feature1',
      attachTo: {
        element: '.first-element',
        on: 'top',
      },
      buttons: this.getButtons(),
      title: 'Feature One',
      text: [
        'This feature allows you to perform complex operations. Make sure to explore it!',
      ],
    },
    {
      id: 'feature2',
      attachTo: {
        element: '.second-element',
        on: 'top',
      },
      buttons: this.getButtons(),
      title: 'Feature Two',
      text: [
        'Feature Two is designed for advanced users. Here you can configure your settings.',
      ],
    },
    {
      id: 'feature3',
      attachTo: {
        element: '.third-element',
        on: 'top',
      },
      buttons: this.getButtons(),
      title: 'Feature Three',
      text: [
        "This feature helps you visualize your data. Don't forget to check it out!",
      ],
    },
    {
      id: 'feature4',
      attachTo: {
        element: '.fourth-element',
        on: 'top',
      },
      buttons: this.getButtons(),
      title: 'Feature Three',
      text: [
        'This feature helps you visualize your data. Don’t forget to check it out!',
      ],
    },
    {
      id: 'final',
      buttons: [
        {
          classes: 'shepherd-button-primary',
          text: 'Finish',
          action: () => this.shepherdService.cancel(),
        },
      ],
      title: 'Final Thoughts',
      text: [
        'You have reached the end of the tour! Feel free to explore the application further.',
      ],
    },
  ];
  constructor(private shepherdService: ShepherdService) {}

  ngAfterViewInit() {
    this.shepherdService.modal = true;
    this.shepherdService.confirmCancel = false;
    this.shepherdService.defaultStepOptions = {
      classes: 'custom-shepherd-class',
      scrollTo: true,
      cancelIcon: {
        enabled: true,
      },
    };

    this.initializeTourSteps();
  }

  private initializeTourSteps(customSteps?: any[]) {
    this.shepherdService.addSteps(customSteps || this.defaultSteps);
  }
  resetTour() {
    this.initializeTourSteps();
    this.startTour();
  }
  startTour() {
    this.shepherdService.start();
  }
  search(query: any) {
    console.log(query);
  }
  updateSearchResults(results: any) {
    this.hasSearchResults = results.length > 0;
    if (this.hasSearchResults) {
      this.startTour();
    }
  }

  private getButtons() {
    return [
      {
        classes: 'shepherd-button-secondary',
        text: 'Exit',
        action: () => this.shepherdService.cancel(),
      },
      {
        classes: 'shepherd-button-primary',
        text: 'Back',
        action: () => this.shepherdService.back(),
      },
      {
        classes: 'shepherd-button-primary',
        text: 'Next',
        action: () => this.shepherdService.next(),
      },
    ];
  }
  onInput(query?: string) {
    this.searchResults = [];
    if (query) this.searchResults = this.performSearch(query);
  }
  onSearch() {
    this.initializeTourSteps(this.searchResults);
    this.startTour();
  }

  performSearch(query: string): any[] {
    const searchResults: any = [];
    let len = this.defaultSteps.length - 1;
    this.defaultSteps.forEach((result: any, i: number) => {
      if (
        (result?.id.toLowerCase().includes(query.toLowerCase()) ||
          result?.title.toLowerCase().includes(query.toLowerCase())) &&
        i !== 0 &&
        i !== len
      )
        searchResults.push({
          ...result,
          index: i,
        });
    });
    return searchResults;
  }
}
