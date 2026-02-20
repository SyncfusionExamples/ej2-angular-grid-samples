// File: src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataManager, UrlAdaptor } from '@syncfusion/ej2-data';
import {
  GridModule,
  ToolbarService,
  EditService,
  SortService,
  FilterService,
  PageService,
} from '@syncfusion/ej2-angular-grids';
import { CustomAdaptor } from './custom-adaptor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    GridModule, // NgModule imported directly into a standalone component
  ],
  providers: [
    ToolbarService,
    EditService,
    SortService,
    FilterService,
    PageService,
  ],
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {
  public toolbar = ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'Search'];
  public edit = {
    allowAdding: true,
    allowEditing: true,
    allowDeleting: true,
    // mode: 'Batch',
  };
  public dataManager?: DataManager;

  ngOnInit(): void {
    this.dataManager = new DataManager({
      url: 'http://localhost:5018/api/tickets/url',
      insertUrl: 'http://localhost:5018/api/tickets/insert',
      updateUrl: 'http://localhost:5018/api/tickets/update',
      removeUrl: 'http://localhost:5018/api/tickets/remove',
      batchUrl: 'http://localhost:5018/api/tickets/batch',
      adaptor: new UrlAdaptor(),
    });
  }
}
