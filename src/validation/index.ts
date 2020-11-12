/* eslint-disable @typescript-eslint/no-explicit-any */
import { IJsonSchema, OpenAPIV3, OpenAPI } from 'openapi-types';
import OpenAPIRequestValidator, {
  OpenAPIRequestValidatorArgs,
} from 'openapi-request-validator';
import OpenAPIResponseValidator from 'openapi-response-validator';

export declare type HttpMethod =
  | 'GET'
  | 'POST'
  | 'DELETE'
  | 'HEAD'
  | 'PATCH'
  | 'PUT'
  | 'OPTIONS'
  | 'TRACE'
  | 'CONNECT';

export interface HttpRequest {
  method: HttpMethod | null;
  url: string;
  headers: {
    [key: string]: string;
  };
  query: {
    [key: string]: string;
  };
  params: {
    [key: string]: string;
  };
  body?: any;
  rawBody?: any;
}

function getServerPath(oapi: any): string {
  return oapi.servers && oapi.servers.length > 0 ? oapi.servers[0].url : '';
}

function getMethod(method: string | null): string {
  return method ? method.toLowerCase() : '';
}

function getPath(originalUrl: string, basePath: string): string {
  return originalUrl.replace(basePath, '');
}

function getResource(
  api: Record<string, any>,
  path: string,
  method: string
): any {
  if (!api.paths[path]) {
    throw new Error(`resource ${path} does not exist`);
  }

  if (!api.paths[path][method]) {
    throw new Error(`resource method ${path} ${method} does not exist`);
  }

  return api.paths[path][method];
}

function buildRequestSchema(
  requestBody: OpenAPIV3.RequestBodyObject,
  parameters: OpenAPI.Parameters,
  schemas: IJsonSchema | any
): OpenAPIRequestValidatorArgs {
  return {
    requestBody,
    parameters,
    schemas,
  };
}

function buildRequest(req: HttpRequest): OpenAPI.Request {
  return {
    headers: req.headers,
    body: req.body,
    params: req.params,
    query: req.query,
  };
}

function buildResponseSchema(responses: any, components: any): any {
  return {
    responses,
    components,
  };
}

export function validateRequest(api: any, req: HttpRequest): any {
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
}

export function validateResponse(
  api: any,
  req: HttpRequest,
  res: any,
  status: number
): any {
  const serverPath = getServerPath(api);
  const path = getPath(req.url, serverPath);
  const method = getMethod(req.method);
  const resource = getResource(api, path, method);
  const schema = buildResponseSchema(resource.responses, api.components);
  const responseValidator = new OpenAPIResponseValidator(schema);
  return responseValidator.validateResponse(status, res);
}
