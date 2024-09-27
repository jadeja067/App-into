import { Component } from '@angular/core';
import { TourService, TourStep } from '../../services/tour.service';

@Component({
  selector: 'app-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.scss']
})
export class TourComponent {
  constructor(private tourService: TourService) {
    const steps: TourStep[] = [
      {
        id: 'step1',
        element: '.first-element',
        title: 'First Step',
        text: 'This is the first step of the tour.',
        position: 'bottom',
        buttons: [{ text: 'Next', action: () => this.tourService.nextStep() }],
      },
      {
        id: 'step2',
        element: '.second-element',
        title: 'Second Step',
        text: 'This is the second step of the tour.',
        position: 'top',
        buttons: [
          { text: 'Back', action: () => this.tourService.prevStep() },
          { text: 'Next', action: () => this.tourService.nextStep() },
        ],
      },
    ];

    this.tourService.addSteps(steps);
  }

  startTour() {
    this.tourService.startTour();
  }
}
