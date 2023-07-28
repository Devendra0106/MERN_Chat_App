import { ViewIcon } from "@chakra-ui/icons";
import {
	Box,
	Button,
	IconButton,
	Image,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	useDisclosure,
} from "@chakra-ui/react";
import React from "react";

const ProfileModel = ({ user, children }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	return (
		<>
			{children ? (
				<span onClick={onOpen}>{children}</span>
			) : (
				<IconButton
					display={{ base: "flex" }}
					icon={<ViewIcon />}
					onClick={onOpen}
				/>
			)}
			<Modal isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay />
				<ModalContent h="250px">
					<ModalHeader
						fontSize="28px"
						fontFamily="Roboto Slab"
						display="flex"
						justifyContent="left"
					>
						{user.name}
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody
						display="flex"
						flexDirection="row"
						justifyContent="space-between"
						alignItems="top"
					>
						<Image
							borderRadius="full"
							boxSize="150px"
							src={user.pic}
							alt={user.name}
						/>
						<Box fontSize="17px" fontFamily="Roboto Slab" mt={2}>
							<Text>
								<b>Id:</b> {user._id}
							</Text>
							<Text>
								<b>Phone No:</b> +91 8822334455
							</Text>
							<Text>
								<b>Email:</b> {user.email}
							</Text>
						</Box>
					</ModalBody>

					{/* <ModalFooter>
						<Button colorScheme="teal" mr={3} onClick={onClose}>
							Close
						</Button>
					</ModalFooter> */}
				</ModalContent>
			</Modal>
		</>
	);
};

export default ProfileModel;
