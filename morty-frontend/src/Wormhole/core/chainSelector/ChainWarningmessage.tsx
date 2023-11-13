import { CHAIN_CONFIG_MAP } from "@/utils/wormhole/consts";
import { ChainId } from "@certusone/wormhole-sdk";
import { Alert, Box, Link, Text } from "@chakra-ui/react";

import { useMemo } from "react";


export default function ChainWarningMessage({ chainId }: { chainId: ChainId }) {


    const warningMessage = useMemo(() => {
        return CHAIN_CONFIG_MAP[chainId]?.warningMessage;
    }, [chainId]);

    if (warningMessage === undefined) {
        return null;
    }

    return (
        <Alert variant="outlined">
            {warningMessage.text}
            {warningMessage.link ? (
                <Text>
                    <Link href={warningMessage.link.url} target="_blank" rel="noreferrer">
                        {warningMessage.link.text}
                    </Link>
                </Text>
            ) : null}
        </Alert>
    );
}
