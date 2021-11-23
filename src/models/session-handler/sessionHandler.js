const mongoose = require('mongoose');

const Solution = require('../solutions');
const User = require('../users')
const testCommit = async () => {
    try {
        const session = await mongoose.startSession()
        await session.startTransaction()
        //const [errorOp, result] = await toAll([App.deleteMany({ user: id }).session(session), UserModel.findByIdAndRemove(id).session(session)]);
        const [errorOp, result] = await Promise.all([
            Solution.create([{description:"pep"}], {session:session}),
            User.create([{email:"algodos@gmail.com", userId:"wenodos", password:"1234"}] ,{session:session} )
        ])
        
        if (errorOp) {
            console.log("error con errorOp", errorOp, result)
        }
        const [solution, user] = result;
        await session.commitTransaction();
        session.endSession();
        return "wep"
    }catch(e){
        console.log(e)
        await session.abortTransaction()
        session.endSession();
        return "error"
    }
}

module.exports = testCommit