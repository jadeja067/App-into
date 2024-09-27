import { Injectable } from '@angular/core';

export interface TourStep {
  id: string;
  element: string;
  title: string;
  text: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  buttons?: TourButton[];
  beforeShow?: () => void;
  afterShow?: () => void;
}

export interface TourButton {
  text: string;
  action: () => void;
  classes?: string;
}

@Injectable({
  providedIn: 'root',
})
export class TourService {
  private steps: TourStep[] = [];
  private currentStepIndex: number = -1;
  private svgBackdrop: SVGSVGElement | null = null;
  private svgPath?: any;
  constructor() {
    window.addEventListener(
      'resize',
      this.throttle(this.onResize.bind(this), 100)
    );
  }

  addSteps(steps: TourStep[]) {
    this.steps = steps;
  }

  startTour() {
    if (this.steps.length > 0) {
      this.currentStepIndex = 0;
      this.createSvgBackdrop();
      this.showStep(this.currentStepIndex);
    }
  }

  private showStep(index: number) {
    const step = this.steps[index];
    if (step) {
      const element = document.querySelector(step.element);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        step.beforeShow?.();
        this.renderTooltip(step, element as HTMLElement);
        step.afterShow?.();
      }
    }
  }

  nextStep() {
    this.clearTooltip();
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
      this.generateSvgPath();
      this.showStep(this.currentStepIndex);
    }
  }

  prevStep() {
    this.clearTooltip();
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.generateSvgPath();
      this.showStep(this.currentStepIndex);
    }
  }

  endTour() {
    this.currentStepIndex = -1;
    this.clearTooltip();
    this.removeBackdrop();
  }

  private renderTooltip(step: TourStep, element: HTMLElement) {
    this.clearTooltip();

    const tooltip = document.createElement('div');
    tooltip.classList.add('tour-tooltip');
    tooltip.innerHTML = `
      <h4>${step.title}</h4>
      <p>${step.text}</p>`;

    step.buttons?.forEach((button) => {
      const btn = document.createElement('button');
      btn.classList.add(button.classes || 'tour-button');
      btn.textContent = button.text;
      btn.onclick = button.action;
      tooltip.appendChild(btn);
    });
    document.body.appendChild(tooltip);
    this.positionTooltip(tooltip, element, step.position);
  }

  private positionTooltip(
    tooltip: HTMLElement,
    element: HTMLElement,
    position: string
  ) {
    switch (position) {
      case 'top':
        tooltip.style.top = `${
          element.offsetTop - (tooltip.offsetHeight + 2)
        }px`;
        tooltip.style.left = `${element.offsetLeft + 2}px`;
        break;
      case 'bottom':
        tooltip.style.top = `${
          element.offsetTop + (element.offsetHeight + 2)
        }px`;
        tooltip.style.left = `${element.offsetLeft + 2}px`;
        break;
      case 'left':
        tooltip.style.top = `${element.offsetTop + 2}px`;
        tooltip.style.left = `${
          element.offsetLeft + (element.offsetWidth + 2)
        }px`;
        break;
      case 'right':
        tooltip.style.top = `${element.offsetTop + 2}px`;
        tooltip.style.left = `${
          element.offsetLeft - (tooltip.offsetWidth + 2)
        }px`;
        break;
    }
  }

  private clearTooltip() {
    const tooltip = document.querySelector('.tour-tooltip');
    if (tooltip) {
      tooltip.remove();
    }
  }

  private createSvgBackdrop() {
    this.removeBackdrop();
    this.svgBackdrop = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg'
    );
    this.svgBackdrop.setAttribute('class', 'tour-backdrop');
    this.svgBackdrop.setAttribute('width', '100%');
    this.svgBackdrop.setAttribute('height', '100%');
    // this.generateSvgPath();
    const step = this.steps[this.currentStepIndex];
    if (step) {
      const element = document.querySelector(step.element);
      if (element) {
        const pathData: string = this.calcSvgPath(element)
        this.svgPath = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'path'
        );
        this.svgPath.setAttribute('d', pathData);
        this.svgPath.setAttribute('fill', 'rgba(0, 0, 0, 0.5)');
        this.svgPath.setAttribute('stroke', 'none');
        this.svgBackdrop?.appendChild(this.svgPath);
      }
    }
    document.body.appendChild(this.svgBackdrop);
  }
  private calcSvgPath(element: Element): string {
    const elementRect = element.getBoundingClientRect();
        const width = window.innerWidth;
        const height = window.innerHeight;
        return `M ${width},${height} H 0 V 0 H ${width} V ${height} Z M ${elementRect.left},${elementRect.top} a 0 0 0 0 0 0 0 V ${elementRect.bottom} a 0 0 0 0 0 0 0 H ${elementRect.right} a 0 0 0 0 0 0 0 V ${elementRect.top} a 0 0 0 0 0 0 0 Z`;
        
  }
  private generateSvgPath(): void {
    const step = this.steps[this.currentStepIndex];
    if (step) {
      const element = document.querySelector(step.element);
      if (element) {
        const pathData: string = this.calcSvgPath(element)
        this.svgPath.setAttribute('d', pathData);
      }
    }
  }
  private onResize() {
    if (this.currentStepIndex !== -1) {
      this.generateSvgPath();
    }
  }

  private removeBackdrop() {
    if (this.svgBackdrop) {
      this.svgBackdrop.remove();
      this.svgBackdrop = null;
    }
  }

  private throttle(fn: Function, wait: number) {
    let time = Date.now();
    return (...args: any[]) => {
      if (time + wait - Date.now() < 0) {
        fn.apply(this, args);
        time = Date.now();
      }
    };
  }
  ngOnDestroy() {
    window.removeEventListener('resize', this.onResize.bind(this));
  }
}
