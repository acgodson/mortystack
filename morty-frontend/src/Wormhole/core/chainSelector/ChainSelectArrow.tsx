
import { useState } from "react";
import { IconButton } from "@chakra-ui/react";
import { MdArrowForward, MdSwapHoriz } from "react-icons/md";

export default function ChainSelectArrow({
    onClick,
    disabled,
}: {
    onClick: () => void;
    disabled: boolean;
}) {
    const [showSwap, setShowSwap] = useState(false);

    return (
        <IconButton
            aria-label="chain select Arrow"
            onClick={onClick}
            onMouseEnter={() => {
                setShowSwap(true);
            }}
            onMouseLeave={() => {
                setShowSwap(false);
            }}
            disabled={disabled}
            icon={showSwap ? <MdSwapHoriz /> : <MdArrowForward />

            }
        />


    );
}
