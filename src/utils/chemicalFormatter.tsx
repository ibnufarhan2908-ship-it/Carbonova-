import React from 'react'

export const SUBSCRIPT_MAP: Record<string, string> = {
  '0': '₀',
  '1': '₁',
  '2': '₂',
  '3': '₃',
  '4': '₄',
  '5': '₅',
  '6': '₆',
  '7': '₇',
  '8': '₈',
  '9': '₉',
  '+': '₊',
  '-': '₋',
  n: 'ₙ',
  m: 'ₘ',
}

export const SUPERSCRIPT_MAP: Record<string, string> = {
  '0': '⁰',
  '1': '¹',
  '2': '²',
  '3': '³',
  '4': '⁴',
  '5': '⁵',
  '6': '⁶',
  '7': '⁷',
  '8': '⁸',
  '9': '⁹',
  '+': '⁺',
  '-': '⁻',
}

/**
 * Render a chemical phase like (s), (l), (g), (aq).
 * STRICT REQUIREMENT:
 * - Must use <i> tag with font-style: italic
 * - MUST NOT use <sub> or <sup>
 * - MUST have vertical-align: baseline (strictly level with normal text)
 */
export function renderChemicalPhase(phase: string, key?: string | number): React.ReactElement {
  return (
    <i
      key={key}
      className="italic font-serif"
      style={{
        verticalAlign: 'baseline',
        fontStyle: 'italic',
        display: 'inline',
        marginRight: '0.05em',
      }}
    >
      ({phase})
    </i>
  )
}

/**
 * Formats a specific chemical formula token (e.g. "CH4(g)", "H2O", "C6H12O6", "SO4^2-", "Na+", "2 H2O")
 */
export function formatChemicalToken(rawToken: string, baseKey: string | number = 0): React.ReactNode {
  if (!rawToken) return null

  // Check if token ends with phase e.g. "CH4(g)" or "NaCl(aq)"
  const phaseMatch = rawToken.match(/^(.*?)\((s|l|g|aq)\)$/i)
  if (phaseMatch) {
    const [, formulaPart, phase] = phaseMatch
    return (
      <span key={baseKey} className="inline whitespace-nowrap">
        {formatChemicalToken(formulaPart, `${baseKey}-form`)}
        {renderChemicalPhase(phase.toLowerCase(), `${baseKey}-phase`)}
      </span>
    )
  }

  // Token might just be a standalone phase e.g. "(g)" or "(aq)"
  const standalonePhaseMatch = rawToken.match(/^\((s|l|g|aq)\)$/i)
  if (standalonePhaseMatch) {
    return renderChemicalPhase(standalonePhaseMatch[1].toLowerCase(), baseKey)
  }

  // Handle coefficient at start (e.g., "2 H2O", "5 O2", "3 CO2")
  const coeffMatch = rawToken.match(/^(\d+)\s*(.+)$/)
  if (coeffMatch && /^[A-Z]/.test(coeffMatch[2])) {
    return (
      <span key={baseKey} className="inline">
        <span className="font-normal">{coeffMatch[1]} </span>
        {formatChemicalToken(coeffMatch[2], `${baseKey}-c`)}
      </span>
    )
  }

  // Handle explicit ions with caret e.g. "SO4^2-", "Cu^2+", "Na^+"
  if (rawToken.includes('^')) {
    const [base, charge] = rawToken.split('^')
    return (
      <span key={baseKey} className="inline whitespace-nowrap">
        {formatChemicalToken(base, `${baseKey}-b`)}
        <sup
          className="text-[0.75em] leading-none select-none font-semibold"
          style={{ verticalAlign: 'super' }}
        >
          {charge}
        </sup>
      </span>
    )
  }

  // Handle ions at end e.g. "Cu2+", "Fe3+", "C4+", "C4-", "Cl-", "Na+", "OH-"
  const ionMatch = rawToken.match(/^([A-Za-z0-9()]+?)(\d*[+-])$/)
  if (ionMatch && !/^\d+$/.test(ionMatch[1])) {
    const [, base, charge] = ionMatch
    return (
      <span key={baseKey} className="inline whitespace-nowrap">
        {formatChemicalToken(base, `${baseKey}-ib`)}
        <sup
          className="text-[0.75em] leading-none select-none font-semibold"
          style={{ verticalAlign: 'super' }}
        >
          {charge}
        </sup>
      </span>
    )
  }

  // Parse formula letters, subscripts, brackets
  // Elements e.g. C, H, O, He, Cl, Br, Na, Cu
  // Numbers following them should become <sub>
  const parts: React.ReactNode[] = []
  const elementNumRegex = /([A-Z][a-z]?|[a-z]|\(|\)|\[|\]|–|—|=|≡|⇌|→|\+|-)(\d+)?/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  // If already contains unicode subscripts, preserve
  if (/([₀-₉₊₋ₙₘ⁰-⁹⁺⁻])/.test(rawToken)) {
    return <span key={baseKey}>{rawToken}</span>
  }

  let index = 0
  while ((match = elementNumRegex.exec(rawToken)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        <span key={`${baseKey}-t-${index++}`}>
          {rawToken.substring(lastIndex, match.index)}
        </span>
      )
    }

    const symbol = match[1]
    const num = match[2]

    parts.push(
      <React.Fragment key={`${baseKey}-p-${index++}`}>
        <span>{symbol}</span>
        {num && (
          <sub
            className="text-[0.75em] leading-none font-normal"
            style={{ verticalAlign: 'sub' }}
          >
            {num}
          </sub>
        )}
      </React.Fragment>
    )

    lastIndex = elementNumRegex.lastIndex
  }

  if (lastIndex < rawToken.length) {
    parts.push(
      <span key={`${baseKey}-rest`}>{rawToken.substring(lastIndex)}</span>
    )
  }

  return parts.length > 0 ? (
    <span key={baseKey} className="inline font-mono sm:font-sans">
      {parts}
    </span>
  ) : (
    <span key={baseKey}>{rawToken}</span>
  )
}

