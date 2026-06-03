import React from 'react'
import ReactDOM from 'react-dom/client'
import './theme/globals.css'
import { initializeAppZoom } from './lib/appZoom'
import { runDesktopPersistenceMigrations } from './lib/persistenceMigrations'

declare global {
  interface Window {
<<<<<<< HEAD
    __HUBO_BOOTSTRAPPED__?: boolean
    __HUBO_SHOW_STARTUP_ERROR__?: (reason: unknown) => void
=======
    __CC_HAHA_BOOTSTRAPPED__?: boolean
    __CC_HAHA_SHOW_STARTUP_ERROR__?: (reason: unknown) => void
>>>>>>> upstream/main
  }
}

type DesktopBootstrapModules = [
  { App: React.ComponentType },
  { ErrorBoundary: React.ComponentType<{ children: React.ReactNode }> },
  { installClientDiagnosticsCapture: () => void },
  { initializeTheme: () => void },
]

function loadDesktopBootstrapModules() {
  return Promise.all([
    import('./App'),
    import('./components/ErrorBoundary'),
    import('./lib/diagnosticsCapture'),
    import('./stores/uiStore'),
  ])
}

export async function bootstrapDesktopApp(
  root: HTMLElement | null = document.getElementById('root'),
  loadModules: () => Promise<DesktopBootstrapModules> = loadDesktopBootstrapModules,
) {
  try {
    const [{ App }, { ErrorBoundary }, { installClientDiagnosticsCapture }, { initializeTheme }] = await loadModules()
    initializeTheme()
    installClientDiagnosticsCapture()

    if (!root) {
      throw new Error('Desktop root element not found')
    }

    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>,
    )
<<<<<<< HEAD
    window.__HUBO_BOOTSTRAPPED__ = true
  } catch (error) {
    console.error('[desktop] Failed to bootstrap app', error)
    if (root) {
      if (window.__HUBO_SHOW_STARTUP_ERROR__) {
        window.__HUBO_SHOW_STARTUP_ERROR__(error)
=======
    window.__CC_HAHA_BOOTSTRAPPED__ = true
  } catch (error) {
    console.error('[desktop] Failed to bootstrap app', error)
    if (root) {
      if (window.__CC_HAHA_SHOW_STARTUP_ERROR__) {
        window.__CC_HAHA_SHOW_STARTUP_ERROR__(error)
>>>>>>> upstream/main
      } else {
        root.textContent = error instanceof Error ? error.message : String(error)
      }
    }
  }
}

runDesktopPersistenceMigrations()
void initializeAppZoom()

void bootstrapDesktopApp()
