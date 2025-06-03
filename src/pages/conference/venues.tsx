import { Container, Heading, Text, Img, Center, Flex, Box} from "@chakra-ui/react"
import Link from "next/link"
import React from "react"
import { NextPage } from "next"

function venues() {
  return (

    
    <Container maxW="110ch">
      <Center>
      <Box 
      className="row"
      padding="10px 10px 10px 10px"
      listStyleType="none"
      justifyContent="center"
      width="80vw"
      >
      <Flex paddingRight="10px">
      <article className="c-project-card"> 
      {/* to add if you want skinner col col-4 col-d-6 col-t-12 */}
      <div className="c-project-card__content">
        <Link href="/uvoz">
          <Text></Text>
        </Link>
          <a className="c-project-card__image">
            <Img
              src="/images/headertest4.png" position="absolute"></Img>
          </a>
        <div className="c-project-card__info">
          <div className="c-project-card__info-wrap">
            <Heading size="lg" className="c-project-card__title-shown">
            Ùvoz Campus
            </Heading>
            <Text className="c-project-card__subtitle">
            Ùvoz 227
            </Text>
          </div>
        </div>
      </div>
      <Text>Ùvoz Campus is for the <b>debating</b> aspect of PLISMUN '25</Text>
    </article>
    </Flex>
    <Flex paddingLeft="10px">
      <article className="c-project-card"> 
      {/* to add if you want skinner col col-4 col-d-6 col-t-12 */}
      <div className="c-project-card__content">
        <Link href="/uvoz">
          <Text></Text>
        </Link>
          <a className="c-project-card__image">
            <Img
              src="/images/noveradnice.png" position="absolute"></Img>
          </a>
        <div className="c-project-card__info">
          <div className="c-project-card__info-wrap">
            <Heading size="lg" className="c-project-card__title-shown">
            Nová radnice
            </Heading>
            <Text className="c-project-card__subtitle">
            Mariánské náměstí 2/2, 11000 Praha 1-Staré Město
            </Text>
          </div>
        </div>
      </div>
      <Text>Nová radnice is for the <b>assembly</b> aspect of PLISMUN '25</Text>
    </article>
    </Flex>
    </Box>
    </Center>

    <br />
    <br />

      <Text><b>Map of PLISMUN '25 Locations:</b></Text>
      <br />
      <Center>
        <br />
        <Img
          src="/images/plismunmap25v4.png"
          //width="16"
          //height="9"
          borderRadius={5}
        />
      </Center>
      <br />
      <Center>
        <Text>
          For information on how to get to these locations please utilise websites like Google Maps and Apple Maps.
          <br />
          If you want to find tram & Metro times use { }
          <a href="https://dpp.cz">https://dpp.cz</a>
        </Text>
        <br />
      </Center>
      <br />
      <Center>
        <Text><b>Major Stops at Each Location:</b></Text>
      </Center>
      <br />
      <Center>
        <Text><u>Úvoz Campus (Ùvoz 227):</u></Text>
      </Center>
      <br />
      <Center>
        <ol>
          <li>
            <Text>Malostranská</Text>
          </li>
          <li>
            <Text>Malostranské námeští</Text>
          </li>
          <li>
            <Text>Pohořelec</Text>
          </li>
        </ol>
      </Center>
      <br />
      <Center>
        <Text><u>Nová radnice (Mariánské náměstí 2/2):</u></Text>
      </Center>
      <br />
      <Center>
        <ol>
          <li>
            <Text>Staroměstská</Text>
          </li>
        </ol>
      </Center>
      <br />
    </Container>
  )
}

venues.pageName = "VENUES"
export default venues

// this makes the page render only once on server startup, which is good for SEO + performance
// makes TTFB faster since the page is just sent immediately after the request rather than rendering it
export function getStaticProps() {
  return {
    props: {},
  }
}