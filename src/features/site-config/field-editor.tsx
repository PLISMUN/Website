"use client"
import { useEffect, useId, useState, type ReactNode } from 'react'
import { IconArrowDown, IconArrowUp, IconPlus, IconTrash } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import type { Field } from './fields'
import type { ConfigIssue } from './schema'

// Edits a value laid out by a Field from fields.ts, and shows the problems found in it next to the
// fields they're about. Used by the Settings and Committees admin pages.

type Path = (string | number)[]

export const samePath = (a: Path, b: Path) => a.length === b.length && a.every((part, index) => String(part) === String(b[index]))

export function FieldEditor({
    field,
    value,
    path,
    issues,
    onChange,
    isRoot = false,
    compact = false,
}: {
    field: Field
    value: unknown
    path: Path
    issues: ConfigIssue[]
    onChange: (value: unknown) => void
    isRoot?: boolean
    // For a field in a row of an inline list: the label is only read out, and there's no help text
    compact?: boolean
}) {
    const id = useId()
    const ownIssues = issues.filter((issue) => samePath(issue.path, path))
    const invalid = ownIssues.length > 0

    switch (field.kind) {
        case 'text':
            return (
                <FieldShell id={id} field={field} issues={ownIssues} compact={compact}>
                    <div className="flex items-start gap-3">
                        {field.multiline ? (
                            <Textarea
                                id={id}
                                value={String(value ?? '')}
                                placeholder={field.placeholder}
                                aria-invalid={invalid}
                                onChange={(e) => onChange(e.target.value)}
                                className="min-h-24"
                            />
                        ) : (
                            <Input
                                id={id}
                                value={String(value ?? '')}
                                placeholder={field.placeholder}
                                aria-invalid={invalid}
                                onChange={(e) => onChange(e.target.value)}
                            />
                        )}
                        {field.image && <ImagePreview src={String(value ?? '')} />}
                    </div>
                </FieldShell>
            )

        case 'number':
            return (
                <FieldShell id={id} field={field} issues={ownIssues} compact={compact}>
                    <Input
                        id={id}
                        type="number"
                        inputMode="numeric"
                        className="max-w-48"
                        value={typeof value === 'number' && !Number.isNaN(value) ? value : ''}
                        aria-invalid={invalid}
                        // Left as '' while empty, which is flagged as missing rather than saved as 0
                        onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
                    />
                </FieldShell>
            )

        case 'select': {
            const current = String(value ?? '')
            // Something saved before the choices were limited is still shown, so it can be changed
            const options = current && !field.options.includes(current) ? [current, ...field.options] : field.options
            return (
                <FieldShell id={id} field={field} issues={ownIssues} compact={compact}>
                    <Select value={current} onValueChange={onChange}>
                        <SelectTrigger id={id} className="w-full max-w-60" aria-invalid={invalid}>
                            <SelectValue placeholder="Choose one" />
                        </SelectTrigger>
                        <SelectContent>
                            {options.map((option) => (
                                <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </FieldShell>
            )
        }

        case 'boolean':
            return (
                <div className="flex items-start gap-3 rounded-md border p-4">
                    <Checkbox id={id} checked={value === true} onCheckedChange={(checked) => onChange(checked === true)} className="mt-0.5" />
                    <div className="space-y-1">
                        <Label htmlFor={id} className="font-medium">
                            {field.label}
                            <span className={cn('ml-2 text-xs font-normal', value ? 'text-green-700' : 'text-muted-foreground')}>
                                {value ? 'Open' : 'Closed'}
                            </span>
                        </Label>
                        {field.help && <p className="text-sm text-muted-foreground">{field.help}</p>}
                        <Issues issues={ownIssues} />
                    </div>
                </div>
            )

        case 'group': {
            const object = (value ?? {}) as Record<string, unknown>
            const children = field.fields.map((child) => (
                <FieldEditor
                    key={child.key}
                    field={child}
                    value={object[child.key]}
                    path={[...path, child.key]}
                    issues={issues}
                    onChange={(next) => onChange({ ...object, [child.key]: next })}
                />
            ))
            if (isRoot) return <div className="space-y-5">{children}</div>
            return (
                <fieldset className="min-w-0 space-y-4 rounded-md border p-4">
                    <legend className="px-1 text-sm font-semibold">{field.label}</legend>
                    {field.help && <p className="text-sm text-muted-foreground">{field.help}</p>}
                    <Issues issues={ownIssues} />
                    {children}
                </fieldset>
            )
        }

        case 'textList': {
            const items = Array.isArray(value) ? (value as unknown[]) : []
            return (
                <fieldset className="min-w-0 space-y-3 rounded-md border p-4">
                    <legend className="px-1 text-sm font-semibold">{field.label}</legend>
                    {field.help && <p className="text-sm text-muted-foreground">{field.help}</p>}
                    <Issues issues={ownIssues} />
                    {items.map((item, index) => {
                        const itemIssues = issues.filter((issue) => samePath(issue.path, [...path, index]))
                        const itemId = `${id}-${index}`
                        return (
                            <div key={index} className="space-y-1">
                                <Label htmlFor={itemId} className="sr-only">{`${field.itemLabel} ${index + 1}`}</Label>
                                <div className="flex items-start gap-2">
                                    {field.multiline ? (
                                        <Textarea
                                            id={itemId}
                                            value={String(item ?? '')}
                                            aria-invalid={itemIssues.length > 0}
                                            onChange={(e) => onChange(items.map((old, i) => (i === index ? e.target.value : old)))}
                                            className="min-h-24"
                                        />
                                    ) : (
                                        <Input
                                            id={itemId}
                                            value={String(item ?? '')}
                                            aria-invalid={itemIssues.length > 0}
                                            onChange={(e) => onChange(items.map((old, i) => (i === index ? e.target.value : old)))}
                                        />
                                    )}
                                    {field.image && <ImagePreview src={String(item ?? '')} />}
                                    <ItemButtons
                                        label={`${field.itemLabel} ${index + 1}`}
                                        index={index}
                                        count={items.length}
                                        onMove={(to) => onChange(move(items, index, to))}
                                        onRemove={() => onChange(items.filter((_, i) => i !== index))}
                                    />
                                </div>
                                <Issues issues={itemIssues} />
                            </div>
                        )
                    })}
                    <Button type="button" variant="outline" size="sm" onClick={() => onChange([...items, ''])}>
                        <IconPlus /> Add {field.itemLabel.toLowerCase()}
                    </Button>
                </fieldset>
            )
        }

        case 'list':
            return <ListEditor field={field} value={value} path={path} issues={issues} onChange={onChange} isRoot={isRoot} />
    }
}

function ListEditor({
    field,
    value,
    path,
    issues,
    onChange,
    isRoot,
}: {
    field: Extract<Field, { kind: 'list' }>
    value: unknown
    path: Path
    issues: ConfigIssue[]
    onChange: (value: unknown) => void
    isRoot: boolean
}) {
    const id = useId()
    const items = Array.isArray(value) ? (value as Record<string, unknown>[]) : []
    // Items start closed so a long list can be scanned. New ones, and ones with something to fix, are open.
    const [expanded, setExpanded] = useState<Set<number>>(() => new Set())

    const ownIssues = issues.filter((issue) => samePath(issue.path, path))
    const titleOf = (item: Record<string, unknown>) => (field.titleKey ? String(item[field.titleKey] ?? '').trim() : '')

    const toggle = (index: number) =>
        setExpanded((current) => {
            const next = new Set(current)
            if (next.has(index)) next.delete(index)
            else next.add(index)
            return next
        })

    const add = () => {
        setExpanded((current) => new Set(current).add(items.length))
        onChange([...items, field.newItem()])
    }

    const remove = (index: number) => {
        setExpanded((current) => new Set([...current].filter((i) => i !== index).map((i) => (i > index ? i - 1 : i))))
        onChange(items.filter((_, i) => i !== index))
    }

    const moveItem = (from: number, to: number) => {
        setExpanded((current) => new Set([...current].map((i) => (i === from ? to : i === to ? from : i))))
        onChange(move(items, from, to))
    }

    const list = (
        <div className="space-y-3">
            {!isRoot && field.help && <p className="text-sm text-muted-foreground">{field.help}</p>}
            <Issues issues={ownIssues} />
            {items.length === 0 && <p className="text-sm text-muted-foreground">None yet.</p>}
            {items.map((item, index) => {
                const itemPath = [...path, index]
                const hasIssues = issues.some((issue) => issue.path.length > itemPath.length && samePath(issue.path.slice(0, itemPath.length), itemPath))
                const editChild = (key: string) => (next: unknown) => onChange(items.map((old, i) => (i === index ? { ...old, [key]: next } : old)))

                if (field.inline) {
                    return (
                        <div key={index} className="flex items-start gap-2">
                            <span className="text-muted-foreground w-6 shrink-0 pt-2.5 text-right text-xs tabular-nums">{index + 1}</span>
                            {/* Side by side where there's room, one above the other on a phone */}
                            <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row">
                            {field.fields.map((child) => (
                                <div key={child.key} className={cn('min-w-0', child.kind === 'select' ? 'sm:w-36 sm:shrink-0' : 'flex-1')}>
                                    <FieldEditor
                                        field={{ ...child, label: `${child.label} of ${field.itemLabel.toLowerCase()} ${index + 1}` }}
                                        value={item[child.key]}
                                        path={[...itemPath, child.key]}
                                        issues={issues}
                                        onChange={editChild(child.key)}
                                        compact
                                    />
                                </div>
                            ))}
                            </div>
                            <ItemButtons
                                label={`${field.itemLabel} ${index + 1}`}
                                index={index}
                                count={items.length}
                                onMove={(to) => moveItem(index, to)}
                                onRemove={() => remove(index)}
                            />
                        </div>
                    )
                }

                const open = expanded.has(index) || hasIssues
                const title = titleOf(item)
                const bodyId = `${id}-${index}`
                return (
                    <div key={index} className={cn('rounded-md border bg-background', hasIssues && 'border-red-300')}>
                        <div className="flex items-center gap-2 py-1 pl-2 pr-1">
                            <button
                                type="button"
                                className="flex min-w-0 flex-1 items-center gap-2 rounded px-2 py-2 text-left hover:bg-muted"
                                aria-expanded={open}
                                aria-controls={bodyId}
                                onClick={() => toggle(index)}
                            >
                                <span className="text-muted-foreground text-xs tabular-nums">{index + 1}</span>
                                <span className="min-w-0 flex-1 truncate text-sm font-medium">
                                    {title || <span className="text-muted-foreground">New {field.itemLabel.toLowerCase()}</span>}
                                </span>
                                <span className="text-muted-foreground hidden text-xs sm:inline">{open ? 'Close' : 'Edit'}</span>
                            </button>
                            <ItemButtons
                                label={`${field.itemLabel} ${index + 1}`}
                                index={index}
                                count={items.length}
                                onMove={(to) => moveItem(index, to)}
                                onRemove={() => remove(index)}
                            />
                        </div>
                        {open && (
                            <div id={bodyId} className="space-y-4 border-t px-4 py-4">
                                {field.fields.map((child) => (
                                    <FieldEditor
                                        key={child.key}
                                        field={child}
                                        value={item[child.key]}
                                        path={[...itemPath, child.key]}
                                        issues={issues}
                                        onChange={editChild(child.key)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )
            })}
            <Button type="button" variant="outline" size="sm" onClick={add}>
                <IconPlus /> Add {field.itemLabel.toLowerCase()}
            </Button>
        </div>
    )

    if (isRoot) return list
    return (
        <fieldset className="min-w-0 space-y-3 rounded-md border p-4">
            <legend className="px-1 text-sm font-semibold">{field.label}</legend>
            {list}
        </fieldset>
    )
}

function FieldShell({ id, field, issues, compact, children }: { id: string; field: Field; issues: ConfigIssue[]; compact: boolean; children: ReactNode }) {
    return (
        <div className="space-y-1.5">
            <Label htmlFor={id} className={cn(compact && 'sr-only')}>{field.label}</Label>
            {children}
            {!compact && field.help && <p className="text-sm text-muted-foreground">{field.help}</p>}
            <Issues issues={issues} />
        </div>
    )
}

function Issues({ issues }: { issues: ConfigIssue[] }) {
    if (!issues.length) return null
    return (
        <>
            {issues.map((issue, index) => (
                <p key={index} className="text-sm text-red-600">{issue.message}</p>
            ))}
        </>
    )
}

function ItemButtons({
    label,
    index,
    count,
    onMove,
    onRemove,
}: {
    label: string
    index: number
    count: number
    onMove: (to: number) => void
    onRemove: () => void
}) {
    return (
        <div className="flex shrink-0 items-center">
            <Button type="button" variant="ghost" size="icon" className="size-8" aria-label={`Move ${label} up`} disabled={index === 0} onClick={() => onMove(index - 1)}>
                <IconArrowUp />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="size-8" aria-label={`Move ${label} down`} disabled={index === count - 1} onClick={() => onMove(index + 1)}>
                <IconArrowDown />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="size-8 text-red-600 hover:text-red-700" aria-label={`Remove ${label}`} onClick={onRemove}>
                <IconTrash />
            </Button>
        </div>
    )
}

function ImagePreview({ src }: { src: string }) {
    const [failed, setFailed] = useState(false)
    useEffect(() => setFailed(false), [src])

    const usable = /^(\/\S+|https?:\/\/\S+)$/i.test(src.trim())
    return (
        <div className="flex h-9 w-14 shrink-0 items-center justify-center overflow-hidden rounded border bg-muted text-[10px] text-muted-foreground">
            {usable && !failed ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={src.trim()} alt="" className="size-full object-cover" onError={() => setFailed(true)} />
            ) : (
                'No image'
            )}
        </div>
    )
}

function move<T>(items: T[], from: number, to: number): T[] {
    const next = [...items]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    return next
}
