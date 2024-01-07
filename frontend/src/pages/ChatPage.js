// import { useEffect, useState } from "react";
import { ChatState } from "../Context/chatProvider";
import { Box } from "@chakra-ui/react";
import ChatBox from "../components/ChatBox";
import SideDrawer from "../components/Miscelleneous/SideDrawer";
import MyChats from "../components/MyChats";
import { useState } from "react";

const ChatPage = () => {
	const { user } = ChatState();
	const { fetchAgain, setFetchAgain } = useState(false); // To fetch chat data whenever group or chat deleted

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
				{user && <MyChats fetchAgain={fetchAgain} />}
				{user && (
					<ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
				)}
			</Box>
		</div>
	);
};

export default ChatPage;
