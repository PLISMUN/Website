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

export const metadata = {
  title: "PLISMUN | Terms of Service",
  description: "PLISMUN Terms of Service."
}

function TosPage() {
    return (
     <>
        <Header />
        <section>
            <div className="pt-24">
                <div className="mx-auto w-full max-w-5xl px-6">
                    <div className="@container mx-auto max-w-2xl">
                        <div className="max-w-3xl mx-auto px-4 py-10 mb-12 space-y-8">
                            <h1 className="text-4xl font-bold text-center">Terms and Conditions</h1>
                            <p className="text-center text-sm text-muted-foreground">Last updated: 28 June 2025</p>
                            <Separator />

                            <section>
                                <p>
                                    In these Terms and Conditions, the PLISMUN Secretariat and Park Lane International School is collectively referred to as 'we' or 'us', with all participants referred to as 'you'. By applying to attend, and by attending PLISMUN, you accept and agree to these Terms and Conditions.
                                </p>
                            </section>

                            <Separator />

                            <section>
                                <h2 className="text-2xl font-semibold mt-6">1. Participant duties:</h2>
                                <p>By applying for a participating position, you agree to:</p>
                                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                                    <li>Providing truthful and correct personal information about yourself</li>
                                    <li>Ensuring that you are not currently charged with criminal offences in any country</li>
                                    <li>Accept and respect the responsibility of all authorised persons and act upon their command during all formal conference time and in emergency situations</li>
                                    <li>Treat other participants, including guests and staff, with respect, dignity and in a civil manner</li>
                                    <li>Not cause damage to the property of school nor the venues used by us</li>
                                    <li>Not deal with and/or use any of the following:
                                        <ul className="list-disc list-inside ml-8">
                                            <li>Mind-altering substances</li>
                                            <li>Cigarettes, including e-cigarettes</li>
                                            <li>Life-endangering objects that have the capacity to cause bodily harm</li>
                                        </ul>
                                    </li>
                                    <li>Acknowledge PLISMUN's right to expulsion from the conference in the event of breaking any of the above-mentioned duties</li>
                                </ul>
                            </section>

                            <Separator />

                            <section>
                                <h2 className="text-2xl font-semibold mt-6">2. Liability:</h2>
                                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                                    <li>Acknowledge that PLISMUN and Park Lane Internation School are not responsible for any actions you take nor your well-being outside of formal conference time</li>
                                    <li>Waive any and all claims against PLISMUN and Park Lane International School involving compensation in any form for damages or losses sustained during travel or in accomodation</li>
                                    <li>Accept responsibility and will compensate for repair costs of any damage you inflict on the property of the school or any other conference venues</li>
                                </ul>
                            </section>

                            <Separator />

                            <section>
                                <h2 className="text-2xl font-semibold mt-6">3. Payment:</h2>
                                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                                    <li>Conference fees must be paid in full prior to the conference (within two weeks of application submission)</li>
                                    <li>You forfeit your right to refund after registering and applying unless in case of the fault of the PLISMUN Secretariat</li>
                                </ul>
                            </section>

                            <Separator />

                            <section>
                                <h2 className="text-2xl font-semibold mt-6">4. Content Ownership:</h2>
                                <p>By applying to and participating in PLISMUN, you agree to:</p>
                                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                                    <li>Waive ownership of and give consent to being photographed or filmed by conference press</li>
                                    <li>
                                        Give consent to photographic or cinematographic content including you in it to be shared and displayed, including, but not limited to:
                                        <ul className="list-disc list-inside ml-8">
                                            <li>Social media - Facebook, Instagram, Snapchat and Twitter</li>
                                            <li>The official PLISMUN website</li>
                                            <li>Videos published to YouTube and played during opening and closing ceremonies</li>
                                            <li>Future educational or promotional content</li>
                                        </ul>
                                    </li>
                                </ul>
                            </section>

                            <Separator />

                            <section>
                                <h2 className="text-2xl font-semibold mt-6">5. Data privacy:</h2>
                                <p>
                                    By using this website, as well as registering and applying to the conference, you agree to our Privacy Policy, including use of cookies for analytical purposes.
                                </p>
                            </section>

                            <Separator />

                            <section>
                                <h2 className="text-2xl font-semibold mt-6">6. Law:</h2>
                                <p>
                                    Czech Law is applicable in Prague; all participants must abide by the law
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

TosPage.mainPage = true
export default TosPage