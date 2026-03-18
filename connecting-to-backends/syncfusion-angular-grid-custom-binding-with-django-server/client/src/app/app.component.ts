import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Query } from '@syncfusion/ej2-data';
import {
  GridModule,
  PageService,
  SortService,
  FilterService,
  EditService,
  ToolbarService,
  SearchService
} from '@syncfusion/ej2-angular-grids';
import type {
  DataSourceChangedEventArgs,
  DataStateChangeEventArgs,
  EditSettingsModel,
  ToolbarItems
} from '@syncfusion/ej2-grids';

import {
  fetchLendings,
  createLending,
  updateLending,
  deleteLending,
  LendingRecord
} from '../services/apiClient';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, GridModule],
  providers: [PageService, SortService, FilterService, EditService, ToolbarService, SearchService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  public data: { result: LendingRecord[]; count: number } = { result: [], count: 0 };

  public pageSettings = { pageSize: 10, pageSizes: [10, 20, 50, 100] };
  public toolbar: ToolbarItems[] = ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'Search'];
  public editSettings: EditSettingsModel = {
    allowAdding: true,
    allowEditing: true,
    allowDeleting: true,
  };

  public validationRules: Record<string, unknown> = { required: true };
  public lendingStatusParams = { params: { dataSource: ['Borrowed', 'Overdue', 'Returned'], query: new Query() } };

  ngOnInit(): void {
    const initialState = { skip: 0, take: 10 } as DataStateChangeEventArgs;
    void this.dataStateChange(initialState);
  }

  /** Loads data when Grid state changes (paging / sorting / filtering / searching). */
  public async dataStateChange(args: DataStateChangeEventArgs): Promise<void> {
    const gridState: DataStateChangeEventArgs = {
      skip: args.skip,
      take: args.take,
      sorted: args.sorted,
      where: args.where,
      search: args.search,
    } as DataStateChangeEventArgs;

    const res = await fetchLendings(gridState);

    if (
      (args as any).action && (args as any).dataSource &&
      ((args as any).action.requestType === 'filterchoicerequest' ||
       (args as any).action.requestType === 'filterSearchBegin' ||
       (args as any).action.requestType === 'stringfilterrequest')
    ) {
      (args as any).dataSource(res.result);
    } else {
      this.data = res;
    }
  }

  /** Handles CRUD actions (add/edit/delete) using custom data binding. */
  public async dataSourceChanged(args: DataSourceChangedEventArgs): Promise<void> {
    if (args.action === 'add' && args.requestType === 'save') {
      await createLending(args.data as LendingRecord);
    }

    if (args.action === 'edit' && args.requestType === 'save') {
      await updateLending(args.data as LendingRecord);
    }

    if (args.requestType === 'delete') {
      const batch = args.data as LendingRecord[];
      const id = batch && batch.length ? (batch[0] as any).record_id : undefined;
      if (id !== undefined) {
        await deleteLending(id);
      }
    }

    if (typeof (args as any).endEdit === 'function') {
      (args as any).endEdit();
    }
  }
}