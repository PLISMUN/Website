const chairApplicationHTML = `<p>Dear {FIRSTNAME} {LASTNAME},</p>
<p>
  Your application for the chair position in the following committees has been
  received and you will be informed about your application as soon as possible. Below
  are your chosen committees. </p>
<hr>
<h4> <b>Committee 1: </b></h4>
<p> {COM1} </p>
<h4> <b>Committee 2: </b></h4>
<p> {COM2} </p>
<h4> <b>Committee 3: </b></h4>
<p> {COM3} </p>

<h4><b>Motivation:</b></h4>
<p>{MOTIVATION}</p>

<h4><b>Experience:</b></h4>
<p>{EXPERIENCE}</p>

<p>{DELEGATIONTEXT}</p>
<hr>
<p>Sincerely,</p>
<p>The <b>PLISMUN &#39;25 Team</b></p>`;

export { chairApplicationHTML }

const chairApplicationTXT = `Dear {FIRSTNAME} {LASTNAME},

Your application for the chair position in the following committees has been received and you will be informed about your application as soon as possible. Below are your chosen committees.

----------------------

Committee 1:
{COM1}       
Committee 2:
{COM2}       
Committee 3:
{COM3}

----------------------
Motivation
{MOTIVATION}
Experience
{EXPERIENCE}


{DELEGATIONTEXT}

----------------------

Sincerely,
The PLISMUN '25 Team`
export { chairApplicationTXT }

const chairInfoHTML = `<p>Dear Eva & Sophie,</p>

<p>There is a new chair application here for you.</p>

<hr>

<h4><b>Applicant Information:</b></h4>
<p>Email: {EMAIL}</p>
<p>Name: {FIRSTNAME} {LASTNAME}</p>
<p>School: {SCHOOL}</p>
<p>Diet: {DIET}</p>
<p>Phone: {PHONE}</p>
<p>Shirt Size: {SHIRT}</p>

<hr>

<h4><b>Application Information:</b></h4>

<p>Committee Choice 1:<p>
<p>{COM1}</p>
<hr>
<p>Committee Choice 2:</p>
<p>{COM2}</p>
<hr>
<p>Committee Choice 3:</p>
<p>{COM3}</p>
<hr>
<p>Motivation:</p>
<p>{MOTIVATION}</p>
<hr>
<p>Experience:</p>
<p>{EXPERIENCE}</p>

<hr>`
export { chairInfoHTML }

const chairInfoTXT = `Dear Eva & Sophie,

There is a new chair application here for you.

Applicant Information:
Email: {EMAIL}
Name: {FIRSTNAME} {LASTNAME}
School: {SCHOOL}
Diet: {DIET}
Phone: {PHONE}
Shirt Size: {SHIRT}


Application Information:
Committee Choice 1:
{COM1}

Committee Choice 2:
{COM2}

Committee Choice 3:
{COM3}

Motivation:
{MOTIVATION}

Experience:
{EXPERIENCE}`
export { chairInfoTXT }

const delegateInitalHTML = `<p>Dear {FIRSTNAME} {LASTNAME},</p>
<p>Your application for the delegate position in the following committees and countries has been received.</p>
<p>Below are your chosen committees:</p>
<hr>
<h4><b>Committee 1:</b></h4>
<p>{COM1}</p>
<h4><b>Country 1:</b></h4>
<p>{CON1}</p>
<hr>
<h4><b>Committee 2:</b></h4>
<p>{COM2}</p>
<h4><b>Country 2:</b></h4>
<p>{CON2}</p>
<hr>
<h4><b>Committee 3:</b></h4>
<p>{COM3}</p>
<h4><b>Country 3:</b></h4>
<p>{CON3}</p>
<hr>
<br><p> Please note that there is no guarantee for the individual countries but you will be sure to have a place within the selected committees. <p>  
<p>{DELEGATIONTEXT}</p>
<p><b>Your position will be allocated after payment with your school has been confirmed</b>; if you are an individual attendee you will be contacted by the Finance team regarding the payment you will have to pay for your place in PLISMUN ’25. 
  amount sent.</p>

<p>Sincerely,</P
<p>The <b>PLISMUN &#39;25 Team</b></p>`
export { delegateInitalHTML }

