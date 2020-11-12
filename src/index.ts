import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { TenantUser, ErrorResponse, Response } from '../src/interfaces';
import { validateRequest, validateResponse } from '../src/validation';
import { errorResponse, responseHandler } from '../src/services/response';
import { getData } from '../src/query';
import * as api from './api.json';

// generic get  data handler
const getHandler = async (
  context: Context,
  req: HttpRequest,
  func: Function
): Promise<Response<TenantUser> | Response<ErrorResponse>> => {
  try {
    //validate the request
    const requestErrors = validateRequest(api, req);

    // check
    if (requestErrors) {
      return responseHandler<ErrorResponse>(400, requestErrors);
    }

    // execute the get date func
    const data = func();

    // validate the response
    const responseErrors = validateResponse(api, req, data, 200);

    // check if response returns errors
    if (responseErrors) {
      return responseHandler<ErrorResponse>(400, responseErrors);
    }

    // return valid request/response
    return responseHandler<TenantUser>(200, data);
  } catch (err) {
    return responseHandler<ErrorResponse>(500, errorResponse(err.message));
  }
};

// route
const httpTrigger: AzureFunction = async function (
  context: Context,
  request: HttpRequest
): Promise<void> {
  context.res = await getHandler(context, request, getData);
};

export default httpTrigger;
