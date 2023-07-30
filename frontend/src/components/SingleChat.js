import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/chatProvider";
import {
	Box,
	FormControl,
	IconButton,
	Input,
	Spinner,
	Text,
	useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../Config/ChatLogics";
import ProfileModel from "./Miscelleneous/ProfileModel";
import UpdateGroupChatModel from "./Miscelleneous/UpdateGroupChatModel";
import axios from "axios";
import "./styles.css";
import ScrollableChat from "./ScrollableChat";
import Lottie from "lottie-react";
import typingAnimation from "../animations/typing.json";
import "../App.css";

import io from "socket.io-client";
const ENDPOINT = "http://localhost:5000";
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
	const [messages, setMessages] = useState();
	const [loading, setLoading] = useState();
	const [newMessage, setNewMessage] = useState();
	const [socketConnected, setSocketConnected] = useState(false);
	const [typing, setTyping] = useState(false);
	const [isTyping, setIsTyping] = useState(false);

	const toast = useToast();
	const { user, selectedChat, setSelectedChat, notification, setNotification } =
		ChatState();

	const fetchMessages = async () => {
		if (!selectedChat) return;

		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};

			setLoading(true);
			console.log("selectedChat-->", selectedChat);
			const { data } = await axios.get(
				`/api/message/${selectedChat._id}`,
				config
			);

			setMessages(data);
			setLoading(false);
			socket.emit("join chat", selectedChat._id);
		} catch (error) {
			toast({
				title: "Error Occured!",
				description: "Failed to Load the Messages",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
		}
	};

	useEffect(() => {
		socket = io(ENDPOINT);
		socket.emit("setup", user);
		socket.on("connected", () => setSocketConnected(true));
		socket.on("typing", () => setIsTyping(true));
		socket.on("stop typing", () => setIsTyping(false));
	}, []);

	useEffect(() => {
		fetchMessages();
		selectedChatCompare = selectedChat;
	}, [selectedChat]);

	console.log("Notifications---->", notification);

	useEffect(() => {
		socket.on("message received", (newMessageRecieved) => {
			if (
				!selectedChatCompare || // if chat is not selected or doesn't match current chat
				selectedChatCompare._id !== newMessageRecieved.chat._id
			) {
				//give notification
				if (!notification.includes(newMessageRecieved)) {
					setNotification([newMessageRecieved, ...notification]);
					setFetchAgain(!fetchAgain);
				}
			} else {
				console.log("received messages: bef", messages, newMessageRecieved);
				setMessages([...messages, newMessageRecieved]);
				console.log("received messages: aft", messages);
			}
		});
	}, [messages]);

	const sendMessage = async (event) => {
		console.log("In function-->", event);
		if (
			(event.key === "Enter" || event._reactName === "onClick") &&
			newMessage
		) {
			socket.emit("stop typing", selectedChat._id);
			try {
				const config = {
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${user.token}`,
					},
				};
				setNewMessage("");
				const { data } = await axios.post(
					"api/message",
					{
						content: newMessage,
						chatId: selectedChat._id,
					},
					config
				);

				console.log(data);
				socket.emit("new message", data);
				setMessages([...messages, data]);
			} catch (error) {
				toast({
					title: "Error Occured!",
					description: "Failed to send the Message.",
					status: "error",
					duration: 5000,
					isClosable: true,
					position: "bottom",
				});
			}
		}
	};

	const typingHandler = (e) => {
		setNewMessage(e.target.value);
		//Typing indicator logic
		if (!socketConnected) return;

		if (!typing) {
			setTyping(true);
			socket.emit("typing", selectedChat._id);
		}
		let lastTypingTime = new Date().getTime();
		let timerLength = 3000;
		setTimeout(() => {
			let timeNow = new Date().getTime();
			let timeDiff = timeNow - lastTypingTime;
			if (timeDiff >= timerLength && typing) {
				socket.emit("stop typing", selectedChat._id);
				setTyping(false);
			}
		}, timerLength);
	};

	return (
		<>
			{selectedChat ? (
				<>
					<Text
						fontSize={{ base: "28px", md: "30px" }}
						pb={3}
						px={2}
						w="100%"
						fontFamily="Roboto Slab"
						display="flex"
						justifyContent={{ base: "space-between" }}
						alignItems="center"
					>
						<IconButton
							display={{ base: "flex", md: "none" }}
							icon={<ArrowBackIcon />}
							onClick={() => setSelectedChat("")}
						/>
						{!selectedChat.isGroupChat ? (
							<>
								{getSender(user, selectedChat.users)}
								<ProfileModel user={getSenderFull(user, selectedChat.users)} />
							</>
						) : (
							<>
								{selectedChat.chatName.toUpperCase()}
								<UpdateGroupChatModel
									fetchAgain={fetchAgain}
									setFetchAgain={setFetchAgain}
									fetchMessages={fetchMessages}
								/>
							</>
						)}
					</Text>
					<Box
						display="flex"
						flexDir="column"
						justifyContent="flex-end"
						p={3}
						bg="#E8E8E8"
						// backgroundImage="url('../background-02.png')"
						w="100%"
						h="100%"
						borderRadius="lg"
						overflowY="hidden"
					>
						{loading ? (
							<Spinner
								size="xl"
								w={20}
								h={20}
								alignSelf="center"
								margin="auto"
							/>
						) : (
							<div className="messages">
								<ScrollableChat messages={messages} />
							</div>
						)}
						<FormControl onKeyDown={sendMessage} isRequired mt={3}>
							{isTyping ? (
								<Box style={{ width: "60px" }}>
									<Lottie
										animationData={typingAnimation}
										loop={true}
										width={70}
										autoplay={true}
										rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
										style={{ marginBottom: 15, marginLeft: 0 }}
									/>
								</Box>
							) : (
								<></>
							)}
							<Box
								display="flex"
								flexDirection="row"
								justifyContent="space-between"
							>
								<Input
									variant="filled"
									bg="E0E0E0"
									placeholder="Enter a message..."
									onChange={typingHandler}
									value={newMessage}
								/>
								<Box
									bg="#FFF"
									color="#12c97d"
									padding="7px 8px"
									margin="0px 8px"
									border="1px solid white"
									border-radius="5px"
									_hover={{
										color: "teal.500",
										cursor: "pointer",
									}}
									onClick={sendMessage}
								>
									<i class="fas fa-paper-plane fa-lg"></i>
								</Box>
							</Box>
						</FormControl>
					</Box>
				</>
			) : (
				<Box
					display="flex"
					flexDirection="column"
					alignItems="center"
					justifyContent="center"
					h="100%"
				>
					<Box className="emptyDrawer"></Box>
					<Text fontSize="2xl" pb={3} fontFamily="Roboto Slab">
						Click on a user to start New Chat
					</Text>
				</Box>
			)}
		</>
	);
};

export default SingleChat;
