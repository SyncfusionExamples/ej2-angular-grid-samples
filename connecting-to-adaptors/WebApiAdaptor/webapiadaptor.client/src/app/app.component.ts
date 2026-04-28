import { Component } from '@angular/core';
import { ToolbarItems, EditSettingsModel } from '@syncfusion/ej2-angular-grids';
import { DataManager, WebApiAdaptor } from '@syncfusion/ej2-data';
import { EditService, FilterService, GridModule, PageService, SortService, ToolbarService } from '@syncfusion/ej2-angular-grids';


@Component({
  selector: 'app-root',
  imports: [ GridModule ],
  providers: [EditService, ToolbarService, FilterService, SortService, PageService],
  templateUrl: './app.component.html'
})
export class AppComponent {
  public data?: DataManager;
  public editSettings?: EditSettingsModel;
  public toolbar?: ToolbarItems[];
  public orderIDRules?: Object;
  public customerIDRules?: Object

  ngOnInit(): void {
    this.data = new DataManager({
      url: 'https://localhost:7112/api/Orders', // Replace with the actual endpoint URL.
      adaptor: new WebApiAdaptor(), // This handles Web API communication.
      crossDomain: true // Allow cross-domain requests.
    });

    this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' };
    this.toolbar = ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'Search'];
    this.orderIDRules = { required: true };
    this.customerIDRules = { required: true, minLength: 3 };
  }
}
