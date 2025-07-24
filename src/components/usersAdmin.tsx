"use client"
import { Card } from '@/components/ui/card'
import { useEffect } from 'react'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'


export default function UsersAdmin({ onSuccess }: { onSuccess?: () => void }) {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [usersInfo, setUsersInfo] = useState<any>(null)
    const [editRows, setEditRows] = useState<{ [id: number]: any }>({})

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('/api/retrieve/getUsers', { 
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                })
                if (res.ok) {
                    const data = await res.json()
                    setUsersInfo(data)
                }
            } catch (err) {
                console.error('Error fetching users info:', err)
            }
        }
        fetchUsers()
    }, [])

    const handleEditChange = (id: number, field: string, value: string | boolean) => {
        setEditRows(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value,
            }
        }))
    }

    const handleEditStart = (user: any) => {
        setEditRows(prev => ({
            ...prev,
            [user.id]: { ...user }
        }))
    }

    const handleEditCancel = (id: number) => {
        setEditRows(prev => {
            const copy = { ...prev }
            delete copy[id]
            return copy
        })
    }

    const handleEditSave = async (id: number) => {
        setLoading(true)
        try {
            const res = await fetch('/api/modify/updateUser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editRows[id]),
            })
            if (res.ok) {
                setSuccess(true)
                setEditRows(prev => {
                    const copy = { ...prev }
                    delete copy[id]
                    return copy
                })
                // Optionally refetch users
                const data = await res.json()
                setUsersInfo(data)
            } else {
                setError('Failed to update user')
            }
        } catch (err) {
            setError('Failed to update user')
        }
        setLoading(false)
    }

    return (
    <section className="bg-muted">
        <div className="mx-auto max-w-4xl px-4 py-4 lg:px-0 min-h-screen">
            <div className="@container lg:col-span-3">
                <Card className="p-8 sm:p-12">
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200 rounded">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-2 py-1 border">ID</th>
                                    <th className="px-2 py-1 border">Email</th>
                                    <th className="px-2 py-1 border">Name</th>
                                    <th className="px-2 py-1 border">Admin</th>
                                    <th className="px-2 py-1 border">Google User</th>
                                    <th className="px-2 py-1 border">Birth</th>
                                    <th className="px-2 py-1 border">Nationality</th>
                                    <th className="px-2 py-1 border">Delegation</th>
                                    <th className="px-2 py-1 border">Diet</th>
                                    <th className="px-2 py-1 border">Notes</th>
                                    <th className="px-2 py-1 border">Payment Value</th>
                                    <th className="px-2 py-1 border">Payment Status</th>
                                    <th className="px-2 py-1 border">Payment Code</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usersInfo?.people?.map((user: any) => {
                                    const isEditing = !!editRows[user.id]
                                    const row = isEditing ? editRows[user.id] : user
                                    return (
                                    <tr key={user.id} className="border-t">
                                        <td className="px-2 py-1 border">{row.id}</td>
                                        <td className="px-2 py-1 border">
                                            {isEditing ? (
                                                <Input value={row.email} onChange={e => handleEditChange(user.id, 'email', e.target.value)} />
                                            ) : row.email}
                                        </td>
                                        <td className="px-2 py-1 border">
                                            {isEditing ? (
                                                <Input value={row.name} onChange={e => handleEditChange(user.id, 'name', e.target.value)} />
                                            ) : row.name}
                                        </td>
                                        <td className="px-2 py-1 border">
                                            {isEditing ? (
                                                <select value={row.isAdmin ? "Yes" : "No"} onChange={e => handleEditChange(user.id, 'isAdmin', e.target.value === "Yes")}>
                                                    <option value="Yes">Yes</option>
                                                    <option value="No">No</option>
                                                </select>
                                            ) : row.isAdmin ? "Yes" : "No"}
                                        </td>
                                        <td className="px-2 py-1 border">
                                            {isEditing ? (
                                                <select value={row.isGoogleUser ? "Yes" : "No"} onChange={e => handleEditChange(user.id, 'isGoogleUser', e.target.value === "Yes")}>
                                                    <option value="Yes">Yes</option>
                                                    <option value="No">No</option>
                                                </select>
                                            ) : row.isGoogleUser ? "Yes" : "No"}
                                        </td>
                                        <td className="px-2 py-1 border">
                                            {isEditing ? (
                                                <Input value={row.birth} onChange={e => handleEditChange(user.id, 'birth', e.target.value)} />
                                            ) : row.birth}
                                        </td>
                                        <td className="px-2 py-1 border">
                                            {isEditing ? (
                                                <Input value={row.nationality} onChange={e => handleEditChange(user.id, 'nationality', e.target.value)} />
                                            ) : row.nationality}
                                        </td>
                                        <td className="px-2 py-1 border">
                                            {isEditing ? (
                                                <Input value={row.delegation} onChange={e => handleEditChange(user.id, 'delegation', e.target.value)} />
                                            ) : row.delegation}
                                        </td>
                                        <td className="px-2 py-1 border">
                                            {isEditing ? (
                                                <Input value={row.diet} onChange={e => handleEditChange(user.id, 'diet', e.target.value)} />
                                            ) : row.diet}
                                        </td>
                                        <td className="px-2 py-1 border">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button size="sm" variant="outline">View</Button>
                                                </PopoverTrigger>
                                                <PopoverContent>
                                                    {isEditing ? (
                                                        <Input value={row.notes} onChange={e => handleEditChange(user.id, 'notes', e.target.value)} />
                                                    ) : row.notes}
                                                </PopoverContent>
                                            </Popover>
                                        </td>
                                        <td className="px-2 py-1 border">
                                            {isEditing ? (
                                                <Input value={row.value} onChange={e => handleEditChange(user.id, 'value', e.target.value)} />
                                            ) : row.value}
                                        </td>
                                        <td className="px-2 py-1 border">
                                            {isEditing ? (
                                                <Input value={row.status} onChange={e => handleEditChange(user.id, 'status', e.target.value)} />
                                            ) : row.status}
                                        </td>
                                        <td className="px-2 py-1 border">
                                            {isEditing ? (
                                                <Input value={row.code} onChange={e => handleEditChange(user.id, 'code', e.target.value)} />
                                            ) : row.code}
                                        </td>
                                        <td className="px-2 py-1 border">
                                            {isEditing ? (
                                                <>
                                                    <Button size="sm" onClick={() => handleEditSave(user.id)} disabled={loading}>Save</Button>
                                                    <Button size="sm" variant="ghost" onClick={() => handleEditCancel(user.id)} disabled={loading}>Cancel</Button>
                                                </>
                                            ) : (
                                                <Button size="sm" variant="outline" onClick={() => handleEditStart(user)}>Edit</Button>
                                            )}
                                        </td>
                                    </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    </section>
    )
}