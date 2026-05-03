export type ProspectHeatLevel = 'cold' | 'warm' | 'hot'

export type ProspectTemperatureInput = {
  similarity: number
  searchCount: number
  activity: {
    views: number
    favorites: number
    leads: number
    phoneReveals: number
  }
  lastActivityAt: string | null
  diversity: {
    typeSpread: number
    citySpread: number
  }
}

export type ProspectTemperatureResult = {
  level: ProspectHeatLevel
  label: 'Froid' | 'Tiède' | 'Chaud'
  uxLabel: string
  score: number
  similarity: number
  reasons: string[]
}

type Thresholds = {
  hotSimilarity: number
  warmSimilarity: number
  coldLockSimilarity: number
}

const DEFAULT_THRESHOLDS: Thresholds = {
  hotSimilarity: 0.8,
  warmSimilarity: 0.5,
  coldLockSimilarity: 0.46,
}

function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v))
}

function heatFromSimilarity(similarity: number, thresholds: Thresholds): ProspectHeatLevel {
  if (similarity >= thresholds.hotSimilarity) {
    return 'hot'
  }
  if (similarity >= thresholds.warmSimilarity) {
    return 'warm'
  }
  return 'cold'
}

function shiftHeat(level: ProspectHeatLevel, delta: -1 | 0 | 1): ProspectHeatLevel {
  if (delta === 0) {
    return level
  }
  if (delta > 0) {
    if (level === 'cold') {
      return 'warm'
    }
    if (level === 'warm') {
      return 'hot'
    }
    return 'hot'
  }
  if (level === 'hot') {
    return 'warm'
  }
  if (level === 'warm') {
    return 'cold'
  }
  return 'cold'
}

function levelLabel(level: ProspectHeatLevel): 'Froid' | 'Tiède' | 'Chaud' {
  if (level === 'hot') {
    return 'Chaud'
  }
  if (level === 'warm') {
    return 'Tiède'
  }
  return 'Froid'
}

function levelUxLabel(level: ProspectHeatLevel): string {
  if (level === 'hot') {
    return "Pret a passer a l'action"
  }
  if (level === 'warm') {
    return 'Interesse'
  }
  return 'Peu actif ou hors cible'
}

function recencyDelta(lastActivityAt: string | null): { delta: -1 | 0 | 1; reason: string } {
  if (!lastActivityAt) {
    return { delta: -1, reason: 'Aucune activite recente observee' }
  }
  const days = (Date.now() - new Date(lastActivityAt).getTime()) / (1000 * 60 * 60 * 24)
  if (days <= 3) {
    return { delta: 1, reason: 'Activite tres recente (< 3 jours)' }
  }
  if (days <= 7) {
    return { delta: 0, reason: 'Activite recente (<= 7 jours)' }
  }
  if (days > 30) {
    return { delta: -1, reason: 'Activite ancienne (> 30 jours)' }
  }
  return { delta: -1, reason: 'Activite en baisse (> 7 jours)' }
}

function behaviorDelta(input: ProspectTemperatureInput): { delta: -1 | 0 | 1; reason: string } {
  const repeatedViews = input.activity.views >= 3 ? 1 : 0
  const strongActions = input.activity.favorites + input.activity.leads + input.activity.phoneReveals
  const behaviorScore = repeatedViews * 2 + strongActions * 2 + Math.min(3, input.searchCount)
  if (behaviorScore >= 8) {
    return { delta: 1, reason: 'Interactions fortes (favoris, demandes ou telephones)' }
  }
  if (behaviorScore <= 1) {
    return { delta: -1, reason: "Peu d'interactions observables" }
  }
  return { delta: 0, reason: 'Engagement modere' }
}

function intentionDelta(input: ProspectTemperatureInput): { delta: -1 | 0 | 1; reason: string } {
  const repeatedViews = input.activity.views >= 4
  const activeSignals = input.searchCount >= 2 || repeatedViews || input.activity.favorites >= 1
  if (activeSignals && (input.activity.leads > 0 || input.activity.phoneReveals > 0 || repeatedViews)) {
    return { delta: 1, reason: 'Intentions actives (vues repetees ou action de contact)' }
  }
  if (activeSignals) {
    return { delta: 0, reason: 'Signaux d intention presents' }
  }
  return { delta: -1, reason: 'Intention faible' }
}

function adaptiveSimilarity(similarity: number, diversity: ProspectTemperatureInput['diversity']): number {
  const spread = clamp01((diversity.typeSpread * 0.6) + (diversity.citySpread * 0.4))
  const toleranceAdjustment = (spread - 0.5) * 0.12
  return clamp01(similarity + toleranceAdjustment)
}

export function evaluateProspectTemperature(
  input: ProspectTemperatureInput,
  thresholds: Thresholds = DEFAULT_THRESHOLDS,
): ProspectTemperatureResult {
  const reasons: string[] = []
  const similarity = adaptiveSimilarity(clamp01(input.similarity), input.diversity)
  const baseLevel = heatFromSimilarity(similarity, thresholds)
  reasons.push(`Similarite contextuelle ${Math.round(similarity * 100)}%`)

  const behavior = behaviorDelta(input)
  const intention = intentionDelta(input)
  const recency = recencyDelta(input.lastActivityAt)

  reasons.push(behavior.reason)
  reasons.push(intention.reason)
  reasons.push(recency.reason)

  let finalLevel = baseLevel

  // La similarite domine : en dessous du seuil critique, on reste Froid.
  if (similarity < thresholds.coldLockSimilarity) {
    finalLevel = 'cold'
    reasons.push('Similarite insuffisante pour monter en temperature')
  } else {
    finalLevel = shiftHeat(finalLevel, behavior.delta)
    finalLevel = shiftHeat(finalLevel, intention.delta)
    finalLevel = shiftHeat(finalLevel, recency.delta)
  }

  // Degradation forte si inactif depuis longtemps.
  if (input.lastActivityAt) {
    const days = (Date.now() - new Date(input.lastActivityAt).getTime()) / (1000 * 60 * 60 * 24)
    if (days > 30) {
      finalLevel = 'cold'
      reasons.push('Rafraichissement force : inactivite > 30 jours')
    }
  }

  // Durcissement du niveau "Chaud": necessite une similarite forte.
  if (finalLevel === 'hot' && similarity < thresholds.hotSimilarity) {
    finalLevel = 'warm'
    reasons.push('Seuil chaud non atteint: similarite insuffisante pour rester en priorite maximale')
  }

  const engagementRaw =
    (input.searchCount * 1)
    + (input.activity.views * 1.8)
    + (input.activity.favorites * 4)
    + (input.activity.phoneReveals * 5)
    + (input.activity.leads * 6)
  const engagement = clamp01(engagementRaw / 28)
  const recencyComponent = recency.delta > 0 ? 1 : recency.delta < 0 ? 0.25 : 0.7
  const score = Math.round((similarity * 0.72 + engagement * 0.18 + recencyComponent * 0.1) * 1000) / 10

  return {
    level: finalLevel,
    label: levelLabel(finalLevel),
    uxLabel: levelUxLabel(finalLevel),
    score,
    similarity,
    reasons,
  }
}
