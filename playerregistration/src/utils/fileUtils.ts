export const saveFileLocally = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const timestamp = new Date().getTime();
      const extension = file.name.split('.').pop();
      const filename = `file_${timestamp}.${extension}`;
      resolve(filename);
    } catch (error) {
      reject(error);
    }
  });
};

export const validateFile = (file: File, maxSizeMB = 2): boolean => {
  if (!file.type.match('image.*')) {
    throw new Error('Please select an image file (JPEG, PNG)');
  }
  if (file.size > maxSizeMB * 1024 * 1024) {
    throw new Error(`File size should be less than ${maxSizeMB}MB`);
  }
  return true;
};