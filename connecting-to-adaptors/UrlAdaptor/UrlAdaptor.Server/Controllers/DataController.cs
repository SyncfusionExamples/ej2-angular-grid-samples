using Microsoft.AspNetCore.JsonPatch.Operations;
using Microsoft.AspNetCore.Mvc;
using Syncfusion.EJ2.Base;
using UrlAdaptor.Server.Models;
using System.Collections;

namespace UrlAdaptor.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DataController : ControllerBase
    {
        /// <summary>
        /// Main endpoint for data requests.
        /// Handles initial load and all operations (paging, filtering, sorting, etc.)
        /// </summary>
        [HttpPost]
        public object Post([FromBody] DataManagerRequest DataManagerRequest)
        {
            // Retrieve data from the data source (e.g., database).
            IEnumerable<OrdersDetails> DataSource = GetOrderData().AsEnumerable();

            // Initialize DataOperation instance.
            DataOperations operation = new DataOperations();

            // Apply server-side operations here (will be added later).
            // For now, return all data with count.

            // Handling filtering operation.
            if (DataManagerRequest.Where != null && DataManagerRequest.Where.Count > 0)
            {                
                DataSource = operation.PerformFiltering(DataSource, DataManagerRequest.Where, DataManagerRequest.Where[0].Condition);
            }

            // Handling searching operation.
            if (DataManagerRequest.Search != null && DataManagerRequest.Search.Count > 0)
            {
                DataSource = operation.PerformSearching(DataSource, DataManagerRequest.Search);
            }

            // Handling sorting operation.
            if (DataManagerRequest.Sorted != null && DataManagerRequest.Sorted.Count > 0)
            {
                DataSource = operation.PerformSorting(DataSource, DataManagerRequest.Sorted);
            }

            // Calculate aggregates on the entire dataset instead of just the page.
            List<string> fields = new List<string>();
            if (DataManagerRequest.Aggregates != null)
            {
                // Process the aggregates on the full dataset.
                for (var i = 0; i < DataManagerRequest.Aggregates.Count; i++)
                    fields.Add(DataManagerRequest.Aggregates[i].Field);
            }
            IEnumerable<object> aggregateValue = ((IEnumerable<object>)operation.PerformSelect(DataSource, fields)).ToList();

            // Get the total records count.
            int totalRecordsCount = DataSource.Count();

            // Handling paging operation.
            if (DataManagerRequest.Skip != 0)
            {
                DataSource = operation.PerformSkip(DataSource, DataManagerRequest.Skip);
            }
            if (DataManagerRequest.Take != 0)
            {
                DataSource = operation.PerformTake(DataSource, DataManagerRequest.Take);
            }

            IEnumerable groupedData = null;
            // Handling grouping operation.
            if (DataManagerRequest.Group != null)
            {
                groupedData = operation.PerformGrouping<OrdersDetails>(DataSource, DataManagerRequest);
            }
            // Return the result and count object.
            return DataManagerRequest.RequiresCounts ? new JsonResult(new
            {
                result = (groupedData == null) ? DataSource : groupedData,
                groupDs = groupedData,
                aggregate = aggregateValue,
                count = totalRecordsCount
            }) : new JsonResult(DataSource);
        }

        /// <summary>
        /// Helper method to retrieve order data.
        /// In production, replace with database query:
        /// return _dbContext.Orders.ToList();
        /// </summary>
        [HttpGet]
        public List<OrdersDetails> GetOrderData()
        {
            return OrdersDetails.GetAllRecords().ToList();
        }

        /// <summary>
        /// Inserts a new data item into the data collection.
        /// </summary>
        /// <param name="newRecord">It contains the new record detail that needs to be inserted.</param>
        /// <returns>Returns void</returns>
        [HttpPost]
        [Route("Insert")]
        public void Insert([FromBody] CRUDModel<OrdersDetails> newRecord)
        {
            if (newRecord.value != null)
            {
                OrdersDetails.GetAllRecords().Insert(0, newRecord.value);
            }
        }

        /// <summary>
        /// Update an existing data item from the data collection.
        /// </summary>
        /// <param name="updatedRecord">It contains the updated record detail that needs to be updated.</param>
        /// <returns>Returns void</returns>
        [HttpPost]
        [Route("Update")]
        public void Update([FromBody] CRUDModel<OrdersDetails> updatedRecord)
        {
            var updatedOrder = updatedRecord.value;
            var data = OrdersDetails.GetAllRecords().FirstOrDefault(existingOrder => existingOrder.OrderID == updatedOrder.OrderID);
            if (data != null)
            {
                // Update the existing record.
                data.OrderID = updatedOrder.OrderID;
                data.CustomerID = updatedOrder.CustomerID;
                data.ShipCity = updatedOrder.ShipCity;
                data.ShipCountry = updatedOrder.ShipCountry;
                // Update other properties similarly.
            }
        }

        /// <summary>
        /// Remove a specific data item from the data collection.
        /// </summary>
        /// <param name="deletedRecord">It contains the specific record detail that needs to be removed.</param>
        /// <returns>Returns void</returns>
        [HttpPost]
        [Route("Remove")]
        public void Remove([FromBody] CRUDModel<OrdersDetails> deletedRecord)
        {
            int orderId = int.Parse(deletedRecord.key.ToString());
            var data = OrdersDetails.GetAllRecords().FirstOrDefault(orderData => orderData.OrderID == orderId);
            if (data != null)
            {
                // Remove the record from the data collection.
                OrdersDetails.GetAllRecords().Remove(data);
            }
        }

        [HttpPost]
        [Route("BatchUpdate")]
        public IActionResult BatchUpdate([FromBody] CRUDModel<OrdersDetails> batchOperation)
        {
            if (batchOperation.added != null)
            {
                foreach (var addedOrder in batchOperation.added)
                {
                    OrdersDetails.GetAllRecords().Insert(0, addedOrder);
                }
            }
            if (batchOperation.changed != null)
            {
                foreach (var changedOrder in batchOperation.changed)
                {
                    var existingOrder = OrdersDetails.GetAllRecords().FirstOrDefault(or => or.OrderID == changedOrder.OrderID);
                    if (existingOrder != null)
                    {
                        existingOrder.CustomerID = changedOrder.CustomerID;
                        existingOrder.ShipCity = changedOrder.ShipCity;
                        // Update other properties as needed.
                    }
                }
            }
            if (batchOperation.deleted != null)
            {
                foreach (var deletedOrder in batchOperation.deleted)
                {
                    var orderToDelete = OrdersDetails.GetAllRecords().FirstOrDefault(or => or.OrderID == deletedOrder.OrderID);
                    if (orderToDelete != null)
                    {
                        OrdersDetails.GetAllRecords().Remove(orderToDelete);
                    }
                }
            }
            return new JsonResult(batchOperation);
        }

        [HttpPost]
        [Route("CrudUpdate")]
        public void CrudUpdate([FromBody] CRUDModel<OrdersDetails> request)
        {
            if (request.action == "update")
            {
                var orderValue = request.value;
                OrdersDetails existingRecord = OrdersDetails.GetAllRecords().Where(or => or.OrderID == orderValue.OrderID).FirstOrDefault();
                existingRecord.OrderID = orderValue.OrderID;
                existingRecord.CustomerID = orderValue.CustomerID;
                existingRecord.ShipCity = orderValue.ShipCity;
            }
            else if (request.action == "insert")
            {
                OrdersDetails.GetAllRecords().Insert(0, request.value);
            }
            else if (request.action == "remove")
            {
                OrdersDetails.GetAllRecords().Remove(OrdersDetails.GetAllRecords().Where(or => or.OrderID == int.Parse(request.key.ToString())).FirstOrDefault());
            }
        }

        public class CRUDModel<T> where T : class
        {
            public string? action { get; set; }
            public string? keyColumn { get; set; }
            public object? key { get; set; }
            public T? value { get; set; }
            public List<T>? added { get; set; }
            public List<T>? changed { get; set; }
            public List<T>? deleted { get; set; }
            public IDictionary<string, object>? @params { get; set; }
        }
    }
}