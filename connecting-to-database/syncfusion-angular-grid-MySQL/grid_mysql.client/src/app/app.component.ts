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
} from '@syncfusion/ej2-angular-grids';
import { DataManager } from '@syncfusion/ej2-data';
import { CustomAdaptor } from './custom-adaptor';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [CommonModule, GridModule],
  providers: [
    EditService,
    ToolbarService,
    PageService,
    SortService,
    FilterService,
    SearchService,
  ],
})
export class AppComponent implements OnInit {
  @ViewChild('grid', { static: true }) grid!: GridComponent;
  public dataManager?: DataManager;
  public data!: DataManager;
  public editSettings!: EditSettingsModel;
  public toolbar!: ToolbarItems[];
  public dateDefault: Date = new Date();

  public transactionIdRules: any = { required: true, maxLength: 50 };
  public customerIdRules: any = { required: true, number: true };
  public orderIdRules: any = { number: true };
  public invoiceNumberRules: any = { maxLength: 50 };
  public descriptionRules: any = { maxLength: 500 };
  public amountRules: any = { required: true, number: true };
  public currencyCodeRules: any = { maxLength: 10 };
  public transactionTypeRules: any = { maxLength: 50 };
  public paymentGatewayRules: any = { maxLength: 100 };
  public statusRules: any = { maxLength: 50 };

  ngOnInit(): void {
    this.dataManager = new DataManager({
      url: 'http://localhost:5283/api/grid/url',
      insertUrl: 'http://localhost:5283/api/grid/insert',
      updateUrl: 'http://localhost:5283/api/grid/update',
      removeUrl: 'http://localhost:5283/api/grid/remove',
      batchUrl: 'http://localhost:5283/api/grid/batch',
      adaptor: new CustomAdaptor(),
    });

    this.editSettings = {
      allowAdding: true,
      allowEditing: true,
      allowDeleting: true,
      // mode: 'Batch',
    };
    this.toolbar = ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'Search'];
  }
}