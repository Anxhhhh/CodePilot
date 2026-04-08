import path from "path";
import fs from "fs";
import { customError, created } from "../../utils/response.util.js";

export const createFile = async (req, res) => {
  const { name } = req.query;
  const { body } = req.body;

  if (!name) {
    return customError(
      res,
      {},
      400,
      "File name is required as a query parameter (?name=...)",
    );
  }

  let currentDir = path.join(path.resolve(), "assets");
  let filePath = path.join(currentDir, name);

  fs.writeFile(filePath, body || "There is nothing here", (err) => {
    if (err) {
      return customError(res, {}, 500, err.message || "Error creating file");
    }
    return created(
      res,
      { fileName: name },
      `File '${name}' created successfully`,
    );
  });
};
