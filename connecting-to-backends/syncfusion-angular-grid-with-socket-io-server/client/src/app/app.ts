import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GridModule,
  PageService,
  SortService,
  FilterService,
  EditService,
  ToolbarService,
  SearchService,
  ResizeService,
  GridComponent,
  DataStateChangeEventArgs,
  DataSourceChangedEventArgs,
} from '@syncfusion/ej2-angular-grids';
import { io, Socket } from 'socket.io-client';
import { DataUtil, Query } from '@syncfusion/ej2-data';
import { DEPARTMENTS, LOCATIONS } from './constants';
import { count } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, GridModule],
  providers: [PageService, SortService, FilterService, EditService, ToolbarService, SearchService, ResizeService],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('grid') grid!: GridComponent;

  // ── Grid settings ────────────────────────────────────────────────────────
  editSettings = {
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
  };

  toolbarItems = ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'Search'];
  filterSettings = { type: 'Excel' as const };
  pageSettings = { pageSize: 10, pageSizes: true };
  departmentParams = {
    params: {
      dataSource: DEPARTMENTS,
      query: new Query()
    }
  }
  locationParams = {
    params: {
      dataSource: LOCATIONS,
      query: new Query()
    }
  }

  // ── Socket.IO state ──────────────────────────────────────────────────────
  connected = false;
  clientCount = 0;
  syncFlash = false;

  private socket!: Socket;
  private syncFlashTimer: ReturnType<typeof setTimeout> | null = null;
  // Flag: becomes true after the grid view is ready for the initial load
  private viewReady = false;
  private socketReady = false;
  // Flag: prevents recursive socket calls when applying remote updates
  // private isApplyingRemoteUpdate = false;

  // ── Wraps socket.emit as an awaitable Promise via acknowledgment callback
  private socketEmit<T>(event: string, data: unknown): Promise<T> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`Socket timeout on "${event}"`)), 10_000);
      this.socket.emit(event, data, (response: T) => {
        clearTimeout(timer);
        resolve(response);
      });
    });
  }

  // ── Manually fire the initial page request ───────────────────────────────
  private loadInitialData(): void {
    if (!this.viewReady || !this.socketReady) return;
    const initialState = {
      skip: 0,
      take: this.pageSettings.pageSize,
    } as DataStateChangeEventArgs;
    this.dataStateChange(initialState);
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.loadInitialData();
  }

  ngOnInit(): void {
    this.socket = io('http://localhost:5000', { transports: ['websocket'] });

    this.socket.on('connect', () => {
      this.connected = true;
      this.socketReady = true;
      this.loadInitialData();
    });

    this.socket.on('disconnect', () => {
      this.connected = false;
      this.socketReady = false;
    });

    // ★ Key Socket.IO use-case:
    // listening on server side broadcast for specific changes (add/edit/delete)
    // and applying them without interrupting current user operations
    this.socket.on('dataChanged', (changes: { added?: any; edited?: any; deleted?: { deletedRecordsPage: number }, count: number }) => {
      if (!this.grid?.dataSource) return;
      
      let dataSource = this.grid.dataSource as { result: any[]; count: number };
      dataSource = { result: structuredClone(dataSource.result), count: dataSource.count };

      if (!dataSource.result) return;
      
      // Set flag to prevent recursive socket calls
      // this.isApplyingRemoteUpdate = true;

      const pager = this.grid.pagerModule.pagerObj;
      
      try {
        // Handle added record
        if (changes.added) {
          const isLastPage = pager.currentPage === pager.totalPages;
          const canAppend = dataSource.result.length < (this.grid.pageSettings as any).pageSize;

          if (isLastPage && canAppend) {
            this.grid.isEdit && this.grid.closeEdit();
            this.grid.refresh();
          } else {
            pager.totalRecordsCount = changes.count;
          }
        }
        
        // Handle edited record
        if (changes.edited) {
          if (this.grid.isEdit) {
            const editedRowEle = this.grid.editModule.formObj.element.closest('tr') as HTMLTableRowElement;
            const rowInfo = this.grid.getRowInfo(editedRowEle) as any;
            const editedRowID = rowInfo.rowData.EmployeeID;

            if (editedRowID === changes.edited.EmployeeID) {
              this.grid.closeEdit();
            } 

            this.grid.setRowData(changes.edited.EmployeeID, changes.edited);
          }
        }
        
        // Handle deleted record
        if (changes.deleted !== undefined) {
          if (pager.currentPage >= changes.deleted.deletedRecordsPage) {
            this.grid.isEdit && this.grid.closeEdit();
            this.grid.refresh();
          } else {
            pager.totalRecordsCount = changes.count;
          }
        }
      } catch (error) {
        console.error(error);
      }
      
      // Show sync flash indicator
      this.syncFlash = true;
      if (this.syncFlashTimer) clearTimeout(this.syncFlashTimer);
      this.syncFlashTimer = setTimeout(() => (this.syncFlash = false), 1500);
    });

    this.socket.on('clientCount', (count: number) => {
      this.clientCount = count;
    });
  }

  ngOnDestroy(): void {
    this.socket?.disconnect();
    if (this.syncFlashTimer) clearTimeout(this.syncFlashTimer);
  }

  // ── READ — triggered by every grid state change (page / sort / filter / search) ──
  async dataStateChange(args: DataStateChangeEventArgs): Promise<void> {
    const params = {
      skip:   args.skip,
      take:   args.take,
      sorted: args.sorted,
      where:  args.where,
      search: args.search,
    };

    const res = await this.socketEmit<{ result: object[]; count: number }>('readData', params);

    if (DataUtil && DataUtil.parse && DataUtil.parse.parseJson)
    res.result = DataUtil.parse.parseJson(res.result);

    // Excel-filter popup requests its own distinct data source via a callback
    const action: any = (args as any).action;
    if (
      action &&
      (
        action.requestType === 'filterchoicerequest' ||
        action.requestType === 'filterSearchBegin'   ||
        action.requestType === 'stringfilterrequest'
      )
    ) {
      (args as any).dataSource(res.result);
    } else {
      this.grid.dataSource = res;           // { result, count } update grid data
    }
  }

  // ── CRUD — triggered after the user confirms add / edit / delete ──────────
  async dataSourceChanged(args: DataSourceChangedEventArgs): Promise<void> {
    // Skip if this is a remote update (to prevent recursive socket calls)
    // if (this.isApplyingRemoteUpdate) {
    //   return;
    // }
    
    const data: any = args.data;

    // INSERT
    if (args.action === 'add' && args.requestType === 'save') {
      await this.socketEmit('crudAction', { action: 'insert', value: data });
      (args as any).endEdit();
    }

    // UPDATE
    if (args.action === 'edit' && args.requestType === 'save') {
      await this.socketEmit('crudAction', { action: 'update', value: data });
      (args as any).endEdit();
    }

    // DELETE
    if (args.requestType === 'delete') {
      const record = Array.isArray(data) ? data[0] : data;
      await this.socketEmit('crudAction', {
        action: 'remove',
        key:    record?.EmployeeID,
        value:  record,
        currentPage: this.grid.pagerModule.pagerObj.currentPage,
      });
      (args as any).endEdit();
    }
  }
}
