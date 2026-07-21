const generateBookingId = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 7);
  return `BK${timestamp}${randomStr}`.toUpperCase();
};

export default generateBookingId;
