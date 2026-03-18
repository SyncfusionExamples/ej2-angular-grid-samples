import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  GridModule,
  PageService,
  SortService,
  FilterService,
  ToolbarService,
  EditService,
  SaveEventArgs,
  DialogEditEventArgs,
} from "@syncfusion/ej2-angular-grids";
import { DataManager, GraphQLAdaptor } from "@syncfusion/ej2-data";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, GridModule],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  providers: [
    PageService,
    SortService,
    FilterService,
    ToolbarService,
    EditService,
  ],
})
export class AppComponent {
  // DataManager + GraphQL adaptor
  public data!: DataManager;

  // Grid configs
  public pageSettings = { pageSize: 10, pageSizes: true };
  public checkboxFilter = { type: "CheckBox" };
  public toolbar: string[] = ["Add", "Edit", "Delete", "Update", "Cancel", "Search"];
  public editSettings = {
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    mode: "Normal",
    showDeleteConfirmDialog: true,
  };

  ngOnInit(){
     this.data = new DataManager({
      url: "http://localhost:5083/graphql",
      adaptor: new GraphQLAdaptor({
        response: {
          result: "orders.result",
          count: "orders.count",
        },
        query: `
          query GetOrders($datamanager: DataManagerInput) {
            orders(datamanager: $datamanager) {
              result {
                orderID
                customerID
                employeeID
                shipCountry
              }
              count
            }
          }
        `,
        getMutation: (action: string) => {
          if (action === "insert") {
            return `
              mutation CreateOrder($value: OrdersDetailsInput!) {
                addOrder(input: $value) {
                  orderID
                  customerID
                  employeeID
                  shipCountry
                }
              }
            `;
          }
          if (action === "update") {
            return `
              mutation UpdateOrder($key: Int!, $keyColumn: String, $value: OrdersDetailsInput!) {
                updateOrder(key: $key, keyColumn: $keyColumn, input: $value) {
                  orderID
                  customerID
                  employeeID
                  shipCountry
                }
              }
            `;
          }
          if (action === "remove") {
            return `
              mutation DeleteOrder($key: Int!) {
                deleteOrder(orderID: $key)
              }
            `;
          }
          return "";
        },
      }),
      crossDomain: true,
    });
  }
}
