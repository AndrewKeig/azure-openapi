const OpenAPIRequestValidator = require('openapi-request-validator').default;
const OpenAPIResponseValidator = require('openapi-response-validator').default;
const api = require('../api.json');

const getServerPath = (oapi) => {
  return oapi.servers && oapi.servers.length > 0 ? oapi.servers[0].url : '';
};

const getMethod = (method) => {
  return method ? method.toLowerCase() : '';
};

const getPath = (originalUrl, basePath) => {
  return originalUrl.replace(basePath, '');
};

const getResource = (path, method) => {
  return api.paths[path][method];
};

const validateRequest = (req) => {
  const serverPath = getServerPath(api);
  const path = getPath(req.originalUrl, serverPath);
  const method = getMethod(req.method);
  const resource = getResource(path, method);

  const schema = {
    requestBody: resource.requestBody,
    parameters: resource.parameters,
    schemas: api.components.schemas,
  };

  const requestValidator = new OpenAPIRequestValidator(schema);

  const request = {
    headers: req.headers,
    body: req.body,
    params: req.params,
    query: req.query,
  };

  return requestValidator.validateRequest(request);
};

const validateResponse = (req, res, status) => {
  const serverPath = getServerPath(api);
  const path = getPath(req.originalUrl, serverPath);
  const method = getMethod(req.method);
  const resource = getResource(path, method);

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
