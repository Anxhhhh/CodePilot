import path from "path";
import fs from "fs";
import { customError, success } from "../../utils/response.util.js";

export const createFolder = async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return customError(res, {}, 400, "Folder name is required as a query parameter (?name=...)");
  }

  const currentDir = path.join(path.resolve(), "assets");
  const folderPath = path.join(currentDir, name);

  fs.mkdir(folderPath, { recursive: true }, (err) => {
    if (err) {
      return customError(res, {}, 500, err.message || "Error creating folder");
    }
    return success(res, { message: `Folder '${name}' created successfully` });
  });
};

