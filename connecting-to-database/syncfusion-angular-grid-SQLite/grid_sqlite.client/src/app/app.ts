import { Component } from '@angular/core';
import { DataManager } from '@syncfusion/ej2-data';
import { CustomAdaptor } from './custom-adaptor';
import { CommonModule } from '@angular/common'
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
  public dataManager: DataManager;
  public toolbarOptions: string[];
  public editSettings: Object;
  public filterSettings: Object;
  public requiredrules?: Object;
  constructor() {
    this.requiredrules = { required: true };
    this.toolbarOptions = ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'Search'];
    this.editSettings = {
      allowAdding: true,
      allowEditing: true,
      allowDeleting: true,
      mode: 'Normal'
    };
    this.filterSettings = { type: 'Excel' };

    this.dataManager = new DataManager({
      url: 'https://localhost:7066/api/asset/url',
      insertUrl: 'https://localhost:7066/api/asset/insert',
      updateUrl: 'https://localhost:7066/api/asset/update',
      removeUrl: 'https://localhost:7066/api/asset/remove',
      batchUrl: 'https://localhost:7066/api/asset/batch',
      adaptor: new CustomAdaptor()
    });
  }
}
