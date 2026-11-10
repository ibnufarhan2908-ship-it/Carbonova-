import React from 'react'
import {
  formatChemicalText,
  renderChemicalPhase,
  formatChemicalToken,
  SUBSCRIPT_MAP,
  SUPERSCRIPT_MAP,
} from '../utils/chemicalFormatter'

export {
  formatChemicalText,
  renderChemicalPhase,
  formatChemicalToken,
  SUBSCRIPT_MAP,
  SUPERSCRIPT_MAP,
}

interface ChemicalFormulaProps {
  formula?: string
  children?: React.ReactNode
  className?: string
  as?: 'span' | 'div' | 'p'
}

/**
 * ChemicalFormula Component
 * Automatically transforms:
 * - Numbers following element symbols into proper subscripts: CH4 -> CH₄, H2O -> H₂O, CO2 -> CO₂, C6H12O6 -> C₆H₁₂O₆
 * - Coefficients before formulas stay normal size & baseline (e.g. 2 H2O, 5 O2)
 * - Ions and charges into proper superscripts: Na+ -> Na⁺, SO4^2- -> SO₄²⁻, Cu2+ -> Cu²⁺
 * - Phase notations (s), (l), (g), (aq) are rendered with <i> italic and STRICT vertical-align: baseline
 *
 * Usage examples:
 * <ChemicalFormula formula="CH4(g)" />
 * <ChemicalFormula>2 H2O(l) -> 2 H2(g) + O2(g)</ChemicalFormula>
 */
export default function ChemicalFormula({
  formula,
  children,
  className = '',
  as: Component = 'span',
}: ChemicalFormulaProps) {
  const content = formula || (typeof children === 'string' ? children : '')

  if (!content && children) {
    return <Component className={className}>{children}</Component>
  }

  return (
    <Component className={`chemical-formula ${className}`}>
      {formatChemicalText(content)}
    </Component>
  )
}
