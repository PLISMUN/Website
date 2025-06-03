import { Container, Heading, Text, Img, Center } from "@chakra-ui/react"
import Link from "next/link"
import React from "react"

function ZENWORKDisplay() {
  return (
    <Container maxW="110ch">
      <Center>
      <Img src="/images/sponsors/large/zenwork.png"></Img>
      </Center>
      <br />
      <br />
      <Text>
      We are Zenwork – the perfect place to work, meet and collaborate. Our modern coworking space is designed to inspire creativity, 
      foster innovation and connect like-minded individuals. Whether you’re a freelancer, startup or established business, 
      we have everything you need to succeed.
      </Text>
      <br />
      <Text>
      At Zenwork, we believe that work should be more than just a place to earn a living. We believe that work can be a source of fulfillment, 
      inspiration, and growth. That’s why we created a coworking space that is more than just a desk and a chair. Our space is a community of driven, passionate, 
      and diverse individuals who share a common goal: to build a better future.
      </Text>
      <br />
      <a href="https://zenwork.cz">https://zenwork.cz</a>
    </Container>
  )
}

ZENWORKDisplay.pageName = "ZENWORK"
export default ZENWORKDisplay

// this makes the page render only once on server startup, which is good for SEO + performance
// makes TTFB faster since the page is just sent immediately after the request rather than rendering it
export function getStaticProps() {
  return {
    props: {},
  }
}