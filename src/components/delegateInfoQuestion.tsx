"use client"
import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import CalendarBirthday from '@/components/calendarBirthday'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

export default function DelegateInfoQuestion() {

    const { data: session } = useSession()

    const [form, setForm] = useState({
        name: '',
        email: session?.user?.email, 
        nationality: '',
        delegation: '',
        diet: '',
        birth: '',
        notes: '',
    })
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(false)
        
        try {
            const res = await fetch('/api/setPeopleInfo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })
            if (res.ok) {
                setSuccess(true)
            } else {
                const data = await res.json()
                setError(data.message || 'Submission failed')
            }
        } catch (err: any) {
            setError(err.message || 'Submission failed')
        }
        setLoading(false)
    }

    
    const [delegations, setDelegations] = useState<{ id: number, name: string }[]>([])
    
    useEffect(() => {
            const getInfo = async (email: string) => {
                try {
                    const res = await fetch('/api/getPeopleInfo', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email }),
                    })
                    if (res.ok) {
                        const data = await res.json()
                        setForm((prev) => ({
                            ...prev,
                            name: data[0].name || '',
                            birth: data[0].birth || '',
                            nationality: data[0].nationality || '',
                            delegation: data[0].delegation || '',
                            diet: data[0].diet || '',
                            notes: data[0].notes || '',
                        }))
                    }
                } catch (err) {
                    console.error('Error fetching user info:', err)
                }
            }
        const fetchDelegations = async () => {
            try {
                const res = await fetch('/api/getDelegations', { method: 'POST' })
                if (res.ok) {
                    const data = await res.json()
                    setDelegations(data)
                }
            } catch (err) {
                // Optionally handle error
            }
        }
        setForm(prev => ({ ...prev, name: session?.user?.name || '' }))
        fetchDelegations()
        if (session?.user?.email) {
            getInfo(session.user.email)
        }
    }, [])

    return (
        <section className="bg-muted">
            <div className="mx-auto max-w-4xl px-4 py-4 lg:px-0">
                <form onSubmit={handleSubmit} className="@container lg:col-span-3">
                    <Card className="p-8 sm:p-12">
                        <h3 className="text-xl font-semibold">Let's get to know a little more about you</h3>
                        <p className="text-sm">In order to be able to properly get things ready for you, we first need to learn a bit more about you.</p>

                        <div className="**:[&>label]:block mt-6 space-y-6 *:space-y-3">
                            <div className="@md:grid-cols-2 grid gap-3 *:space-y-3">
                                <div>
                                    <Label htmlFor="name" className="space-y-2">Full name</Label>
                                    <Input
                                        type="text"
                                        id="name"
                                        required
                                        value={form.name}
                                        onChange={e => handleChange('name', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        type="email"
                                        id="email"
                                        required
                                        value={session?.user?.email || ''}
                                        readOnly
                                        className="cursor-not-allowed bg-gray-100 text-gray-500"
                                    />
                                </div>
                            </div>
                            <div className="@md:grid-cols-2 grid gap-3 *:space-y-3">
                                <div>
                                    <Label htmlFor="country">Nationality</Label>
                                    <Select required value={form.nationality} onValueChange={val => handleChange('nationality', val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a country" />
                                        </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Afghanistan">Afghanistan</SelectItem>
                                                <SelectItem value="Albania">Albania</SelectItem>
                                                <SelectItem value="Algeria">Algeria</SelectItem>
                                                <SelectItem value="American Samoa">American Samoa</SelectItem>
                                                <SelectItem value="Andorra">Andorra</SelectItem>
                                                <SelectItem value="Angola">Angola</SelectItem>
                                                <SelectItem value="Antigua and Barbuda">Antigua and Barbuda</SelectItem>
                                                <SelectItem value="Argentina">Argentina</SelectItem>
                                                <SelectItem value="Armenia">Armenia</SelectItem>
                                                <SelectItem value="Aruba">Aruba</SelectItem>
                                                <SelectItem value="Australia">Australia</SelectItem>
                                                <SelectItem value="Austria">Austria</SelectItem>
                                                <SelectItem value="Azerbaijan">Azerbaijan</SelectItem>
                                                <SelectItem value="The Bahamas">The Bahamas</SelectItem>
                                                <SelectItem value="Bahrain">Bahrain</SelectItem>
                                                <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                                                <SelectItem value="Barbados">Barbados</SelectItem>
                                                <SelectItem value="Belarus">Belarus</SelectItem>
                                                <SelectItem value="Belgium">Belgium</SelectItem>
                                                <SelectItem value="Belize">Belize</SelectItem>
                                                <SelectItem value="Benin">Benin</SelectItem>
                                                <SelectItem value="Bermuda">Bermuda</SelectItem>
                                                <SelectItem value="Bhutan">Bhutan</SelectItem>
                                                <SelectItem value="Bolivia">Bolivia</SelectItem>
                                                <SelectItem value="Bosnia and Herzegovina">Bosnia and Herzegovina</SelectItem>
                                                <SelectItem value="Botswana">Botswana</SelectItem>
                                                <SelectItem value="Brazil">Brazil</SelectItem>
                                                <SelectItem value="Brunei">Brunei</SelectItem>
                                                <SelectItem value="Bulgaria">Bulgaria</SelectItem>
                                                <SelectItem value="Burkina Faso">Burkina Faso</SelectItem>
                                                <SelectItem value="Burundi">Burundi</SelectItem>
                                                <SelectItem value="Cabo Verde (Cape Verde)">Cabo Verde (Cape Verde)</SelectItem>
                                                <SelectItem value="Cambodia">Cambodia</SelectItem>
                                                <SelectItem value="Cameroon">Cameroon</SelectItem>
                                                <SelectItem value="Canada">Canada</SelectItem>
                                                <SelectItem value="Cayman Islands">Cayman Islands</SelectItem>
                                                <SelectItem value="Central African Republic">Central African Republic</SelectItem>
                                                <SelectItem value="Chad">Chad</SelectItem>
                                                <SelectItem value="Chile">Chile</SelectItem>
                                                <SelectItem value="China">China</SelectItem>
                                                <SelectItem value="Colombia">Colombia</SelectItem>
                                                <SelectItem value="Comoros">Comoros</SelectItem>
                                                <SelectItem value="Democratic Republic of the Congo">Democratic Republic of the Congo</SelectItem>
                                                <SelectItem value="Republic of the Congo">Republic of the Congo</SelectItem>
                                                <SelectItem value="Costa Rica">Costa Rica</SelectItem>
                                                <SelectItem value="Côte d’Ivoire">Côte d’Ivoire</SelectItem>
                                                <SelectItem value="Croatia">Croatia</SelectItem>
                                                <SelectItem value="Cuba">Cuba</SelectItem>
                                                <SelectItem value="Curaçao">Curaçao</SelectItem>
                                                <SelectItem value="Cyprus">Cyprus</SelectItem>
                                                <SelectItem value="Czech Republic">Czech Republic</SelectItem>
                                                <SelectItem value="Denmark">Denmark</SelectItem>
                                                <SelectItem value="Djibouti">Djibouti</SelectItem>
                                                <SelectItem value="Dominica">Dominica</SelectItem>
                                                <SelectItem value="Dominican Republic">Dominican Republic</SelectItem>
                                                <SelectItem value="East Timor (Timor-Leste)">East Timor (Timor-Leste)</SelectItem>
                                                <SelectItem value="Ecuador">Ecuador</SelectItem>
                                                <SelectItem value="Egypt">Egypt</SelectItem>
                                                <SelectItem value="El Salvador">El Salvador</SelectItem>
                                                <SelectItem value="Equatorial Guinea">Equatorial Guinea</SelectItem>
                                                <SelectItem value="Eritrea">Eritrea</SelectItem>
                                                <SelectItem value="Estonia">Estonia</SelectItem>
                                                <SelectItem value="Eswatini (Swaziland)">Eswatini (Swaziland)</SelectItem>
                                                <SelectItem value="Ethiopia">Ethiopia</SelectItem>
                                                <SelectItem value="Faroe Islands">Faroe Islands</SelectItem>
                                                <SelectItem value="Fiji">Fiji</SelectItem>
                                                <SelectItem value="Finland">Finland</SelectItem>
                                                <SelectItem value="France">France</SelectItem>
                                                <SelectItem value="French Guiana">French Guiana</SelectItem>
                                                <SelectItem value="French Polynesia">French Polynesia</SelectItem>
                                                <SelectItem value="Gabon">Gabon</SelectItem>
                                                <SelectItem value="The Gambia">The Gambia</SelectItem>
                                                <SelectItem value="Gaza Strip">Gaza Strip</SelectItem>
                                                <SelectItem value="Georgia">Georgia</SelectItem>
                                                <SelectItem value="Germany">Germany</SelectItem>
                                                <SelectItem value="Ghana">Ghana</SelectItem>
                                                <SelectItem value="Greece">Greece</SelectItem>
                                                <SelectItem value="Greenland">Greenland</SelectItem>
                                                <SelectItem value="Grenada">Grenada</SelectItem>
                                                <SelectItem value="Guadeloupe">Guadeloupe</SelectItem>
                                                <SelectItem value="Guam">Guam</SelectItem>
                                                <SelectItem value="Guatemala">Guatemala</SelectItem>
                                                <SelectItem value="Guernsey">Guernsey</SelectItem>
                                                <SelectItem value="Guinea">Guinea</SelectItem>
                                                <SelectItem value="Guinea-Bissau">Guinea-Bissau</SelectItem>
                                                <SelectItem value="Guyana">Guyana</SelectItem>
                                                <SelectItem value="Haiti">Haiti</SelectItem>
                                                <SelectItem value="Honduras">Honduras</SelectItem>
                                                <SelectItem value="Hong Kong">Hong Kong</SelectItem>
                                                <SelectItem value="Hungary">Hungary</SelectItem>
                                                <SelectItem value="Iceland">Iceland</SelectItem>
                                                <SelectItem value="India">India</SelectItem>
                                                <SelectItem value="Indonesia">Indonesia</SelectItem>
                                                <SelectItem value="Iran">Iran</SelectItem>
                                                <SelectItem value="Iraq">Iraq</SelectItem>
                                                <SelectItem value="Ireland">Ireland</SelectItem>
                                                <SelectItem value="Isle of Man">Isle of Man</SelectItem>
                                                <SelectItem value="Israel">Israel</SelectItem>
                                                <SelectItem value="Italy">Italy</SelectItem>
                                                <SelectItem value="Jamaica">Jamaica</SelectItem>
                                                <SelectItem value="Japan">Japan</SelectItem>
                                                <SelectItem value="Jersey">Jersey</SelectItem>
                                                <SelectItem value="Jordan">Jordan</SelectItem>
                                                <SelectItem value="Kazakhstan">Kazakhstan</SelectItem>
                                                <SelectItem value="Kenya">Kenya</SelectItem>
                                                <SelectItem value="Kiribati">Kiribati</SelectItem>
                                                <SelectItem value="North Korea">North Korea</SelectItem>
                                                <SelectItem value="South Korea">South Korea</SelectItem>
                                                <SelectItem value="Kosovo">Kosovo</SelectItem>
                                                <SelectItem value="Kuwait">Kuwait</SelectItem>
                                                <SelectItem value="Kyrgyzstan">Kyrgyzstan</SelectItem>
                                                <SelectItem value="Laos">Laos</SelectItem>
                                                <SelectItem value="Latvia">Latvia</SelectItem>
                                                <SelectItem value="Lebanon">Lebanon</SelectItem>
                                                <SelectItem value="Lesotho">Lesotho</SelectItem>
                                                <SelectItem value="Liberia">Liberia</SelectItem>
                                                <SelectItem value="Libya">Libya</SelectItem>
                                                <SelectItem value="Liechtenstein">Liechtenstein</SelectItem>
                                                <SelectItem value="Lithuania">Lithuania</SelectItem>
                                                <SelectItem value="Luxembourg">Luxembourg</SelectItem>
                                                <SelectItem value="Macau">Macau</SelectItem>
                                                <SelectItem value="Madagascar">Madagascar</SelectItem>
                                                <SelectItem value="Malawi">Malawi</SelectItem>
                                                <SelectItem value="Malaysia">Malaysia</SelectItem>
                                                <SelectItem value="Maldives">Maldives</SelectItem>
                                                <SelectItem value="Mali">Mali</SelectItem>
                                                <SelectItem value="Malta">Malta</SelectItem>
                                                <SelectItem value="Marshall Islands">Marshall Islands</SelectItem>
                                                <SelectItem value="Martinique">Martinique</SelectItem>
                                                <SelectItem value="Mauritania">Mauritania</SelectItem>
                                                <SelectItem value="Mauritius">Mauritius</SelectItem>
                                                <SelectItem value="Mayotte">Mayotte</SelectItem>
                                                <SelectItem value="Mexico">Mexico</SelectItem>
                                                <SelectItem value="Micronesia">Micronesia</SelectItem>
                                                <SelectItem value="Moldova">Moldova</SelectItem>
                                                <SelectItem value="Monaco">Monaco</SelectItem>
                                                <SelectItem value="Mongolia">Mongolia</SelectItem>
                                                <SelectItem value="Montenegro">Montenegro</SelectItem>
                                                <SelectItem value="Morocco">Morocco</SelectItem>
                                                <SelectItem value="Mozambique">Mozambique</SelectItem>
                                                <SelectItem value="Myanmar (Burma)">Myanmar (Burma)</SelectItem>
                                                <SelectItem value="Namibia">Namibia</SelectItem>
                                                <SelectItem value="Nauru">Nauru</SelectItem>
                                                <SelectItem value="Nepal">Nepal</SelectItem>
                                                <SelectItem value="Netherlands">Netherlands</SelectItem>
                                                <SelectItem value="New Caledonia">New Caledonia</SelectItem>
                                                <SelectItem value="New Zealand">New Zealand</SelectItem>
                                                <SelectItem value="Nicaragua">Nicaragua</SelectItem>
                                                <SelectItem value="Niger">Niger</SelectItem>
                                                <SelectItem value="Nigeria">Nigeria</SelectItem>
                                                <SelectItem value="North Macedonia">North Macedonia</SelectItem>
                                                <SelectItem value="Northern Mariana Islands">Northern Mariana Islands</SelectItem>
                                                <SelectItem value="Norway">Norway</SelectItem>
                                                <SelectItem value="Oman">Oman</SelectItem>
                                                <SelectItem value="Pakistan">Pakistan</SelectItem>
                                                <SelectItem value="Palau">Palau</SelectItem>
                                                <SelectItem value="Panama">Panama</SelectItem>
                                                <SelectItem value="Papua New Guinea">Papua New Guinea</SelectItem>
                                                <SelectItem value="Paraguay">Paraguay</SelectItem>
                                                <SelectItem value="Peru">Peru</SelectItem>
                                                <SelectItem value="Philippines">Philippines</SelectItem>
                                                <SelectItem value="Poland">Poland</SelectItem>
                                                <SelectItem value="Portugal">Portugal</SelectItem>
                                                <SelectItem value="Puerto Rico">Puerto Rico</SelectItem>
                                                <SelectItem value="Qatar">Qatar</SelectItem>
                                                <SelectItem value="Réunion">Réunion</SelectItem>
                                                <SelectItem value="Romania">Romania</SelectItem>
                                                <SelectItem value="Russia">Russia</SelectItem>
                                                <SelectItem value="Rwanda">Rwanda</SelectItem>
                                                <SelectItem value="Saint Kitts and Nevis">Saint Kitts and Nevis</SelectItem>
                                                <SelectItem value="Saint Lucia">Saint Lucia</SelectItem>
                                                <SelectItem value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</SelectItem>
                                                <SelectItem value="Samoa">Samoa</SelectItem>
                                                <SelectItem value="San Marino">San Marino</SelectItem>
                                                <SelectItem value="Sao Tome and Principe">Sao Tome and Principe</SelectItem>
                                                <SelectItem value="Saudi Arabia">Saudi Arabia</SelectItem>
                                                <SelectItem value="Senegal">Senegal</SelectItem>
                                                <SelectItem value="Serbia">Serbia</SelectItem>
                                                <SelectItem value="Seychelles">Seychelles</SelectItem>
                                                <SelectItem value="Sierra Leone">Sierra Leone</SelectItem>
                                                <SelectItem value="Singapore">Singapore</SelectItem>
                                                <SelectItem value="Sint Maarten">Sint Maarten</SelectItem>
                                                <SelectItem value="Slovakia">Slovakia</SelectItem>
                                                <SelectItem value="Slovenia">Slovenia</SelectItem>
                                                <SelectItem value="Solomon Islands">Solomon Islands</SelectItem>
                                                <SelectItem value="Somalia">Somalia</SelectItem>
                                                <SelectItem value="South Africa">South Africa</SelectItem>
                                                <SelectItem value="Spain">Spain</SelectItem>
                                                <SelectItem value="Sri Lanka">Sri Lanka</SelectItem>
                                                <SelectItem value="Sudan">Sudan</SelectItem>
                                                <SelectItem value="South Sudan">South Sudan</SelectItem>
                                                <SelectItem value="Suriname">Suriname</SelectItem>
                                                <SelectItem value="Sweden">Sweden</SelectItem>
                                                <SelectItem value="Switzerland">Switzerland</SelectItem>
                                                <SelectItem value="Syria">Syria</SelectItem>
                                                <SelectItem value="Taiwan">Taiwan</SelectItem>
                                                <SelectItem value="Tajikistan">Tajikistan</SelectItem>
                                                <SelectItem value="Tanzania">Tanzania</SelectItem>
                                                <SelectItem value="Thailand">Thailand</SelectItem>
                                                <SelectItem value="Togo">Togo</SelectItem>
                                                <SelectItem value="Tonga">Tonga</SelectItem>
                                                <SelectItem value="Trinidad and Tobago">Trinidad and Tobago</SelectItem>
                                                <SelectItem value="Tunisia">Tunisia</SelectItem>
                                                <SelectItem value="Turkey">Turkey</SelectItem>
                                                <SelectItem value="Turkmenistan">Turkmenistan</SelectItem>
                                                <SelectItem value="Tuvalu">Tuvalu</SelectItem>
                                                <SelectItem value="Uganda">Uganda</SelectItem>
                                                <SelectItem value="Ukraine">Ukraine</SelectItem>
                                                <SelectItem value="United Arab Emirates">United Arab Emirates</SelectItem>
                                                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                                                <SelectItem value="United States">United States</SelectItem>
                                                <SelectItem value="United States Virgin Islands">United States Virgin Islands</SelectItem>
                                                <SelectItem value="Uruguay">Uruguay</SelectItem>
                                                <SelectItem value="Uzbekistan">Uzbekistan</SelectItem>
                                                <SelectItem value="Vanuatu">Vanuatu</SelectItem>
                                                <SelectItem value="Vatican City">Vatican City</SelectItem>
                                                <SelectItem value="Venezuela">Venezuela</SelectItem>
                                                <SelectItem value="Vietnam">Vietnam</SelectItem>
                                                <SelectItem value="West Bank">West Bank</SelectItem>
                                                <SelectItem value="Yemen">Yemen</SelectItem>
                                                <SelectItem value="Zambia">Zambia</SelectItem>
                                                <SelectItem value="Zimbabwe">Zimbabwe</SelectItem>
                                            </SelectContent>

                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="delegation">Delegation</Label>
                                    <Select required value={form.delegation} onValueChange={val => handleChange('delegation', val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a delegation" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {delegations.map(d => (
                                                <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="@md:grid-cols-2 grid gap-3 *:space-y-3">
                                <div>
                                    <Label htmlFor="diet">Diet</Label>
                                    <Select required value={form.diet} onValueChange={val => handleChange('diet', val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select your diet" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="None">None</SelectItem>
                                            <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                                            <SelectItem value="Vegan">Vegan</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="birth">Date of birth</Label>
                                    <CalendarBirthday selected={form.birth} onChange={date => handleChange('birth', date)} />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                    id="notes"
                                    rows={3}
                                    value={form.notes}
                                    onChange={e => handleChange('notes', e.target.value)}
                                />
                            </div>
                            <Button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</Button>
                            {success && <p className="text-green-600">Signup successful!</p>}
                            {error && <p className="text-red-600">{error}</p>}
                        </div>
                    </Card>
                </form>
            </div>
        </section>
    )
}