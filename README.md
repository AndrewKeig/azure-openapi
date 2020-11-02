# user-api

### Introduction
This repository contains a REST API related to the user bounded context.  The API consists of multiple azure functions.

### Resources

The user-api contains the following endpoints:


#### Get a single user
```
GET /api/users/:id
```

#### Get a list of users
```
GET /api/users/
```

### Tools

This codebase uses the following dependencies:

- Node.js, version 12.
- Typescript, version 3.

Please install node using nvm

- `https://github.com/nvm-sh/nvm`


### Setup

#### VS Code

Install the following extensions:

- Azure Account
- Azure Cosmos DB
- Azure Functions
- EditorConfig for VS Code
- ESLint
- Prettier


#### Dependencies

You can install dependencies with the following:

`npm install`


#### Environment variables

You will need a `.env` file, the contents can be found in azure under

`project-name/settings/keys`

The following keys are required:

- URI
- PRIMARY_KEY
- SECONDARY_KEY
- PRIMARY_CONNECTION_STRING
- SECONDARY_CONNECTION_STRING



### Development

In order to develop on this repository, run the following commands:

To build the project, (first time):

`npm run build`

To watch for code changes:

`npm run build-watch`

To start the function

`npm start`

### Test

`npm test`

### Code coverage

`npm run coverage`

### Lint

We are using eslint,

`npm run lint`
