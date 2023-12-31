import {
	Button,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
	VStack,
	useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
	const [show, setShow] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const toast = useToast();
	const navigate = useNavigate();

	const handleClick = () => setShow(!show);

	const submitHandler = async () => {
		setLoading(true);
		if (!email || !password) {
			toast({
				title: "Please Fill all the fields",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			setLoading(false);
			return;
		}
		try {
			const config = {
				headers: {
					"Content-type": "application/json",
				},
			};
			const { data } = await axios.post(
				"/api/user/login",
				{ email, password },
				config
			);
			toast({
				title: "Login successful",
				status: "success",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			localStorage.setItem("userInfo", JSON.stringify(data));
			setLoading(false);
			navigate("/chats");
		} catch (err) {
			toast({
				title: "Error Occured!",
				description: err.response.data.message,
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			setLoading(false);
		}
	};

	return (
		<VStack spacing="5px">
			<FormControl id="email" isRequired>
				<FormLabel>Email</FormLabel>
				<Input
					value={email}
					placeContent="Enter Your Email"
					onChange={(e) => setEmail(e.target.value)}
				/>
			</FormControl>

			<FormControl id="password" isRequired>
				<FormLabel>Password</FormLabel>
				<InputGroup>
					<Input
						value={password}
						type={show ? "text" : "password"}
						placeContent="Enter Your Password "
						onChange={(e) => setPassword(e.target.value)}
					/>
					<InputRightElement width="4.5rem">
						<Button h="1.75rem" size="sm" onClick={handleClick}>
							{show ? "Hide" : "Show"}
						</Button>
					</InputRightElement>
				</InputGroup>
			</FormControl>

			<Button
				colorScheme="teal"
				width="100%"
				color="white"
				style={{ marginTop: 15 }}
				onClick={submitHandler}
			>
				Login
			</Button>
			<Button
				variant="solid"
				colorScheme="purple"
				width="100%"
				style={{ marginTop: 15 }}
				isLoading={loading}
				onClick={() => {
					setEmail("guest@example.com");
					setPassword("123456");
				}}
			>
				Get Guest User Credentials
			</Button>
		</VStack>
	);
};

export default Login;
