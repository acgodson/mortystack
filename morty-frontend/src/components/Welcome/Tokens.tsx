import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Box, Image, ChakraProvider, extendTheme, Heading } from '@chakra-ui/react';

const Tokens = ({ logos }: any) => {

    const settings = {
        dots: false,
        infinite: true,
        speed: 2000,
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 0,
        cssEase: 'linear',
        pauseOnHover: false,
        swipeToSlide: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2,
                },
            },
        ],
    };


    return (

        <>


            <Heading

                mt={32}
                px={[3, 3, 32]}
                letterSpacing={"1px"}
                fontSize={"2xl"}
                fontWeight={"semibold"}
                textAlign="center" mb={8}>
                Accept on &nbsp;
                <span style={{
                    color: "#659df6"
                }}>
                    Algorand, with MortyStack
                </span>
            </Heading>


            <Box w="100%"
                // bg="#152036"

                py={3}
                // position={"fixed"}
                // zIndex={"0"}
                bottom={0}
                overflow="hidden"
            >



                <Slider {...settings}>
                    {logos.map((logo: any, index: number) => (
                        <Box key={index} px={4}>
                            <Image
                                h="50px"
                                w="auto"
                                src={"/icons/" + logo} alt={`Logo ${index}`} />
                        </Box>
                    ))}
                </Slider>
            </Box>
        </>



    );
};

export default Tokens;
