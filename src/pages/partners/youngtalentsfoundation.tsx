import { Container, Heading, Text, Img, Center } from "@chakra-ui/react"
import Link from "next/link"
import React from "react"

function YOUNGTALENTSFOUNDATION() {
  return (
    <Container maxW="110ch">
      <Center>
      <Img src="/images/sponsors/large/youngtalentsfound.png"></Img>
      </Center>
      <br />
      <br />
      <Text>
      In  the Young Talents Foundation we believe in the power of potential. Our mission is to support and nurture young, talented individuals across various fields, providing them with the resources, mentorship, and opportunities they need to thrive. Through scholarships, workshops, and community engagement, we aim to empower the next generation of leaders, innovators, and creators.
      </Text>
      <br />
      <a href="https://youngtalentsfoundation.com/">https://youngtalentsfoundation.com/</a>
    </Container>
  )
}

YOUNGTALENTSFOUNDATION.pageName = "YOUNG TALENTS FOUNDATION"
export default YOUNGTALENTSFOUNDATION

// this makes the page render only once on server startup, which is good for SEO + performance
// makes TTFB faster since the page is just sent immediately after the request rather than rendering it
export function getStaticProps() {
  return {
    props: {},
  }
}