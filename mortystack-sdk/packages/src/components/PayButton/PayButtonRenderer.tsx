import React, { ReactNode } from 'react';
import { useDisclosure } from "@chakra-ui/react"

export interface PayButtonRendererProps {
    children: (renderProps: {
        payModalOpen: boolean;
        openPayModal: () => void;
    }) => ReactNode;
}

export function PayButtonRenderer({ children }: PayButtonRendererProps) {
    const { isOpen, onOpen } = useDisclosure();



    return <>{children({ payModalOpen: isOpen, openPayModal: onOpen })}</>;
}

PayButtonRenderer.displayName = 'PayButtonRenderer.Custom';
