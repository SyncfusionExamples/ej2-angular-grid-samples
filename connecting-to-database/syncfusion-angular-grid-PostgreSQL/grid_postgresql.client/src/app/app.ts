import { Component } from '@angular/core';
import { DataManager } from '@syncfusion/ej2-data';
import { CustomAdaptor } from './custom-adaptor';
import { CommonModule } from '@angular/common'
import {
  GridModule, EditService, ToolbarService,
  PageService, SortService, FilterService,
} from '@syncfusion/ej2-angular-grids';
@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  imports: [CommonModule, GridModule],
  providers: [EditService, ToolbarService, PageService, SortService, FilterService,],
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
      // mode: 'Batch'
    };
    this.filterSettings = { type: 'Excel' };

    this.dataManager = new DataManager({
      url: 'https://localhost:7102/api/PurchaseOrder/url',
      insertUrl: 'https://localhost:7102/api/PurchaseOrder/insert',
      updateUrl: 'https://localhost:7102/api/PurchaseOrder/update',
      removeUrl: 'https://localhost:7102/api/PurchaseOrder/remove',
      // batchUrl: 'https://localhost:7102/api/PurchaseOrder/batch',
      adaptor: new CustomAdaptor()
    });
  }
}
