using Microsoft.AspNetCore.Mvc;
using WebMethodAdaptor.Server.Models;
using Syncfusion.EJ2.Base;

namespace WebMethodAdaptor.Server.Controllers
{
    public class HomeController : Controller
    {
        public object Post([FromBody] DataManagerRequest value)
        {
            IQueryable<OrdersDetails> DataSource = GetOrderData().AsQueryable();
            QueryableOperation queryableOperation = new QueryableOperation(); // Initialize QueryableOperation instance
            var val = value;
            // Handling Sorting operation
            //if (DataManagerRequest.Sorted != null && DataManagerRequest.Sorted.Count > 0)
            //{
            //    DataSource = queryableOperation.PerformSorting(DataSource, DataManagerRequest.Sorted);
            //}
            int totalRecordsCount = DataSource.Count();
            return new { result = DataSource, count = totalRecordsCount };
        }

        public List<OrdersDetails> GetOrderData()
        {
            var data = OrdersDetails.GetAllRecords().ToList();
            return data;
        }
    }
}
