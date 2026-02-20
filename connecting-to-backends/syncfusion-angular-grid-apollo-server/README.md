# Connecting the Syncfusion Angular Grid with Apollo GraphQL Backend

GraphQL is a query language that allows applications to request exactly the data needed, nothing more and nothing less. Unlike traditional REST APIs that return fixed data structures, GraphQL enables the client to specify the shape and content of the response.

**What is Apollo?**

Apollo Server is a widely used GraphQL server that simplifies creating efficient and scalable APIs. It offers a clear structure for defining schemas, handling queries, and connecting data sources, making it a strong choice for building modern GraphQL backends.

**Key GraphQL concepts:**

- **Queries**: A query is a request to read data. Queries do not modify data; they only retrieve it.
- **Mutations**: A mutation is a request to modify data. Mutations create, update, or delete records.
- **Resolvers**: Each query or mutation is handled by a resolver, which is a function responsible for fetching data or executing an operation. **Query resolvers** handle **read operations**, while **mutation resolvers** handle **write operations**.
- **Schema**: Defines the structure of the API. The schema describes available data types, the fields within those types, and the operations that can be executed. Query definitions specify the way data can be retrieved, and mutation definitions specify the way data can be modified.

## Prerequisites

| Software / Package          | Recommended version          | Purpose                                 |
|-----------------------------|------------------------------|--------------------------------------   |
| Node.js                     | 20.x LTS or later            | Runtime                                 |
| npm / yarn / pnpm           | npm 11.6.4 (latest)          | Package manager                         | 
| Angular CLI                 | 18.x (latest stable)         | Used to create and manage Angular applications |
| TypeScript                  | 5.x or later                 | Server‑side and client‑side type safety |


## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   ```

2. **Running the application**

### Run the Server:

- Run the below commands to install the depency packages of server and run the sevrer:
	```bash
	cd server
	npm install
	npm start
	```
- Access at `http://localhost:4000/`.

### Run the Client:

- Execute the below commands to install the depencies of client application and run it:
	```bash
	cd client
	npm install
	npm start
	```
- Open `http://localhost:4200/` in your browser.
- Verify: Load data, page/sort/filter, add/edit/delete expenses.


## Backend Configuration (Apollo + DataManagerInput)

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
| `server/src/schema.graphql` | Defines the GraphQL schema for the backend |
| `server/src/resolvers.ts` | Contains resolver functions for GraphQL queries and mutations |
| `GraphQLServer/src/resolvers.ts` | GraphQL resolvers implementation |
| `server/src/server.ts` | Sets up and starts the Apollo GraphQL server |
| `client/src/app/constants/expense-constants.ts`| Holds constant values used across the Angular app |
| `server/src/data.ts` | In‑memory expense dataset used by the GraphQL backend |
| `server/tsconfig.json` | TypeScript configuration for the server project |
| `server/package.json` | Server-side dependencies and scripts |
| `client/src/app/models/transaction-record.ts`|Transaction model definition |
| `client/src/app/app.component.ts` | Root Angular component logic |
| `client/src/app/app.component.html` | Root Angular component template |
| `client/src/styles.css`| Global styles including Syncfusion theme imports |
| `client/src/main.ts`| Application bootstrap file with Syncfusion license registration |
| `client/angular.json` | Angular workspace configuration |
| `client/package.json` | Client-side dependencies and scripts |

## Common Operations in the Grid

### Add a Record
1. Click **Add** in the grid toolbar
2. Fill out the dialog (expenseId, department, category, amount, etc.)
3. Click **Save** to create the record

### Edit a Record
1. Select a row → **Edit**
2. Modify fields → **Update**
3. Click Update

### Delete a Record
1. Select a row → **Delete**
2. Confirm deletion

### Search / Filter / Sort
- Use the **Search** box (toolbar) to match across configured columns
- Use **column filter icons** for equals/contains/date filters
- Click **column headers** to sort ascending/descending

## Reference
The [Syncfusion Angular Grid with Apollo server](https://ej2.syncfusion.com/angular/documentation/grid/connecting-to-backends/graphql-apollo-server) provides detailed directions in a clear, step-by-step format.