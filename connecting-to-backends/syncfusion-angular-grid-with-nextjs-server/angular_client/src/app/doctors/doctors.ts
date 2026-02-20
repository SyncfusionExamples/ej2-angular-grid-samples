import { CommonModule } from '@angular/common';
import { Component, inject, signal, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import {
  DataSourceChangedEventArgs,
  DataStateChangeEventArgs,
  EditService,
  GridComponent,
  GridModule,
  ToolbarService,
  RowInfo,
} from '@syncfusion/ej2-angular-grids';
import {
  PageService,
  SortService,
  FilterService,
  GroupService,
} from '@syncfusion/ej2-angular-grids';
import { DataManager, Query } from '@syncfusion/ej2-data';

@Component({
  selector: 'app-doctors',
  imports: [RouterOutlet, GridModule, CommonModule, ButtonModule],
  templateUrl: './doctors.html',
  styleUrls: ['./doctors.css'],
  providers: [
    PageService,
    SortService,
    FilterService,
    EditService,
    ToolbarService,
    GroupService,
  ],
})
export class Doctors {
  @ViewChild('grid') public gridInstance!: GridComponent;

  public data: any[] = [];
  public toolbar: string[] = [
    'Add',
    'Edit',
    'Delete',
    'Update',
    'Cancel',
    'Search',
  ];
  public filterSettings: Object = { type: 'Excel' };
  public editSettings: Object = {
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    mode: 'Normal',
  };

  // Specialty dropdown data
  public ddData = [
    { specialtyName: 'Cardiologist', specialtyId: '1' },
    { specialtyName: 'Dermatologist', specialtyId: '2' },
    { specialtyName: 'Neurologist', specialtyId: '3' },
    { specialtyName: 'Orthopedic', specialtyId: '4' },
    { specialtyName: 'Pediatrician', specialtyId: '5' },
    { specialtyName: 'Psychiatrist', specialtyId: '6' },
  ];
  public ddparams = {
    params: {
      actionComplete: () => false,
      dataSource: new DataManager(this.ddData),
      fields: { text: 'specialtyName', value: 'specialtyName' },
      query: new Query(),
    },
  };

  // Availability dropdown data
  public availabilityData = [
    { Availability: 'Available' },
    { Availability: 'On Leave' },
  ];
  public availabilityParams = {
    params: {
      actionComplete: () => false,
      dataSource: new DataManager(this.availabilityData),
      fields: { text: 'Availability', value: 'Availability' },
      query: new Query(),
    },
  };

  private router = inject(Router);

  ngOnInit(): void {
    const initialState = {
      skip: 0,
      take: 12,
      sorted: [],
      where: [],
      search: [],
    };
    this.fetchData(initialState).then((res) => {
      this.gridInstance.dataSource  = res;
    });
  }

  // Fetch grid data from back-end, passing current state
  async fetchData(gridState: any) {
    const encodedState = encodeURIComponent(JSON.stringify(gridState));
    const url = `http://localhost:3000/api/health_care?gridState=${encodedState}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return await response.json();
  }

  // Syncfusion Grid data state change handler (paging, sorting, filtering, searching)
  async dataStateChange(args: DataStateChangeEventArgs) {
    const gridState = {
      skip: args.skip,
      take: args.take,
      sorted: args.sorted,
      where: args.where,
      search: args.search,
    };

    const res: any = await this.fetchData(gridState);

    if (
      args.action &&
      (args.action.requestType === 'filterchoicerequest' ||
        args.action.requestType === 'filtersearchbegin' ||
        args.action.requestType === 'stringfilterrequest')
    ) {
      // For filter dialog data
      (args as any).dataSource(res.result);
    } else {
      // For paging, sorting and other data actions
      this.gridInstance.dataSource  = res;
    }
  }

  // Handle Create / Update / Delete operations
  async dataSourceChanged(args: DataSourceChangedEventArgs) {
    const url = 'http://localhost:3000/api/health_care';
    let method = 'POST';
    let body: any = {};

    if (args.action === 'add') {
      method = 'POST';
      body = { ...args.data, action: 'add' };
    } else if (args.action === 'edit') {
      method = 'PUT';
      body = { ...args.data, action: 'edit' };
    } else if (args.requestType === 'delete') {
      method = 'DELETE';
      body = { ...args.data, action: 'delete' };
    } else {
      return;
    }

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      await response.json();
      args.endEdit?.();
    }
  }

  // Navigate to patients for the selected doctor
  btnClick(event: MouseEvent) {
    const currentRowInfo: RowInfo = this.gridInstance.getRowInfo(event.target as HTMLElement);
    const doctorID = (currentRowInfo.rowData as any).DoctorId;
    this.router.navigate(['patients'], {
      queryParams: { doctorID },
    });
  }
}