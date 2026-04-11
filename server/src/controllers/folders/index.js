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

const getRecursiveFiles = (dirPath, basePath = "") => {
  let results = [];
  const list = fs.readdirSync(dirPath, { withFileTypes: true });
  
  list.forEach(file => {
    const relativePath = path.join(basePath, file.name).replace(/\\/g, '/');
    if (file.isDirectory()) {
      results.push({ name: relativePath, type: 'folder' });
      results = results.concat(getRecursiveFiles(path.join(dirPath, file.name), relativePath));
    } else {
      results.push({ name: relativePath, type: 'file' });
    }
  });
  
  return results;
};

export const readFolder = async (req, res) => {
  const name = req.query.name || req.body.name;

  const currentDir = path.join(path.resolve(), "assets");
  const folderPath = path.join(currentDir, name || "");

  try {
    // If no name is provided, get the full recursive tree as a flat list of paths
    if (!name) {
      const allFiles = getRecursiveFiles(currentDir);
      return success(res, { 
        message: "Full project structure read successfully",
        data: allFiles 
      });
    }

    // Otherwise, just read the single level (legacy support)
    fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
      if (err) {
        return customError(res, {}, 500, err.message || "Error reading folder");
      }
      
      const formattedFiles = files.map(file => ({
        name: file.name,
        type: file.isDirectory() ? 'folder' : 'file'
      }));

      return success(res, { 
        message: `Folder '${name}' read successfully`,
        data: formattedFiles 
      });
    });
  } catch (err) {
    return customError(res, {}, 500, err.message || "Error reading structure");
  }
};
