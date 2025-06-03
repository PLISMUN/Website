import { Container, Heading, Text, Img, Center } from "@chakra-ui/react"
import Link from "next/link"
import React from "react"

function COBIS() {
  return (
    <Container maxW="110ch">
      <Center>
      <Img src="/images/cobiscolourv2.png"></Img>
      </Center>
      <br />
      <br />
      <Text>
      COBIS is a membership association that represents more than 400 schools and organisations globally. High-quality COBIS schools, which educate over 200,000 students and employ more than 17,000 teachers, can be found in more than 80 countries across Europe, Asia, Africa, the Middle East and the Americas. COBIS Supporting Associates provide a wide range of services and resources to the international schools sector.
      </Text>
      <br />
      <Text>
      As a student-centred organisation, we are committed to cultivating and celebrating student talent. We achieve this by delivering a broad programme of student activities with the generous support of host schools, Supporting Associates and other partner organisations. Our student activities include virtual and in-person events, competitions and awards. Through these activities, we hope to engage, challenge and inspire students of all ages and abilities.
      </Text>
      <br />
      <a href="https://www.cobis.org.uk/">https://cobis.org.uk</a>
    </Container>
  )
}

COBIS.pageName = "COBIS"
export default COBIS

// this makes the page render only once on server startup, which is good for SEO + performance
// makes TTFB faster since the page is just sent immediately after the request rather than rendering it
export function getStaticProps() {
  return {
    props: {},
  }
}