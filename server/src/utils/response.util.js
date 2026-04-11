export function success(res, data = {}, message = "Success") {
  sendResponse(res, 200, true, message, data);
}

export function created(res, data = {}, message = "successfully created") {
  sendResponse(res, 201, true, message, data);
}

export function updated(res, data = {}, message = "successfully updated") {
  sendResponse(res, 200, true, message, data);
}

export function deleted(res, data = {}, message = "successfully deleted") {
  sendResponse(res, 200, true, message, data);
}

export function notFound(res, data = {}, message = "Page not found") {
  sendResponse(res, 404, false, message, data);
}

export function badRequest(res, data = {}, message = "Bad request") {
  sendResponse(res, 400, false, message, data);
}

export function internalError(res , data ={}, message = "Internal server error") {
  sendResponse(res, 500, false, message, data);
}

export function customError(res , data ={}, status = 500, message = "Error") {
  sendResponse(res, status, false, message, data);
}

function sendResponse(res, status, success, message, data = {}, error = null) {
  return res.status(status).send({ status, success, message, data, error });
}

