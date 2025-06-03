import { Container, Heading, Text } from "@chakra-ui/react"
import Link from "next/link"
import React from "react"

function FAQ() {
  return (
    <Container maxW="110ch">

      <br />

      <Heading size="lg">1. How do I apply?</Heading>
      <Text>There are a few steps in the application process:</Text>
      <ol>
        <li>
          <Text>
            Create an account on plismun.com by going to the login, followed by
            the {} 
            <a href="/user/signup">signup page</a> then logging into your account again on
            the {}
            <a href="/user/login">login page</a>.
          </Text>
        </li>
        <li>
          <Text>
            Once logged in, heading to the user, followed by {}
            <a href="/user/apply">application page</a>.
          </Text>
        </li>
        <li>
          <Text>
            There are all the possible application you would need to sign up for which are delegate and chair.
          </Text>
        </li>
      </ol>

      <br />

      <Heading size="lg">2. Where can I find the country matrices for the committees?</Heading>
      <Text>
        All the information about the {} 
        <a href="/committees">committees</a> page of the website.
      </Text>

      <br />
      <Heading size="lg">3. What's the best way to get to the Úvoz Campus?</Heading>
      <Text>There are a few different ways to travel to our campus.</Text>
      <ol>
        <li>
          <Text>Travel on the 22 or 23 tram to Pohořelec and walk down the hill.</Text>
        </li>
        <li>
          <Text>
            Take the trams 12,15,20,22 to Malostranské náměstí and walk up the hill.
          </Text>
        </li>
        <li>
          <Text>
            Alternatively, you can take 194 bus from Malostranská to Nemocnice pod Petřínem
             and walk up the hill from the rear enterance of the Úvoz campus.
          </Text>
        </li>
      <br />
      
      <Text>The full address is: <b>Úvoz 227, 118 00 Malá Strana, Czechia</b></Text>
      
      <br />
      <Text>Please note that this is the standard operation, may be changed.
        Check {}
        <a href="https://dpp.cz">DPP</a>  (the city's public transport provider) for more details on your route.
      </Text>
      </ol>

      <br />

      <br />
      <Heading size="lg">4. What if I want to change my PLISMUN country & committee choices?</Heading>
      <Text>Normally, when you submit your application your choices are locked in but if there are
        spare spaces closer towards the conference there might be a chance for a change.
      </Text>

      <br />
      <Heading size="lg">5. How much is the attendance fee for PLISMUN '25?</Heading>
      <Text>This years edition of PLISMUN is in partnership with COBIS (Council of British International Schools) meaning that registrations for the conference is handled through them initally. 
      The pricing of the conference is 70 EUR per person but there is a 400 EUR fee that the school must pay inorder for registration to occur. In addition there is another 50 EUR fee for the delegation 
      leaders. More can be found on the {} <a href="https://www.cobis.org.uk/students/forthcoming-events-activities/mun">COBIS Website</a>. 
      </Text>

      <br />
      <Heading size="lg">6. What if I do not receive any information about my application?</Heading>
      <Text>You should always receive some sort of notification for your application. If you do not
        receive any information within 24 hours of submission of your application please contact via our {}
        <a href="mailto:plismun@parklane-is.com">email</a>.
      </Text>
      <br />
      <Heading size="lg">7. I got an unknown error when submitting my application, what should I do?</Heading>
      <ol>
        <li>
          <Text>
          Firstly email us at {}
          <a href="mailto:plismun@parklane-is.com">plismun@parklane-is.com</a> for you to be able to
          get your confirmation email. </Text>
        </li>
        <li>
          <Text>
          Additionally, in the email send us the screenshot of the console so we are able to know how to fix it for
          next time. (Right click anywhere on the page, then Inspect Element, then the console.) </Text>
        </li>
        <Text>
          We apologise for the issues and we will attempt to get back to you within 24 hours an error occuring.
        </Text>
      </ol>
    </Container>
  )
}

FAQ.pageName = "FREQUENTLY ASKED QUESTIONS"
export default FAQ

// this makes the page render only once on server startup, which is good for SEO + performance
// makes TTFB faster since the page is just sent immediately after the request rather than rendering it
export function getStaticProps() {
  return {
    props: {},
  }
}
