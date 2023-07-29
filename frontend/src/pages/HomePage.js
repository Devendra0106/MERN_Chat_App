import React, { useEffect } from "react";
import {
	Box,
	Container,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
} from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
	const navigate = useNavigate();

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem("userInfo"));
		if (user) {
			navigate("/chats");
		}
	}, [navigate]);

	return (
		<Container maxH="xl" centerContent>
			<Box
				display="flex"
				justifyContent="center"
				textAlign="center"
				p={3}
				bg={"white"}
				w="100%"
				m="40px 0 15px 0"
				borderRadius="lg"
				borderWidth="1px"
			>
				<Box
					display="flex"
					fontSize="3xl"
					fontFamily="Merienda"
					fontWeight="bold"
					align="center"
					textAlign="center"
					padding={1}
					color="teal"
				>
					<Box style={{ padding: "2px 5px 0px", color: "teal" }}>
						<i class="fab fa-whatsapp fa-lg"></i>
					</Box>
					<Box>QuickChat</Box>
				</Box>
			</Box>
			<Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
				<Tabs variant="soft-rounded">
					<TabList mb="1em">
						<Tab width="50%">Login</Tab>
						<Tab width="50%">Signup</Tab>
					</TabList>
					<TabPanels>
						<TabPanel>
							<Login />
						</TabPanel>
						<TabPanel>
							<Signup />
						</TabPanel>
					</TabPanels>
				</Tabs>
			</Box>
		</Container>
	);
};

export default HomePage;
