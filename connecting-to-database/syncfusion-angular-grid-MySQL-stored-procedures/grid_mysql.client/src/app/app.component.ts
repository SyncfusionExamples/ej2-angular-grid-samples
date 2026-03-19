import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GridComponent, GridModule, EditSettingsModel, FilterSettingsModel, ToolbarItems,
  EditService, ToolbarService, PageService, SortService, FilterService, SearchService,
  ValueAccessor
} from '@syncfusion/ej2-angular-grids';
import { DataManager, UrlAdaptor } from '@syncfusion/ej2-data';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [CommonModule, GridModule],
  providers: [EditService, ToolbarService, PageService,
    SortService, FilterService, SearchService,
  ],
})
export class AppComponent implements OnInit {
  @ViewChild('grid', { static: true }) grid!: GridComponent;
  public dataManager?: DataManager;
  public editSettings!: EditSettingsModel;
  public filterSettings!: FilterSettingsModel;
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
      // batchUrl: 'http://localhost:5283/api/grid/batch',
      adaptor: new UrlAdaptor(),
    });

    this.editSettings = {
      allowAdding: true,
      allowEditing: true,
      allowDeleting: true,
      // mode: 'Batch',
    };
    this.toolbar = ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'Search'];
    this.filterSettings = { type: 'Excel' }
  }
  amountValueAccessor: ValueAccessor = (field: string, data: any, column: any,) => {
    const currencySymbols: Record<string, string> = {
      INR: "₹",
      USD: "$",
      EUR: "€",
      GBP: "£",
    };
    const symbol = currencySymbols[data.CurrencyCode] || "";
    return `${symbol}${data.Amount?.toFixed(2)}`;
  };
}