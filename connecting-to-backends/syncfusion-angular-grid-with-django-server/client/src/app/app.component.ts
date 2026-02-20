
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataManager, UrlAdaptor } from '@syncfusion/ej2-data';
import {
  GridComponent,
  GridModule,
  EditSettingsModel,
  ToolbarItems,
  FilterSettingsModel,
  SelectionSettingsModel,
  PageService,
  SortService,
  FilterService,
  EditService,
  ToolbarService,
  SearchService,
  IFilter
} from '@syncfusion/ej2-angular-grids';

type DueState = 'returned' | 'overdue' | 'due' | 'today' | 'unknown';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, GridModule],
  providers: [
    PageService,
    SortService,
    FilterService,
    EditService,
    ToolbarService,
    SearchService
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  @ViewChild('grid') public grid!: GridComponent;

  public data!: DataManager;

  public pageSettings = { pageSize: 12, pageSizes: [10, 12, 20, 50, 100] };
  
  public filterSettings: FilterSettingsModel = { type: 'Excel' };
  public menuFilterSettings: IFilter = { type: 'Menu' };
  public checkBoxFilterSettings: IFilter = { type: 'CheckBox' };

  public toolbar: ToolbarItems[] = ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'Search'];

  public editSettings: EditSettingsModel = {
    allowAdding: true,
    allowEditing: true,
    allowDeleting: true,
  };

  public selectionSettings: SelectionSettingsModel = {
    type: 'Single',
    mode: 'Row'
  };

  public authorNameValidationRule = { required: true, minLength: 3, maxLength: 50 };
  public bookTitleValidationRule = { required: true, minLength: 1, maxLength: 100 };
  public ISBNValidationRule = { required: true, minLength: 10, maxLength: 13 };
  public genreValidationRule = { required: true };
  public borrowerNameValidationRule = { required: true, minLength: 3, maxLength: 50 };
  public borrowerEmailValidationRule = { required: true, email: true };
  public borrowDateValidationRule = { required: true };
  public expectedReturnDateValidationRule = { required: true };
  public lendingStatusValidationRule = { required: true };

  ngOnInit() {
    this.data = new DataManager({
      url: 'http://localhost:8000/api/lendings/',
      adaptor: new UrlAdaptor(),
      crossDomain: true
    });
  }

  // ===== Helpers =====
  private parseDate(d: any): Date | null {
    if (!d) return null;
    const dt = new Date(d);
    return isNaN(dt.getTime()) ? null : dt;
  }

  private stripTime(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  getDueMeta(row: any): { label: string; state: DueState } {
    const due = this.parseDate(row?.expected_return_date);
    const ret = this.parseDate(row?.actual_return_date);
    if (!due && !ret) return { label: '—', state: 'unknown' };
    if (ret) return { label: `Returned ${ret.toLocaleDateString()}`, state: 'returned' };

    if (!due) return { label: '—', state: 'unknown' };

    const today = this.stripTime(new Date());
    const d0 = this.stripTime(due);
    const diffDays = Math.floor((d0.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays > 0) return { label: `Due in ${diffDays} day${diffDays === 1 ? '' : 's'}`, state: 'due' };
    if (diffDays === 0) return { label: 'Due today', state: 'today' };
    return { label: `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'}`, state: 'overdue' };
  }

  getStatusClass(status?: string | null): string {
    const s = (status || '').toLowerCase();
    if (s === 'returned') return 'pill pill--returned';
    if (s === 'borrowed') return 'pill pill--borrowed';
    if (s === 'overdue')  return 'pill pill--overdue';
    if (s === 'lost')     return 'pill pill--lost';
    return 'pill';
  }

  getGenreClass(genre?: string | null): string {
    const g = (genre || '').toLowerCase();
    if (g === 'fantasy') return 'gchip g-fantasy';
    if (g === 'science fiction') return 'gchip g-scifi';
    if (g === 'mystery') return 'gchip g-mystery';
    if (g === 'thriller') return 'gchip g-thriller';
    if (g === 'romance') return 'gchip g-romance';
    if (g === 'historical') return 'gchip g-historical';
    if (g === 'non-fiction') return 'gchip g-nonfiction';
    if (g === 'biography') return 'gchip g-biography';
    if (g === 'young adult') return 'gchip g-ya';
    if (g === 'horror') return 'gchip g-horror';
    if (g === 'adventure') return 'gchip g-adventure';
    if (g === 'classic') return 'gchip g-classic';
    return 'gchip';
  }
}
