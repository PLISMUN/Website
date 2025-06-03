import {
  AppliedUser,
  ChairApplication,
  Committee,
  CommitteeCountries,
  Delegation,
  User,
} from "@prisma/client"
import nodemailer from "nodemailer"
import ENV from "./env"
import { Application } from "./redux/parts/user"
import fs from "fs/promises"
import path from "path"
import {
  chairApplicationHTML,
  chairApplicationTXT,
  chairInfoHTML,
  chairInfoTXT,
  delegateInitalHTML,
  delegateInitalTXT,
  delegateAcceptHTML,
  delegateAcceptTXT,
  delegateDenyHTML,
  delegateDenyTXT,
  delegationHTML,
  delegationTXT,
} from "./templates"


console.log("Import Succeed");

const transport = nodemailer.createTransport({
  pool: true,
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use TLS
  auth: {
    user: ENV.EMAIL_USERNAME,
    pass: ENV.EMAIL_PASSWORD,
  },
})
console.log("Login Succeeded");

// Initial Delegation Application
export async function sendDelegationEmail(user: User, application: Delegation) {
  /* let text = await fs.readFile(
    path.join(".", "src", "utils", "templates", "delegation.txt"),
    "utf8"
  )
  let html = await fs.readFile(
    path.join(".", "src", "utils", "templates", "delegation.html"),
    "utf8" 
  ) */
  
    
  let text = delegationTXT
    .replaceAll("{FIRSTNAME}", user.firstname)
    .replaceAll("{LASTNAME}", user.lastname)
    .replaceAll("{DELEGATION}", application.name)
  let html = delegationHTML
    .replaceAll("{FIRSTNAME}", user.firstname)
    .replaceAll("{LASTNAME}", user.lastname)
    .replaceAll("{DELEGATION}", application.name) 
  transport.sendMail({
    to: user.email,
    from: ENV.EMAIL_USERNAME,
    subject: "Your PLISMUN Delegation Application",
    text: text,
    html: html,
  })
  transport.sendMail({
    to: ENV.NOTIFICATIONEMAIL,
    from: ENV.EMAIL_USERNAME,
    subject: "New PLISMUN Delegation Application",
    text: text,
    html: html,
  })
}

// Inital Chair Email (Try to fix for 2025)
export async function sendChairEmail(
  user: User,
  application: ChairApplication,
  committees: Committee[],
  delegation: Delegation | null
) {
  let messages = []
  for (const type of ["chair", "chairInfo"]) {
    const data = []
    for (const filetype of ["txt", "html"]) {
      data.push(
        await fs.readFile(
          path.join(".", "src", "utils", "templates", `${type}.${filetype}`),
          "utf8"
        )
      )
    }
    messages.push(data)
  }
  const delegationText = delegation
    ? `You are part of the ${delegation.name} delegation`
    : "You have not applied as part of a delegation"
  messages = messages.map((ending) => {
    return ending.map((msg) => {
      return msg
        .replaceAll("{FIRSTNAME}", user.firstname)
        .replaceAll("{LASTNAME}", user.lastname)
        .replaceAll(
          "{COM1}",
          committees.find((c) => c.id === application.choice1committee)
            ?.displayname || ""
        )
        .replaceAll(
          "{COM2}",
          committees.find((c) => c.id === application.choice2committee)
            ?.displayname || ""
        )
        .replaceAll(
          "{COM3}",
          committees.find((c) => c.id === application.choice3committee)
            ?.displayname || ""
        )
        .replaceAll("{DELEGATIONTEXT}", delegationText)
        .replaceAll("{MOTIVATION}", application.motivation)
        .replaceAll("{EXPERIENCE}", application.experience)
        .replaceAll("{PHONE}", application.phone)
        .replaceAll("{EMAIL}", user.email)
        .replaceAll("{SCHOOL}", application.school ?? "Not provided")
        .replaceAll("{DIET}", application.diet)

    })
    
  })
  transport.sendMail({
    to: user.email,
    from: ENV.EMAIL_USERNAME,
    bcc: ENV.NOTIFICATIONEMAIL,
    subject: "Your PLISMUN Chair Application",
    text: messages[0][0],
    html: messages[0][1],

  })
  transport.sendMail({
    to: ENV.NOTIFICATIONEMAIL,
    from: ENV.EMAIL_USERNAME,
    subject: "New PLISMUN Chair Application",
    text: messages[1][0],
    html: messages[1][1],
  })
  console.log("Inital Chair Application Sent");
}



