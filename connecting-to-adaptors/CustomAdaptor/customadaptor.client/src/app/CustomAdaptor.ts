import { setValue } from '@syncfusion/ej2-base';
import { DataManager, ODataV4Adaptor, Query } from '@syncfusion/ej2-data';

export class CustomAdaptor extends ODataV4Adaptor {

  public override processResponse(): object {
    let i = 0;
    const original: any = super.processResponse.apply(this, arguments as any);

    if (original?.result) {
      original.result.forEach((item: any) => setValue('SNo', ++i, item));
    }

    return original;
  }

  public override processQuery(dm: DataManager, query: Query): object {
    dm.dataSource.url = 'https://localhost:7014/odata/orders';
    query.addParams('Syncfusion in Angular Grid', 'true');

    return super.processQuery.apply(this, arguments as any);
  }

  public override beforeSend(dm: DataManager, request: any, settings: any): void {
    request.headers.set('Authorization', `Bearer ${(window as any).token}`);
    super.beforeSend(dm, request, settings);
  }
}
