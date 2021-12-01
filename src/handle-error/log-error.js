module.exports = function logError (err,req,res,next){
    if (res.statusCode == '200'){
        res.status(500)
    }
    console.error(`Log Error.StatusCode:${res.statusCode}.Description ${err}`);
    next(err);
}