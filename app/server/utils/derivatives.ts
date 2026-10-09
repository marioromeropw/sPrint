import type { ApsManifestChild, ApsManifestDerivative, Derivative, DerivativeFormat, ViewSet } from '~/types/derivatives'

function normalizeViewSets(viewSets: string | string[] | undefined): string[] {
  if (!viewSets) return []
  return Array.isArray(viewSets) ? viewSets : [viewSets]
}

export function resolveFormat(child: ApsManifestChild): DerivativeFormat {
  const role = child.role?.toLowerCase() || ''
  const urn = (child.urn || '').toLowerCase()
  const name = urn.split('/').pop() || ''

  if (role === 'pdf-page' || urn.endsWith('.pdf')) return 'pdf'
  if (role === 'thumbnail') return 'thumbnail'
  if (name === 'aecmodeldata.json') return 'aec'
  if (urn.endsWith('.sdb') || name === 'model.sdb') return 'sdb'
  if (urn.endsWith('.svf') || urn.endsWith('.svf2')) return 'svf'
  if (urn.endsWith('.dwg')) return 'dwg'
  if (urn.endsWith('.dwf') || urn.endsWith('.dwfx')) return 'dwf'
  if (urn.endsWith('.ifc')) return 'ifc'
  return 'other'
}

export function resolveMimeType(format: DerivativeFormat): string {
  const map: Record<DerivativeFormat, string> = {
    pdf: 'application/pdf',
    dwg: 'application/acad',
    dwf: 'model/vnd.dwf',
    ifc: 'application/x-step',
    thumbnail: 'image/png',
    aec: 'application/json',
    sdb: 'application/octet-stream',
    svf: 'application/octet-stream',
    other: 'application/octet-stream'
  }
  return map[format]
}

export function filterDerivatives(children: ApsManifestChild[], formats?: DerivativeFormat[]): Derivative[] {
  const result: Derivative[] = []
  const seenUrns = new Set<string>()

  const push = (derivative: Derivative) => {
    if (formats && !formats.includes(derivative.format)) return
    if (derivative.urn && seenUrns.has(derivative.urn)) return
    if (derivative.urn) seenUrns.add(derivative.urn)
    result.push(derivative)
  }

  // Walk the full tree: newer Revit manifests nest sheets and views under
  // folder nodes (e.g. "Sheets" > sheet geometry > pdf-page) at arbitrary depth.
  // ViewSets live on geometry nodes, so resources inherit the nearest ancestor's.
  const walk = (nodes: ApsManifestChild[], inheritedViewSets: string[]) => {
    for (const node of nodes) {
      const viewSets = node.ViewSets !== undefined ? normalizeViewSets(node.ViewSets) : inheritedViewSets

      const pdfChild = node.children?.find(c => c.role === 'pdf-page')
      if (pdfChild) {
        push({
          guid: pdfChild.guid,
          name: node.name || pdfChild.urn?.split('/').pop() || pdfChild.name,
          urn: pdfChild.urn || '',
          format: 'pdf',
          mimeType: resolveMimeType('pdf'),
          viewSets,
          active: true
        })
        continue
      }

      if (node.urn) {
        const format = resolveFormat(node)
        push({
          guid: node.guid,
          name: node.urn.split('/').pop() || node.name,
          urn: node.urn,
          format,
          mimeType: resolveMimeType(format),
          viewSets,
          active: format === 'pdf' // Only PDFs are active by default
        })
      }

      if (node.children) walk(node.children, viewSets)
    }
  }

  walk(children, [])
  return result
}

/** @deprecated Use filterDerivatives instead */
export const filterPdfDerivatives = (children: ApsManifestChild[]) => filterDerivatives(children, ['pdf'])

export function extractViewSets(derivatives: Derivative[]): ViewSet[] {
  const names = new Set<string>()
  for (const d of derivatives) {
    for (const vs of d.viewSets) {
      names.add(vs)
    }
  }
  return Array.from(names).map(name => ({ name, active: true }))
}

/** @deprecated Use extractViewSets instead */
export const extractPdfViewSets = extractViewSets

export function groupDerivativesByViewSet(derivatives: Derivative[]): Map<string, Derivative[]> {
  const groups = new Map<string, Derivative[]>()
  for (const d of derivatives) {
    for (const vs of d.viewSets) {
      if (!groups.has(vs)) groups.set(vs, [])
      groups.get(vs)!.push(d)
    }
  }
  return groups
}

export function checkRevitVersion(derivative: ApsManifestDerivative): { supported: boolean, version: number | null } {
  const versionStr = derivative.properties?.['Document Information']?.RVTVersion
  if (!versionStr) return { supported: false, version: null }
  const version = parseInt(versionStr)
  return { supported: version >= 2022, version }
}
