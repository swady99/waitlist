function handleError(error, req, res, next) {
   return res.json({ status: "error", data: error.message });
}

module.exports = { handleError };
