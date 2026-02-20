# Connecting the Syncfusion Angular Grid with GraphQL backend in Node.js

GraphQL is a query language that allows applications to request exactly the data needed, nothing more and nothing less. Unlike traditional REST APIs that return fixed data structures, GraphQL enables the client to specify the shape and content of the response.

**Key GraphQL concepts:**

- **Queries**: A query is a request to read data. Queries do not modify data; they only retrieve it.
- **Mutations**: A mutation is a request to modify data. Mutations create, update, or delete records.
- **Resolvers**: Each query or mutation is handled by a resolver, which is a function responsible for fetching data or executing an operation. **Query resolvers** handle **read operations**, while **mutation resolvers** handle **write operations**.
- **Schema**: Defines the structure of the API. The schema describes available data types, the fields within those types, and the operations that can be executed. Query definitions specify the way data can be retrieved, and mutation definitions specify the way data can be modified.

## Prerequisites

| Software / Package          | Recommended version          | Purpose                                 |
|-----------------------------|------------------------------|--------------------------------------   |
| Node.js                     | 20.x LTS or later            | Backend runtime                            |
| npm                         | Latest (11.x+)               | Package manager                         | 
| Angular CLI                 | 18.x or later                | Create and manage Angular apps |


## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   ```


2. **Running the application**
 **Run the GraphQL server**
- Run the below commands to run the server.
  ```bash
    cd GraphQLServer
    npm start
  ```
  The server is now running at http://localhost:4205/.

 **Run the client**
 - Execute the below commands to run the client application.
  ```bash
  cd GridClient
  npm start
  ```
- Open http://localhost:4200/ in the browser.

## Configuration

The Syncfusion `GraphQLAdaptor` converts grid actions → GraphQL queries/mutations automatically and expects the backend to follow a specific structure.

Below is the complete reference, extracted from your uploaded backend guide.

**DataManager**

The Syncfusion DataManager sends a single JSON payload containing all operation metadata.

| Parameters       | Description                                                                     |
| ---------------- | ------------------------------------------------------------------------------- |
| `requiresCounts` | If it is "true" then the total count of records will be included in response. |
| `skip`           | Holds the number of records to skip.                                            |
| `take`           | Holds the number of records to take.                                            |
| `sorted`         | Contains details about current sorted column and its direction.                 |
| `where`          | Contains details about current filter column name and its constraints.          |
| `group`          | Contains details about current Grouped column names.                            |
| `search`         | Contains details about current search data.                                     |
| `aggregates`     | Contains details about aggregate data.                                          |

---

## Project Layout

| File/Folder | Purpose |
|-------------|---------|
| `GraphQLServer/src/data.js` | Contains mock or seed data used by the GraphQL server |
| `GraphQLServer/src/resolvers.js` | GraphQL resolver functions that map schema fields to data |
| `GraphQLServer/src/schema.graphql` |GraphQL schema defining types, queries, and mutations |
| `GridClient/src/app/app.component.ts` | Root Angular component logic |
| `GridClient/src/app/app.component.html` | Root Angular component template |
| `GridClient/src/app/app.component.css` | Styles for the root component |
| `GridClient/src/styles.css` | Global styles for the Angular application |

---

## Common Tasks

### Add a Record
1. Click **Add** in the grid toolbar
2. Fill out fields (productName, productId, category, rating, etc.)
3. Click **Save** to create the record

### Edit a Record
1. Select a row → **Edit**
2. Modify fields → **Update**

### Delete a Record
1. Select a row → **Delete**
2. Confirm deletion

### Search / Filter / Sort
- Use the **Search** box (toolbar) to match across configured columns
- Use column filter icons for equals/contains/date filters
- Click column headers to sort ascending/descending

## Reference
The [user guide](https://ej2.syncfusion.com/angular/documentation/grid/connecting-to-backends/graphql-nodejs-server) provides detailed directions in a clear, step-by-step format.
