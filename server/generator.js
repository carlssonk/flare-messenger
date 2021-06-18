const mongoose = require("mongoose");
const User = require("./models/user");

mongoose.connect("mongodb://localhost:27017/flare-chat", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const registerUser = async () => {
  const user = new User({ email: "oliver@gmail.com", username: "oliverost" });
  const newUser = await User.register(user, "password123");
  console.log(newUser);
};

// registerUser();

const deleteUser = async (userId) => {
  await User.findByIdAndDelete(userId);
  console.log("SUCCESFULLY DELETED USER");
};

const deleteAllUsers = async () => {
  await User.deleteMany();
};

// deleteAllUsers();

// deleteUser("60c928b5f865404224348ba2");
