import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridModule, GridComponent, PageService, SortService, FilterService, EditService, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { FilterSettingsModel, EditSettingsModel, PageSettingsModel, ToolbarItems, DataStateChangeEventArgs, DataSourceChangedEventArgs } from '@syncfusion/ej2-grids';
import { GridApiService } from './grid-api.service';
import { Query } from '@syncfusion/ej2-data';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, GridModule],
  providers: [PageService, SortService, FilterService, EditService, ToolbarService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('grid') public grid?: GridComponent;

  constructor(private gridApiService: GridApiService) {}

  // ---------- Endpoint ----------
  public API_BASE = 'http://localhost:8000'; // FastAPI base

  // ---------- DataSource ----------
  public data: any = [];

  // ---------- Edit behavior ----------
  public editSettings: EditSettingsModel = {
    allowAdding: true,
    allowEditing: true,
    allowDeleting: true,
    showDeleteConfirmDialog: true,
    newRowPosition: 'Top'
  };

  // ---------- Toolbar ----------
  public toolbar: ToolbarItems[] | string[] = ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'Search'];

  // ---------- Paging + Filtering ----------
  public pageSettings: PageSettingsModel = { pageSize: 12, pageSizes: [12, 25, 50, 100] };
  public filterSettings: FilterSettingsModel = { type: 'Excel' };

  // Per-column filter UI types
  public menuFilter = { type: 'Menu' };
  public checkboxFilter = { type: 'CheckBox' };

  // ---------- Validation rules ----------
  public required = { required: true };

  public skuRules = { required: true, minLength: 3, maxLength: 32 };
  public productNameRules = { required: true, minLength: 2, maxLength: 80 };
  public categoryRules = { required: true, minLength: 1, maxLength: 50 };
  public priceRules = { required: true, number: true, min: 0 };
  public stockRules = { required: true, number: true, min: 0, max: 999999 };
  public statusRules = { required: true };

  // Edit params
  public categoryParams = {
    params: {
      dataSource: ["Beauty","Books","Electronics","Grocery","Office","Clothing","Toys","Home & Kitchen","Sports"],
      query: new Query(),
    },
  };
  public statusParams = {
    params: {
      dataSource: ["Active","Backorder","Discontinued"],
      query: new Query(),
    },
  };


  // ---------- Lifecycle ----------
  ngOnInit(): void {
    // Initialize the API service with base URL and primary key
    this.gridApiService.initialize(`${this.API_BASE}/products`, 'id');
  }

  ngAfterViewInit(): void {
    // Load initial data after view is initialized
    this.loadInitialData();
  }

  private async loadInitialData(): Promise<void> {
    try {
      const initialState = {
        skip: 0,
        take: 12,
      };
      const data = await this.gridApiService.fetchData(initialState);
      if (this.grid) {
        this.grid.dataSource = data;
      }
    } catch (error) {
      console.error('Failed to load initial data:', error);
    }
  }

  // ---------- Helpers ----------
  public getStatusClass(status: string | null | undefined): string {
    const s = String(status ?? '').toLowerCase();
    if (s === 'active') return 'pg-chip pg-chip--active';
    if (s === 'inactive') return 'pg-chip pg-chip--inactive';
    if (s === 'discontinued') return 'pg-chip pg-chip--discontinued';
    return 'pg-chip';
  }

  // ---------- Custom Binding Events ----------

  // Handle data state changes (read operations)
  public dataStateChange = async (args: DataStateChangeEventArgs): Promise<void> => {
    try {
      const gridState = {
        skip: args.skip,
        take: args.take,
        sorted: args.sorted,
        where: args.where,
        search: args.search,
      };

      const responseData = await this.gridApiService.fetchData(gridState);

      // Handle Excel filter choice requests
      if (
        args.action &&
        (args.action.requestType === 'filterchoicerequest' ||
          args.action.requestType === 'filterSearchBegin' ||
          args.action.requestType === 'stringfilterrequest')
      ) {
        (args as any).dataSource(responseData.result);
      } else {
        // Bind main grid data
        if (this.grid) {
          this.grid.dataSource = responseData;
        }
      }
    } catch (error) {
      console.error('Data state change failed:', error);
    }
  };

  // Handle data source changes (CRUD operations)
  public dataSourceChanged = async (args: DataSourceChangedEventArgs): Promise<void> => {
    try {
      const data = (args as any).data;

      // Create operation
      if (args.action === 'add' && args.requestType === 'save') {
        await this.gridApiService.createRecord(data);
        (args as any).endEdit();
        return;
      }

      // Update operation
      if (args.action === 'edit' && args.requestType === 'save') {
        const recordId = this.gridApiService.extractRecordId(data);
        await this.gridApiService.updateRecord(recordId, data);
        (args as any).endEdit();
        return;
      }

      // Delete operation
      if (args.requestType === 'delete') {
        const recordId = this.gridApiService.extractRecordId(data);
        await this.gridApiService.deleteRecord(recordId);
        (args as any).endEdit();
        return;
      }
    } catch (error) {
      console.error('Data source change failed:', error);
    }
  };
}
