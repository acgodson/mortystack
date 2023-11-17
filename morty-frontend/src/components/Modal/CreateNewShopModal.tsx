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
import { useTransaction } from '@/contexts/TransactionContext';
import { MdRemove } from 'react-icons/md';

interface ImageUploadFormProps {
    organizationID: string;
}

interface CreateOrgModalProps {
    isOpen: boolean;
    onClose: () => void;
}




const CreateNewShopModal: React.FC<CreateOrgModalProps> = ({ isOpen, onClose }) => {

    const { isCreatingOrg, name, category, setCategory, CreateRecord, CreateApplication, setName } = useTransaction()
    const [selectedImage, setSelectedImage] = useState<File | null>();


    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setSelectedImage(files[0]);
        }
    };

    const handleSubmit = async () => {

        // await CreateApplication();

        const img = selectedImage ? selectedImage : null;

        await CreateRecord(name, category, img);
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




            {/*             
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

            </Box> */}




        </Box >
    )



    return (
        <>
            <AModalLayout
                isOpen={isOpen}
                onClose={onClose}
                title={'New Shop'}
                size={"fit-content"}
                body={<ModalBody />}
            />
        </>
    );
};


export default CreateNewShopModal;
