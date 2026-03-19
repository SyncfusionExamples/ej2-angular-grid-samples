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

## Steps to download GitHub samples using DownGit

1. **Open the DownGit Website**

    Go to the official DownGit tool: https://minhaskamal.github.io/DownGit

2. **Copy the GitHub URL**

    - Navigate to the sample folder you want to download and copy its URL.
    - Example : https://github.com/SyncfusionExamples/ej2-angular-grid-samples/tree/1011064-EditReadMeFile/connecting-to-backends/syncfusion-angular-grid-with-graphql-server

3. **Paste the URL into DownGit**  

    In the DownGit input box, paste the copied GitHub URL.

4. **Download the ZIP**

    - Click **Download**.
    - DownGit will generate a ZIP file of the selected folder, which you can save and extract locally.

5. **Reference** 
    
    For more details or to explore the project, visit the official [DownGit GitHub repository](https://github.com/MinhasKamal/DownGit).

# Syncfusion Angular Grid with Next.js server

A lightweight, production-ready pattern for binding **Next.js** server data to a **Syncfusion Angular Grid**. The sample supports complete CRUD (Create, Read, Update, Delete), server-side filtering, searching, sorting, and paging using Syncfusion **DataManager**.

## Key Features

- **Syncfusion Angular Grid**: Built-in search, filter, sort, and paging capabilities
- **Complete CRUD Operations**: Add, edit, delete, and update records directly from the grid
- **Custom-Binding**: Full control over grid data operations (search, filter, sort, page and CRUD actions)

## Prerequisites

  - Node.js: LTS version (v20.x or later)

  - npm/yarn: For package management.

  - Angular CLI: For creating and serving the Angular client application
  
## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Connecting_to_Next_js_server
   ```

2. **Run the application**

**Run the Next.js server**

```bash
   cd next_js_server
   npm run dev
```

**Run the Angular client**

```bash
  cd angular_client
  ng serve
```

3. **Open the application**

   The server runs at http://localhost:3000
   Navigate to the local URL displayed in the terminal (typically `http://localhost:3000`).

## Configuration

**Security Note**: For production environments, store sensitive credentials using:

- Environment variables

- Secure storage solutions (e.g., Azure Key Vault, AWS Secrets Manager)

## Project Layout

| File/Folder | Purpose |
|-------------|---------|
| `next_js_server/app/api/health_care/route.ts` | Server-side API route handling grid data operations |
| `next_js_server/data/health_care_Entities.ts` | Entity model containing the data |
| `angular_client/src/app/doctors/doctors.ts` | Contains the Grid configuration |
| `angular_client/src/app/patients/patients.ts` | Dynamic route page |

## Common Tasks

### Add a Record
1. Click the **Add** button in the toolbar
2. Fill in the form fields (Doctor ID, Name, Specialty etc.)
3. Click **Update** button in the toolbar to save the record.

### Edit a Record
1. Select a row in the grid
2. Click the **Edit** button in the toolbar
3. Modify the required fields
4. Click **Update** to save changes

### Delete a Record
1. Select a row in the grid
2. Click the **Delete** button in the toolbar
3. Confirm the deletion

### Search Records
1. Use the **Search** box in the toolbar
2. Enter keywords to filter records (searches across all columns)

### Filter Records
1. Click the filter icon in any column header
2. Select filter criteria (equals, contains, greater than, etc.)
3. Click **Filter** to apply

### Sort Records
1. Click the column header to sort ascending
2. Click again to sort descending

### Routing
1. Click the **View Appointment Details** button in the template column of the Grid.
2. This will navigate to the appointment details page.

## Reference
The [user guide](https://ej2.syncfusion.com/angular/documentation/grid/connecting-to-backends/next-js-server) provides detailed directions in a clear, step-by-step format.

## Steps to download GitHub samples using DownGit

1. **Open the DownGit Website**

    Go to the official DownGit tool: https://minhaskamal.github.io/DownGit

2. **Copy the GitHub URL**

    - Navigate to the sample folder you want to download and copy its URL.
    - Example : https://github.com/SyncfusionExamples/ej2-angular-grid-samples/tree/master/connecting-to-backends/syncfusion-angular-grid-with-graphql-server

3. **Paste the URL into DownGit**  

    In the DownGit input box, paste the copied GitHub URL.

4. **Download the ZIP**

    - Click **Download**.
    - DownGit will generate a ZIP file of the selected folder, which you can save and extract locally.
5. **Reference** 
    
    For more details or to explore the project, visit the official [DownGit GitHub repository](https://github.com/MinhasKamal/DownGit).

