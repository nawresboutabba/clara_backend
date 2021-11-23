module.exports = function errorHandler(err, req, res, next) {
    
    let msg
    try {
        msg = err.message
    }catch(e){
        console.log(`Error parsing error:${e}`)
        msg = "Unknown Error"
    }
    res
    .json({ error: msg })
    .send();
}