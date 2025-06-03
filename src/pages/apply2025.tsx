import { Container, Heading, Text, Img } from "@chakra-ui/react"
import React from "react"

function apply2025() {
  return (
    <Container maxW="110ch">
      <Text>Hello!</Text>

      <br />
      <Img
        src="/images/debate_image7.JPG"
        //width="16"
        //height="9"
        borderRadius={16}
      />
    </Container>
  )
}

apply2025.pageName = "PLISMUN 2025 Apply"
export default apply2025

// this makes the page render only once on server startup, which is good for SEO + performance
// makes TTFB faster since the page is just sent immediately after the request rather than rendering it
export function getStaticProps() {
  return {
    props: {},
  }
}
