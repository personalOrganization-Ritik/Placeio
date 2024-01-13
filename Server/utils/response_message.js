export const errorResponse = (message, dataArray) => {
  const data = {
    success: false,
    message: message,
    data: dataArray,
  };

  return data;
};
export const successResponse = (message, dataArray) => {
  const data = {
    success: true,
    message: message,
    data: dataArray,
  };

  return data;
};
