import { Stepper, Step, StepIndicator, StepStatus, StepIcon, StepNumber, StepSeparator } from "@chakra-ui/react";






export function BridgeSteps({ active }: { active: number }) {
    return (
        <>

            <Stepper
                display={"flex"}
                index={active} orientation="horizontal">
                <Step >
                    <StepIndicator>
                        <StepStatus
                            complete={<StepIcon />}
                            incomplete={<StepNumber />}
                            active={<StepNumber />}
                        />
                    </StepIndicator>

                    <StepSeparator />
                </Step>

                <Step>
                    <StepIndicator>
                        <StepStatus
                            complete={<StepIcon />}
                            incomplete={<StepNumber />}
                            active={<StepNumber />}
                        />
                    </StepIndicator>
                    <StepSeparator />
                </Step>

                <Step>
                    <StepIndicator>
                        <StepStatus
                            complete={<StepIcon />}
                            incomplete={<StepNumber />}
                            active={<StepNumber />}
                        />
                    </StepIndicator>

                    <StepSeparator />
                </Step>
            </Stepper>

        </>
    )
}