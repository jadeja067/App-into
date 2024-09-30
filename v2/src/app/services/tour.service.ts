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
    window.addEventListener('resize', this.onResize.bind(this));
    window.addEventListener('scroll', this.onResize.bind(this));
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
        element.scrollIntoView({ behavior: 'auto', block: 'center' });
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
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft =
      window.pageXOffset || document.documentElement.scrollLeft;

    switch (position) {
      case 'top':
        tooltip.style.top = `${
          rect.top + scrollTop - (tooltip.offsetHeight + 2)
        }px`;
        tooltip.style.left = `${rect.left + scrollLeft + 2}px`;
        break;
      case 'bottom':
        tooltip.style.top = `${rect.top + scrollTop + rect.height + 2}px`;
        tooltip.style.left = `${rect.left + scrollLeft + 2}px`;
        break;
      case 'left':
        tooltip.style.top = `${rect.top + scrollTop + 2}px`;
        tooltip.style.left = `${
          rect.left + scrollLeft - (tooltip.offsetWidth + 2)
        }px`;
        break;
      case 'right':
        tooltip.style.top = `${rect.top + scrollTop + 2}px`;
        tooltip.style.left = `${rect.left + scrollLeft + rect.width + 2}px`;
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
        const pathData: string = this.calcSvgPath(element);
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
    const w = window.innerWidth;
    const h = window.innerHeight;
    return `M ${w},${h} H 0 V 0 H ${w} V ${h} Z M ${elementRect.left},${elementRect.top} a 0 0 0 0 0 0 0 V ${elementRect.bottom} a 0 0 0 0 0 0 0 H ${elementRect.right} a 0 0 0 0 0 0 0 V ${elementRect.top} a 0 0 0 0 0 0 0 Z`;
  }

  private generateSvgPath(): void {
    const step = this.steps[this.currentStepIndex];
    if (step) {
      const element = document.querySelector(step.element);
      if (element) {
        const pathData: string = this.calcSvgPath(element);
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
  ngOnDestroy() {
    window.removeEventListener('resize', this.onResize.bind(this));
    window.removeEventListener('scroll', this.onResize.bind(this));
  }
}
