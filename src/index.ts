import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { TenantUser, ErrorResponse, Response } from '../src/interfaces';
import { validateRequest, validateResponse } from '../src/validation';
import { errorResponse, responseHandler } from '../src/services/response';
import { getData } from '../src/query';

const getHandler = async (
  context: Context,
  req: HttpRequest,
  func: Function
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<Response<TenantUser> | Response<ErrorResponse>> => {
  try {
    const requestErrors = validateRequest(req);

    if (requestErrors) {
      return responseHandler<ErrorResponse>(400, requestErrors);
    }

    const data = func();

    const responseErrors = validateResponse<TenantUser>(req, data, 200);

    if (responseErrors) {
      return responseHandler<ErrorResponse>(400, responseErrors);
    }

    return responseHandler<TenantUser>(200, data);
  } catch (err) {
    return responseHandler<ErrorResponse>(500, errorResponse(err));
  }
};

const httpTrigger: AzureFunction = async function (
  context: Context,
  request: HttpRequest
): Promise<void> {
  context.res = await getHandler(context, request, getData);
};

export default httpTrigger;
