import {
  Container,
  Heading,
  Text,
  Img,
  GridItem,
  Grid,
  Flex,
  Box,
} from "@chakra-ui/react"
import React from "react"
import Image from "next/image"
import ASPIRONIX from "../../public/images/sponsors/large/aspironix.png"
import EDN from "../../public/images/sponsors/large/EDN.png"
import MONDI from "../../public/images/sponsors/large/mondi.png"
import FRUITISMO from "../../public/images/sponsors/large/fruitisimo.png"
import FRESHTASTY from "../../public/images/sponsors/large/freshtasty.png"
import ZENWORK from "../../public/images/sponsors/large/zenwork.png"
import AIRSEA from "../../public/images/sponsors/large/airsea.png"
import BCC from "../../public/images/sponsors/large/bcc-logo.png"
import YOUNG from "../../public/images/sponsors/large/youngtalentsfound.png"
import CHARITY from "../../public/images/sponsors/large/churchcharity.png"
import UNICEF from"../../public/images/sponsors/large/unicef.png"
import ORIEN from"../../public/images/sponsors/large/orion.png"

function Partners() {
  return (
    <Container maxW="110ch">
      <Heading>Our PLISMUN '25 partners are:</Heading>
      <br />
      {/* <Box
        className="row"
        padding="20px 10px 20px 10px"
        listStyleType="none"
        justifyContent="center"
        width="100vw"
      > */}

        <Flex
          minW="128"
          alignItems="center"
          justifyContent="center"
          flexDir="column"
          padding="6"
        >
          <a href="/partners/cobis" style={{ border: "0" }}>
            <Image height="140" width="400" src="/images/cobiscolour.png" />
          </a>
        </Flex>

        <Flex
          minW="128"
          alignItems="center"
          justifyContent="center"
          flexDir="column"
          padding="6"
        >
          <a href="/partners/youngtalentsfoundation" style={{ border: "0" }}>
            <Image height="72.5" width="240" src={YOUNG} />
          </a>
        </Flex>

        <Flex
          minW="128"
          alignItems="center"
          justifyContent="center"
          flexDir="column"
          padding="6"
        >
          <a href="/partners/zenwork" style={{ border: "0" }}>
            <Image height="72.5" width="240" src={ZENWORK} />
          </a>
        </Flex>

        <Flex
          minW="128"
          alignItems="center"
          justifyContent="center"
          flexDir="column"
          padding="6"
        >
          <a href="/partners/arcidiecezni" style={{ border: "0" }}>
            <Image height="72.5" width="200" src={CHARITY} />
          </a>
        </Flex>

        <Flex
          minW="128"
          alignItems="center"
          justifyContent="center"
          flexDir="column"
          padding="6"
        >
          <a href="https://orionreal.cz/" style={{ border: "0" }}>
            <Image height="100" width="150" src={ORIEN} />
          </a>
        </Flex>

      <Heading>Our PLISMUN '25 Patrons are:</Heading>
        <br />
        <Flex
          minW="128"
          alignItems="center"
          justifyContent="center"
          flexDir="column"
          padding="6"
        >
          <a href="https://www.unicef.cz/" style={{ border: "0" }}>
            <Image height="100" width="200" src={UNICEF} />
          </a>
        </Flex>
        <br />
        <Flex
          minW="128"
          alignItems="center"
          justifyContent="center"
          flexDir="column"
          padding="6"
        >
          <a href="https://www.britishchamber.cz/" style={{ border: "0" }}>
            <Image height="60" width="300" src={BCC} />
          </a>
        </Flex>
        <br />

      {/* <Heading>Our PLISMUN '24 partners were:</Heading> */}
      <br />
      {/* <Box
        className="row"
        padding="20px 10px 20px 10px"
        listStyleType="none"
        justifyContent="center"
        width="100vw"
      > */}

        {/* <Flex
          minW="128"
          alignItems="center"
          justifyContent="center"
          flexDir="column"
          padding="6"
        >
          <a href="/partners/zenwork" style={{ border: "0" }}>
            <Image height="90" width="400" src={ZENWORK} />
          </a>
        </Flex>

        <Flex
          minW="128"
          alignItems="center"
          justifyContent="center"
          flexDir="column"
          padding="6"
        >
          <a href="https://www.edn.cz" style={{ border: "0" }}>
            <Image height="144.9" width="138.2" src={EDN} />
          </a>
        </Flex> */}

        {/* <Flex
          minW="128"
          alignItems="center"
          justifyContent="center"
          flexDir="column"
          padding="6"
        >
          <a href="https://fruitisimo.cz/" style={{ border: "0" }}>
            <Image height="110" width="256" src={FRUITISMO} />
          </a>
        </Flex> */}

        {/* <Flex
          minW="128"
          alignItems="center"
          justifyContent="center"
          flexDir="column"
          padding="6"
        >
          <a href="https://www.freshandtasty.cz" style={{ border: "0" }}>
            <Image height="68" width="256" src={FRESHTASTY} />
          </a>
        </Flex> */}

        {/* <Flex
          minW="128"
          alignItems="center"
          justifyContent="center"
          flexDir="column"
          padding="6"
        >
          <a href="https://www.edn.cz/" style={{ border: "0" }}>
            <Image height="256" width="256" src={EDN} />
          </a>
        </Flex> */}
      {/* </Box> */}

      <br />

      <Heading>What is PLISMUN looking for?</Heading>

      <br />

      <Grid
        templateRows="repeat(1, 1fr)"
        templateColumns="repeat(3, 1fr)"
        gap={4}
        justifyContent="center"
        flexWrap="wrap"
        display="flex"
      >
        <GridItem maxW="250px">
          <Heading size="lg">Money</Heading>
          <Heading size="2xl">
            <ion-icon name="logo-euro" />
          </Heading>
          <Text>
            We are looking for financial donations of any size for us to sustain
            the costs of the conference. We are a student-led non-profit
            organization and all funds are allocated to the creation of this
            conference.
          </Text>
        </GridItem>

        <GridItem maxW="250px">
          <Heading size="lg">Speakers</Heading>
          <Heading size="2xl">
            <ion-icon name="person-outline" />
          </Heading>
          <Text>
            We are looking for experienced speakers, that are willing and able
            to deliver speeches within the context of topics that are debated
            and discussed at this conference. These can include politicians,
            journalists, diplomats, mentors and any other appropriate
            occupations.
          </Text>
        </GridItem>

        <GridItem maxW="250px">
          <Heading size="lg">Logistics</Heading>
          <Heading size="2xl">
            <ion-icon name="globe-outline" />
          </Heading>
          <Text>
            We are looking to collaborate with catering companies, venues for
            social events and many others to ensure the best possible experience
            for the whole conference.
          </Text>
        </GridItem>
      </Grid>

      <br />

      <Heading>Why PLISMUN?</Heading>
      <ul>
        <li>
          <Text>
            We are a full student-led organization that is composed of students
            from the years 9 to 13, receiving no money or compensation of any
            other kind,
          </Text>
        </li>

        <li>
          <Text>
            We are all enthusiasts and determined to be the next generation of
            leaders interested in politics, history, computer science, economics
            and many more,
          </Text>
        </li>

        <li>
          <Text>
            We are doing the most we can to deliver the best conference in
            Prague!
          </Text>
        </li>
      </ul>

      <br />

      <Heading>What do we offer?</Heading>
      <Text>
        We are offering many different tiers of sponsorship, where we promote your
        brand on our website, and social media, and handbooks given to
        individual participants of our conference mentions at the Opening and
        Closing Ceremonies and many more!
      </Text>
      <Text>
        If you are interested in parterning or sponsoring PLISMUN '25 please feel free to {}
        <a href="mailto:plismun@parklane-is.com">contact us</a>.
      </Text>


    </Container>
  )
}

Partners.pageName = "PARTNERS"
export default Partners

// this makes the page render only once on server startup, which is good for SEO + performance
// makes TTFB faster since the page is just sent immediately after the request rather than rendering it
export function getStaticProps() {
  return {
    props: {},
  }
}
