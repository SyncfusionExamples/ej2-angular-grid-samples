import { Component } from '@angular/core';
import { ToolbarItems, EditSettingsModel, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { DataManager, ODataV4Adaptor } from '@syncfusion/ej2-data';
import { EditService, FilterService, GridModule, PageService, SortService, ToolbarService } from '@syncfusion/ej2-angular-grids';


@Component({
  selector: 'app-root',
  standalone:true,
  templateUrl: './app.component.html',
  imports: [GridModule],
  providers: [EditService, ToolbarService, PageService, SortService, FilterService],
})
export class AppComponent {
  public data?: DataManager;
  public pageSettings?: PageSettingsModel;
  public editSettings?: EditSettingsModel;
  public toolbar?: ToolbarItems[];
  public orderIDRules?: Object;
  public customerIDRules?: Object;

  ngOnInit(): void {
    this.data = new DataManager({
      url: 'https://localhost:7185/odata/Orders', // Replace xxxx with actual port number.
      adaptor: new ODataV4Adaptor(), // Handles all OData communication.
      crossDomain: true // Enables cross-domain requests.
    });
    this.pageSettings = { pageSize: 10, pageSizes: true }; 
    this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal', showDeleteConfirmDialog: true };
    this.toolbar = ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'Search'];
    this.orderIDRules = { required: true };
    this.customerIDRules = { required: true, minLength: 3 };
  }
}
