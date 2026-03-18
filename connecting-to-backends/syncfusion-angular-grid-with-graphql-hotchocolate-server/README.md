# HotChocolate GraphQL + Syncfusion Angular Grid (ASP.NET Core + Angular)

This sample demonstrates how to run an ASP.NET Core HotChocolate GraphQL backend together with an Angular client using the Syncfusion Angular Grid component to perform CRUD operations seamlessly.

## 1. Prerequisites

### Visual Studio 2022
ASP.NET Core workload required.

### Node.js 14 or later
Check:
```
node --version
```

## 2. Install Client‑Side Node Modules

1. Open folder:
```
angularapp1.client
```
2. Run:
```
npm install
```

## 3. Run the Solution from Visual Studio

1. Open:
```
AngularApp1.sln
```
2. Set `AngularApp1.Server` as startup project.
3. Press **F5** to run server + client.

The Grid will load data from the GraphQL endpoint:
```
https://localhost:<port>/graphql
```

## 4. Project Structure

### Server (AngularApp1.Server)
- **Program.cs**: Configures HotChocolate GraphQL server
- **GraphQL/**: Contains GraphQL queries, mutations, and types
- **Models/**: Data models
- **Controllers/**: API controllers

### Client (angularapp1.client)
- **src/**: Angular application source code
- **package.json**: Node.js dependencies including Syncfusion Angular Grid
- **angular.json**: Angular configuration

## Steps to download GitHub samples using DownGit

1. **Open the DownGit Website**

    Go to the official DownGit tool: https://minhaskamal.github.io/DownGit

2. **Copy the GitHub URL**

    - Navigate to the sample folder you want to download and copy its URL.
    - Example : https://github.com/SyncfusionExamples/ej2-angular-grid-samples/tree/master/connecting-to-backends/syncfusion-angular-grid-with-graphql-hotchocolate-server

3. **Paste the URL into DownGit**  

    In the DownGit input box, paste the copied GitHub URL.

4. **Download the ZIP**

    - Click **Download**.
    - DownGit will generate a ZIP file of the selected folder, which you can save and extract locally.

5. **Reference** 
    
    For more details or to explore the project, visit the official [DownGit GitHub repository](https://github.com/MinhasKamal/DownGit).
