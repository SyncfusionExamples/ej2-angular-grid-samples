import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GridComponent,
  GridModule,
  DataStateChangeEventArgs,
  DataSourceChangedEventArgs,
  EditSettingsModel,
  FilterSettingsModel,
  PageSettingsModel,
  ToolbarItems,
  PageService,
  SortService,
  FilterService,
  EditService,
  ToolbarService,
} from '@syncfusion/ej2-angular-grids';
import { Query } from '@syncfusion/ej2-data';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, GridModule],
  templateUrl: './app.component.html',
  providers: [PageService, SortService, FilterService, EditService, ToolbarService],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('grid', { static: false }) public grid!: GridComponent;

  constAPI_BASE = 'http://localhost:5000'; // Flask server endpoint
  public readonly API_BASE = 'http://localhost:5000'; // Flask server endpoint

  // --- Toolbar & settings ---
  public toolbar: ToolbarItems[] = ['Search', 'Add', 'Edit', 'Delete', 'Update', 'Cancel'];

  public editSettings: EditSettingsModel = {
    allowAdding: true,
    allowEditing: true,
    allowDeleting: true,
    mode: 'Dialog',
  };

  public pageSettings: PageSettingsModel = {
    pageSize: 12,
    pageSizes: [12, 25, 50, 100],
  };

  public filterSettings: FilterSettingsModel = { type: 'Excel' };

  public menuFilter = { type: 'Menu' };
  public checkBoxFilter = { type: 'CheckBox' };

  // --- dropdown data sources ---
  public statusDropDownData = [
    { text: 'Open', value: 'Open' },
    { text: 'In Progress', value: 'In Progress' },
    { text: 'Completed', value: 'Completed' },
    { text: 'Blocked', value: 'Blocked' },
  ];

  public priorityDropDownData = [
    { text: 'Low', value: 'Low' },
    { text: 'Medium', value: 'Medium' },
    { text: 'High', value: 'High' },
    { text: 'Critical', value: 'Critical' },
  ];

  // --- Edit params ---
  public statusEditParams = {
    dataSource: this.statusDropDownData,
    fields: { text: 'text', value: 'value' },
    placeholder: 'Select status',
    query: new Query(),
  };

  public priorityEditParams = {
    dataSource: this.priorityDropDownData,
    fields: { text: 'text', value: 'value' },
    placeholder: 'Select priority',
    query: new Query(),
  };

  // --- READ (GET) ---
  public fetchData = async (gridState: any) => {
    const stateWithCount = { requiresCounts: true, ...gridState };
    const url = `${this.API_BASE}/tasks?gridState=${encodeURIComponent(JSON.stringify(stateWithCount))}`;

    const response = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${text}`);
    }

    return (await response.json()) as { result: any[]; count: number };
  };

  public async dataStateChange(args: DataStateChangeEventArgs): Promise<void> {
    const gridState = {
      skip: args.skip,
      take: args.take,
      sorted: args.sorted,
      where: args.where,
      search: args.search,
    };

    const res = await this.fetchData(gridState);

    // Excel filter choices / search in popup
    const action: any = (args as any).action;
    if (
      action &&
      (
        action.requestType === 'filterchoicerequest' ||
        action.requestType === 'filterSearchBegin' ||
        action.requestType === 'stringfilterrequest'
      )
    ) {
      (args as any).dataSource(res.result);
    } else {
      // Bind main grid data: expects { result, count }
      if (this.grid) {
        this.grid.dataSource = res;
      }
    }
  }

  // --- CRUD (POST / PUT / DELETE) ---
  public async dataSourceChanged(args: DataSourceChangedEventArgs): Promise<void> {
    try {
      let response: Response | null = null;

      // Create
      if (args.action === 'add' && args.requestType === 'save') {
        response = await fetch(`${this.API_BASE}/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(args.data),
        });
        if (!response.ok) throw new Error('Create failed');
        await response.json();
        (args as any).endEdit();
        return;
      }

      // Update
      if (args.action === 'edit' && args.requestType === 'save') {
        const data: any = args.data;
        const id = data?.TaskId;
        response = await fetch(`${this.API_BASE}/tasks/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Update failed');
        await response.json();
        (args as any).endEdit();
        return;
      }

      // Delete
      if (args.requestType === 'delete') {
        const payload: any = args.data;
        const id = Array.isArray(payload) ? payload[0]?.TaskId : payload?.TaskId;
        response = await fetch(`${this.API_BASE}/tasks/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Delete failed');
        await response.json();
        (args as any).endEdit();
        return;
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Initial load
  public async ngAfterViewInit(): Promise<void> {
    const initialState = { skip: 0, take: 12, sorted: [], where: [], search: [] };
    try {
      const res = await this.fetchData(initialState);
      if (this.grid) {
        this.grid.dataSource = res; // { result, count }
      }
    } catch (e) {
      console.error(e);
    }
  }
}