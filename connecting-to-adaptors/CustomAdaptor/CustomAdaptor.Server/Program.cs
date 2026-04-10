using CustomAdaptor.Server.Models;
using Microsoft.AspNetCore.OData;
using Microsoft.OData.ModelBuilder;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Create an ODataConventionModelBuilder to build the OData model.
var modelBuilder = new ODataConventionModelBuilder();

// Register the "Orders" entity set with the OData model builder.
// "Orders" will be the name used in URLs (e.g., /odata/Orders).
modelBuilder.EntitySet<OrdersDetails>("Orders");

// Add controllers with OData support to the service collection.
builder.Services.AddControllers().AddOData(
    options => options
        .Select()    // Enables $select to choose specific fields.
        .Filter()    // Enables $filter for filtering data.
        .OrderBy()   // Enables $orderby for sorting.
        .Expand()    // Enables $expand for related data.
        .Count()     // Enables $count to get total record count.
        .SetMaxTop(100) // Limits maximum records per request.
        .AddRouteComponents("odata", modelBuilder.GetEdmModel())); // Maps routes with "odata" prefix.

// Add CORS support (required for Angular app to call API).
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

var app = builder.Build();
app.UseCors();
app.UseDefaultFiles();
app.MapStaticAssets();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
