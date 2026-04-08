import { internalError } from "./response.util.js";

const errorMiddleware = (err, __, res, _) => {
  return internalError(res, err.message || err.stack);
};

export default errorMiddleware;
