import { useRef, useEffect } from 'react'
import { useVoiceStore } from '../stores/useVoiceStore'

export function ConversationView() {
  const { conversation, partialTranscript, streamedResponse, pipelineStatus } = useVoiceStore()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation.length, streamedResponse])

  const isActive = pipelineStatus !== 'idle'
  const isEmpty = conversation.length === 0 && !partialTranscript && !streamedResponse

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      padding: '16px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
    }}>
      {isEmpty && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: '#475569',
          fontSize: 14,
          textAlign: 'center',
        }}>
          <p>Your conversation will appear here.<br />Tap the button below to start speaking.</p>
        </div>
      )}

      {conversation.map((turn) => (
        <div key={turn.id} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {turn.transcript && (
            <div style={{
              alignSelf: 'flex-end',
              background: '#1e293b',
              borderRadius: '12px 12px 4px 12px',
              padding: '10px 14px',
              maxWidth: '80%',
            }}>
              <p style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>You</p>
              <p style={{ fontSize: 14, lineHeight: 1.5 }}>{turn.transcript}</p>
            </div>
          )}
          {turn.response && (
            <div style={{
              alignSelf: 'flex-start',
              background: 'rgba(59,130,246,0.15)',
              borderRadius: '12px 12px 12px 4px',
              padding: '10px 14px',
              maxWidth: '85%',
            }}>
              <p style={{ fontSize: 11, color: '#3b82f6', marginBottom: 2 }}>AI</p>
              <p style={{ fontSize: 14, lineHeight: 1.5 }}>{turn.response}</p>
            </div>
          )}
        </div>
      ))}

      {/* Current in-progress turn */}
      {isActive && (partialTranscript || streamedResponse) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {partialTranscript && (
            <div style={{
              alignSelf: 'flex-end',
              background: '#1e293b',
              borderRadius: '12px 12px 4px 12px',
              padding: '10px 14px',
              maxWidth: '80%',
              opacity: 0.9,
            }}>
              <p style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>You</p>
              <p style={{ fontSize: 14, lineHeight: 1.5 }}>{partialTranscript}</p>
            </div>
          )}
          {streamedResponse && (
            <div style={{
              alignSelf: 'flex-start',
              background: 'rgba(59,130,246,0.15)',
              borderRadius: '12px 12px 12px 4px',
              padding: '10px 14px',
              maxWidth: '85%',
            }}>
              <p style={{ fontSize: 11, color: '#3b82f6', marginBottom: 2 }}>AI</p>
              <p style={{ fontSize: 14, lineHeight: 1.5 }}>
                {streamedResponse}
                {pipelineStatus === 'processing' && (
                  <span style={{ animation: 'pulse 1s ease-in-out infinite', color: '#3b82f6' }}>|</span>
                )}
              </p>
            </div>
          )}
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
