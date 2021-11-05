module.exports = function logError (err,req,res,next){
    if (res.statusCode == '200'){
        res.status(500)
    }
    console.log(err)
    console.error(`Log Error.StatusCode:${res.statusCode}.Description ${err}`);
    next(err);
}