import React, { useCallback, useEffect, useState } from 'react';
import {
    Button,
    Box,
    VStack,
    Text,
    Flex,
    Stack,
    FormControl,
    FormLabel,
    Input,
    Select,
    IconButton,
    HStack,
    Textarea
} from '@chakra-ui/react';
import AModalLayout from '@/layout/ActionModal';
import { useWallet } from '@txnlab/use-wallet';
import { useTransaction } from '@/contexts/TransactionContext';
import { useWeb3AuthProvider } from '@/contexts/Web3AuthContext';
import { MdRemove } from 'react-icons/md';

interface ImageUploadFormProps {
    organizationID: string;
}

interface CreateOrgModalProps {
    isOpen: boolean;
    onClose: () => void;
}




const CreateOrgModal: React.FC<CreateOrgModalProps> = ({ isOpen, onClose }) => {

    const { isCreatingOrg, name, category, setCategory, CreateRecord, setName } = useTransaction()
    const [selectedImage, setSelectedImage] = useState<File | null>(null);


    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setSelectedImage(files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!selectedImage) {
            return
        }
        await CreateRecord(name, category, selectedImage);
    }
    const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    }, []);




    const ModalBody = () => (
        <Box
            w="100%"
            position={"relative"}
            justifyContent={"center"}
            alignItems={"center"}
            pt={12}
            maxW="800px"

        >
            <Text
                w="100%"
                maxW={"500px"}
                textAlign={"left"}
            >This would serve as a business profile for customers to identity  with your service</Text>

            <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
                w="100%"

                flexDirection={["column-reverse", "column-reverse", "column-reverse", "row"]}
            >
                <Box

                    pt={8}
                >
                    <Text
                        color={"#a6a6ee"}
                        fontSize={["md", "md", "lg", "2xl"]}> Name of Organization</Text>
                    <Input
                        // w="100%"
                        value={name}
                        type='text'
                        onChange={handleNameChange}
                        placeholder="Enter a name"

                    />

                    <br />
                    <Text
                        color={"#a6a6ee"}
                        fontSize={["md", "md", "lg", "2xl"]} mt={4}>Category </Text>
                    <Select
                        w="100%"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="Select Category">
                        <option value="public profile">Public Profile</option>
                        <option value="technology">Technology</option>
                        <option value="finance">Finance</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="hospitality">Hospitality </option>
                        <option value="others">Others</option>
                    </Select>

                </Box >

                <VStack spacing={4}

                    justifyContent={"space-between"}
                    m="auto">

                    <FormLabel>
                        <Flex
                            color={"#a6a6ee"}
                            alignItems={"center"} fontSize={"sm"}>
                            Upload  Logo  <Box fontSize={"xs"} as="span">(Optional)</Box>
                        </Flex>
                    </FormLabel>

                    {!selectedImage && (
                        <Input
                            w={["100%", "100%", "100%", "300px"]}
                            h={["fit-content", "fit-content", "fit-content", "300px"]}
                            border={"none"}
                            py={6}
                            bg="blackAlpha.300"
                            type="file"
                            accept="image/*" onChange={handleImageChange} />
                    )}

                    {selectedImage && (
                        <HStack
                            spacing={5}
                            alignItems={"center"}
                        >
                            <Text>{selectedImage.name}</Text>
                            <IconButton
                                onClick={() => setSelectedImage(null)}
                                icon={<MdRemove />} aria-label={'clear image'} />

                        </HStack>
                    )}

                </VStack>


            </Box>

            <Box pt={12}>
                <Button
                    isDisabled={name.length < 2 || category.length < 2}
                    isLoading={isCreatingOrg}
                    bg="#4e4fdf"
                    color="white"
                    size="lg"
                    onClick={handleSubmit}
                >
                    Submit
                </Button>

            </Box>




        </Box >
    )



    return (
        <>
        
        </>
        // <AModalLayout
        //     isOpen={isOpen}
        //     onClose={onClose}
        //     title={' Add New Organization'}
        //     size={"fit-content"}
        //     body={<ModalBody />}
        // />
    );
};


export default CreateOrgModal;
