module.exports = function errorHandler(err, req, res, next) {
    res
    .json({ error: err })
    .send();
}