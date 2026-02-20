import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientsGridComponent } from './components/patients-grid/patients-grid.component';

/**
 * Root component of the Hospital Patient Management application
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, PatientsGridComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Hospital Patient Management System';
}
