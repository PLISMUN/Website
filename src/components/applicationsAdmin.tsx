"use client"
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
import { useSession } from 'next-auth/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Application = {
  id: string
  committeeName: string
  role: string
  status: string
  [key: string]: any
}

type UserApplications = {
  userId: string
  email: string,
  name: string,
  birth: string,
  nationality: string,
  delegation: string,
  notes: string,
  pending: boolean,
  applications: Application[]
}

export default function ApplicationsAdmin() {
  const [users, setUsers] = useState<Record<string, UserApplications>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAllApplications = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/getAllApplications", { method: "POST" })
      if (!res.ok) {
        console.error(res)
        throw new Error("Failed to fetch applications")
      }
      const data = await res.json()
      const usersDict: Record<string, UserApplications> = {}
      for (const app of data.applications) {
        if (!usersDict[app.userId]) {
          usersDict[app.userId] = {
            userId: app.userId,
            email: app.userEmail,
            name: app.name,
            birth: app.birth,
            nationality: app.nationality,
            delegation: app.delegation,
            notes: app.userNotes,
            pending: false,
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
      }
      setUsers(usersDict)
    } catch (err: any) {
      setError(err.message)
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

    const [committees, setCommittees] = useState<{ id: number, name: string, roles: string }[]>([])

      useEffect(() => {
        const fetchCommittees = async () => {
            try {
                const res = await fetch('/api/getCommittees', { method: 'POST' })
                if (res.ok) {
                    const data = await res.json()
                    setCommittees(data)
                }
            } catch (err) {
                console.error('Error fetching committees:', err)
            }
        }

        fetchCommittees()
    }, [])

    const setApplication = async (event: React.FormEvent, user: UserApplications) => {
      event.preventDefault();
      const res_setapp = await fetch('/api/setApplication', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          type: form.type,
          committee: form.committee,
          role: form.role,
          notes: form.notes,
        }),
      })
      if (!res_setapp.ok) {
        const error = await res_setapp.text()
        throw new Error(`Failed to set application: ${error}`)
      }
      const data = await res_setapp.json();
      const applicationId = data.applicationId;
      const newApplication: Application = {
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

    const acceptApplication = async (applicationId: string, email: string) => {
      try {
        const acceptedMap: Record<string, boolean> = {};
        const res_getuserapps = await fetch('/api/getApplications', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email }), 
        })
        if (!res_getuserapps.ok) {
          const error = await res_getuserapps.text()
          throw new Error(`Failed to fetch applications: ${error}`)
        }
        const applicationsObj = await res_getuserapps.json()
        const applications = applicationsObj.applications;
        if (Array.isArray(applications)) {
          applications.forEach((application: any) => {
            acceptedMap[application.id] = application.id === applicationId
          })
        }
        const res_updateapps = await fetch('/api/acceptApplication', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(acceptedMap),
        })
        if (!res_updateapps.ok) {
          const error = await res_updateapps.text()
          throw new Error(`Failed to update applications: ${error}`)
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
    console.log("Active tab:", value);
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
              </TabsList>
            <Accordion type="multiple" id="applicants-list">
            {Object.keys(users).length > 0 ? (
              Object.values(users).map((user) => (
                <div key={user.userId} className={`border rounded-lg p-4 mb-4 ${user.pending ? "bg-yellow-50" : "bg-green-50"} shadow-sm`} data-pending={user.pending}>
                  <AccordionItem value={user.userId}>
                   <AccordionTrigger><h2 className="font-semibold text-xl">{user.name}</h2></AccordionTrigger>
                   <AccordionContent>
                    <div className="flex items-start justify-between">
                      <div>
                        <p><strong>Birth:</strong> {user.birth}</p>
                        <p><strong>Nationality:</strong> {user.nationality}</p>
                        <p><strong>Delegation:</strong> {user.delegation}</p>
                        <p><strong>Notes:</strong> {user.notes}</p>
                      </div>
                          <button
                            type="button"
                            className="ml-4 mt-1 text-red-600 hover:text-red-800 p-2 rounded-full border border-red-200 hover:bg-red-50 transition"
                            title="Reject all applications for this user"
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
                                    try {
                                        const rolesArr = JSON.parse(committee.roles)
                                        return Array.isArray(rolesArr)
                                            ? rolesArr.map((roleObj: any, index: number) => (
                                                <SelectItem key={index} value={roleObj.role || roleObj}>
                                                    {roleObj.role || roleObj}
                                                    {roleObj.difficulty ? ` (${roleObj.difficulty})` : ""}
                                                </SelectItem>
                                            ))
                                            : null
                                    } catch {
                                        return null
                                    }
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
                          <span id="application-status" className={
                            app.status === "pending" ? "text-yellow-600" :
                            app.status === "accepted" ? "text-green-600" :
                            app.status === "rejected" ? "text-red-600" : ""
                          }>
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
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
              </TabsList>
            </Tabs>
          </Card>
        </div>
      </div>
    </section>
  )
}