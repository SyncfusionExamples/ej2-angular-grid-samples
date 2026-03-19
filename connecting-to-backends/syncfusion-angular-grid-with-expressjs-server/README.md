# Syncfusion Angular Grid with Express.js Server

A lightweight, production-ready pattern for binding **Express.js** server data to a **Syncfusion Angular Grid**. The sample supports complete CRUD (Create, Read, Update, Delete), server-side filtering, searching, sorting, and paging using Syncfusion **DataManager**.

## Key Features

- **Express.js Server Backend**: TypeScript-based RESTful API for robust server-side data processing
- **Syncfusion Angular Grid**: Built-in search, filter, sort, and paging capabilities
- **Complete CRUD Operations**: Add, edit, delete, and update records directly from the grid

## Prerequisites

  - Node.js: LTS version (v20.x or later)

  - npm/yarn: For package management.

  - Angular CLI: For creating and serving the Angular client application
  
## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd syncfusion-angular-grid-with-expressjs-server
   ```

2. **Run the application**

**Run the Express.js server**

```bash
   cd server
   npm install
   npm start
```

**Run the Angular client**

```bash
  cd client
  npm install
  ng serve
```

3. **Open the application**

   The server runs at http://localhost:3000
   Navigate to the Angular application in your browser (typically `http://localhost:4200`).

## Configuration

**Security Note**: For production environments, store sensitive credentials using:

- Environment variables

- Secure storage solutions (e.g., Azure Key Vault, AWS Secrets Manager)

## Project Layout

| File/Folder | Purpose |
|-------------|---------|
| `server/src/routes/patients.routes.ts` | Server-side route handling grid data operations |
| `server/src/controllers/patients.controller.ts` | Controller logic for CRUD operations |
| `server/src/utils/data.ts` | Entity model containing the data |
| `server/src/types/interface.ts` | TypeScript interfaces and types |
| `client/src/app/components/patients-grid/` | Contains the Grid configuration and component |

## Common Tasks

### Add a Record
1. Click the **Add** button in the toolbar
2. Fill in the form fields
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

## Reference
For detailed information, refer to the [Syncfusion Angular Grid documentation](https://ej2.syncfusion.com/angular/documentation/grid/getting-started).

## Steps to download GitHub samples using DownGit

1. **Open the DownGit Website**

    Go to the official DownGit tool: https://minhaskamal.github.io/DownGit

2. **Copy the GitHub URL**

    - Navigate to the sample folder you want to download and copy its URL.
    - Example : https://github.com/SyncfusionExamples/ej2-angular-grid-samples/tree/master/connecting-to-backends/syncfusion-angular-grid-with-expressjs-server

3. **Paste the URL into DownGit**  

    In the DownGit input box, paste the copied GitHub URL.

4. **Download the ZIP**

    - Click **Download**.
    - DownGit will generate a ZIP file of the selected folder, which you can save and extract locally.

5. **Reference** 
    
    For more details or to explore the project, visit the official [DownGit GitHub repository](https://github.com/MinhasKamal/DownGit).
