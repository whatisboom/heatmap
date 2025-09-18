import '@testing-library/jest-dom'
import { vi } from 'vitest'
import type { GoogleMapsGlobal } from '@/types'

// Mock Google Maps API
(global as unknown as { google: GoogleMapsGlobal }).google = {
  maps: {
    Map: vi.fn(() => ({})),
    LatLng: vi.fn(),
    marker: { Marker: vi.fn() },
    visualization: {
      HeatmapLayer: vi.fn(),
    },
  },
}

// Mock file reader API
Object.defineProperty(window, 'FileReader', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    readAsArrayBuffer: vi.fn(),
    readAsDataURL: vi.fn(),
    readAsText: vi.fn(),
    readAsBinaryString: vi.fn(),
    onload: null,
    onerror: null,
    onabort: null,
    result: null,
    error: null,
    abort: vi.fn(),
  })),
})