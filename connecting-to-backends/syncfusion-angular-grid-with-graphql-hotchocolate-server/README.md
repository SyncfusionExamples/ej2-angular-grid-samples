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
