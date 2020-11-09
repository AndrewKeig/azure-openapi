const { validateRequest, validateResponse } = require('./validation');
const api = require('./api.json');

// mock data
const getData = () => {
  return { id: 12345, name: 'test' };
};

const responseHandler = (status, body) => {
  return { status, body };
};

// main handler
module.exports = async function handler(context, req) {
  try {
    const request = {
      url: req.url,
      method: req.method,
      data: {
        headers: req.headers,
        body: req.body,
        params: req.params,
        query: req.query,
      }
    };

    const requestErrors = validateRequest(api, request);

    if (requestErrors) {
      context.res = responseHandler(400, requestErrors);
      return;
    }

    const response = getData();
    const responseErrors = validateResponse(api, request, response, 200);

    if (responseErrors) {
      context.res = responseHandler(400, responseErrors);
      return;
    }

    context.res = responseHandler(200, response);
  } catch (error) {
    console.log(error)
    context.res = responseHandler(500, { error: 'Unable to parse request' });
  }
};
