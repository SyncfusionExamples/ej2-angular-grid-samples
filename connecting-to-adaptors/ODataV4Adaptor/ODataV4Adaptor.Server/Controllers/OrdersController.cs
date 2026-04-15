//using Microsoft.AspNetCore.Mvc;
//using Microsoft.AspNetCore.OData.Query;
//using Microsoft.AspNetCore.OData.Routing.Controllers;
//using ODataV4Adaptor.Server.Models;

//namespace OdataV4Adaptor.Server.Controllers
//{

//    public class OrdersController : Controller
//    {
//        /// <summary>
//        /// Retrieves all orders.
//        /// </summary>
//        /// <returns>The collection of orders.</returns>
//        [HttpGet]
//        [EnableQuery]
//        public IActionResult Get()
//        {
//            var data = OrdersDetails.GetAllRecords().AsQueryable();
//            return Ok(data);
//        }

//        /// <summary>
//        /// Inserts a new order to the collection.
//        /// </summary>
//        /// <param name="addRecord">The order to be inserted.</param>
//        /// <returns>It returns the newly inserted record detail.</returns>
//        [HttpPost]
//        [EnableQuery]
//        public IActionResult Post([FromBody] OrdersDetails addRecord)
//        {
//            if (addRecord == null)
//            {
//            return BadRequest("Null order");
//            }
//            OrdersDetails.GetAllRecords().Insert(0, addRecord);
//            return Json(addRecord);
//        }

//        /// <summary>
//        /// Updates an existing order.
//        /// </summary>
//        /// <param name="key">The ID of the order to update.</param>
//        /// <param name="updateRecord">The updated order details.</param>
//        /// <returns>It returns the updated order details.</returns>
//        [HttpPatch("{key}")]
//        public IActionResult Patch(int key, [FromBody] OrdersDetails updateRecord)
//        {
//            if (updateRecord == null)
//            {
//                return BadRequest("No records");
//            }
//            var existingOrder = OrdersDetails.GetAllRecords().FirstOrDefault(order => order.OrderID == key);
//            if (existingOrder != null)
//            {
//                // If the order exists, update its properties
//                existingOrder.CustomerID = updateRecord.CustomerID ?? existingOrder.CustomerID;
//                existingOrder.EmployeeID = updateRecord.EmployeeID ?? existingOrder.EmployeeID;
//                existingOrder.ShipCountry = updateRecord.ShipCountry ?? existingOrder.ShipCountry;
//            }
//            return Json(updateRecord);
//        }

//        /// <summary>
//        /// Deletes an order.
//        /// </summary>
//        /// <param name="key">The ID of the order to delete.</param>
//        /// <returns>It returns the deleted record detail</returns>
//        [HttpDelete("{key}")]
//        public IActionResult Delete(int key)
//        {
//            var deleteRecord = OrdersDetails.GetAllRecords().FirstOrDefault(order => order.OrderID == key);
//            if (deleteRecord != null)
//            {
//                OrdersDetails.GetAllRecords().Remove(deleteRecord);
//            }
//            return Json(deleteRecord);
//        }
//    }
//}

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using ODataV4Adaptor.Server.Models;

namespace ODataV4Adaptor.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class OrdersController : ODataController
    {
        // READ: Get all orders
        [HttpGet]
        [EnableQuery]
        public IActionResult Get()
        {
            var data = OrdersDetails.GetAllRecords().AsQueryable();
            return Ok(data);
        }

        // READ: Get single order by key
        [HttpGet("{key}")]
        [EnableQuery]
        public IActionResult Get(int key)
        {
            var order = OrdersDetails.GetAllRecords().FirstOrDefault(o => o.OrderID == key);
            if (order == null)
            {
                return NotFound();
            }
            return Ok(order);
        }

        // CREATE: Insert new order
        [HttpPost]
        [EnableQuery]
        public IActionResult Post([FromBody] OrdersDetails addRecord)
        {
            if (addRecord == null)
            {
                return BadRequest("Order cannot be null");
            }

            // Add to the beginning of the list
            OrdersDetails.GetAllRecords().Insert(0, addRecord);
            return Created(addRecord);
        }

        // UPDATE: Modify existing order
        [HttpPatch("{key}")]
        public IActionResult Patch(int key, [FromBody] OrdersDetails updatedOrder)
        {
            if (updatedOrder == null)
            {
                return BadRequest("Order data cannot be null");
            }

            var existingOrder = OrdersDetails.GetAllRecords().FirstOrDefault(o => o.OrderID == key);
            if (existingOrder == null)
            {
                return NotFound();
            }

            // Update properties (null-coalescing handles partial updates)
            existingOrder.CustomerID = updatedOrder.CustomerID ?? existingOrder.CustomerID;
            existingOrder.EmployeeID = updatedOrder.EmployeeID ?? existingOrder.EmployeeID;
            existingOrder.ShipCountry = updatedOrder.ShipCountry ?? existingOrder.ShipCountry;

            return Ok(existingOrder);
        }

        // DELETE: Remove order
        [HttpDelete("{key}")]
        public IActionResult Delete(int key)
        {
            var order = OrdersDetails.GetAllRecords().FirstOrDefault(o => o.OrderID == key);
            if (order == null)
            {
                return NotFound();
            }

            OrdersDetails.GetAllRecords().Remove(order);
            return NoContent(); // 204 No Content is standard for successful DELETE
        }
    }
}