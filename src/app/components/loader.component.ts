import { Component } from "@angular/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";


@Component({
  standalone: true,
  selector: 'app-loader',
  template: `
    <mat-spinner [strokeWidth]="4"></mat-spinner>
    <ng-content></ng-content>
  `,
  styles: [`
    :host {
      padding: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      gap: 32px;
    }
  `],
  imports: [
    MatProgressSpinnerModule,
  ]
})
export class LoaderComponent {
}