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

const Signup = () => {
	const [show, setShow] = useState(false);
	const [name, setName] = useState();
	const [email, setEmail] = useState();
	const [password, setPassword] = useState();
	const [confirmPassword, setConfirmPassword] = useState();
	const [pic, setPic] = useState();
	const [loading, setLoading] = useState();
	const toast = useToast();
	const navigate = useNavigate();

	const handleClick = () => setShow(!show);

	const postDetails = (pics) => {
		setLoading(true);
		if (pics === undefined) {
			toast({
				title: "Please Select an Image!",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			return;
		}

		if (pics.type === "image/jpeg" || pics.type === "image/png") {
			const data = new FormData();
			data.append("file", pics);
			data.append("upload_preset", "MERN-Chat-App");
			data.append("cloud_name", "devtechs");
			fetch("https://api.cloudinary.com/v1_1/devtechs/image/upload", {
				method: "POST",
				body: data,
			})
				.then((res) => res.json())
				.then((data) => {
					console.log(data);
					setPic(data.url.toString());
					setLoading(false);
				})
				.catch((err) => {
					console.log("err-->", err);
					setLoading(false);
				});
		} else {
			toast({
				title: "Please Select an Image!",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			setLoading(false);
			return;
		}
	};

	const submitHandler = async () => {
		setLoading(true);
		if (!name || !email || !password || !confirmPassword) {
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
		if (password !== confirmPassword) {
			toast({
				title: "Passwords do not match!",
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
				"/api/user",
				{ name, email, password, pic },
				config
			);
			toast({
				title: "Registration successful",
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
			<FormControl id="fist-name" isRequired>
				<FormLabel>Name</FormLabel>
				<Input
					placeContent="Enter Your Name"
					onChange={(e) => setName(e.target.value)}
				/>
			</FormControl>

			<FormControl id="email" isRequired>
				<FormLabel>Email</FormLabel>
				<Input
					placeContent="Enter Your Email"
					onChange={(e) => setEmail(e.target.value)}
				/>
			</FormControl>

			<FormControl id="password" isRequired>
				<FormLabel>Password</FormLabel>
				<InputGroup>
					<Input
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

			<FormControl id="confirm-password" isRequired>
				<FormLabel>Confirm Password</FormLabel>
				<InputGroup>
					<Input
						type={show ? "text" : "password"}
						placeContent="Enter Your Password "
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
					<InputRightElement width="4.5rem">
						<Button h="1.75rem" size="sm" onClick={handleClick}>
							{show ? "Hide" : "Show"}
						</Button>
					</InputRightElement>
				</InputGroup>
			</FormControl>

			<FormControl id="pic" isRequired>
				<FormLabel>Upload Your Picture</FormLabel>
				<Input
					type="file"
					p={1.5}
					accept="image/*"
					onChange={(e) => postDetails(e.target.files[0])}
				/>
			</FormControl>

			<Button
				colorScheme="blue"
				width="100%"
				style={{ marginTop: 15 }}
				onClick={submitHandler}
				isLoading={loading}
			>
				Sign Up
			</Button>
		</VStack>
	);
};

export default Signup;