const delegateInitalTXT = `Dear {FIRSTNAME} {LASTNAME},

Your application for the delegate position in the following committees and countries has been received. 
Below are your chosen committees:
----------
Committee 1:
{COM1}
Country 1:
{CON1}
----------
Committee 2:
{COM2}
Country 2:
{CON2}
----------
Committee 3:
{COM3}
Country 3:
{CON3}
----------

{DELEGATIONTEXT}

Please note that there is no guarantee for the individual countries but you will be sure to have a place within the selected committees.
Your position will be allocated after payment with your school has been confirmed.</b>; if you are an individual attendee you will be contacted by the Finance team regarding the payment you will have to pay for your place in PLISMUN ’25. 
  amount sent.

Sincerely,
The PLISMUN '25 Team`
export { delegateInitalTXT }

const delegateAcceptHTML = `<p>Dear {FIRSTNAME} {LASTNAME},</p>
<p>This email has been sent to inform you that we have received your payment, and your
delegate application to PLISMUN &#39;25 has been accepted.</p>
<hr>
<p>Your final committee is: <b>{COMMITTEE}</b></p>
<p>Your final country is: <b>{COUNTRY}</b></p>
<hr>
<p>We do understand that you might not have gotten what you wanted but due to very high demand in certain committees we had to balance it out due to limited number of places.</p>
<p>As well, we thank you for applying to PLISMUN '25 and we look forward to seeing you in January.</p>
<br>
<p>Sincerely,</p>
<p>The <b>PLISMUN &#39;25 Team</b></p>`
export { delegateAcceptHTML }

const delegateAcceptTXT = `Dear {FIRSTNAME} {LASTNAME},

This email has been sent to inform you that we have received your payment, and your
delegate application to PLISMUN '25 has been accepted.


Your final committee is: {COMMITTEE}
Your final country is: {COUNTRY}

If you believe that there is the mistake please contact us on this email address.

As well, we thank you for applying to PLISMUN '25 and we look forward to seeing you in January.

Sincerely,
The PLISMUN '25 Team`
export { delegateAcceptTXT }

const delegateDenyHTML = `<p>Dear {FIRSTNAME} {LASTNAME},</p>
<p>This email has been sent to inform you that your delegate application to PLISMUN &#39;25 has been rejected.</p>
<p>This is because your delegation has not signed up to this conference. PLISMUN'25 is in partnership with the Council of British International Schools (COBIS) which does not allow us to have individual applicants.</p>
<br>
<p> We hope you understand. </p>
<p>Sincerely,</p>
<p>The <b>PLISMUN &#39;25 Team</b></p>`
export { delegateDenyHTML }

const delegateDenyTXT = `Dear {FIRSTNAME} {LASTNAME},

This is because your delegation has not signed up to this conference. PLISMUN'25 is in partnership with the Council of British International Schools (COBIS) which does not allow us to have individual applicants.

We hope you understand.

Sincerely,
The PLISMUN '25 Team`
export { delegateDenyTXT }

const delegationHTML = `<p>Dear {FIRSTNAME} {LASTNAME},</p>
<p>Your application for the delegation {DELEGATION} has been accepted and people will now be able to apply as chairs and delegates with this delegation.</p>
<p>Sincerely,
The PLISMUN &#39;25 team</p>
<p><i>This is a system message</i></p>`
export { delegationHTML }

const delegationTXT = `Dear {FIRSTNAME} {LASTNAME},

Your application for the delegation {DELEGATION} has been accepted and people will now be able to apply as chairs and delegates with this delegation.

Sincerely,
The PLISMUN '25 team

--
This is a system message`
export { delegationTXT }