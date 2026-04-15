using Microsoft.AspNetCore.Mvc;
using RemoteSaveAdaptor.Server.Models;

namespace RemoteSaveAdaptor.Server.Controllers
{
    [ApiController]
    public class OrdersController : Controller
    {
        [HttpPost]
        [Route("api/[controller]")]
        public object Post()
        {
            // Retrieve data from the data source (e.g., database)
            IQueryable<OrdersDetails> DataSource = GetOrderData().AsQueryable();

            // Get the total records count
            int totalRecordsCount = DataSource.Count();

            // Return data based on the request
            return new { result = DataSource, count = totalRecordsCount };
        }

        [HttpGet]
        [Route("api/[controller]")]
        public List<OrdersDetails> GetOrderData()
        {
            var data = OrdersDetails.GetAllRecords().ToList();
            return data;
        }

        [HttpPost]
        [Route("api/Orders/Insert")]
        public ActionResult Insert([FromBody] CRUDModel<OrdersDetails> newRecord)
        {
            if (newRecord.value !=null)
            {
                OrdersDetails.GetAllRecords().Insert(0, newRecord.value);
            }

            return new JsonResult(newRecord.value);
        }

        [HttpPost]
        [Route("api/Orders/Update")]
        public object Update([FromBody] CRUDModel<OrdersDetails> updatedRecord)
        {
            var updatedOrder = updatedRecord.value;
            if (updatedOrder != null)
            {
                var data = OrdersDetails.GetAllRecords().FirstOrDefault(or => or.OrderID == updatedOrder.OrderID);
                if (data != null)
                {
                    // Update the existing record
                    data.OrderID = updatedOrder.OrderID;
                    data.CustomerID = updatedOrder.CustomerID;
                    data.Freight = updatedOrder.Freight;
                    data.ShipCity = updatedOrder.ShipCity;
                    data.ShipCountry = updatedOrder.ShipCountry;
                    data.Verified = updatedOrder.Verified;

                    // Update other properties similarly
                }
            }
            return updatedRecord;
        }

        [HttpPost]
        [Route("api/Orders/Remove")]
        public object Remove([FromBody] CRUDModel<OrdersDetails> deletedRecord)
        {
            int orderId = int.Parse(deletedRecord.key.ToString()); // get key value from the deletedRecord
            var data = OrdersDetails.GetAllRecords().FirstOrDefault(orderData => orderData.OrderID == orderId);
            if (data != null)
            {
                // Remove the record from the data collection
                OrdersDetails.GetAllRecords().Remove(data);
            }
            return deletedRecord;
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
