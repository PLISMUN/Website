import { Container, Heading, Text, Img, Center } from "@chakra-ui/react"
import Link from "next/link"
import React from "react"

function ARCI() {
  return (
    <Container maxW="110ch">
      <Center>
      <Img src="../images/sponsors/large/churchcharity.png"></Img>
      </Center>
      <br />
      <br />
      <Text>
      Arcidiecézní charita Praha je profesionální poskytovatel sociálních služeb s více než stoletou
historií. V pražské arcidiecézi ročně pomáhá více než 20 tisícům lidí v nouzi - seniorům,
rodinám v tísni, lidem s postižením a dalším potřebným. Ke klíčovým sociálním službám patří
5 domovů pro seniory, 8 azylových domů, pečovatelské a zdravotní služby v domácnostech
a odborné sociální poradenství. Charity v pražské arcidiecézi zřizují více než 60
registrovaných sociálních služeb.
      </Text>
      <br />
      <Text>
      Od roku 1993 se Arcidiecézní charita Praha významně angažuje také v rozvojových zemích.
Její stěžejní zahraniční projekty zahrnují program Adopce na dálku®, který za 30 let
existence pomohl ke vzdělání více než 38 tisícům dětí, a Českou nemocnici v Ugandě, která
od roku 2006 poskytuje zdravotní péči tisícům pacientů v kraji Buikwe. Charita působí
především v Ugandě, Indii a Bělorusku, kde kromě vzdělávání a zdravotnictví podporuje také
komunitní rozvoj, budování infrastruktury a drobné podnikání.
      </Text>
      <br />
      <Text>Poslání Charity pramení z pověření katolické církve šířit ve světě dobro, spravedlnost a
      naději, s důrazem na ochranu lidské důstojnosti a solidaritu s potřebnými.</Text>
      <br />
      <a href="https://praha.charita.cz/">https://praha.charita.cz/</a>
    </Container>
  )
}

ARCI.pageName = "Arcidiecézní charita Praha"
export default ARCI

// this makes the page render only once on server startup, which is good for SEO + performance
// makes TTFB faster since the page is just sent immediately after the request rather than rendering it
export function getStaticProps() {
  return {
    props: {},
  }
}