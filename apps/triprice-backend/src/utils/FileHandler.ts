import * as fs from 'fs';

export const deleteFile = (filePath: string) => {
  if (filePath) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err);
        throw err;
      }
    });
  }
};
