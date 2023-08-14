const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

/*
 * accessChat - Get chat data based on user id
 */
const accessChat = asyncHandler(async (req, res) => {
	const { userId } = req.body;

	if (!userId) {
		console.log("UserId param not sent with request");
		return res.sendStatus(400);
	}

	let isChat = await Chat.find({
		isGroupChat: false,
		$and: [
			{ users: { $elemMatch: { $eq: req._id } } },
			{ users: { $elemMatch: { $eq: userId } } },
		],
	})
		.populate("users", "-password")
		.populate("latestMessage");

	isChat = await User.populate(isChat, {
		path: "latestMessage.sender",
		select: "name pic email",
	});

	if (isChat.length > 0) {
		res.send(isChat[0]);
	} else {
		let chatData = {
			chatName: "Sender",
			isGroupChat: false,
			users: [req.user._id, userId],
		};
		try {
			const createdChat = await Chat.create(chatData);
			const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
				"users",
				"-password"
			);
			res.status(200).send(fullChat);
		} catch (error) {
			res.status(400);
			throw new Error(error.message);
		}
	}
});

/*
 * fetchChats - Get chat users to be shown on chat list
 */
const fetchChats = asyncHandler(async (req, res) => {
	try {
		Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
			.populate("users", "-password")
			.populate("groupAdmin", "-password")
			.populate("latestMessage")
			.sort({ updatedAt: -1 })
			.then(async (results) => {
				results = await User.populate(results, {
					path: "latestMessage.sender",
					select: "name pic email",
				});
				res.status(200).send(results);
			});
	} catch (error) {
		res.status(400);
		throw new Error(error.message);
	}
});

/*
 * createGroupChat - Create new group chat
 */
const createGroupChat = asyncHandler(async (req, res) => {
	if (!req.body.users || !req.body.name) {
		return res.status(400).send({ message: "Please fill all the fields" });
	}

	let users = JSON.parse(req.body.users);
	if (users.length < 2) {
		return res
			.status(400)
			.send("More than 2 users required to form a group chat");
	}

	users.push(req.user);

	try {
		const groupChat = await Chat.create({
			chatName: req.body.name,
			users: users,
			isGroupChat: true,
			groupAdmin: req.user,
		});

		const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
			.populate("users", "-password")
			.populate("groupAdmin", "-password");

		res.status(200).send(fullGroupChat);
	} catch (error) {
		res.status(400);
		throw new Error(error.message);
	}
});

/*
 * renameGroup - Rename group chat
 */
const renameGroup = asyncHandler(async (req, res) => {
	const { chatId, chatName } = req.body;
	const updatedChat = await Chat.findByIdAndUpdate(
		chatId,
		{ chatName },
		{
			new: true, // return updated value
		}
	)
		.populate("users", "-password")
		.populate("groupAdmin", "-password");

	if (!updatedChat) {
		res.status(400);
		throw new Error("Chat Not Found");
	} else {
		res.json(updatedChat);
	}
});

/*
 * addToGroup - add new member to group
 */
const addToGroup = asyncHandler(async (req, res) => {
	const { chatId, userId } = req.body;
	const added = await Chat.findByIdAndUpdate(
		chatId,
		{ $push: { users: userId } },
		{
			new: true, // return updated value
		}
	)
		.populate("users", "-password")
		.populate("groupAdmin", "-password");

	if (!added) {
		res.status(400);
		throw new Error("Chat Not Found");
	} else {
		res.json(added);
	}
});

/*
 * removeFromGroup - remove member from group
 */
const removeFromGroup = asyncHandler(async (req, res) => {
	const { chatId, userId } = req.body;
	const removed = await Chat.findByIdAndUpdate(
		chatId,
		{ $pull: { users: userId } },
		{
			new: true, // return updated value
		}
	)
		.populate("users", "-password")
		.populate("groupAdmin", "-password");

	if (!removed) {
		res.status(400);
		throw new Error("Chat Not Found");
	} else {
		res.json(removed);
	}
});

module.exports = {
	accessChat,
	fetchChats,
	createGroupChat,
	renameGroup,
	addToGroup,
	removeFromGroup,
};