export async function sendChairEmailRedo(
  user: User,
  application: ChairApplication,
  committees: Committee[],
  delegation: Delegation | null
) {

  const delegationText = delegation
    ? `You are part of the ${delegation.name} delegation`
    : "You have not applied as part of a delegation"
  
  let text = chairApplicationTXT
  let html = chairApplicationHTML

  const format = (msg: string) => {
    return msg
      .replaceAll("{FIRSTNAME}", user.firstname)
      .replaceAll("{LASTNAME}", user.lastname)
      .replaceAll("{DELEGATIONTEXT}", delegationText)
      .replaceAll(
        "{COM1}",
        committees.find((x) => x.id == application.choice1committee)!
          .displayname
      )
      .replaceAll(
        "{COM2}",
        committees.find((x) => x.id == application.choice2committee)!
          .displayname
      )
      .replaceAll(
        "{COM3}",
        committees.find((x) => x.id == application.choice3committee)!
          .displayname
      )
      .replaceAll("{MOTIVATION}", application.motivation)
      .replaceAll("{EXPERIENCE}", application.experience)
      .replaceAll("{DIET}", application.diet)
      .replaceAll("{SCHOOL}", application.school ?? "Not provided")
  }
  text = format(text)
  html = format(html)
  console.log(user.email)

  await transport.sendMail({
    to: user.email,
    from: ENV.EMAIL_USERNAME,
    subject: "PLISMUN '25 Chair Application",
    bcc: ENV.NOTIFICATIONEMAIL,
    text: text,
    html: html,
  })
}

export async function sendChairEmailStaffing(
  user: User,
  application: ChairApplication,
  committees: Committee[],
  delegation: Delegation | null
) {

  const delegationText = delegation
    ? `You are part of the ${delegation.name} delegation`
    : "You have not applied as part of a delegation"
  
  let text = chairInfoTXT
  let html = chairInfoHTML

  const format = (msg: string) => {
    return msg
      .replaceAll("{FIRSTNAME}", user.firstname)
      .replaceAll("{LASTNAME}", user.lastname)
      .replaceAll(
        "{COM1}",
        committees.find((x) => x.id == application.choice1committee)!
          .displayname
      )
      .replaceAll(
        "{COM2}",
        committees.find((x) => x.id == application.choice2committee)!
          .displayname
      )
      .replaceAll(
        "{COM3}",
        committees.find((x) => x.id == application.choice3committee)!
          .displayname
      )
      .replaceAll("{MOTIVATION}", application.motivation)
      .replaceAll("{EXPERIENCE}", application.experience)
      .replaceAll("{DIET}", application.diet)
      .replaceAll("{SCHOOL}", application.school ?? "Not provided")
      .replaceAll("{EMAIL}", user.email)
      .replaceAll("{PHONE}", application.phone)
      .replace("{SHIRT}", application.shirtSize ?? "Not provided")
  }
  text = format(text)
  html = format(html)

  await transport.sendMail({
    to: ["pupil.sophie.straus@parklane-is.com", "pupil.eva.wray@parklane-is.com"],
    from: ENV.EMAIL_USERNAME,
    subject: "New PLISMUN '25 Chair Application",
    bcc: ENV.NOTIFICATIONEMAIL,
    text: text,
    html: html,
  })
}


