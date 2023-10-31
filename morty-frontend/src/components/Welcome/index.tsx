
import { Box, Button, Center, Heading, VStack, Text, Divider } from '@chakra-ui/react'
import HeroTitle from './HeroTitle'
import Features from './FeaturesGrid'
import Tokens from './Tokens';
import AnimatedLandingPage from './AnimatedHero';
import HowItWorks from './HowitWorks';
import Footer from './Footer';


const featuresData = [
    {
        title: 'Seamless Payment Experience  ',
        subtitle: 'Integrate Morty once and let your customers pay your however they want',
        image: '',
    },
    {
        title: 'Delight your Customers',
        subtitle: "Opt-in for morty's after-sales magic",
        image: '',
    },
    // Add more features as needed
];

export const logos = [
    "chainlink.svg", "usdc.svg", "bnb.svg", "bitcoin.svg", "eth.svg", "filecoin.svg", "matic.svg"
];



export default function Welcome() {
    return (
        <>
            <Box color="white" h="100%">

                {/* <AnimatedLandingPage /> */}
                <HeroTitle title={"The Algorand Solution For Your Business"}
                    subtitle={"Choose the easy way! Accept tokenized payments on algorand, and offer more to your customers "} />
                <Features features={featuresData} />

                <HowItWorks />
                <Tokens logos={logos} />
                <Footer />
            </Box >
        </>
    )
}
