import React from "react"
import Header from "@/components/header"
import AboutSection from "@/components/about"
import StatsSection from "@/components/stats-one"
import TeamSection from "@/components/team"
import FooterSection from "@/components/footer-one"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MailIcon, ShieldAlert } from "lucide-react"

function PrivacyPage() {
    return (
     <>
        <Header />
        <section>
            <div className="pt-24">
                <div className="mx-auto w-full max-w-5xl px-6">
                    <div className="@container mx-auto max-w-2xl">
                            <div className="max-w-3xl mx-auto px-4 py-10 mb-12 space-y-8">
                                <h1 className="text-4xl font-bold text-center">Privacy Policy</h1>
                                <p className="text-center text-sm text-muted-foreground">Last updated: 28 June 2025</p>

                                <Separator />

                                <section>
                                    <h2 className="text-2xl font-semibold">1. Who We Are</h2>
                                    <p className="mt-2">
                                    PLISMUN ("we" or "us") is the data controller of your personal information. We are committed to handling personal data in accordance with GDPR and Czech law.
                                    </p>
                                    <p className="mt-4 flex items-center gap-2">
                                    <MailIcon className="w-5 h-5 text-primary" />
                                    <a href="mailto:plismun@parklane-is.com" className="text-primary underline">plismun@parklane-is.com</a>
                                    </p>
                                </section>

                                <Separator />

                                <section>
                                    <h2 className="text-2xl font-semibold">2. What Information Do We Collect?</h2>
                                    <div className="mt-2 space-y-4">
                                    <div>
                                        <h3 className="font-semibold">Personal Identification Data:</h3>
                                        <ul className="list-disc list-inside ml-4">
                                        <li>Full name</li>
                                        <li>Date of birth</li>
                                        <li>Gender</li>
                                        <li>Email address</li>
                                        <li>Phone number</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Application or Registration Data:</h3>
                                        <p>Information you provide in forms (e.g., position preferences, MUN experience)</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Technical Data:</h3>
                                        <ul className="list-disc list-inside ml-4">
                                        <li>IP address</li>
                                        <li>Browser type and version</li>
                                        <li>Device information</li>
                                        </ul>
                                    </div>
                                    <Alert variant="default" className="bg-yellow-50 border-yellow-200">
                                        <AlertDescription>
                                            ⚠️ We do not use non-essential cookies or third-party tracking tools.
                                        </AlertDescription>
                                    </Alert>
                                    </div>
                                </section>

                                <Separator />

                                <section>
                                    <h2 className="text-2xl font-semibold">3. Lawful Basis for Processing Your Data</h2>
                                    <table className="mt-4 w-full border text-sm">
                                    <thead className="bg-muted text-left">
                                        <tr>
                                        <th className="p-2 border">Purpose</th>
                                        <th className="p-2 border">Legal Basis</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                        <td className="p-2 border">Managing registrations and applications</td>
                                        <td className="p-2 border">Consent and/or Contract</td>
                                        </tr>
                                        <tr>
                                        <td className="p-2 border">Communicating with applicants and participants</td>
                                        <td className="p-2 border">Legitimate Interest</td>
                                        </tr>
                                        <tr>
                                        <td className="p-2 border">Responding to inquiries</td>
                                        <td className="p-2 border">Legitimate Interest</td>
                                        </tr>
                                        <tr>
                                        <td className="p-2 border">Ensuring secure website access</td>
                                        <td className="p-2 border">Legitimate Interest</td>
                                        </tr>
                                    </tbody>
                                    </table>
                                </section>

                                <Separator />

                                <section>
                                    <h2 className="text-2xl font-semibold">4. Special Note on Children’s Data</h2>
                                    <p className="mt-2">
                                    Under Czech GDPR law, children under <strong>15 years old</strong> cannot provide valid consent themselves.
                                    </p>
                                    <Alert variant="destructive" className="mt-4">
                                    <ShieldAlert className="h-4 w-4" />
                                    <AlertDescription>
                                        If you are under 15, we require parental or guardian consent. Verification steps may apply.
                                    </AlertDescription>
                                    </Alert>
                                </section>

                                <Separator />

                                <section>
                                    <h2 className="text-2xl font-semibold">5. How We Use Your Information</h2>
                                    <ul className="list-disc list-inside ml-4 mt-2">
                                    <li>Process applications for PLISMUN events</li>
                                    <li>Communicate with you</li>
                                    <li>Maintain records for historical purposes</li>
                                    <li>Securely administer our website</li>
                                    </ul>
                                    <p className="mt-2">We do <strong>not</strong> use automated decision-making or profiling.</p>
                                </section>

                                <Separator />

                                <section>
                                    <h2 className="text-2xl font-semibold">6. Who We Share Your Data With</h2>
                                    <ul className="list-disc list-inside ml-4 mt-2">
                                    <li>Trusted service providers (e.g. hosting, email)</li>
                                    <li>PLISMUN team members under strict confidentiality</li>
                                    </ul>

                                    <div className="mt-4">
                                    <h3 className="font-semibold">International Transfers</h3>
                                    <p className="mt-1">
                                        Data transfers outside the EEA are protected by safeguards such as Standard Contractual Clauses.
                                    </p>
                                    </div>
                                </section>

                                <Separator />

                                <section>
                                    <h2 className="text-2xl font-semibold">7. How Long Do We Keep Your Data?</h2>
                                    <p className="mt-2">
                                    Data is retained for up to <strong>5 years</strong> after an event unless you request earlier deletion.
                                    </p>
                                </section>

                                <Separator />

                                <section>
                                    <h2 className="text-2xl font-semibold">8. How We Protect Your Data</h2>
                                    <ul className="list-disc list-inside ml-4 mt-2">
                                    <li>Restricted access to secure databases</li>
                                    <li>SSL encryption</li>
                                    <li>Hashed and salted passwords</li>
                                    </ul>
                                    <Alert variant="default" className="mt-4 bg-yellow-50 border-yellow-200">
                                    <AlertDescription>
                                        ⚠️ No method of transmission is 100% secure. Use of the site is at your own risk.
                                    </AlertDescription>
                                    </Alert>
                                </section>

                                <Separator />

                                <section>
                                    <h2 className="text-2xl font-semibold">9. Your Data Rights (Under GDPR)</h2>
                                    <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                                    <li><strong>Right to be informed</strong></li>
                                    <li><strong>Right of access</strong></li>
                                    <li><strong>Right to rectification</strong></li>
                                    <li><strong>Right to erasure</strong></li>
                                    <li><strong>Right to restrict processing</strong></li>
                                    <li><strong>Right to data portability</strong></li>
                                    <li><strong>Right to object</strong></li>
                                    <li><strong>Rights around automated decision-making</strong></li>
                                    </ul>
                                    <p className="mt-4">
                                    To exercise any of these rights, email: <br />
                                    <a href="mailto:plismun@parklane-is.com" className="ml-1 text-primary underline">plismun@parklane-is.com</a>
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">Proof of identity may be required. We respond within 1 month.</p>
                                </section>

                                <Separator />

                                <section>
                                    <h2 className="text-2xl font-semibold">10. Changes to This Policy</h2>
                                    <p className="mt-2">
                                    Updates will be posted here. Please check this page periodically for any changes.
                                    </p>
                                </section>
                                </div>
                    </div>
                </div>
            </div>
        </section>
        <FooterSection />
    </>
    )
    }

PrivacyPage.mainPage = true
export default PrivacyPage