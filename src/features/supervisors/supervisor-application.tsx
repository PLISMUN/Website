"use client"
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import {
    IconSchool,
    IconUsersPlus,
    IconCheck,
    IconClock,
    IconX,
    IconUsersGroup,
    IconCreditCardPay,
    IconBook,
    IconInfoCircle,
} from '@tabler/icons-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CountryDropdown } from '@/components/ui/country-dropdown'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import CalendarBirthday from '@/components/birthday-picker'
import { useSiteConfig } from '@/features/site-config/context'
import { errorMessage } from '@/lib/api-client'
import { cn } from '@/lib/utils'
import { getDelegations } from '@/features/delegations/api'
import type { PublicDelegation } from '@/features/delegations/types'
import { getPeopleInfo } from '@/features/people/api'
import { getSupervisorApplications, submitSupervisorApplication } from './api'
import { SUPERVISOR_INFO_PATH } from './paths'
import type { SupervisorApplication } from './types'

type StepState = 'done' | 'current' | 'upcoming' | 'failed'

const emptyForm = {
    name: '',
    phone: '',
    nationality: '',
    birth: '',
    diet: '',
    notes: '',
    delegation: '',
    country: '',
    students: '',
}

export default function SupervisorApplicationPage() {
    const { conference, stages } = useSiteConfig()
    const { data: session } = useSession()
    const sessionEmail = session?.user?.email || ''
    const sessionName = session?.user?.name || ''

    const [applications, setApplications] = useState<SupervisorApplication[] | null>(null)
    const [adding, setAdding] = useState(false)
    const [loadError, setLoadError] = useState<string | null>(null)

    const fetchApplications = useCallback(async () => {
        try {
            const data = await getSupervisorApplications()
            setApplications(data.applications)
            setLoadError(null)
        } catch (err) {
            setLoadError(errorMessage(err))
            setApplications([])
        }
    }, [])

    useEffect(() => {
        if (sessionEmail) fetchApplications()
    }, [sessionEmail, fetchApplications])

    if (applications === null) return <div className="px-4 lg:px-6">Loading...</div>

    const showForm = adding || applications.every(a => a.status === 'rejected')

    return (
        <section className="bg-muted">
            <div className="mx-auto max-w-4xl px-4 py-4 lg:px-0 min-h-screen space-y-4">
                {loadError && <p className="text-red-600">{loadError}</p>}
                {showForm ? (
                    stages.supervisorApplication ? (
                        <SupervisorForm
                            sessionEmail={sessionEmail}
                            sessionName={sessionName}
                            appliedTo={applications.filter(a => a.status !== 'rejected').map(a => a.delegation)}
                            hasApplied={applications.length > 0}
                            onCancel={adding ? () => setAdding(false) : undefined}
                            onSuccess={async () => {
                                await fetchApplications()
                                setAdding(false)
                                window.scrollTo({ top: 0, behavior: 'smooth' })
                            }}
                        />
                    ) : (
                        <Card className="p-8 sm:p-12">
                            <Alert>
                                <IconInfoCircle />
                                <AlertTitle>Supervisor applications are currently closed</AlertTitle>
                                <AlertDescription>
                                    <p>Please check back later, or contact us at <a className="underline" href={`mailto:${conference.contactEmail}`}>{conference.contactEmail}</a>.</p>
                                </AlertDescription>
                            </Alert>
                        </Card>
                    )
                ) : null}

                {!adding && applications.map(application => (
                    <ApplicationStatus key={application.id} application={application} />
                ))}

                {!showForm && stages.supervisorApplication && (
                    <Card className="p-6 sm:p-8">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <h3 className="font-semibold">Supervising more than one delegation?</h3>
                                <p className="text-sm text-muted-foreground">Register each delegation separately. Your personal details are filled in for you.</p>
                            </div>
                            <Button variant="outline" className="cursor-pointer" onClick={() => setAdding(true)}>
                                Register another delegation
                            </Button>
                        </div>
                    </Card>
                )}
            </div>
        </section>
    )
}