/**
 * Universal formatter for arbitrary text paragraphs.
 * Scans text for:
 * 1. Phase notations: (s), (l), (g), (aq) -> converts to <i style={{ verticalAlign: 'baseline' }}>(g)</i>
 * 2. Reaction arrows: -> or --> to →, <=> to ⇌
 * 3. Chemical formulas like CH4, H2O, CO2, C5H12, C6H12O6, C4+, C4-, Na+, etc.
 */
export function formatChemicalText(text: string): React.ReactNode {
  if (!text) return text

  const tokenRegex = /(\((?:s|l|g|aq)\)|(?:(?:\b[A-Z][a-z]?(?:\d+|[₀-₉]+)?){1,}(?:\([A-Za-z0-9]+\)(?:\d+|[₀-₉]+)?)?)+(?:\^?\d*[+-]|\^?[+-]\d*)?(?:\((?:s|l|g|aq)\))?|-->|->|<=>|<->)/g

  const nodes: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  let keyIdx = 0

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.substring(lastIndex, match.index))
    }

    const token = match[0]

    // Arrow substitutions
    if (token === '->' || token === '-->') {
      nodes.push(' → ')
    } else if (token === '<=>' || token === '<->') {
      nodes.push(' ⇌ ')
    } else if (/^\((s|l|g|aq)\)$/i.test(token)) {
      // Pure standalone phase
      nodes.push(renderChemicalPhase(token.slice(1, -1).toLowerCase(), `phase-${keyIdx++}`))
    } else if (/\((s|l|g|aq)\)$/i.test(token)) {
      // Formula with phase attached e.g. "CH4(g)" or "CH₄(g)"
      const pMatch = token.match(/^(.*?)\((s|l|g|aq)\)$/i)
      if (pMatch) {
        nodes.push(
          <span key={`fphase-${keyIdx++}`} className="inline whitespace-nowrap">
            {formatChemicalToken(pMatch[1], `fp-${keyIdx++}`)}
            {renderChemicalPhase(pMatch[2].toLowerCase(), `p-${keyIdx++}`)}
          </span>
        )
      } else {
        nodes.push(token)
      }
    } else if (/^[A-Z]/.test(token) && /\d/.test(token) && !/^(Senyawa|Tabung|Modul|Topik|Nomor|Langkah|Level|Tingkat|Opsi|Bab|Pilihan|Aturan|Gambar|Tabel|Zat)\b/.test(token)) {
      // Chemical formula candidate e.g. "CH4", "CO2", "H2O", "C5H12"
      nodes.push(formatChemicalToken(token, `chem-${keyIdx++}`))
    } else {
      nodes.push(token)
    }

    lastIndex = tokenRegex.lastIndex
  }

  if (lastIndex < text.length) {
    nodes.push(text.substring(lastIndex))
  }

  return nodes.length > 0 ? <>{nodes}</> : text
}

