import React, { useEffect } from "react"
import Link from "next/link"
import { Container, Heading, Text } from "@chakra-ui/react"
import { useAppDispatch, useAppSelector } from "@/utils/redux/hooks"
import {
  Application,
  apply,
  ExtraData,
  setExtraData,
} from "@/utils/redux/parts/user"
import { AppliedUser, ChairApplication, Delegation } from "@prisma/client"

function ApplyIndex() {
  const { application } = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()
  useEffect(() => {
    const run = async () => {
      const req = await fetch("/api/user/application")
      if (req.status !== 200) return
      const json = await req.json()
      const data = json.data as Application
      dispatch(apply(data))

      const extraQuery = await fetch("/api/user/application/delegation")
      if (extraQuery.status !== 200) return
      const extraJson = (await extraQuery.json()) as ExtraData
      dispatch(setExtraData(extraJson))
    }
    run()
  }, [])

  if (!application)
    return (
      <Container maxW="110ch">
        <br />
        <Heading>DELEGATE APPLICATIONS:</Heading>
        {/* <Text>Closed as of December 18th, 2023</Text> */}
        <Text>If your school applied through the COBIS Registration, please ask your Delegation Leader for the relevant information. </Text>
        {/* <Link href="/user/apply/delegate">Apply to be a delegate here</Link> */}
        {/* <Text>Delegate Applications are opening soon, keep a lookout at our {}
          <a href="https://instagram.com/plismun">Instagram</a> for more updates
        </Text> */}

        <br />
        <br />

        <Heading>CHAIR APPLICATIONS:</Heading>
        {/* <Text>If your school applied through the COBIS Registration, please ask your Delegation Leader for the relevant information. </Text> */}
        <Text>Closed as of November 10th, 2023</Text>
        <Text><b>Note:</b> Thank you all for the applications and we hope to see you apply for chair in 2025!</Text>
        {/* <Link href="/user/apply/chair">Apply to be a chair for PLISMUN'25</Link> */}
        {/* <Text>Chair applications are opening on the October 18th</Text> */}
        {/* <Text>These applications will not be subjected to the COBIS school fee if you are applying as an individual, so you are able to come as an individual to PLISMUN'25. If you are a COBIS School you will still be subjected to the COBIS fee.</Text> */}

        <br />
        <br />

        {/* <Heading>DELEGATION LEADER APPLICATIONS:</Heading>
        <Link href="/user/apply/delegation">Apply to be a delegation leader here</Link>
        <Text>Delegation applications are closed, if you wish to come as a delegation please {}
          <a href="mailto:plismun@parklane-is.com">email us</a>.
        </Text> */}
      </Container>
    )

  if (application.type === "delegation") {
    return (
      <Container maxW="110ch">
        <Text>
          You are a leader of the {application.application.name} delegation
        </Text>
      </Container>
    )
  }

  return (
    <Container maxW="110ch">
      <Text>
        You have already submitted a {application.type} application. Please
        check your email inbox for updates on your application. If you have not received
        any information feel free to {}
        <a href="mailto:plismun@parklane-is.com">contact us</a>.
      </Text>

      <br />

      <Text>
        Your application status: {" "}
        {application.application.finalCommittee ? "accepted" : "pending"}
      </Text>
    </Container>
  )
}

ApplyIndex.pageName = "APPLICATIONS"
export default ApplyIndex
