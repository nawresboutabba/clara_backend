const router = require("express").Router();

router.post ('/company', async (req,res,next)=> {
    console.log(req.body)
    res
    .status(200)
    .send()
})
const organizationsRouter = router

export default organizationsRouter