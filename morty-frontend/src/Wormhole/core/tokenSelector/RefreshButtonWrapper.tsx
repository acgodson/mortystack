import { Box, IconButton, Tooltip } from "@chakra-ui/react";
import { MdRefresh } from "react-icons/md";


export default function RefreshButtonWrapper({
    children,
    callback,
}: {
    children: JSX.Element;
    callback: () => any;
}) {


    const refreshWrapper = (
        <Box>
            <Box>{children}</Box>
            <Tooltip title="Reload Tokens">
                <IconButton
                    icon={<MdRefresh />}
                    aria-label="referesh"
                    onClick={callback} />


            </Tooltip>
        </Box>
    );

    return refreshWrapper;
}
