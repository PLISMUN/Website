import { Container, Heading, Text } from "@chakra-ui/react"
import React from "react"

function About() {
  return (
    <Container maxW="110ch">
      <Text>
        With pride, we present to you the sixth annual Model United Nations
        conference hosted by{" "}
        <a href="https://parklane-is.com">Park Lane International School</a> in the 
        wonderful city of Prague.
        The conference is open to all students aged 13 - 18, targeted at both
        Model UN debutants and seasoned debating veterans from around Europe and the 
        world.
      </Text>
      <Text>
        The conference is completely student-led, with a passionate team of
        high-school MUN enthusiasts paving the way for several days of quality
        debate. We have worked day and night to ensure that all attendees
        develop skills and experience that will last a lifetime.
      </Text>

      <br />


      <Heading size="xl">OUR MISSION:</Heading>
      <Text>
        PLISMUN is proudly hosted by Park Lane International school and we
        believe in crafting an experience that follows our school motto,
        'preparing the young people of today for the unknown occupations of
        tomorrow.'
      </Text>

      <br />

      <Text>
        With this in mind, we have set ourselves six key goals which we aim to
        achieve:
      </Text>
      <ol>
        <li>
          <Text>
            Ensuring high-quality and challenging debate in which experienced
            participants are pushed to the limit,
          </Text>
        </li>
        <li>
          <Text>
            Providing a supportive environment where beginner delegates are
            introduced to MUN,
          </Text>
        </li>
        <li>
          <Text>
            Broadening all participants' spectrum of knowledge and creating
            well-rounded global citizens,
          </Text>
        </li>
        <li>
          <Text>
            Promoting mutual cooperation and rational conflict resolution,
          </Text>
        </li>
        <li>
          <Text>
            Educating today's generation about the work of the United Nations
            and the importance of diplomacy,
          </Text>
        </li>
        <li>
          <Text>
            Kindling new friendships and expanding a dynamic community of MUN
            enthusiasts.
          </Text>
        </li>
      </ol>
      <Text>
        It is our mission to contribute to the future of democracy by teaching
        the generations of today to influence the future world.
      </Text>

      <br /> 

      <Heading size="xl">MAIN THEME:</Heading>
      <Text>"Building future resilience through international development and cooperation"</Text>

      <br />
      
      <Text>If you have any other questions about PLISMUN '25, held in Prague, Czech Republic please contact us at  
        {}
        <a href="mailto:plismun@parklane-is.com"> plismun@parklane-is.com</a>.
      </Text>

    </Container>
  )
}

About.pageName = "ABOUT PLISMUN"
export default About

// this makes the page render only once on server startup, which is good for SEO + performance
// makes TTFB faster since the page is just sent immediately after the request rather than rendering it
export function getStaticProps() {
  return {
    props: {},
  }
}
