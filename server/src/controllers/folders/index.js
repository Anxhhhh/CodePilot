import path from "path";
import fs from "fs";
import { customError, success } from "../../utils/response.util.js";

export const createFolder = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return customError(res, {}, 400, "Folder name is required in the request body");
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

export const readFolder = async (req, res) => {
  const { name } = req.query;

  const currentDir = path.join(path.resolve(), "assets");
  const folderPath = path.join(currentDir, name || "");

  fs.readdir(folderPath, (err, files) => {
    if (err) {
      return customError(res, {}, 500, err.message || "Error reading folder");
    }
    return success(res, { 
      message: `Folder '${name || "root"}' read successfully`,
      data: files 
    });
  });
};


