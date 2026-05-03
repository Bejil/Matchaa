export type MessageThreadEntry = {
  id: string
  author: 'public' | 'pro'
  text: string
  at: string
  listingId?: string | null
  listingTitle?: string
}

export type MessageThread = {
  id: string
  publicEmail: string
  proAgencyId: string
  proAgencyName: string
  publicName: string
  messages: MessageThreadEntry[]
  unreadPublic: number
  unreadPro: number
  updatedAt: string
}

export function normalizeThreadEntry(raw: unknown): MessageThreadEntry | null {
  if (!raw || typeof raw !== 'object') {
    return null
  }
  const r = raw as Record<string, unknown>
  if (
    typeof r.id !== 'string'
    || (r.author !== 'public' && r.author !== 'pro')
    || typeof r.text !== 'string'
    || typeof r.at !== 'string'
  ) {
    return null
  }
  const listingId =
    typeof r.listingId === 'string' || typeof r.listingId === 'number'
      ? String(r.listingId)
      : (r.listingId === null ? null : undefined)
  const listingTitle = typeof r.listingTitle === 'string' ? r.listingTitle : undefined
  return {
    id: r.id,
    author: r.author,
    text: r.text,
    at: r.at,
    listingId,
    listingTitle,
  }
}

export function normalizeMessageThread(raw: unknown): MessageThread | null {
  if (!raw || typeof raw !== 'object') {
    return null
  }
  const r = raw as Record<string, unknown>
  if (
    typeof r.id !== 'string'
    || typeof r.publicEmail !== 'string'
    || typeof r.proAgencyId !== 'string'
    || typeof r.proAgencyName !== 'string'
    || typeof r.publicName !== 'string'
    || !Array.isArray(r.messages)
  ) {
    return null
  }
  const messages = r.messages
    .map((m) => normalizeThreadEntry(m))
    .filter((m): m is MessageThreadEntry => m !== null)
    .slice(-120)
  return {
    id: r.id,
    publicEmail: r.publicEmail.trim().toLowerCase(),
    proAgencyId: r.proAgencyId,
    proAgencyName: r.proAgencyName,
    publicName: r.publicName,
    messages,
    unreadPublic: Math.max(0, Number(r.unreadPublic ?? 0)),
    unreadPro: Math.max(0, Number(r.unreadPro ?? 0)),
    updatedAt: typeof r.updatedAt === 'string' ? r.updatedAt : (messages.at(-1)?.at ?? new Date().toISOString()),
  }
}

export function sortThreadsByUpdatedAt(threads: MessageThread[]): MessageThread[] {
  return [...threads].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
}

export function upsertThreadMessage(
  threads: MessageThread[],
  input: {
    publicEmail: string
    publicName: string
    proAgencyId: string
    proAgencyName: string
    author: 'public' | 'pro'
    text: string
    listingId?: string | null
    listingTitle?: string
    nowIso?: string
  },
): { threads: MessageThread[]; thread: MessageThread | null } {
  const publicEmail = input.publicEmail.trim().toLowerCase()
  const text = input.text.trim()
  if (!publicEmail || !input.proAgencyId || !text) {
    return { threads, thread: null }
  }
  const now = input.nowIso ?? new Date().toISOString()
  const existing = threads.find(
    (t) => t.publicEmail === publicEmail && t.proAgencyId === input.proAgencyId,
  )
  const nextMsg: MessageThreadEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    author: input.author,
    text,
    at: now,
    listingId: input.listingId ?? null,
    listingTitle: input.listingTitle,
  }
  let nextThread: MessageThread
  let nextThreads: MessageThread[]
  if (existing) {
    nextThread = {
      ...existing,
      publicName: input.publicName || existing.publicName,
      proAgencyName: input.proAgencyName || existing.proAgencyName,
      messages: [...existing.messages, nextMsg].slice(-120),
      unreadPublic: existing.unreadPublic + (input.author === 'pro' ? 1 : 0),
      unreadPro: existing.unreadPro + (input.author === 'public' ? 1 : 0),
      updatedAt: now,
    }
    nextThreads = [
      nextThread,
      ...threads.filter((t) => t.id !== existing.id),
    ]
  } else {
    nextThread = {
      id: `thread-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      publicEmail,
      proAgencyId: input.proAgencyId,
      proAgencyName: input.proAgencyName,
      publicName: input.publicName || 'Prospect',
      messages: [nextMsg],
      unreadPublic: input.author === 'pro' ? 1 : 0,
      unreadPro: input.author === 'public' ? 1 : 0,
      updatedAt: now,
    }
    nextThreads = [nextThread, ...threads]
  }
  return { threads: nextThreads, thread: nextThread }
}

export function markThreadRead(
  threads: MessageThread[],
  threadId: string,
  audience: 'public' | 'pro',
  audienceKey: string,
): { threads: MessageThread[]; changed: boolean } {
  if (!threadId || !audienceKey) {
    return { threads, changed: false }
  }
  let changed = false
  const next = threads.map((t) => {
    if (t.id !== threadId) {
      return t
    }
    if (audience === 'public') {
      if (t.publicEmail !== audienceKey || t.unreadPublic === 0) {
        return t
      }
      changed = true
      return { ...t, unreadPublic: 0 }
    }
    if (t.proAgencyId !== audienceKey || t.unreadPro === 0) {
      return t
    }
    changed = true
    return { ...t, unreadPro: 0 }
  })
  return { threads: next, changed }
}

export function markAllRead(
  threads: MessageThread[],
  audience: 'public' | 'pro',
  audienceKey: string,
): { threads: MessageThread[]; changed: boolean } {
  if (!audienceKey) {
    return { threads, changed: false }
  }
  let changed = false
  const next = threads.map((t) => {
    if (audience === 'public') {
      if (t.publicEmail !== audienceKey || t.unreadPublic === 0) {
        return t
      }
      changed = true
      return { ...t, unreadPublic: 0 }
    }
    if (t.proAgencyId !== audienceKey || t.unreadPro === 0) {
      return t
    }
    changed = true
    return { ...t, unreadPro: 0 }
  })
  return { threads: next, changed }
}

export function markThreadUnread(
  threads: MessageThread[],
  threadId: string,
  audience: 'public' | 'pro',
  audienceKey: string,
): { threads: MessageThread[]; changed: boolean } {
  if (!threadId || !audienceKey) {
    return { threads, changed: false }
  }
  let changed = false
  const next = threads.map((t) => {
    if (t.id !== threadId) {
      return t
    }
    if (audience === 'public') {
      if (t.publicEmail !== audienceKey || t.unreadPublic > 0) {
        return t
      }
      changed = true
      return { ...t, unreadPublic: 1 }
    }
    if (t.proAgencyId !== audienceKey || t.unreadPro > 0) {
      return t
    }
    changed = true
    return { ...t, unreadPro: 1 }
  })
  return { threads: next, changed }
}
