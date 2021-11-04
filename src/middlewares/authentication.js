module.exports = async function(req, res, next){
    console.log("fake authentication")
    next()
}