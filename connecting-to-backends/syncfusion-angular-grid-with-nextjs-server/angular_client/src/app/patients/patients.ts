import { Component, inject, ViewChild } from '@angular/core';
import {
  EditService,
  FilterService,
  GridComponent,
  GridModule,
  GroupService,
  PageService,
  SortService,
  ToolbarService,
} from '@syncfusion/ej2-angular-grids';
import { patientData } from '../data/health_care_Entities';
import { Query } from '@syncfusion/ej2-data';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { Router, RouterOutlet } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [RouterOutlet, GridModule, CommonModule, ButtonModule],
  providers: [
    PageService,
    SortService,
    FilterService,
    EditService,
    ToolbarService,
    GroupService,
  ],
  templateUrl: './patients.html',
  styleUrls: ['./patients.css'],
})
export class Patients {
  @ViewChild('grid') public gridInstance!: GridComponent;
  // For imperative navigation
  private router = inject(Router);
  //To read route parameters
  private route = inject(ActivatedRoute);

  public data: any[] = patientData;
  public filterSettings = { type: 'Excel' };
  public toolbarOptions: string[] = ['Search'];
  public query = new Query();
  public doctorID: string = '';
  ngOnInit(): void {
    // Read doctorID from query params
    this.route.queryParams.subscribe((params: any) => {
      this.doctorID = params['doctorID'] || '';
      // Apply filter based on router parameter
      this.query = new Query().where('DoctorAssigned', 'equal', this.doctorID, true);
    });
  }

  // Go back to doctors page
  public btnClick(): void {
    this.router.navigate(['doctors']);
  }
}
