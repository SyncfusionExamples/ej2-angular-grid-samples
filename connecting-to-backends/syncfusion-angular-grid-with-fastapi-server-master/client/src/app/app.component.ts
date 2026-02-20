import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridModule, GridComponent, PageService, SortService, FilterService, EditService, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { DataManager, UrlAdaptor } from '@syncfusion/ej2-data';
import { FilterSettingsModel, EditSettingsModel, PageSettingsModel, ToolbarItems } from '@syncfusion/ej2-grids';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, GridModule],
  providers: [PageService, SortService, FilterService, EditService, ToolbarService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {

  // ---------- Endpoint ----------
  public API_BASE = 'http://localhost:8000'; // FastAPI base

  // ---------- DataSource ----------
  public data: DataManager = new DataManager({
    url: `${this.API_BASE}/products/`,
    adaptor: new UrlAdaptor(),
    crossDomain: true,
  });

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

  // ---------- Helpers ----------
  public getStatusClass(status: string | null | undefined): string {
    const s = String(status ?? '').toLowerCase();
    if (s === 'active') return 'pg-chip pg-chip--active';
    if (s === 'inactive') return 'pg-chip pg-chip--inactive';
    if (s === 'discontinued') return 'pg-chip pg-chip--discontinued';
    return 'pg-chip';
  }
}