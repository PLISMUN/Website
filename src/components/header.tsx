import Image from "next/image"
import { Heading, Center } from "@chakra-ui/react"

type HeaderProps =
  | {
      title?: undefined
      mainPage: true
    }
  | {
      title: string
      mainPage?: undefined
    }

export default ({ title, mainPage }: HeaderProps) => {
  return (
    <div
      style={{
        paddingBottom: mainPage ? "12vh" : "16vh",
      }}
    >
      <Center
        paddingTop="8vh"
        flexDir="column"
        backgroundImage={'url("/images/headertest4.png")'}
        backgroundPosition="center center"
        backgroundSize={2500}
        paddingBottom="8vh"
        
      >
        {mainPage ? (
          <>
            <Image src="/images/plismun25logo.png" height={500} width={500}/>
            <Heading color="white" userSelect="none" pointerEvents="none">JANUARY 30TH - FEBRUARY 2ND 2025</Heading>
            <a href="/partners/cobis">
              <Image src="/images/cobiswhite.png" height={200} width={600}/>
            </a>
          </>
        ) : (
          <Heading color="white">{title}</Heading>
        )}
      </Center>
    </div>
  )
}
