// File: src/app/custom-adaptor.ts
import {
  DataManager,
  UrlAdaptor,
  Query,
  ReturnOption,
} from '@syncfusion/ej2-data';

export class CustomAdaptor extends UrlAdaptor {
  public override processResponse() {
    let i = 0;
    const original: any = super.processResponse.apply(this, arguments as any);
    // Adding serial number.
    if (original.result) {
      original.result.forEach((item: any) => (item.SNo = ++i));
    }
    return original;
  }

  public override beforeSend(
    dm: DataManager,
    request: Request,
    settings?: any,
  ): void {
    super.beforeSend(dm, request, settings);
  }

  public override insert(dm: DataManager, data: any, tableName?: string): any {
    return {
      url: `${(dm as any).dataSource['insertUrl']}`,
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(data),
    };
  }

  public override update(
    dm: DataManager,
    keyField: string,
    value: any,
    tableName?: string,
  ): any {
    return {
      url: `${(dm as any).dataSource['updateUrl']}`,
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(value),
    };
  }

  public override remove(
    dm: DataManager,
    keyField: string,
    value: any,
    tableName?: string,
  ): any {
    const keyValue =
      value && typeof value === 'object' ? value[keyField] : value;
    return {
      url: `${(dm as any).dataSource['removeUrl']}`,
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({ key: keyValue }),
    };
  }

  public override batchRequest(dm: DataManager, changes: any): any {
    return {
      url: `${(dm as any).dataSource['batchUrl']}`,
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({
        added: changes.addedRecords,
        changed: changes.changedRecords,
        deleted: changes.deletedRecords,
      }),
    };
  }
}
