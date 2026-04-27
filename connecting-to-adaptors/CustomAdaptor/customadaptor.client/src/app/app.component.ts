import { Component } from '@angular/core';
import { CustomAdaptor } from './CustomAdaptor';
import { DataManager } from '@syncfusion/ej2-data';
import { EditSettingsModel, ToolbarItems } from '@syncfusion/ej2-angular-grids';

import { GridModule, EditService, ToolbarService, FilterService, SortService, PageService, } from '@syncfusion/ej2-angular-grids';

@Component({
  selector: 'app-root',
  standalone:true,
   imports: [
     GridModule
  ],
  providers: [EditService, ToolbarService, FilterService, SortService, PageService],
  templateUrl: './app.component.html',
  
})
export class AppComponent {
  public data?: DataManager;
  public editSettings?: EditSettingsModel;
  public toolbar?: ToolbarItems[];
  public orderIDRules?: Object;
  public customerIDRules?: Object;

  ngOnInit(): void {
    this.data = new DataManager({
      url: 'https://localhost:7014/odata/Orders', // Here xxxx represents the port number.
      adaptor: new CustomAdaptor()
    });
    this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true };
    this.toolbar = ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'Search'];
    this.orderIDRules = { required: true };
    this.customerIDRules = { required: true, minLength: 3 };
  }
}
