import type { ApsManifest, ApsManifestChild, ApsManifestDerivative } from '~/types/derivatives'

export const mockPdfChild1: ApsManifestChild = {
  guid: 'guid-a001',
  name: 'A001 - Floor Plan',
  role: '2d',
  urn: 'urn:adsk.viewing:fs.file:output/views/A001.pdf',
  ViewSets: 'Sheet Set 1',
  children: [
    {
      guid: 'guid-a001-pdf',
      name: 'A001.pdf',
      role: 'pdf-page',
      urn: 'urn:adsk.viewing:fs.file:output/pdf/A001.pdf',
      children: []
    }
  ]
}

export const mockPdfChild2: ApsManifestChild = {
  guid: 'guid-a002',
  name: 'A002 - Elevations',
  role: '2d',
  urn: 'urn:adsk.viewing:fs.file:output/views/A002.pdf',
  ViewSets: ['Sheet Set 1', 'Sheet Set 2'],
  children: [
    {
      guid: 'guid-a002-pdf',
      name: 'A002.pdf',
      role: 'pdf-page',
      urn: 'urn:adsk.viewing:fs.file:output/pdf/A002.pdf',
      children: []
    }
  ]
}

export const mock3dChild: ApsManifestChild = {
  guid: 'guid-3d',
  name: '3D View',
  role: '3d',
  urn: 'urn:adsk.viewing:fs.file:output/3d/model.svf',
  children: [
    {
      guid: 'guid-3d-geometry',
      name: 'model.svf',
      role: 'graphics',
      urn: 'urn:adsk.viewing:fs.file:output/3d/model.svf'
    }
  ]
}

export const mockThumbnailChild: ApsManifestChild = {
  guid: 'guid-thumb',
  name: 'Thumbnail',
  role: 'thumbnail',
  urn: 'urn:adsk.viewing:fs.file:output/thumb.png'
}

export const mockPdfChildNoUrn: ApsManifestChild = {
  guid: 'guid-nourn',
  name: 'S001 - Structural',
  role: '2d',
  ViewSets: 'Structural Set',
  children: [
    {
      guid: 'guid-nourn-pdf',
      name: 'S001 - Structural.pdf',
      role: 'pdf-page'
    }
  ]
}

export const mockAecChild: ApsManifestChild = {
  guid: 'guid-aec',
  name: 'AECModelData',
  role: 'Autodesk.AEC.ModelData',
  urn: 'urn:adsk.viewing:fs.file:output/AECModelData.json'
}

export const mockSdbChild: ApsManifestChild = {
  guid: 'guid-sdb',
  name: 'model.sdb',
  role: 'Autodesk.CloudPlatform.PropertyDatabase',
  urn: 'urn:adsk.viewing:fs.file:output/properties/model.sdb'
}

export const mockSvfChild: ApsManifestChild = {
  guid: 'guid-svf',
  name: 'model.svf',
  role: 'graphics',
  urn: 'urn:adsk.viewing:fs.file:output/0/model.svf'
}

export const mockDerivativeWithPdfs: ApsManifestDerivative = {
  name: 'TestModel.rvt',
  children: [mockPdfChild1, mockPdfChild2, mock3dChild, mockThumbnailChild],
  properties: {
    'Document Information': {
      RVTVersion: '2024'
    }
  }
}

export const mockDerivativeNoPdfs: ApsManifestDerivative = {
  name: 'TestModel.rvt',
  children: [mock3dChild, mockThumbnailChild],
  properties: {
    'Document Information': {
      RVTVersion: '2024'
    }
  }
}

export const mockDerivativeOldRevit: ApsManifestDerivative = {
  name: 'OldModel.rvt',
  children: [mockPdfChild1],
  properties: {
    'Document Information': {
      RVTVersion: '2020'
    }
  }
}

export const mockDerivativeNoVersion: ApsManifestDerivative = {
  name: 'NoVersionModel.rvt',
  children: [mockPdfChild1],
  properties: {}
}

export const mockManifestWithPdfs: ApsManifest = {
  urn: 'dXJuOmFkc2sud2lwcHJvZDpmcy5maWxlOnZmLmFiYzEyMw',
  derivatives: [mockDerivativeWithPdfs]
}

export const mockManifestNoPdfs: ApsManifest = {
  urn: 'dXJuOmFkc2sud2lwcHJvZDpmcy5maWxlOnZmLmRlZjQ1Ng',
  derivatives: [mockDerivativeNoPdfs]
}

export const mockManifestOldRevit: ApsManifest = {
  urn: 'dXJuOmFkc2sud2lwcHJvZDpmcy5maWxlOnZmLmdoaTc4OQ',
  derivatives: [mockDerivativeOldRevit]
}

// Folder-nested layout (Revit 2026 publish): viewable folder → "Sheets" / "Views" folders → geometry nodes.
// ViewSets appears as a string or string[] on geometry nodes; resources carry no ViewSets of their own.
export const mockNestedSheetsFolder: ApsManifestChild = {
  guid: 'guid-sheets-folder',
  name: 'Sheets',
  role: 'viewable',
  children: [
    {
      guid: 'guid-g000',
      name: 'G-000 - COVER SHEET',
      role: '2d',
      ViewSets: ['100 DD SET ', 'BULLETIN #5'],
      children: [
        {
          guid: 'guid-g000-pdf',
          name: '',
          role: 'pdf-page',
          urn: 'urn:adsk.viewing:fs.file:abc/output/Resource/Sheet/g000/pdf/G-000 - COVER SHEET.pdf'
        },
        { guid: 'guid-g000-view', name: 'G-000 - COVER SHEET', role: '2d' }
      ]
    },
    {
      guid: 'guid-a400',
      name: 'A-400 - ENLARGED - L65 EXISTING RESTROOM',
      role: '2d',
      ViewSets: 'BULLETIN #5',
      children: [
        {
          guid: 'guid-a400-pdf',
          name: '',
          role: 'pdf-page',
          urn: 'urn:adsk.viewing:fs.file:abc/output/Resource/Sheet/a400/pdf/A-400 - ENLARGED - L65 EXISTING RESTROOM.pdf'
        }
      ]
    }
  ]
}

export const mockNestedViewsFolder: ApsManifestChild = {
  guid: 'guid-views-folder',
  name: 'Views',
  role: '',
  children: [
    {
      guid: 'guid-3d-view-folder',
      name: '3D View',
      role: '',
      children: [
        {
          guid: 'guid-bim360',
          name: 'BIM360',
          role: '3d',
          ViewSets: 'BIM360 PUBLISHED VIEWS',
          children: [
            { guid: 'guid-bim360-view', name: 'BIM360', role: '3d' },
            {
              guid: 'guid-bim360-svf',
              name: '',
              role: 'graphics',
              urn: 'urn:adsk.viewing:fs.file:abc/output/Resource/3D View/bim360/BIM360.svf'
            }
          ]
        }
      ]
    }
  ]
}

export const mockNestedViewableFolderChildren: ApsManifestChild[] = [
  mockSdbChild,
  mockAecChild,
  mockNestedViewsFolder,
  mockNestedSheetsFolder
]
