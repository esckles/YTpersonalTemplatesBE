import path from "node:path";
import fs from "node:fs";

export const removeFileUpload = (folderPath: any) => {
  try {
    let readFileData = fs.readdirSync(folderPath);

    for (let i of readFileData) {
      fs.unlink(path.join(folderPath, i), () => {
        console.log("Removed");
      });
    }
  } catch (error) {
    return error;
  }
};
