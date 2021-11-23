const mongoose = require("mongoose");
const _ = require("lodash");
const HistoricalUser = require("./historical-users");

const user = mongoose.Schema({
  active: Boolean,
  email: {
    type: String,
    required: true,
    unique: true,
    match:
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  userId: {
    type: String,
    require: true,
    unique: true,
  },
  password: { type: String, required: true },
  workSpace: [
    {
      type: String,
    },
  ],
  updated: Date,
});

user.statics.getUserActiveByEmail = async function (email) {
  return new Promise((resolve, reject) => {
    this.findOne({
      email: email,
      active: true,
    })
      .lean()
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

user.statics.getUserActiveByUserId = async function (userId) {
  return new Promise((resolve, reject) => {
    this.findOne({
      userId: userId,
      active: true,
    })
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

user.statics.newGenericUser = async function (data) {
  return new Promise((resolve, reject) => {
    this.create({
      userId: data.userId,
      email: data.email,
      active: true,
      password: data.password,
      workSpace: ["ABSOLUTE"],
    })
      .then((resp) => {
        resolve(_.omit(resp.toJSON(), ["_id", "__v", "password"]));
      })
      .catch((err) => {
        reject(err);
      });
  });
};

user.methods.deleteUserWithLog = async function () {
  const oldData = _.omit(this.toJSON(), ["_id", "__v"]);
  const data = { update: new Date(), active: false };

  Object.assign(this, data);
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    await Promise.all([
      HistoricalUser.create([oldData], { session: session }),
      this.save({ session: session }),
    ]);
    await session.commitTransaction();
    session.endSession();
    return "deleted succesfully";
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return error;
  }
};
module.exports = mongoose.model("User", user);
