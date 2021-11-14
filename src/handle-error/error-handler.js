module.exports = function errorHandler(err, req, res, next) {
    
    let msg
    try {
        msg = JSON.parse(err.message)
    }catch(e){
        console.log(`Error parsing error:${e}`)
        msg = e.message
    }
    res
    .json({ error: msg })
    .send();
}