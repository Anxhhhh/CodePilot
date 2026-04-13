import path from "path";
import fs from "fs";
import { customError, created, success } from "../../utils/response.util.js";

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

  fs.writeFile(filePath, body || "", (err) => {
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

export const editFile = async (req, res) => {
  const { name, content } = req.body;

  if (!name) {
    return customError(res, {}, 400, "File name is required in body");
  }

  const currentDir = path.join(path.resolve(), "assets");
  const filePath = path.join(currentDir, name);

  // Ensure parent directory exists (for nested paths like webdev/app.js)
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFile(filePath, content || "", (err) => {
    if (err) {
      return customError(res, {}, 500, err.message || "Error editing file");
    }
    return success(res, { fileName: name }, `File '${name}' updated successfully`);
  });
};

export const getFileContent = async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return customError(res, {}, 400, "File name is required as a query parameter");
  }

  const currentDir = path.join(path.resolve(), "assets");
  const filePath = path.join(currentDir, name);

  fs.readFile(filePath, "utf8", (err, content) => {
    if (err) {
      return customError(res, {}, 500, err.message || "Error reading file");
    }
    return success(res, { content }, `File '${name}' read successfully`);
  });
};

export const deleteFile = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return customError(res, {}, 400, "File name is required in the request body");
  }

  const currentDir = path.join(path.resolve(), "assets");
  const filePath = path.join(currentDir, name);

  if (!fs.existsSync(filePath)) {
    return customError(res, {}, 404, "File not found");
  }

  fs.unlink(filePath, (err) => {
    if (err) {
      return customError(res, {}, 500, err.message || "Error deleting file");
    }
    return success(res, { fileName: name }, `File '${name}' deleted successfully`);
  });
};

