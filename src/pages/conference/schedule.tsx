import { Container, Heading, Text, Img, Center } from "@chakra-ui/react"
import Link from "next/link"
import React from "react"

function schedule() {
  return (
    <Container maxW="110ch">
      <Text><b>PLISMUN '25 Schedule:</b></Text>
      <br />
      <Text>Please refer to the key below for the locations of each event.</Text>
      <br />
      <Center>
      <Img
        src="/images/plismun2025officialschedule.png"
        //width="16"
        //height="9"
        borderRadius={0}
        />
      </Center>
      <br />
      <Center>

      <Img
        src="/images/plismun2025officialgroups.png"
        //width="16"
        //height="9"
        borderRadius={0}
        />
      </Center>
      <br />
      <Text>If you need any help with understanding please contact {}
        <a href="mailto:pupil.archie.chapman@parklane-is.com">support</a>.
      </Text>
    </Container>
  )
}

schedule.pageName = "SCHEDULE"
export default schedule

// this makes the page render only once on server startup, which is good for SEO + performance
// makes TTFB faster since the page is just sent immediately after the request rather than rendering it
export function getStaticProps() {
  return {
    props: {},
  }
}