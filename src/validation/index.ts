import { IJsonSchema, OpenAPIV3, OpenAPI } from 'openapi-types';
import { HttpRequest } from '@azure/functions';
import OpenAPIRequestValidator, {
  OpenAPIRequestValidatorArgs,
} from 'openapi-request-validator';
import OpenAPIResponseValidator from 'openapi-response-validator';
import * as api from '../api.json';

// validates request and response, should include all of this in your project

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getServerPath = (oapi: any): string => {
  return oapi.servers && oapi.servers.length > 0 ? oapi.servers[0].url : '';
};

const getMethod = (method: string | null): string => {
  return method ? method.toLowerCase() : '';
};

const getPath = (originalUrl: string, basePath: string): string => {
  return originalUrl.replace(basePath, '');
};

const getResource = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  api: Record<string, any>,
  path: string,
  method: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any => {
  return api.paths[path][method];
};

const buildRequestSchema = (
  requestBody: OpenAPIV3.RequestBodyObject,
  parameters: OpenAPI.Parameters,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schemas: IJsonSchema | any
): OpenAPIRequestValidatorArgs => {
  return {
    requestBody,
    parameters,
    schemas,
  };
};

const buildRequest = (req: HttpRequest): OpenAPI.Request => {
  return {
    headers: req.headers,
    body: req.body,
    params: req.params,
    query: req.query,
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateRequest = (req: HttpRequest): any => {
  const serverPath = getServerPath(api);
  const path = getPath(req.url, serverPath);
  const method = getMethod(req.method);
  const resource = getResource(api, path, method);
  const schema = buildRequestSchema(
    resource.requestBody,
    resource.parameters,
    api.components.schemas
  );

  const requestValidator = new OpenAPIRequestValidator(schema);
  const request = buildRequest(req);
  return requestValidator.validateRequest(request);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const buildResponseSchema = (responses: any, components: any): any => {
  return {
    responses,
    components,
  };
};

export const validateResponse = <T>(
  req: HttpRequest,
  res: T,
  status: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any => {
  const serverPath = getServerPath(api);
  const path = getPath(req.url, serverPath);
  const method = getMethod(req.method);
  const resource = getResource(api, path, method);
  const schema = buildResponseSchema(resource.responses, api.components);
  const responseValidator = new OpenAPIResponseValidator(schema);
  return responseValidator.validateResponse(status, res);
};
