using System.Collections.Generic;
using AngularApp1.Server.Models;

namespace AngularApp1.Server.GraphQL
{
    // Return type for Syncfusion GraphQLAdaptor
    // Must have 'result' and 'count' properties
    public class OrdersReturnType
    {
        public List<OrdersDetails> Result { get; set; } = new List<OrdersDetails>();
        public int Count { get; set; }
        public string? Aggregates { get; set; }
    }
}
