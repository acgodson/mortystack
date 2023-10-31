import React, { useState } from "react";
import { useSignInModal } from "@/context/useModalContext";
import { FiCircle } from 'react-icons/fi';
import { List, ListItem, Icon } from "@chakra-ui/react";



const BulletTitle = (prop: { title: string }) => {
    return (

        <List>
            <ListItem py={[3, 3, 6]} display="flex" alignItems={"center"}>
                <Icon as={FiCircle} color="teal.500" mr={2} />
                {prop.title}
            </ListItem>
        </List>

    );
};
export default BulletTitle;
