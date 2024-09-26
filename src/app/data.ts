// import { StepOptions } from 'angular-shepherd';
// import { Placement } from 'shepherd.js';

// Define valid PopperPlacement for attachTo.on
export const defaultStepOptions: any = {
  scrollTo: true,
  cancelIcon: {
    enabled: true
  },
  classes: 'custom-class-name',
  scrollToHandler: (element: any) => {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

// Define steps with correct PopperPlacement types for "on"
export const steps: any = [
  {
    id: 'welcome',
    title: 'Welcome to the App',
    text: 'This is a demo of an Angular Shepherd tour!',
    attachTo: {
      element: '.welcome-element',
      on: 'bottom' // Cast the placement to the valid type
    },
    buttons: [
      {
        text: 'Next',
        action: 'next',
        classes: 'btn btn-primary'
      }
    ]
  },
  {
    id: 'feature-one',
    title: 'Feature One',
    text: 'Here is the first feature of the app.',
    attachTo: {
      element: '.feature-one-element',
      on: 'bottom'  // Cast the placement to the valid type
    },
    buttons: [
      {
        text: 'Back',
        action: 'back',
        classes: 'btn btn-secondary'
      },
      {
        text: 'Next',
        action: 'next',
        classes: 'btn btn-primary'
      }
    ]
  },
  {
    id: 'feature-two',
    title: 'Feature Two',
    text: 'This is another important feature!',
    attachTo: {
      element: '.feature-two-element',
      on: 'bottom'  // Cast the placement to the valid type
    },
    buttons: [
      {
        text: 'Back',
        action: 'back',
        classes: 'btn btn-secondary'
      },
      {
        text: 'Done',
        action: 'complete',
        classes: 'btn btn-success'
      }
    ]
  }
];
