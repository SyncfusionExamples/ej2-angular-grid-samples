import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GridComponent,
  GridModule,
  EditSettingsModel,
  ToolbarItems,
  EditService,
  ToolbarService,
  PageService,
  SortService,
  FilterService,
  SearchService,
  Sort,
} from '@syncfusion/ej2-angular-grids';
import { DataManager } from '@syncfusion/ej2-data';
import { CustomAdaptor } from './custom-adaptor';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  imports: [CommonModule, GridModule],
  providers: [
    EditService,
    ToolbarService,
    PageService,
    SortService,
    FilterService,
    SearchService,
    SortService,
  ],
})
export class AppComponent {
  @ViewChild('grid', { static: true }) grid!: GridComponent;
  public dataManager?: DataManager;
  public editSettings!: EditSettingsModel;
  public toolbar!: ToolbarItems[];
  public filterSettings: Object = { type: 'Excel' };
  public requiredRule: Object = { required: true };
  public BASE_URL = 'https://localhost:7000/api/rooms';
  ngOnInit(): void {
    this.dataManager = new DataManager({
      url: `${this.BASE_URL}`,
      insertUrl: `${this.BASE_URL}/insert`,
      updateUrl: `${this.BASE_URL}/update`,
      removeUrl: `${this.BASE_URL}/remove`,
      batchUrl: `${this.BASE_URL}/batch`,
      adaptor: new CustomAdaptor(),
    });
    this.editSettings = { allowAdding: true, allowEditing: true, allowDeleting: true };
    this.toolbar = ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'Search'];
  }
}
