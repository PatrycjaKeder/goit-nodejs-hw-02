// database functions
const User = require("../../models/users");

const fetchUser = (key) => {
  return User.findOne(key);
};

const setToken = (_id, token) => {
  return User.findByIdAndUpdate(
    { _id: _id },
    { $set: token },
    {
      new: true,
      runValidators: true,
      strict: "throw",
      upsert: false,
    }
  );
};

const updateUser = async ({ id, toUpdate }) => {
  try {
    console.log("ID w updateUser:", id);
    console.log("toUpdate w updateUser:", toUpdate);
    const user = await User.findByIdAndUpdate(
      { _id: id },
      { $set: toUpdate },
      {
        new: true,
        runValidators: true,
        // upsert:false
      }
    );
    console.log("Wewnątrz funkcji updateUser", user);
    return user;
  } catch (error) {
    console.error("Błąd w funkcji updateUser:", error);
    throw error;
  }
};

// const updateUser = ({ id, toUpdate }) => {
//   return User.findByIdAndUpdate(
//     { _id: id },
//     { $set: toUpdate },
//     {
//       new: true,
//       runValidators: true,
//       // upsert:false
//     }

//   )

// }

module.exports = {
  fetchUser,
  setToken,
  updateUser,
};
