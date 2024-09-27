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
  private svgBackdrop?: SVGSVGElement;
  constructor() {}

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
        setTimeout(() => {
          this.renderTooltip(step, element);
          step.afterShow?.();
        }, 500);
      }
    }
  }

  nextStep() {
    this.clearTooltip();
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
      this.removeSvgPath();
      this.generateSvgPath();
      this.showStep(this.currentStepIndex);
    } else this.endTour()
  }

  prevStep() {
    this.clearTooltip();
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.removeSvgPath();
      this.generateSvgPath();
      this.showStep(this.currentStepIndex);
    }
  }

  endTour() {
    this.currentStepIndex = -1;
    this.clearTooltip();
    this.removeBackdrop();
  }

  private renderTooltip(step: TourStep, element: Element) {
    const tooltip = document.createElement('div');
    tooltip.classList.add('tour-tooltip');
    tooltip.innerHTML = `
      <h4>${step.title}</h4>
      <p>${step.text}</p>`;

    this.positionTooltip(tooltip, element, step.position);

    step.buttons?.forEach((button) => {
      const btn = document.createElement('button');
      btn.classList.add(button.classes || 'tour-button');
      btn.textContent = button.text;
      btn.onclick = button.action;
      tooltip.appendChild(btn);
    });

    document.body.appendChild(tooltip);
  }

  private positionTooltip(
    tooltip: HTMLElement,
    element: Element,
    position: string
  ) {
    const rect = element.getBoundingClientRect();
    switch (position) {
      case 'top':
        tooltip.style.top = `${rect.top - tooltip.offsetHeight}px`;
        tooltip.style.left = `${rect.left}px`;
        break;
      case 'bottom':
        tooltip.style.top = `${rect.bottom}px`;
        tooltip.style.left = `${rect.left}px`;
        break;
      case 'left':
        tooltip.style.top = `${rect.top}px`;
        tooltip.style.left = `${rect.left - tooltip.offsetWidth}px`;
        break;
      case 'right':
        tooltip.style.top = `${rect.top}px`;
        tooltip.style.left = `${rect.right}px`;
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
    this.svgBackdrop = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg'
    );
    this.svgBackdrop.setAttribute('class', 'tour-backdrop');
    this.svgBackdrop.setAttribute('width', '100%');
    this.svgBackdrop.setAttribute('height', '100%');
    this.generateSvgPath();
    document.body.appendChild(this.svgBackdrop);
  }

  private generateSvgPath() {
    const step = this.steps[this.currentStepIndex];
    let pathData = '';

    if (step) {
      const element = document.querySelector(step.element);
      if (element) {
        const elementRect = element.getBoundingClientRect();
        const x = elementRect.left;
        const y = elementRect.top;
        const width = elementRect.width;
        const height = elementRect.height;

        pathData +=
          `M ${window.innerWidth},${window.innerHeight} ` +
          `H 0 ` +
          `V 0 ` +
          `H ${window.innerWidth} ` +
          `V ${window.innerHeight} ` +
          `Z ` +
          `M ${x},${y} ` +
          `a 0 0 0 0 0 0 0 ` +
          `V ${y + height} ` +
          `a 0 0 0 0 0 0 0 ` +
          `H ${x + width} ` +
          `a 0 0 0 0 0 0 0 ` +
          `V ${y} ` +
          `a 0 0 0 0 0 0 0 ` +
          `Z`;

        const backdropPath = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'path'
        );
        backdropPath.setAttribute('d', pathData);
        backdropPath.setAttribute('fill', 'rgba(0, 0, 0, 0.5)');
        backdropPath.setAttribute('stroke', 'none');
        this.svgBackdrop?.appendChild(backdropPath);
      }
    }
  }

  private removeSvgPath(): void {
    this.svgBackdrop?.childNodes.forEach((node) => node.remove());
  }

  private removeBackdrop() {
    const backdrop = document.querySelector('.tour-backdrop');
    if (backdrop) {
      backdrop.remove();
    }
  }
}
