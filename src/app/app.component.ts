import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HasDomaineGuard } from './guards/has-domaine.guard';

@Component({
  standalone: true,
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  imports: [RouterOutlet],

})
export class AppComponent { }
