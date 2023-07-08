// import { useEffect, useState } from "react";
import { ChatState } from "../Context/chatProvider";
import { Box } from "@chakra-ui/react";
import ChatBox from "../components/ChatBox";
import SideDrawer from "../components/Miscelleneous/SideDrawer";
import MyChats from "../components/MyChats";

const ChatPage = () => {
	const { user } = ChatState();

	return (
		<div style={{ width: "100%" }}>
			{user && <SideDrawer />}
			<Box
				display="flex"
				justifyContent="space-between"
				w="100%"
				h="91.5vh"
				p="10px"
			>
				{user && <MyChats />}
				{user && <ChatBox />}
			</Box>
		</div>
	);
};

export default ChatPage;
