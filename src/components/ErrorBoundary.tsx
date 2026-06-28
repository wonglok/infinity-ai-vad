import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export function ErrorBoundaryFallback({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      padding: 32,
      textAlign: 'center',
      gap: 16,
    }}>
      <div style={{ fontSize: 48 }}>&#9888;</div>
      <h2 style={{ fontSize: 20, fontWeight: 600 }}>Something went wrong</h2>
      <p style={{ color: '#94a3b8', maxWidth: 400, fontSize: 14 }}>{error}</p>
      <button
        onClick={onRetry}
        style={{
          padding: '10px 24px',
          borderRadius: 8,
          border: 'none',
          background: '#3b82f6',
          color: '#fff',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Retry
      </button>
    </div>
  )
}

// Simple error boundary using React componentDidCatch pattern
import { Component } from 'react'

interface EBState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<{ children: ReactNode; onRetry: () => void }, EBState> {
  state: EBState = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): EBState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error) {
    console.error('ErrorBoundary caught:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorBoundaryFallback
          error={this.state.error?.message || 'Unknown error'}
          onRetry={() => {
            this.setState({ hasError: false, error: null })
            this.props.onRetry()
          }}
        />
      )
    }
    return this.props.children
  }
}
