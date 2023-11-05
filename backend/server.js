const express = require("express");
const dotenv = require("dotenv");
const chats = require("./data/data");
const connectDB = require("./config/db");
const colors = require("colors");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");

dotenv.config();

connectDB();
const app = express();

app.use(express.json()); // to accept JSON data(server should accept JSON data as we are passing data from frontend is in JSON format)

app.get("/", (req, res) => {
	res.send("API is running Successfully!");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound); // if route not found, gives 404 err
app.use(errorHandler); // any other error coming from controllers

const PORT = process.env.PORT || 5000;

const server = app.listen(
	5000,
	console.log(`Server started on PORT ${PORT}`.yellow.bold)
);

const io = require("socket.io")(server, {
	pingTimeout: 60000, //closes connection when it stays ideal for 60sec/1min
	cors: {
		origin: "http://localhost:3000",
	},
});

io.on("connection", (socket) => {
	console.log("connected to socket.io");

	socket.on("setup", (userData) => {
		socket.join(userData._id);
		console.log("UserId: ", userData._id);
		socket.emit("connected");
	});

	socket.on("join chat", (room) => {
		socket.join(room);
		console.log("User Joined room: ", room);
	});

	socket.on("typing", (room) => socket.in(room).emit("typing"));
	socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

	socket.on("new message", (newMessageRecieved) => {
		let chat = newMessageRecieved.chat;

		if (!chat.users) return console.log("chat.users not defined");

		chat.users.forEach((user) => {
			if (user._id == newMessageRecieved.sender._id) return;
			socket.in(user._id).emit("message received", newMessageRecieved);
		});
	});

	// socket.off("setup", () => {
	// 	console.log("USER DISCONNECTED");
	// 	socket.leave(userData._id);
	// });
});
