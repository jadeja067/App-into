import { Component } from '@angular/core';
import { TourService, TourStep } from 'src/app/services/tour.service';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss']
})
export class IntroComponent  {

  constructor(private tourService: TourService) {
    const steps: TourStep[] = [
      {
        id: 'step1',
        element: '.feature1',
        title: 'First Step',
        text: 'This is the first step of the tour.',
        position: 'bottom',
        buttons: [{ text: 'Next', action: () => this.tourService.nextStep() }],
      },
      {
        id: 'step2',
        element: '.feature2',
        title: 'Second Step',
        text: 'This is the second step of the tour.',
        position: 'top',
        buttons: [
          { text: 'Back', action: () => this.tourService.prevStep() },
          { text: 'Next', action: () => this.tourService.nextStep() },
        ],
      },
      {
        id: 'step3',
        element: '.feature2-a',
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
        element: '.feature2-li',
        title: 'Third Step',
        text: 'This is the third step of the tour.',
        position: 'bottom',
        buttons: [
          { text: 'Back', action: () => this.tourService.prevStep() },
          { text: 'Next', action: () => this.tourService.nextStep() },
        ],
      },
      {
        id: 'step3',
        element: '.feature3',
        title: 'Fourth Step',
        text: 'This is the fourth step of the tour.',
        position: 'bottom',
        buttons: [{ text: 'Finish', action: () => this.tourService.endTour() }],
      },
    ];

    this.tourService.addSteps(steps);
  }

  startTour() {
    this.tourService.startTour();
  }

}
