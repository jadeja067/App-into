import { Component, AfterViewInit } from '@angular/core';
import { ShepherdService } from 'angular-shepherd';

@Component({
  selector: 'app-shepherd',
  templateUrl: './shepherd.component.html',
})
export class ShepherdComponent implements AfterViewInit {
  hasSearchResults: boolean = false;
  searchResults: string[] = []; 

  constructor(private shepherdService: ShepherdService) {}

  ngAfterViewInit() {
    this.shepherdService.modal = true;
    this.shepherdService.confirmCancel = false;
    this.shepherdService.defaultStepOptions = {
       classes: 'custom-shepherd-class',
      scrollTo: false,
      cancelIcon: {
        enabled: true,
      },
    };

    // Initialize the tour steps
    this.initializeTourSteps();
  }

  // Method to initialize tour steps
  private initializeTourSteps() {
    this.shepherdService.addSteps([
      {
        id: 'intro',
        attachTo: {
          element: '.first-element',
          on: 'bottom',
        },
        buttons: this.getButtons(),
        title: 'Welcome to Angular-Shepherd!',
        text: [
          'Angular-Shepherd is a JavaScript library for guiding users through your Angular app.',
        ],
      },
      {
        id: 'search',
        attachTo: {
          element: '.search-result-element',
          on: 'top',
        },
        buttons: this.getButtons(),
        title: 'Search for Results',
        text: [
          'Use the search box above to find relevant results. Start typing to see suggestions.',
        ],
      },
      {
        id: 'results',
        attachTo: {
          element: '.search-results',
          on: 'top',
        },
        buttons: this.getButtons(),
        title: 'View Search Results',
        text: [
          'Here are the results based on your query. Click on any result to learn more.',
        ],
        when: {
          show: () => {
            console.log('Showing results step');
          },
        },
      },
      {
        id: 'feature1',
        attachTo: {
          element: '.second-element',
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
          element: '.third-element',
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
        attachTo: {
          element: '.final-element',
          on: 'top',
        },
        buttons: this.getButtons(),
        title: 'Final Thoughts',
        text: [
          'You have reached the end of the tour! Feel free to explore the application further.',
        ],
      },
    ]);
  }

  // Method to start the tour if there are search results
  startTour() {
    if (this.hasSearchResults) {
      this.shepherdService.start();
    } else {
      alert('No search results found. Please execute another search, and try to start the tour again.');
    }
  }

  // Method to handle search input
  onSearch(event: Event) {
    const target = event.target as HTMLInputElement; // Type assertion to HTMLInputElement
    const query = target.value; // Get the value from the input

    this.searchResults = []; // Reset results

    if (query) {
      this.searchResults = this.performSearch(query);
    }

    this.updateSearchResults(this.searchResults);
  }

  // Simulated search function (replace with actual logic)
  performSearch(query: string): string[] {
    const allResults = [
      'Result 1: Angular Basics',
      'Result 2: Advanced Angular Techniques',
      'Result 3: Angular Shepherd Guide',
      'Result 4: Angular Testing Strategies',
    ];

    return allResults.filter(result => result.toLowerCase().includes(query.toLowerCase()));
  }

  // Method to update search results
  updateSearchResults(results: string[]) {
    this.hasSearchResults = results.length > 0; // Check if there are results
    if (this.hasSearchResults) {
      // Optionally start tour here or show results
      // this.startTour();
    }
  }

  // Helper method to create buttons
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
}
