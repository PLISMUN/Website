import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { errorMessage } from '@/lib/api-client'
import { capitalize, paymentStatusLabel, statusClass } from '@/lib/utils'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCommittees } from '@/features/committees/api'
import { parseCommitteeRoles, type Committee } from '@/features/committees/types'
import { confirmPayment, setPaymentTier } from '@/features/payments/api'
import { decideApplications, getAllApplications, getApplications, submitApplication } from './api'

// What this page keeps of an application
type ApplicantApplication = {
  id: number
  committeeName: string
  role: string
  status: string
  type?: string
  notes: string | null
}

type UserApplications = {
  userId: string
  email: string,
  name: string,
  birth: string,
  phone: string,
  nationality: string,
  delegation: string,
  notes: string,
  pending: boolean,
  paymentStatus: boolean,
  role: string,
  applications: ApplicantApplication[]
}

export default function ApplicationsAdmin() {
  const [users, setUsers] = useState<Record<string, UserApplications>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAllApplications = async () => {
    try {
      setLoading(true)
      const data = await getAllApplications()
      const usersDict: Record<string, UserApplications> = {}
      for (const app of data.applications) {
        if (!usersDict[app.userId]) {
          usersDict[app.userId] = {
            userId: String(app.userId),
            email: app.userEmail,
            name: app.name,
            birth: app.birth,
            phone: app.phone,
            nationality: app.nationality,
            delegation: app.delegation,
            notes: app.userNotes,
            pending: false,
            role: app.role,
            paymentStatus: app.paymentStatus,
            applications: [],
          }
        }
        usersDict[app.userId].applications.push({
          id: app.id,
          committeeName: app.committeeName,
          role: app.role,
          status: app.status,
          type: app.type,
          notes: app.notes,
        })
        if (app.status === "pending") {
          usersDict[app.userId].pending = true
        }
        if (app.role === "chair" || app.type === "chair") {
          usersDict[app.userId].role = "chair"
        }
      }
      setUsers(usersDict)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllApplications()
  }, [])

    const [form, setForm] = useState({
        type: 'delegate',
        committee: '',
        role: '',
        notes: ''
    })

      const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }))
    }

    const [committees, setCommittees] = useState<Committee[]>([])

      useEffect(() => {
        getCommittees()
            .then(setCommittees)
            .catch((err) => console.error('Error fetching committees:', err))
    }, [])

    const setApplication = async (event: React.FormEvent, user: UserApplications) => {
      event.preventDefault();
      if (form.role === "Chair") {form.type = "chair"}
      const { applicationId } = await submitApplication({
        email: user.email,
        type: form.type,
        committee: form.committee,
        role: form.role,
        notes: form.notes,
      })
      const newApplication: ApplicantApplication = {
        id: applicationId,
        committeeName: committees.find(c => c.id.toString() === form.committee)?.name || "Unknown",
        role: form.role,
        status: "accepted",
        notes: form.notes,
      }
      setUsers(prevUsers => {
        const updatedUsers = { ...prevUsers }
        const userKey = Object.keys(updatedUsers).find(
          key => updatedUsers[key].email === user.email
        )
        if (!userKey) return prevUsers

        updatedUsers[userKey] = {
          ...updatedUsers[userKey],
          applications: [...updatedUsers[userKey].applications, newApplication],
          pending: true, // Mark as pending if a new application is added
        }
        return updatedUsers
      })
      setForm({
        type: 'delegate',
        committee: '',
        role: '',
        notes: ''
      })
      acceptApplication(applicationId, user.email);
    }

    const acceptApplication = async (applicationId: number, email: string) => {
      try {
        const acceptedMap: Record<string, boolean> = {};
        const { applications } = await getApplications(email)
        let applicationType = '';
        let applicationRole = '';

        applications.forEach((application) => {
          acceptedMap[application.id] = application.id === applicationId;
          if (application.id === applicationId) {
            applicationType = application.type;
            applicationRole = application.role;
          }
        });
        await decideApplications(acceptedMap)

        // Set what they owe based on application type and role
        if (applicationType === 'chair' || applicationRole === 'chair') {
          await setPaymentTier(email, 'chair')
        } else if (applicationType === 'delegate') {
          await setPaymentTier(email, 'delegate')
        }

        // Update local state instead of refetching everything
        setUsers(prevUsers => {
          // Find the user by email
          const updatedUsers = { ...prevUsers }
          const userKey = Object.keys(updatedUsers).find(
            key => updatedUsers[key].email === email
          )
          if (!userKey) return prevUsers

          updatedUsers[userKey] = {
            ...updatedUsers[userKey],
            applications: updatedUsers[userKey].applications.map(app =>
              app.id === applicationId
                ? { ...app, status: "accepted" }
                : { ...app, status: "rejected" }
            ),
          }
          return updatedUsers
        })
      } catch (err) {
        console.error('Error accepting applications:', err)
      }

    }

  const handleTabChange = (value: string) => {
    if (value === "new") {
      const applicantsDiv = document.getElementById("applicants-list");
      if (applicantsDiv) {
        Array.from(applicantsDiv.children).forEach(applicant => {
          if (applicant) {
            const isPending = applicant.getAttribute("data-pending") === "true";
            applicant.classList.toggle("hidden", !isPending);
          }

        });
      }
    } else if (value === "all") {
      const applicantsDiv = document.getElementById("applicants-list");
      if (applicantsDiv) {
        Array.from(applicantsDiv.children).forEach(applicant => {
          if (applicant) {
            applicant.classList.remove("hidden");
          }
        });
      }
    } else if (value === "new-paid") {
      const applicantsDiv = document.getElementById("applicants-list");
      if (applicantsDiv) {
        Array.from(applicantsDiv.children).forEach(applicant => {
          if (applicant) {
            const isPending = applicant.getAttribute("data-pending") === "true";
            const isPaid = applicant.getAttribute("data-paid") === "true";
            applicant.classList.toggle("hidden", !(isPending && isPaid));
          }

        });
      }
    } else if (value === "chairs") {
      const applicantsDiv = document.getElementById("applicants-list");
      if (applicantsDiv) {
        Array.from(applicantsDiv.children).forEach(applicant => {
          if (applicant) {
            const isChair = applicant.getAttribute("data-role") === "chair";
            applicant.classList.toggle("hidden", !isChair);
          }

        });
      }
    }
  };

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-600">{error}</div>

  return (
    <section className="bg-muted">
      <div className="mx-auto max-w-4xl px-4 py-4 lg:px-0 min-h-screen">
        <div className="@container lg:col-span-3">
          <Card className="p-8 sm:p-12">
            <Tabs defaultValue="all" onValueChange={handleTabChange}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="new">New</TabsTrigger>
                <TabsTrigger value="new-paid">New & Paid</TabsTrigger>
                <TabsTrigger value="chairs">Chairs</TabsTrigger>
              </TabsList>
            <Accordion type="multiple" id="applicants-list">
            {Object.keys(users).length > 0 ? (
              Object.values(users).map((user) => (
                <div key={user.userId} className={`border rounded-lg p-4 mb-4 ${user.pending ? "bg-yellow-50" : "bg-white-100"} shadow-sm`} data-pending={user.pending} data-paid={user.paymentStatus} data-role={user.role}>
                  <AccordionItem value={user.userId}>
                   <AccordionTrigger><div style={{ display: "flex", alignItems: "center" }}><h2 className="font-semibold text-xl">{user.name}</h2><svg xmlns="http://www.w3.org/2000/svg" style={{ width: "1.5em", height: "1.5em", marginLeft: "0.5em" }} viewBox="0 0 640 640"><path fill={user.paymentStatus ? "var(--color-green-600)" : "var(--color-red-600)"} d="M512 176C520.8 176 528 183.2 528 192L528 224L112 224L112 192C112 183.2 119.2 176 128 176L512 176zM528 288L528 448C528 456.8 520.8 464 512 464L128 464C119.2 464 112 456.8 112 448L112 288L528 288zM128 128C92.7 128 64 156.7 64 192L64 448C64 483.3 92.7 512 128 512L512 512C547.3 512 576 483.3 576 448L576 192C576 156.7 547.3 128 512 128L128 128zM144 408C144 421.3 154.7 432 168 432L216 432C229.3 432 240 421.3 240 408C240 394.7 229.3 384 216 384L168 384C154.7 384 144 394.7 144 408zM288 408C288 421.3 298.7 432 312 432L376 432C389.3 432 400 421.3 400 408C400 394.7 389.3 384 376 384L312 384C298.7 384 288 394.7 288 408z"/></svg></div></AccordionTrigger>
                   <AccordionContent>
                    <div className="flex items-start justify-between">
                      <div>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Phone:</strong> {user.phone}</p>
                        <p><strong>Birth:</strong> {user.birth}</p>
                        <p><strong>Nationality:</strong> {user.nationality}</p>
                        <p><strong>Delegation:</strong> {user.delegation}</p>
                        <p><strong>Notes:</strong> {user.notes}</p>
                        <p><strong>Payment Status:</strong> <span className={
                          user.paymentStatus ? "text-green-600" : "text-red-600"
                          }>{paymentStatusLabel(user.paymentStatus)}</span></p>
                        {!user.paymentStatus && (
                          <button
                          type="button"
                          className="mt-2 text-blue-600 hover:text-blue-800 p-2 rounded-full border border-blue-200 hover:bg-blue-50 transition"
                          onClick={async () => {
                            try {
                            await confirmPayment(user.email)
                            setUsers(prevUsers => {
                              const updatedUsers = { ...prevUsers };
                              const userKey = Object.keys(updatedUsers).find(
                              key => updatedUsers[key].email === user.email
                              );
                              if (userKey) {
                              updatedUsers[userKey] = {
                                ...updatedUsers[userKey],
                                paymentStatus: true,
                              };
                              }
                              return updatedUsers;
                            });
                            } catch (err) {
                            console.error('Error confirming payment:', err);
                            }
                          }}
                          >
                          Confirm Payment
                          </button>
                        )}
                      </div>
                          <button
                            type="button"
                            className="ml-4 mt-1 text-red-600 hover:text-red-800 p-2 rounded-full border border-red-200 hover:bg-red-50 transition"
                            title="Reject all applications for this user"
                            onClick={() => acceptApplication(0, user.email)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                      </div>
                  <h3 className="mt-4 font-semibold">Applications:</h3>
                  <form
                    key={user.userId + " Custom"}
                    className="border rounded-lg p-4 mt-2 bg-gray-50 shadow-sm flex items-start justify-between"
                    onSubmit={event => setApplication(event, user)}
                  >
                      <div>
                        <Label htmlFor={`committee`}>Committee:</Label>
                        <Select
                            required={true}
                            value={form.committee}
                            onValueChange={val => handleChange(`committee`, val)}

                        >
                            <SelectTrigger className="max-w-[100%]">
                                <SelectValue placeholder="Select a committee" />
                            </SelectTrigger>
                            <SelectContent>
                                {committees.map(d => (
                                    <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className="mt-2">
                          <Label htmlFor={`role`}>Role:</Label>
                        <Select
                            required={true}
                            value={form.role}
                            onValueChange={val => handleChange(`role`, val)}
                        >
                            <SelectTrigger className="max-w-[100%]">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                {(() => {
                                    const committee = committees.find(c => c.id.toString() === form.committee)
                                    if (!committee?.roles) return null
                                    return [{ role: "Chair", difficulty: undefined }, ...parseCommitteeRoles(committee.roles)].map((roleObj, index) => (
                                        <SelectItem key={index} value={roleObj.role}>
                                            {roleObj.role}
                                            {roleObj.difficulty ? ` (${roleObj.difficulty})` : ""}
                                        </SelectItem>
                                    ))
                                })()}
                            </SelectContent>
                        </Select>
                        </div>
                        <div className="mt-1">
                          <Label htmlFor={`notes`}>Notes:</Label>
                        <Textarea
                            required={true}
                            id={`notes`}
                            rows={1}
                            value={form.notes}
                            onChange={e => handleChange(`notes`, e.target.value)}
                        />
                        </div>
                      </div>
                        <button
                        type="submit"
                        className="ml-4 mt-1 text-green-600 hover:text-green-800 p-2 rounded-full border border-green-200 hover:bg-green-50 transition"
                        title="Mark as accepted"
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    </form>
                  {user.applications.map((app) => (
                    <div key={app.id} className="border rounded-lg p-4 mt-2 bg-gray-50 shadow-sm flex items-start justify-between" id="applicant-application">
                      <div>
                        <div className="font-semibold text-lg">{app.committeeName}</div>
                        <div className="mt-2">
                          <span className="font-medium">Role:</span> {app.role}
                        </div>
                        <div className="mt-1">
                          <span className="font-medium">Status:</span>{" "}
                          <span id="application-status" className={statusClass(app.status)}>
                            {capitalize(app.status)}
                          </span>
                        </div>
                        <div className="mt-1">
                          <span className="font-medium">Notes:</span> {app.notes}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="ml-4 mt-1 text-green-600 hover:text-green-800 p-2 rounded-full border border-green-200 hover:bg-green-50 transition"
                        title="Mark as accepted, rejecting all other applications"
                        onClick={() => acceptApplication(app.id, user.email)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    </div>
                  ))}
                    </AccordionContent>
                    </AccordionItem>
                </div>
              ))
            ) : (
              <p>No applications found.</p>
            )}
            </Accordion>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="new">New</TabsTrigger>
                <TabsTrigger value="new-paid">New & Paid</TabsTrigger>
                <TabsTrigger value="chairs">Chairs</TabsTrigger>
              </TabsList>
            </Tabs>
          </Card>
        </div>
      </div>
    </section>
  )
}