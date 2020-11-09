const OpenAPIRequestValidator = require('openapi-request-validator').default;
const OpenAPIResponseValidator = require('openapi-response-validator').default;

//include all of these functions. in your project.

const getServerPath = (oapi) => {
  return oapi.servers && oapi.servers.length > 0 ? oapi.servers[0].url : '';
};

const getMethod = (method) => {
  return method ? method.toLowerCase() : '';
};

const getPath = (url, basePath) => {
  return url.replace(basePath, '');
};

const getResource = (api, path, method) => {
  return api.paths[path][method];
};

const validateRequest = (api, req) => {
  const serverPath = getServerPath(api);
  const path = getPath(req.url, serverPath);
  const method = getMethod(req.method);
  const resource = getResource(api, path, method);

  const schema = {
    requestBody: resource.requestBody,
    parameters: resource.parameters,
    schemas: api.components.schemas,
  };

  const requestValidator = new OpenAPIRequestValidator(schema);
  return requestValidator.validateRequest(req.data);
};

const validateResponse = (api, req, res, status) => {
  const serverPath = getServerPath(api);
  const path = getPath(req.url, serverPath);
  const method = getMethod(req.method);
  const resource = getResource(api, path, method);

  const schema = {
    responses: resource.responses,
    components: api.components,
  };

  const responseValidator = new OpenAPIResponseValidator(schema);
  const validationError = responseValidator.validateResponse(status, res);

  return validationError;
};

module.exports = {
  validateRequest,
  validateResponse,
};
