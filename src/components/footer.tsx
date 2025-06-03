import { Box, Center, Container, Flex, Text, Img } from "@chakra-ui/react"
import { useRouter } from "next/router"
import Image from "next/image"
import ASPIRONIX from "../../public/images/sponsors/large/aspironix.png"
import EDN from "../../public/images/sponsors/large/EDN.png"
import MONDI from "../../public/images/sponsors/large/mondi.png"
import FRUITISMO from "../../public/images/sponsors/large/fruitisimo.png"
import FRESHTASTY from "../../public/images/sponsors/large/freshtasty.png"
import ZENWORK from "../../public/images/sponsors/large/zenwork.png"
import AIRSEA from "../../public/images/sponsors/large/airsea.png"
import YOUNG from "../../public/images/sponsors/large/youngtalentsfound.png"
import CHARITY from "../../public/images/sponsors/large/churchcharity.png"
import UNICEF from"../../public/images/sponsors/large/unicef.png"
import ORIEN from"../../public/images/sponsors/large/orien2.png"
import BCC from "../../public/images/sponsors/large/bcc-logo.png"

const Footer = () => {
  return (
    <footer className="footer">
      <Container centerContent>
       {/*  sponsor buttons */}
      <Box>
          <div className="social">
            <ul className="social__list list-reset">
              {/* <li className="social__item">
                <a
                  aria-label="twitter icon"
                  className="social__link"
                  href="https://twitter.com/plismun"
                  rel="noopener"
                  target="_blank"
                >
                  <ion-icon
                    name="logo-twitter"
                    style={{
                      verticalAlign: "middle",
                    }}
                  />
                </a>
              </li> */}

              <li className="social__item">
                <a
                  aria-label="instagram icon"
                  className="social__link"
                  href="https://instagram.com/plismun"
                  rel="noopener"
                  target="_blank"
                >
                  <ion-icon
                    name="logo-instagram"
                    style={{
                      verticalAlign: "middle",
                    }}
                  />
                </a>
              </li>

              {/* <li className="social__item">
                <a
                  aria-label="facebook icon"
                  className="social__link"
                  href="https://www.facebook.com/Plismunofficial/"
                  rel="noopener"
                  target="_blank"
                >
                  <ion-icon
                    name="logo-facebook"
                    style={{
                      verticalAlign: "middle",
                    }}
                  />
                </a>
              </li> */}

              <li className="social__item">
                <a
                  aria-label="email icon"
                  className="social__link"
                  href="mailto:plismun@parklane-is.com"
                  rel="noopener"
                  target="_blank"
                >
                  <ion-icon
                    name="mail"
                    style={{
                      verticalAlign: "middle",
                    }}
                  />
                </a>
              </li>
            </ul>
          </div>
        </Box>
        {/* sponsors */}
        <Box
          className="row"
          padding="20px 10px 20px 10px"
          listStyleType="none"
          justifyContent="center"
          width="80vw"
        >

    

          {/* <Flex
            minW="128"
            alignItems="center"
            justifyContent="center"
            flexDir="column"
            padding="6"
          >
            <a id="zenworkimage" href="/partners/zenwork" style={{ border: "0" }}>
              <Image height="45" width="190" src={ZENWORK} />
            </a>
          </Flex> */}

  

          {/* <Flex
            minW="128"
            alignItems="center"
            justifyContent="center"
            flexDir="column"
            padding="6"
          >
            <a id="zenworkimage" href="https://edn.cz/" style={{ border: "0" }}>
              <Image height="100" width="90" src={EDN} />
            </a>
          </Flex> */}

          {/* <Flex
            minW="128"
            alignItems="center"
            justifyContent="center"
            flexDir="column"
            padding="6"
          >
            <a href="https://freshtasty.cz/" style={{ border: "0" }}>
              <Image height="34" width="128" src={FRESHTASTY} />
            </a>
          </Flex> */}
        {/* </Box> */}

        {/* cobis */}
        {/* <Img
        src="/images/cobiswhite.png"
        width="1000"
        height="200"
        borderRadius={5}
        />
 */}
        <Flex
          minW="128"
          alignItems="center"
          justifyContent="center"
          flexDir="column"
          padding="6"
        >
          <a href="/partners/cobis" style={{ border: "0" }}>
            <Image height="150px" width="450px" src="/images/cobiswhite.png" />
          </a>
        </Flex>

        <Flex
            minW="128"
            alignItems="center"
            justifyContent="center"
            flexDir="column"
            padding="6"
            
          >
            <a  id="zenworkimage" href="/partners/youngtalentsfoundation" style={{ border: "0" }}>
              <Image height="100" width="300"  src={YOUNG} />
            </a>
        </Flex>

        <Flex
            minW="128"
            alignItems="center"
            justifyContent="center"
            flexDir="column"
            padding="6"
            
          >
            <a  id="zenworkimage" href="/partners/zenwork" style={{ border: "0" }}>
              <Image height="45" width="190"  src={ZENWORK} />
            </a>
        </Flex>

        <Flex
            minW="128"
            alignItems="center"
            justifyContent="center"
            flexDir="column"
            padding="6"
            
          >
            <a  id="zenworkimage" href="/partners/arcidiecezni" style={{ border: "0" }}>
              <Image height="100" width="300"  src={CHARITY} />
            </a>
        </Flex>

        <Flex
            minW="128"
            alignItems="center"
            justifyContent="center"
            flexDir="column"
            padding="6"
            
          >
            <a  id="zenworkimage" href="/www.unicef.cz" style={{ border: "0" }}>
              <Image height="100" width="200"  src={UNICEF} />
            </a>
        </Flex>

        <Flex
            minW="128"
            alignItems="center"
            justifyContent="center"
            flexDir="column"
            padding="6"
            
          >
            <a  id="zenworkimage" href="https://orionreal.cz/" style={{ border: "0" }}>
              <Image height="100" width="150"  src={ORIEN} />
            </a>
        </Flex>

        <Flex
            minW="128"
            alignItems="center"
            justifyContent="center"
            flexDir="column"
            padding="6"
            
          >
            <a  id="zenworkimage" href="https://www.britishchamber.cz/" style={{ border: "0" }}>
              <Image height="60" width="300"  src={BCC} />
            </a>
        </Flex>

      </Box>

        <br />

        {/* credits */}
        <Text id="credits">
          Made by{" "}
          <a id="credits2" href="https://github.com/oof2win2">Honza Kocourek</a>
        </Text>
        <Text id="credits">
          Managed by{" "}
          <a id="credits2" href="https://github.com/notdiamxnd">Archie Chapman</a>
        </Text>
        <br />
        <Text id="credits">
          PLISMUN '25
        </Text>
      </Container>
    </footer>
  )
}

export default Footer
