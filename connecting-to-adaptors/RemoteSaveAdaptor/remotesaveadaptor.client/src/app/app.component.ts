import { Component, OnInit } from '@angular/core';
import { DataManager, RemoteSaveAdaptor } from '@syncfusion/ej2-data';
import { EditSettingsModel, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { HttpClient } from '@angular/common/http';

const serviceUrl = 'https://localhost:7010/api/orders';

@Component({
  selector: 'app-root',
  template: `
    <ejs-grid id='grid' [dataSource]='data' [editSettings]='editSettings' [toolbar]='toolbar' [allowSorting]=true [allowPaging]=true [allowFiltering]=true height=450>
      <e-columns>
          <e-column field='OrderID' headerText='Order ID' textAlign='Right' width=120 isPrimaryKey=true [validationRules]='orderIDRules'></e-column>
          <e-column field='CustomerID' headerText='Customer ID' [validationRules]='customerIDRules' width=150></e-column>
          <e-column field='ShipCity' width=150></e-column>
          <e-column field='ShipCountry' headerText='Ship Country' width=150></e-column>
      </e-columns>
    </ejs-grid>
  `,
  providers: []
})
export class AppComponent implements OnInit {

  public data?: DataManager;
  constructor(private http: HttpClient) { }
  public editSettings: EditSettingsModel = {
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    newRowPosition: 'Top'
  };

  public toolbar: ToolbarItems[] = ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'Search'];

  public orderIDRules?: Object= { required: true };
  public customerIDRules?: Object = { required: true, minLength: 3 };

  ngOnInit(): void {

    this.http.get<[]>(serviceUrl)
      .pipe()
      .subscribe((value: any) => {
        this.data = new DataManager({
          json: value,
          insertUrl: serviceUrl + "/Insert",
          updateUrl: serviceUrl + "/Update",
          removeUrl: serviceUrl + "/Remove",
          adaptor: new RemoteSaveAdaptor(),
        });
      });
  };      
}
