import {
	Avatar,
	Box,
	Button,
	Menu,
	MenuButton,
	MenuDivider,
	MenuItem,
	MenuList,
	Text,
	Tooltip,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { ChatState } from "../../Context/chatProvider";
import ProfileModel from "./ProfileModel";
import { useNavigate } from "react-router-dom";

const SideDrawer = () => {
	const navigate = useNavigate();
	const [search, setSearch] = useState();
	const [searchResult, setSearchResult] = useState();
	const [loading, setLoading] = useState();
	const [loadingChat, setLoadingChat] = useState();

	const { user } = ChatState();

	const logoutHandler = () => {
		localStorage.removeItem("userInfo");
		navigate("/");
	};

	return (
		<>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				bg="white"
				w="100%"
				p="5px 10px"
				borderWidth="5px"
			>
				<Tooltip label="Search Users to chat" hasArrow placement="bottom">
					<Button variant="ghost">
						<i class="fas fa-search"></i>
						<Text display={{ base: "none", md: "flex" }} px="4">
							Search User
						</Text>
					</Button>
				</Tooltip>

				<Text fontSize="2xl" fontFamily="Work sans">
					Talk-A-Tive
				</Text>

				<div>
					<Menu>
						<MenuButton>
							<BellIcon fontSize="2xl" margin={1} />
						</MenuButton>
						{/* <MenuList></MenuList> */}
					</Menu>
					<Menu>
						<MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
							<Avatar
								size="sm"
								cursor="pointer"
								name={user.name}
								src={user.pic}
							/>
						</MenuButton>
						<MenuList>
							<ProfileModel user={user}>
								<MenuItem>My Profile</MenuItem>
							</ProfileModel>
							<MenuDivider />
							<MenuItem onClick={logoutHandler}>Logout</MenuItem>
						</MenuList>
					</Menu>
				</div>
			</Box>
		</>
	);
};

export default SideDrawer;
