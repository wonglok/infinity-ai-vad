import type { ReactNode } from 'react'

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
      gap: 14,
      background: '#FFF8F0',
    }}>
      <div style={{ fontSize: 56, animation: 'float 3s ease-in-out infinite', lineHeight: 1 }}>
        &#x1F4A5;
      </div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#FF8C42' }}>
        Uh-oh! A wild crash appeared!
      </h2>
      <p style={{
        color: '#C4956A',
        maxWidth: 340,
        fontSize: 13,
        lineHeight: 1.6,
        fontWeight: 500,
      }}>
        {error}
      </p>
      <button
        onClick={onRetry}
        style={{
          padding: '12px 32px',
          borderRadius: 20,
          border: 'none',
          background: 'linear-gradient(135deg, #FFB088, #FF8C42)',
          color: '#fff',
          fontSize: 15,
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(255, 140, 66, 0.3)',
          transition: 'all 0.3s',
        }}
      >
        Try Again &#x1F308;
      </button>
    </div>
  )
}

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
