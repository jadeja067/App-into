import { Component } from '@angular/core';
import { TourService, TourStep } from '../../services/tour.service';

@Component({
  selector: 'app-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.scss'],
})
export class TourComponent {
  constructor(private tourService: TourService) {
    const steps: TourStep[] = [
      {
        id: 'step1',
        element: '.first-element',
        title: 'First Step',
        text: 'This is the first step of the tour.',
        position: 'top',
        buttons: [{ text: 'Next', action: () => this.tourService.nextStep() }],
      },
      {
        id: 'step2',
        element: '.second-element',
        title: 'Second Step',
        text: 'This is the second step of the tour.',
        position: 'bottom',
        buttons: [
          { text: 'Back', action: () => this.tourService.prevStep() },
          { text: 'Next', action: () => this.tourService.nextStep() },
        ],
      },
      {
        id: 'step3',
        element: '.third-element',
        title: 'Third Step',
        text: 'This is the third step of the tour.',
        position: 'left',
        buttons: [
          { text: 'Back', action: () => this.tourService.prevStep() },
          { text: 'Next', action: () => this.tourService.nextStep() },
        ],
      },
      {
        id: 'step3',
        element: '.fourth-element',
        title: 'Fourth Step',
        text: 'This is the fourth step of the tour.',
        position: 'right',
        buttons: [{ text: 'Finish', action: () => this.tourService.endTour() }],
      },
    ];

    this.tourService.addSteps(steps);
  }

  startTour() {
    this.tourService.startTour();
  }
}