// Inital Delegate Email
export async function sendDelegateEmail(
  user: User,
  application: AppliedUser,
  committees: Committee[],
  countries: CommitteeCountries[],
  delegation: Delegation | null
) {
  /* let text = await fs.readFile(
    path.join(".", "src", "utils", "templates", "delegate.txt"),
    "utf8"
  )
  let html = await fs.readFile(
    path.join(".", "src", "utils", "templates", "delegate.html"),
    "utf8"
  ) */
  console.time()
  const delegationText = delegation
    ? `You are part of the ${delegation.name} Delegation`
    : "You have not applied as part of a delegation"

  let text = delegateInitalTXT
  let html = delegateInitalHTML
  console.log("Delegate Check 1")

  const format = (msg: string) => {
    return msg
      .replaceAll("{FIRSTNAME}", user.firstname)
      .replaceAll("{LASTNAME}", user.lastname)
      .replaceAll("{DELEGATIONTEXT}", delegationText)
      .replaceAll(
        "{COM1}",
        committees.find((x) => x.id == application.choice1committee)!
          .displayname
      )
      .replaceAll(
        "{COM2}",
        committees.find((x) => x.id == application.choice2committee)!
          .displayname
      )
      .replaceAll(
        "{COM3}",
        committees.find((x) => x.id == application.choice3committee)!
          .displayname
      )
      .replaceAll("{CON1}", application.choice1country)
      .replaceAll("{CON2}", application.choice2country)
      .replaceAll("{CON3}", application.choice3country)
  }

  console.log("Delegate Check 2")
  text = format(text)
  html = format(html)

  console.log("Delegate Check 3")
  console.log(user.email)
  console.time()
  await transport.sendMail({
    to: user.email,
    from: ENV.EMAIL_USERNAME,
    subject: "PLISMUN '25 Delegate Application",
    bcc: ENV.NOTIFICATIONEMAIL,
    text: text,
    html: html,
  })
console.log("Delegate Inital Email Sent")
console.log("Notification Email Sent")
console.timeEnd()
}

// Delegate Accept
export async function sendDelegateAcceptance(
  delegate: User,
  committee: Committee,
  country: CommitteeCountries
) {
  /* let text = await fs.readFile(
    path.join(".", "src", "utils", "templates", "delegateAccept.txt"),
    "utf8"
  )
  let html = await fs.readFile(
    path.join(".", "src", "utils", "templates", "delegateAccept.html"),
    "utf8"
  ) */

  let text = delegateAcceptTXT
  let html = delegateAcceptHTML
  const replacer = (text: string) => {
    return text
      .replaceAll("{FIRSTNAME}", delegate.firstname)
      .replaceAll("{LASTNAME}", delegate.lastname)
      .replaceAll("{COMMITTEE}", committee.displayname)
      .replaceAll("{COUNTRY}", country.country)
  }
  await transport.sendMail({
    to: delegate.email,
    from: ENV.EMAIL_USERNAME,
    bcc: ENV.NOTIFICATIONEMAIL,
    subject: "PLISMUN '25 Delegate Application Acceptance",
    text: replacer(text),
    html: replacer(html),
  })
  console.log("Delegate Accept Email Sent")
}

// Delegate Deny
export async function sendDelegateDeny(delegate: User) {
  /* let text = await fs.readFile(
    path.join(".", "src", "utils", "templates", "delegateDeny.txt"),
    "utf8"
  )
  let html = await fs.readFile(
    path.join(".", "src", "utils", "templates", "delegateDeny.html"),
    "utf8"
  ) */
  let text = delegateDenyTXT
  let html = delegateDenyHTML
  const replacer = (text: string) => {
    return text
      .replaceAll("{FIRSTNAME}", delegate.firstname)
      .replaceAll("{LASTNAME}", delegate.lastname)
  }
  await transport.sendMail({
    to: delegate.email,
    from: ENV.EMAIL_USERNAME,
    bcc: ENV.NOTIFICATIONEMAIL,
    subject: "PLISMUN '25 Delegate Application Denial",
    text: replacer(text),
    html: replacer(html),
  })
  console.log("Delegate Deny Email Sent");
}

export default transport