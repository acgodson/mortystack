import { Textarea, InputGroup } from "@chakra-ui/react";

export default function SelectedTokenMessage({
    onMaxClick,
    token,
    amount,
    isDisabled,
    ...props
}: any) {
    return (
        <InputGroup>
            <Textarea
                h="fit-content"
                fontSize={"xs"}
                color="#a8a9ee"
                bg="blackAlpha.400"
                type="number"
                value={`You're about to pay the total sum of ${amount}${token} from your connected wallet. Click on next to proceed`}
                {...props}
                isDisabled={isDisabled}
                pr={onMaxClick ? "40px" : "0"} // Adjust right padding based on button presence
            />
        </InputGroup>
    );
}
