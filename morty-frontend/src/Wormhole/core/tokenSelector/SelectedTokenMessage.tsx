import { useWormholeContext } from "@/contexts/WormholeContext/WormholeStoreContext";
import { Textarea, InputGroup } from "@chakra-ui/react";

export default function SelectedTokenMessage({
    onMaxClick,
    token,
    amount,
    isDisabled,
    ...props
}: any) {

    const { balanceConfirmed, isValidating }: any = useWormholeContext()
    return (
        <InputGroup>
            <Textarea
                h="fit-content"
                fontSize={"xs"}
                color={!isValidating && !balanceConfirmed ? "red" : "#a8a9ee"}
                bg="blackAlpha.400"
                type="number"

                value={
                    !isValidating && !balanceConfirmed ? ` Insufficient Balance to cover transaction fees and transfer of ${amount}${token}` :


                        `You're about to pay the total sum of ${amount}${token} from your connected wallet. Click on next to proceed`}
                {...props}
                isDisabled={isDisabled}
                pr={onMaxClick ? "40px" : "0"} // Adjust right padding based on button presence
            />
        </InputGroup>
    );
}