function SupervisorForm({
    sessionEmail,
    sessionName,
    appliedTo,
    hasApplied,
    onCancel,
    onSuccess,
}: {
    sessionEmail: string
    sessionName: string
    appliedTo: string[]
    hasApplied: boolean
    onCancel?: () => void
    onSuccess: () => Promise<void>
}) {
    const { pricing } = useSiteConfig()
    const [form, setForm] = useState(emptyForm)
    const [existing, setExisting] = useState(false)
    const [delegations, setDelegations] = useState<PublicDelegation[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleChange = (field: keyof typeof emptyForm, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }))
    }

    useEffect(() => {
        const getInfo = async () => {
            try {
                const data = await getPeopleInfo(sessionEmail)
                setForm(prev => ({
                    ...prev,
                    name: data[0]?.name || sessionName,
                    phone: data[0]?.phone || '',
                    nationality: data[0]?.nationality || '',
                    birth: data[0]?.birth || '',
                    diet: data[0]?.diet || '',
                    notes: data[0]?.notes || '',
                }))
            } catch (err) {
                console.error('Error fetching user info:', err)
            }
        }

        const fetchDelegations = async () => {
            try {
                setDelegations(await getDelegations())
            } catch (err) {
                console.error('Error fetching delegations:', err)
            }
        }

        if (sessionEmail) getInfo()
        fetchDelegations()
    }, [sessionEmail, sessionName])

    const joinableDelegations = delegations.filter(d => !appliedTo.includes(d.name))

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        if (!form.nationality) return setError('Please select your nationality')
        if (!form.birth) return setError('Please select your date of birth')
        if (!form.delegation.trim()) return setError(existing ? 'Please select the delegation you are joining' : 'Please enter your delegation name')
        if (!existing && !form.country) return setError('Please select the country your delegation is from')

        setLoading(true)
        try {
            await submitSupervisorApplication({
                name: form.name,
                phone: form.phone,
                nationality: form.nationality,
                birth: form.birth,
                diet: form.diet,
                notes: form.notes,
                existing,
                delegation: form.delegation,
                country: form.country,
                students: Number(form.students),
            })
            await onSuccess()
        } catch (err) {
            setError(errorMessage(err, 'Submission failed'))
        }
        setLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className="@container lg:col-span-3">
            <Card className="p-8 sm:p-12">
                <div className="space-y-2">
                    <p className="text-sm font-medium text-sky-700">Teachers &amp; supervisors</p>
                    <h3 className="text-xl font-semibold">{hasApplied ? 'Register a delegation' : 'Apply as a supervisor'}</h3>
                    <p className="text-sm text-muted-foreground">
                        This application is for teachers and staff leading a delegation. Students apply separately
                        and join your delegation by selecting it when they sign up.{' '}
                        <Link href={SUPERVISOR_INFO_PATH} className="underline">Read the supervisor guide</Link>
                    </p>
                </div>

                <ProgressTracker steps={[
                    { title: 'Apply', description: 'About you & your school', state: 'current' },
                    { title: 'Review', description: 'We check & set up your delegation', state: 'upcoming' },
                    { title: 'Approved', description: 'My Delegation unlocks', state: 'upcoming' },
                    { title: 'Pay', description: 'Your supervisor fee', state: 'upcoming' },
                    { title: 'Students join', description: 'They pick your delegation', state: 'upcoming' },
                ]} />

                <div className="**:[&>label]:block space-y-8">
                    <fieldset className="space-y-4">
                        <SectionHeading number={1} title="About you" description="We use this for your name badge, catering, and to reach you during the conference." />
                        <div className="@md:grid-cols-2 grid gap-4 *:space-y-2">
                            <div>
                                <Label htmlFor="name">Full name</Label>
                                <Input id="name" required maxLength={100} value={form.name} onChange={e => handleChange('name', e.target.value)} />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={sessionEmail} readOnly className="cursor-not-allowed bg-gray-100 text-gray-500" />
                            </div>
                            <div>
                                <Label htmlFor="phone">Phone number</Label>
                                <Input id="phone" type="tel" required placeholder="e.g. +420 234 567 890" value={form.phone} onChange={e => handleChange('phone', e.target.value)} />
                            </div>
                            <div>
                                <Label htmlFor="nationality">Nationality</Label>
                                <CountryDropdown
                                    placeholder="Select country"
                                    defaultValue={form.nationality}
                                    onChange={country => handleChange('nationality', country.name)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="birth">Date of birth</Label>
                                <CalendarBirthday selected={form.birth} onChange={date => handleChange('birth', date)} />
                            </div>
                            <div>
                                <Label htmlFor="diet">Diet</Label>
                                <Select required value={form.diet} onValueChange={val => handleChange('diet', val)}>
                                    <SelectTrigger id="diet">
                                        <SelectValue placeholder="Select your diet" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Omnivore">Omnivore</SelectItem>
                                        <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                                        <SelectItem value="Vegan">Vegan</SelectItem>
                                        <SelectItem value="Gluten Free">Gluten Free</SelectItem>
                                        <SelectItem value="Lactose Free">Lactose Free</SelectItem>
                                        <SelectItem value="Withdraw">No Lunch</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">We can&apos;t safely accommodate all dietary needs and allergies. Select &quot;No Lunch&quot; if necessary.</p>
                            </div>
                            <div className="@md:col-span-2">
                                <Label htmlFor="notes">Your role at your school</Label>
                                <Textarea
                                    id="notes"
                                    required
                                    maxLength={2500}
                                    rows={2}
                                    placeholder='For example "History teacher and MUN club advisor"'
                                    value={form.notes}
                                    onChange={e => handleChange('notes', e.target.value)}
                                />
                            </div>
                        </div>
                    </fieldset>

                    <fieldset className="space-y-4">
                        <SectionHeading number={2} title="Your delegation" description="A delegation is the group of students you bring, usually your school." />
                        <div className="@md:grid-cols-2 grid gap-3" role="radiogroup" aria-label="Delegation type">
                            <ChoiceCard
                                selected={!existing}
                                onSelect={() => { setExisting(false); handleChange('delegation', '') }}
                                icon={<IconSchool className="size-6" stroke={1.5} />}
                                title="Register a new delegation"
                                description="Your school is new to PLISMUN this year."
                            />
                            <ChoiceCard
                                selected={existing}
                                onSelect={() => { setExisting(true); handleChange('delegation', '') }}
                                icon={<IconUsersPlus className="size-6" stroke={1.5} />}
                                title="Join an existing delegation"
                                description="A colleague has already registered your school."
                                disabled={!joinableDelegations.length}
                            />
                        </div>

                        {existing ? (
                            <div className="space-y-2">
                                <Label htmlFor="existing-delegation">Delegation</Label>
                                <Select value={form.delegation} onValueChange={val => handleChange('delegation', val)}>
                                    <SelectTrigger id="existing-delegation" className="w-full @md:w-1/2">
                                        <SelectValue placeholder="Select your delegation" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {joinableDelegations.map(d => (
                                            <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        ) : (
                            <div className="@md:grid-cols-2 grid gap-4 *:space-y-2">
                                <div className="@md:col-span-2">
                                    <Label htmlFor="delegation">Delegation name</Label>
                                    <Input
                                        id="delegation"
                                        required
                                        minLength={2}
                                        maxLength={100}
                                        placeholder="Usually your school's full name, e.g. Prague International School"
                                        value={form.delegation}
                                        onChange={e => handleChange('delegation', e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground">Your students will look for this name when they sign up.</p>
                                </div>
                                <div>
                                    <Label htmlFor="country">Country</Label>
                                    <CountryDropdown
                                        placeholder="Select country"
                                        defaultValue={form.country}
                                        onChange={country => handleChange('country', country.name)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="students">Expected number of students</Label>
                                    <Input
                                        id="students"
                                        type="number"
                                        required
                                        min={1}
                                        max={200}
                                        placeholder="e.g. 12"
                                        value={form.students}
                                        onChange={e => handleChange('students', e.target.value)}
                                    />
                                </div>
                            </div>
                        )}
                    </fieldset>

                    <div className="rounded-lg border bg-muted/50 p-4 text-sm text-muted-foreground">
                        The supervisor fee is <span className="font-medium text-foreground">{pricing.supervisor.czk} CZK / €{pricing.supervisor.eur}</span>.
                        Once you&apos;re approved, you pay it from your Payment page, which has the bank details and a QR code.
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Button className="cursor-pointer" type="submit" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit application'}
                        </Button>
                        {onCancel && (
                            <Button type="button" variant="ghost" className="cursor-pointer" onClick={onCancel} disabled={loading}>Cancel</Button>
                        )}
                    </div>
                    {error && <p className="text-red-600">{error}</p>}
                </div>
            </Card>
        </form>
    )
}

function ApplicationStatus({ application }: { application: SupervisorApplication }) {
    const { conference, pricing } = useSiteConfig()
    const { status, linked, paid, memberCount, delegation } = application
    const approved = status === 'accepted' && linked
    const rejected = status === 'rejected'
    const paymentDue = approved && !paid

    const reviewState: StepState = rejected ? 'failed' : status === 'accepted' ? 'done' : 'current'
    const approvedState: StepState = approved ? 'done' : status === 'accepted' ? 'current' : 'upcoming'
    // Paying early still counts; otherwise payment is due once approved
    const payState: StepState = paid ? 'done' : approved ? 'current' : 'upcoming'
    const joinState: StepState = !approved || !paid ? 'upcoming' : memberCount > 0 ? 'done' : 'current'

    const badge = rejected
        ? { label: 'Not approved', className: 'bg-red-50 text-red-700 border-red-200', icon: <IconX className="size-3.5" /> }
        : approved
            ? { label: 'Approved', className: 'bg-green-50 text-green-700 border-green-200', icon: <IconCheck className="size-3.5" /> }
            : { label: 'Under review', className: 'bg-amber-50 text-amber-700 border-amber-200', icon: <IconClock className="size-3.5" /> }

    return (
        <Card className="p-8 sm:p-12">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-sky-700">Supervisor application #{application.id}</p>
                    <h3 className="text-xl font-semibold">{delegation}</h3>
                    {application.country && <p className="text-sm text-muted-foreground">{application.country}</p>}
                </div>
                <span className={cn('inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-medium', badge.className)}>
                    {badge.icon}{badge.label}
                </span>
            </div>

            <ProgressTracker steps={[
                { title: 'Applied', description: 'Application received', state: 'done' },
                { title: 'Review', description: rejected ? 'Not approved' : 'We check & set up your delegation', state: reviewState },
                { title: 'Approved', description: 'My Delegation unlocks', state: approvedState },
                { title: 'Pay', description: paid ? 'Fee received' : `${pricing.supervisor.czk} CZK / €${pricing.supervisor.eur}`, state: payState },
                { title: 'Students join', description: approved ? `${memberCount} signed up so far` : 'They pick your delegation', state: joinState },
            ]} />

            <div className="rounded-lg border bg-muted/50 p-5">
                <h4 className="font-semibold">What happens next</h4>
                <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
                    {rejected ? (
                        <li>Your application was not approved. If you think this is a mistake, email us at <a className="underline" href={`mailto:${conference.contactEmail}`}>{conference.contactEmail}</a>.</li>
                    ) : approved ? (
                        <>
                            {paymentDue ? (
                                <li>Pay your supervisor fee of <span className="font-medium text-foreground">{pricing.supervisor.czk} CZK / €{pricing.supervisor.eur}</span> from the Payment page. It can take up to 7 business days for us to process it.</li>
                            ) : (
                                <li>We&apos;ve received your supervisor fee. Thank you!</li>
                            )}
                            <li>Ask your students to sign up and choose <span className="font-medium text-foreground">{delegation}</span> as their delegation.</li>
                            <li>Follow their applications and payments on your <span className="font-medium text-foreground">My Delegation</span> page.</li>
                        </>
                    ) : (
                        <>
                            <li>Our team is reviewing your application. We&apos;ll email you as soon as it&apos;s approved.</li>
                            {linked ? (
                                <li>Your students can already sign up and choose <span className="font-medium text-foreground">{delegation}</span> as their delegation.</li>
                            ) : (
                                <li>Once we&apos;ve set up <span className="font-medium text-foreground">{delegation}</span>, your students will be able to choose it when they sign up.</li>
                            )}
                            <li>Once you&apos;re approved, you pay your supervisor fee from the Payment page.</li>
                        </>
                    )}
                </ul>
            </div>

            <div className="flex flex-wrap gap-3">
                {paymentDue && (
                    <Button asChild>
                        <Link href="/user/payment"><IconCreditCardPay />Pay supervisor fee</Link>
                    </Button>
                )}
                {approved && (
                    <Button asChild variant={paymentDue ? 'outline' : 'default'}>
                        <Link href="/user/supervisor/delegation"><IconUsersGroup />My Delegation</Link>
                    </Button>
                )}
                {!rejected && !paymentDue && (
                    <Button asChild variant="outline">
                        <Link href="/user/payment"><IconCreditCardPay />Payment</Link>
                    </Button>
                )}
                <Button asChild variant="ghost">
                    <Link href={SUPERVISOR_INFO_PATH}><IconBook />Supervisor guide</Link>
                </Button>
            </div>
        </Card>
    )
}

function SectionHeading({ number, title, description }: { number: number, title: string, description: string }) {
    return (
        <div className="flex items-start gap-3">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-sky-700 text-sm font-semibold text-white">{number}</span>
            <div>
                <legend className="text-lg font-semibold">{title}</legend>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
        </div>
    )
}

function ChoiceCard({
    selected,
    onSelect,
    icon,
    title,
    description,
    disabled = false,
}: {
    selected: boolean
    onSelect: () => void
    icon: React.ReactNode
    title: string
    description: string
    disabled?: boolean
}) {
    return (
        <button
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={onSelect}
            className={cn(
                'flex cursor-pointer items-start gap-3 rounded-lg border p-4 text-left transition',
                selected ? 'border-sky-700 bg-sky-50 ring-1 ring-sky-700' : 'bg-background hover:border-slate-400',
                disabled && 'cursor-not-allowed opacity-50'
            )}
        >
            <span className={cn('rounded-md p-2', selected ? 'bg-sky-700 text-white' : 'bg-muted text-slate-700')}>{icon}</span>
            <span>
                <span className="block font-medium">{title}</span>
                <span className="block text-sm text-muted-foreground">{description}</span>
            </span>
        </button>
    )
}

function ProgressTracker({ steps }: { steps: { title: string, description: string, state: StepState }[] }) {
    return (
        <ol className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-5">
            {steps.map((step, index) => (
                <li key={step.title} className="relative">
                    {index < steps.length - 1 && (
                        <span
                            aria-hidden="true"
                            className={cn(
                                'absolute left-9 -right-3 top-3.5 hidden h-0.5 sm:block',
                                step.state === 'done' ? 'bg-sky-700' : 'bg-slate-200'
                            )}
                        />
                    )}
                    <span
                        className={cn(
                            'relative flex size-7 items-center justify-center rounded-full border-2 text-xs font-semibold',
                            step.state === 'done' && 'border-sky-700 bg-sky-700 text-white',
                            step.state === 'current' && 'border-sky-700 bg-white text-sky-700',
                            step.state === 'upcoming' && 'border-slate-200 bg-white text-slate-400',
                            step.state === 'failed' && 'border-red-600 bg-red-600 text-white'
                        )}
                    >
                        {step.state === 'done' ? <IconCheck className="size-4" /> : step.state === 'failed' ? <IconX className="size-4" /> : index + 1}
                    </span>
                    <p className={cn('mt-2 text-sm font-medium', step.state === 'upcoming' && 'text-muted-foreground')}>{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                </li>
            ))}
        </ol>
    )
}
