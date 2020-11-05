# azure-openapi

This repo contains a sample api which demonstrates, how to use openapi 3.0/swagger, with azure to validate the request data and response data of a request.

This repo contains two branches, one in js one in ts.

## search tenant users

`POST http://localhost:7071/v1/tenants/users`

### Valid request

```
{
    "limit": 10,
    "searchText": "test"
}
```

### Invalid request

```
{
    "limit": "10",
    "searchText": "test"
}
```

### Invalid request

```
{
    "searchText": "test"
}
```
