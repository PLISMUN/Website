'use client'
import { Card } from '@/components/ui/card'
import * as React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function Committees() {
    const [committees, setCommittees] = React.useState<
        { id: number, name: string, description: string, difficulty: string, topics: string, icon?: string, roles?: string }[]
    >([])
    const [selectedCommittee, setSelectedCommittee] = React.useState<null | { name: string, description: string, difficulty: string, topics?: string, roles?: string, icon?: string }>(null)

    React.useEffect(() => {
        const fetchCommittees = async () => {
            try {
                const res = await fetch('/api/retrieve/getCommittees', { method: 'POST' })
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

    return (
        <section>
            <div className="py-32">
                <div className="mx-auto max-w-5xl px-6">
                    <div>
                        <h2 className="text-balance text-3xl font-semibold md:text-4xl">Committees</h2>
                        <p className="text-muted-foreground mt-3 text-lg">This year we bring a range of well thought out committees and topics.</p>
                    </div>

                    <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {committees.map((committee) => {
                            let topicNames: string[] = [];
                            if (committee.topics) {
                                try {
                                    const topicsObj = JSON.parse(committee.topics);
                                    if (typeof topicsObj === 'object' && topicsObj !== null) {
                                        if (topicsObj.topic1?.name) topicNames.push(topicsObj.topic1.name);
                                        if (topicsObj.topic2?.name) topicNames.push(topicsObj.topic2.name);
                                    }
                                } catch (e) {
                                    console.error('Error parsing topics for committee:', committee.id, e);
                                }
                            }
                            if (topicNames.length === 0) {
                                topicNames.push("No topics available");
                            }
                            let difficultyColor = "bg-gray-400";
                            if (committee.difficulty === "Beginner") difficultyColor = "bg-green-500";
                            else if (committee.difficulty === "Intermediate") difficultyColor = "bg-yellow-400";
                            else if (committee.difficulty === "Advanced") difficultyColor = "bg-red-500";
                            return (
                                <IntegrationCard
                                    key={committee.id}
                                    title={committee.name}
                                    description={topicNames.map(name => `• ${name}`).join('\n')}
                                    onClick={() => setSelectedCommittee({
                                        name: committee.name,
                                        description: committee.description,
                                        difficulty: committee.difficulty,
                                        topics: committee.topics,
                                        roles: committee.roles,
                                        icon: committee.icon,
                                    })}
                                >
                                    <div>
                                        <div className={`h-1 w-24 rounded-full mt-2 ${difficultyColor}`} />
                                        {committee.icon && (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={committee.icon}
                                                alt={`${committee.name} icon`}
                                                className="w-16 h-16 object-contain rounded"
                                            />
                                        )}
                                    </div>
                                </IntegrationCard>
                            );
                        })}
                    </div>
                </div>
            </div>
            <AlertDialog open={!!selectedCommittee} onOpenChange={() => setSelectedCommittee(null)}>
                <AlertDialogContent>
                    <div className="max-h-[70vh] overflow-y-auto">
                        <div className="flex justify-end">
                            <AlertDialogCancel className="p-1 text-xs h-6 w-6 rounded-full">×</AlertDialogCancel>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                            {selectedCommittee?.icon && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={selectedCommittee.icon}
                                    alt={`${selectedCommittee.name} icon`}
                                    className="w-24 h-24 object-contain rounded mb-4"
                                />
                            )}
                                <AlertDialogTitle>{selectedCommittee?.name}</AlertDialogTitle>
                                <AlertDialogDescription>
                                    <b>Difficulty:</b> {selectedCommittee?.difficulty}
                                    <br />
                                    <b>Description:</b> {selectedCommittee?.description}
                                    <br />
                                </AlertDialogDescription>
                            <AlertDialogDescription>
                               <div className="mt-4">
                                    <b>Roles:</b>
                                    {selectedCommittee?.roles && (() => {
                                        let rolesArr: { role: string; difficulty: string }[] = [];
                                        try {
                                            rolesArr = JSON.parse(selectedCommittee.roles);
                                        } catch {
                                            return <div>Invalid roles format</div>;
                                        }
                                        const grouped = rolesArr.reduce((acc, curr) => {
                                            acc[curr.difficulty] = acc[curr.difficulty] || [];
                                            acc[curr.difficulty].push(curr.role);
                                            return acc;
                                        }, {} as Record<string, string[]>);

                                        return (
                                            <div>
                                                {Object.entries(grouped).map(([difficulty, roles]) => (
                                                    <div key={difficulty} className="mt-2">
                                                        <span className="font-semibold">{difficulty}:</span>
                                                        <ul className="list-disc list-inside ml-4">
                                                            {roles.map((role) => (
                                                                <li key={role}>{role}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })()}
                                </div>
                        </AlertDialogDescription>
                            </div>
                        
                            <div className="mt-8 flex flex-col gap-4">
                            <AlertDialogDescription>
                                {selectedCommittee?.topics && (() => {
                                        const topicsObj = JSON.parse(selectedCommittee.topics);
                                        return Object.entries(topicsObj).map(([key, topic]: any, idx) => (
                                            <div key={key} className="border rounded p-2 mt-2 bg-gray-50">
                                                <div className="font-semibold">{topic.name}</div>
                                                <div className="text-sm">{topic.description}</div>
                                            </div>
                                        ));
                                })()}
                            </AlertDialogDescription>
                            </div>
                        </div>
                        <AlertDialogFooter className='mt-6'>
                            <AlertDialogCancel>Ok</AlertDialogCancel>
                        </AlertDialogFooter>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </section>
    )
}

const IntegrationCard = ({ title, description, children, onClick }: { title: string; description: string; children: React.ReactNode; link?: string; onClick?: () => void }) => {
    const lines = description.split('\n');
    return (
        <Card
            className="p-6 hover:scale-110 transition-transform duration-300 ease-in-out hover:shadow-lg shadow-sm flex flex-col justify-between items-start cursor-pointer"
            onClick={onClick}
        >
            <div className="relative">
                <div className="*:size-10">{children}</div>

                <div className="mt-6 space-y-1.5">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <div className="text-muted-foreground flex flex-col gap-1">
                        {lines.map((line, idx) => (
                            <span key={idx}>{line}</span>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    )
}
