import React from "react"
import {Center, Container, Divider, Flex, Heading, Text, Img,} from "@chakra-ui/react"
import Image from "next/image"
import { Document, Page } from 'react-pdf';

function Home() {
  return (
    <Container maxW="110ch">
      <Text>
      Park Lane International School Model United Nations
      (PLISMUN) is a conference where students aged 13 - 18 discuss topics of global
      importance by representing countries in a simulation of select committees of
      the United Nations.
      </Text>
      <br />
      <Text>
      This is the seventh annual edition of PLISMUN (Parklane International School Model United Nations), held in the wonderful city of Prague, Czech Republic, which is
      organised and run by students of Park Lane. You can find out more about the
      team in the {}
      <a href="/about">About page</a>.
      </Text>
      <br />
      <Text>
      PLISMUN '25 has 9 committees which means that
      first-time beginner delegates and seasoned debating veterans alike will find their place among the different
      committees, providing a range of difficulty levels.
      </Text>
      <br />
      <Divider margin="1em" />
      <Center>
        <Text><u><b>Latest news about PLISMUN'25:</b></u></Text>
      </Center>
      <Divider margin="1em" />
      <br />
      <Container maxW="l" centerContent>
        <Heading><u>STUDY GUIDES ADDED</u></Heading>
        <Text>Posted: 02/01/25</Text>
        <br />
        <Text> Dear Delegates, Chairs and Honourable Guests,</Text>
        <br />
        <Text> The study guides for every committee now have been added.</Text>
        <br />
        <Text></Text>
        <br />
        <Divider margin="1em" />
        <br />
      </Container>
      <br />
      <Divider margin="1em" />
      <Center flexDir="column">
        <br />
        <Img
        src="/images/plismunbackgroundbanner2.png"
        //width="16"
        //height="9"
        borderRadius={16}
        />
      </Center>
      <Divider margin="1em" />

    </Container>
  )
}

Home.mainPage = true

export default Home

// this makes the page render only once on server startup, which is good for SEO + performance
// makes TTFB faster since the page is just sent immediately after the request rather than rendering it
export function getStaticProps() {
  return {
    props: {},
  }
}
