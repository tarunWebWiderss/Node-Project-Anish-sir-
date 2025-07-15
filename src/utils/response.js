function sendResponse(res, { status = 1, message = '', data = null, httpCode = 200 }) {
  return res.status(httpCode).json({ status, message, data });
}

module.exports = { sendResponse }; 