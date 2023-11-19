// pages/index.js
import React, { useState } from 'react';
import { Box, Grid, Button, Image, Text, HStack, Heading, Divider, List, ListItem, VStack, Select } from '@chakra-ui/react';
//@ts-ignore
import { usePay, PayButton } from 'mortystack'


const kittens = [
  { id: '1', moustache: null, filter: '0deg' },
  { id: '2', moustache: null, filter: '50deg' },
  { id: '3', moustache: null, filter: '120deg' },
];

const moustaches = [
  { id: '1', value: 1, image: '/moustache/1.svg' },
  { id: '2', value: 1, image: '/moustache/2.svg' },
  { id: '3', value: 1, image: '/moustache/3.png' },
  { id: '4', value: 2, image: '/moustache/4.png' },
  { id: '5', value: 4, image: '/moustache/5.svg' },
  { id: '6', value: 5, image: '/moustache/6.svg' },
];


const KittenStore = () => {
  const [currentKittenIndex, setCurrentKittenIndex] = useState(0);
  const [currentMoustacheIndex, setCurrentMoustacheIndex] = useState("0");
  const [payload, setPayLoad] = useState<any>()
  const [asset, setAsset] = useState<number>(1)
  const [amount, setAmount] = useState(0)
  const { appInfo } = usePay()



  const handleMoustacheClick = (moustacheId: any) => {
    setCurrentMoustacheIndex(moustacheId)
    setAmount(moustaches.find((x) => x.id === moustacheId)!.value)
    const updatedKittens = kittens.map((kitten) =>
      kitten.id === kittens[currentKittenIndex].id
        ? { ...kitten, moustache: moustacheId }
        : kitten
    );
  };

  const handleNextKitten = () => {
    setCurrentKittenIndex((prevIndex) => (prevIndex + 1) % kittens.length);
  };

  const handlePrevKitten = () => {
    setCurrentKittenIndex((prevIndex) =>
      prevIndex === 0 ? kittens.length - 1 : prevIndex - 1
    );
  };

  const renderKitten = (kitten: any) => {
    return (
      <Box key={kitten.id} position="relative" w="200px" h="200px">
        <Image
          src="/kitten.png"
          alt={`Kitten ${kitten.id}`}
          style={{ filter: `hue-rotate(${kitten.filter})` }}
        />
        <Box
          position="absolute"
          top="50%"
          marginTop={5}
          marginLeft={-5}
          left="50%"
          transform="translate(-50%, -50%)"
          zIndex="1"
          cursor="pointer"
        >
          {currentMoustacheIndex !== "0" && (
            <Image
              src={moustaches.find((m) => m.id === currentMoustacheIndex)?.image}
              alt="Moustache"
              w="100px"
              h="auto"
            />
          )}
        </Box>
      </Box>
    );
  }

  const renderMoustache = (moustache: any) => (
    <Box

      _hover={{
        bg: "white"
      }}
      bg={currentMoustacheIndex === moustache.id ? "white" : "transparent"}
      py={2}
      key={moustache.id}
      position="relative"
      w="auto" display={"flex"}
      justifyContent={"center"}
      alignItems={"center˝"}
      h="60px"
      onClick={() => handleMoustacheClick(moustache.id)}
    >
      <Image src={moustache.image} alt={`Moustache ${moustache.id}`} />
    </Box>
  );


  return (
    <Box p={4}>

      <Box>
        <Heading
          textAlign={"center"}
          px={[2, 2, 2, 12]}
          color="#333"
          pt={2}>Emergency Mustache Supplies for Kittens</Heading>
        <Text
          textAlign={"center"}
          fontStyle={"italic"}>... Because Every Kitten Deserves to Look Dapper!</Text>
      </Box>

      <main>
        <Grid
          pt={24}
          templateColumns="repeat(2, 1fr)" gap={2}>
          <Box>



            <HStack
              spacing={10}
              justifyContent={"center"}
              textAlign="center">
              <Button onClick={handlePrevKitten}>Previous</Button>

              <Box
                py={3}
                border="12px solid gray"
                cursor={"pointer"}
              >
                {renderKitten(kittens[currentKittenIndex])}
              </Box>


              <Button onClick={handleNextKitten}>Next</Button>
            </HStack>

            <Box

              pt={8} w="100%" justifyContent={"center"}
              alignItems={"center"}
              display={"flex"} flexDirection={"column"} px={5}>


              <  Divider
                mt={2}
                px={12} />
              <VStack
                justifyContent={"flex-start"}
                spacing={3} fontSize={"xs"}
                border={"1px solid gray"}
                boxShadow={"md"}
                borderRadius={"12px"}
                w="100%"
                alignItems={"flex-start"}
                maxW={"400px"}
                p={4}
              >

                <Text fontWeight={"bold"}>Organization ID:{appInfo && appInfo.id}  </Text>
                <Text>Subscription: </Text>
                <Text>Record ref: </Text>
                <Text>Total Value Raised: </Text>
                <Text >Breakdown: </Text>
                <List>
                  <ListItem>USDC:    value:  </ListItem>
                  <ListItem>WMATIC: value: </ListItem>
                  <ListItem>WETH:  value:</ListItem>
                </List>
              </VStack>

            </Box>
          </Box>
          <Box
            px={24}>
            <Grid
              p={4}
              cursor={"pointer"}
              bg="gray"
              templateColumns="repeat(3, 1fr)" gap={2}>
              {moustaches.map(renderMoustache)}
            </Grid>
            <Box mt={4}>
              <Text
                fontWeight={"bold"}
                fontSize={"lg"}
              >value: ${amount}.00</Text>

              <Text
                pt={10}
                fontSize={"xl"} fontWeight={"bold"}>Donate value in:</Text>
              <Select
                value={asset}
                onChange={(e) => setAsset(parseInt(e.target.value))}
                isDisabled={currentMoustacheIndex === "0" ? true : false}
              >
                <option value="">Pick an Asset</option>
                {appInfo && appInfo.assets.map((asset: any, index: number) => (
                  <option
                    key={index}
                    value={asset.id}>{asset.symbol}</option>
                ))
                }

              </Select>


              <PayButton
                payload={{
                  asset: asset,
                  amount: amount,
                  email: undefined,
                  name: undefined,
                  items: undefined,
                  acceptWrapped: true,
                }}
              />
              <br />
              <Text fontSize={"xs"}>Please do not disable pop up in browser</Text>


            </Box>
          </Box>
        </Grid>

      </main >
    </Box>
  );
};

export default KittenStore;
