import React, { ReactNode } from 'react';
import { useLottie } from "lottie-react";
import animation from "./spin.json"

export interface SpinnerRenderProps {
    children: (renderProps: {
        widget: ReactNode;
    }) => ReactNode;
}

export function SpinnerRender({ children }: SpinnerRenderProps) {

    const options = {
        animationData: animation,
        loop: true
    };
    const { View } = useLottie(options);

    return <>{children({ widget: View })}</>;
}


