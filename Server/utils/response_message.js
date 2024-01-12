export const errorResponse = (message, dataArray) => {
  const data = {
    success: false,
    data: dataArray,
    message: message,
  };

  return data;
};
export const successResponse = (message, dataArray) => {
  const data = {
    success: true,
    data: dataArray,
    message: message,
  };

  return data;
};
