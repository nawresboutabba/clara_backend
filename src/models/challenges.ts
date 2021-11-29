import { Schema, model } from 'mongoose';

export type TYPE_CHALLENGE  = {
  challengeId:string,
  created: Date,
  updated?:Date,
  description: String,
  active: boolean,
  images: Array<String>,
  timePeriod: number,
  status: string,
  validators: Array<String>,
  referrer: String,
  workSpaceAvailable: Array<String>
}

const challenge = new Schema({
  challengeId: String,
  created: {
    type: Date,
    default: Date.now,
  },
  updated: Date,
  description: String,
  active: {
    type: Boolean,
    default: true,
  },
  images: [
    {
      type: String,
    },
  ],
  timePeriod: Number,
  status: String,
  validators: [
    {
      type: String,
    },
  ],
  referrer: String,
  workSpaceAvailable: [
    {
      type: String,
    },
  ],
});

/* challenge.statics.getChallengeActiveById = async function (id) {
  return new Promise((resolve, reject) =>
    this.findOne({
      challengeId: id,
      active: true,
    })
      .then((result) => {
        // Return the Document Object then could be chained with other methods
        resolve(result);
      })
      .catch((err) => {
        return reject(err);
      })
  );
};

challenge.statics.newChallenge = async function (data){
  return new Promise((resolve, reject) => {
    this.create(data)
      .then((resp) => {
        resolve(_.omit(resp.toJSON(), ["_id", "__v"]));
      })
      .catch((err) => {
        reject(err);
      });
  });  
}

challenge.methods.updateWithLog = async function (update) {
  const oldData = _.omit(this.toJSON(), ["_id", "__v"]);
  update.updated = new Date();
  Object.assign(this, update);
  console.log("entre a la operacion")
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    await Promise.all([
      HistoricalChallenge.create([oldData], { session: session }),
      this.save({ session: session }),
    ]);
    await session.commitTransaction();
    session.endSession();
    return _.omit(this.toJSON(), ["_id", "__v"]);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return error;
  }
};

challenge.methods.deactivateChallenge = function () {
  (this.updated = new Date()), (this.active = false);

  return new Promise((resolve, reject) => {
    this.save()
      .then((resp) => {
        resolve(resp);
      })
      .catch((err) => {
        return reject(err);
      });
  });
}; */

export default model("Challenge", challenge);