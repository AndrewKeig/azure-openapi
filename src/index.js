const { validateRequest, validateResponse } = require('./validation');

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
    const requestErrors = validateRequest(req);

    if (requestErrors) {
      context.res = responseHandler(400, requestErrors);
      return;
    }

    const data = getData();
    const responseErrors = validateResponse(req, data, 200);

    if (responseErrors) {
      context.res = responseHandler(400, responseErrors);
      return;
    }

    context.res = responseHandler(200, data);
  } catch (error) {
    context.res = responseHandler(500, { error: 'Unable to parse request' });
  }
};
