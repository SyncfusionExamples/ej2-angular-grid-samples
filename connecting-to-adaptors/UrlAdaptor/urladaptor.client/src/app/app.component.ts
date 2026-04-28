import { Component } from '@angular/core';
import { EditSettingsModel, GroupSettingsModel,GridModule,ToolbarItems, EditService, ToolbarService, FilterService, SortService, PageService, GroupService, AggregateService } from '@syncfusion/ej2-angular-grids';
import { DataManager, UrlAdaptor } from '@syncfusion/ej2-data';

@Component({
  selector: 'app-root',
  standalone:true,
  imports: [ GridModule],
  providers: [EditService, ToolbarService, FilterService, SortService, PageService, GroupService, AggregateService ],
  templateUrl: './app.component.html', 
})
export class AppComponent {
  public data?: DataManager;
  public groupOptions?: GroupSettingsModel;
  public editSettings?: EditSettingsModel;
  public toolbar?: ToolbarItems[];
  public orderIDRules?: Object;
  public customerIDRules?: Object;

  ngOnInit(): void {
    this.data = new DataManager({
      url: 'https://localhost:7148/api/data', // Replace with the hosted link.
      insertUrl: 'https://localhost:7148/api/data/Insert',
      updateUrl: 'https://localhost:7148/api/data/Update',
      removeUrl: 'https://localhost:7148/api/data/Remove',
      adaptor: new UrlAdaptor()
    });
    this.groupOptions = { columns: ['ShipCountry'] };
    this.toolbar = ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'Search'];
    this.editSettings = { allowAdding: true, allowDeleting: true, allowEditing: true, };
    this.orderIDRules = { required: true };
    this.customerIDRules = { required: true, minLength: 3 };
  }
}
