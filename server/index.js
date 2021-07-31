if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const PORT = 4000;
const mongoose = require("mongoose");
const Joi = require("joi");
const cors = require("cors");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const flash = require("connect-flash");
const bodyParser = require("body-parser");
const mongoSanitize = require("express-mongo-sanitize");

const User = require("./models/user");

const userRoutes = require("./routes/users");
const friendRoutes = require("./routes/friends");
const chatRoutes = require("./routes/chats");
const messageRoutes = require("./routes/messages");

const MongoStore = require("connect-mongo");

// Connect to database
const dbUrl = "mongodb://localhost:27017/flare-chat";
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const server = require("http").createServer(app);
const io = require("socket.io")(server);
// const io = require("socket.io")(server);

// io.on("connection", (socket) => {
//   console.log(`Connected: ${socket.id}`);
//   socket.on("disconnect", () => console.log(`Disconnected: ${socket.id}`));
//   socket.on("join", (room) => {
//     console.log(`Socket ${socket.id} joining ${room}`);
//     socket.join(room);
//   });
//   socket.on("chat", (data) => {
//     const { message, room } = data;
//     console.log(`msg: ${message}, room: ${room}`);
//     io.to(room).emit("chat", message);
//   });
// });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(mongoSanitize());

// Sessions
const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret: "verybadsecret",
  },
});

store.on("error", function (e) {
  console.log("session store error", e);
});

const sessionOptions = {
  store,
  name: "session",
  secret: "verybadsecret",
  saveUninitialized: true,
  resave: false,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 365,
    maxAge: 1000 * 60 * 60 * 24 * 365,
  },
};

const sessionMiddleware = session(sessionOptions);
const passportInit = passport.initialize();
const passportSession = passport.session();

app.use(sessionMiddleware);

// Socket
io.use(function (socket, next) {
  sessionMiddleware(socket.request, socket.request.res, next);
});

io.use(function (socket, next) {
  passportInit(socket.client.request, socket.client.request.res, next);
});

io.use(function (socket, next) {
  passportSession(socket.client.request, socket.client.request.res, next);
});

// Passport
app.use(passportInit);
app.use(passportSession);
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes
app.use("/api", userRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

require("./socket")(io);

// io.on("connection", (socket) => {
//   console.log(`Connected: ${socket.id}`);

//   console.log("###################");
//   console.log(socket.request.user.name);
//   console.log("###################");
// });

// PAGE NOT FOUND
// app.all("*", (req, res, next) => {
//   next(new ExpressError("Page Not Found", 404));
// });

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).send(err.message);
});

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
