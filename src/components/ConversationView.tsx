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
      padding: '12px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
    }}>
      {isEmpty && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          gap: 12,
        }}>
          <div style={{
            fontSize: 48,
            animation: 'float 3s ease-in-out infinite',
            lineHeight: 1,
          }}>
            &#x1F9B8;
          </div>
          <p style={{
            color: '#D4B896',
            fontSize: 14,
            fontWeight: 500,
            textAlign: 'center',
            lineHeight: 1.6,
          }}>
            I'm your cute voice buddy!<br />
            Tap the button below to chat with me &#x1F60A;
          </p>
        </div>
      )}

      {conversation.map((turn) => (
        <div
          key={turn.id}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            animation: 'slide-up 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {turn.transcript && (
            <div style={{
              alignSelf: 'flex-end',
              background: 'linear-gradient(135deg, #FFEDE0, #FFE4D3)',
              borderRadius: '20px 20px 6px 20px',
              padding: '12px 18px',
              maxWidth: '82%',
              boxShadow: '0 2px 8px rgba(255, 180, 136, 0.15)',
              border: '1px solid rgba(255, 180, 136, 0.2)',
            }}>
              <p style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#FFB088',
                marginBottom: 3,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                You
              </p>
              <p style={{
                fontSize: 14,
                fontWeight: 500,
                color: '#5C3D2E',
                lineHeight: 1.55,
              }}>
                {turn.transcript}
              </p>
            </div>
          )}
          {turn.response && (
            <div style={{
              alignSelf: 'flex-start',
              background: '#FFFFFF',
              borderRadius: '20px 20px 20px 6px',
              padding: '12px 18px',
              maxWidth: '85%',
              boxShadow: '0 2px 10px rgba(255, 180, 136, 0.12)',
              border: '1px solid rgba(255, 180, 136, 0.15)',
            }}>
              <p style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#FF8C42',
                marginBottom: 3,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                &#x1F9B8; Buddy
              </p>
              <p style={{
                fontSize: 14,
                fontWeight: 500,
                color: '#5C3D2E',
                lineHeight: 1.55,
              }}>
                {turn.response}
              </p>
            </div>
          )}
        </div>
      ))}

      {/* Current in-progress turn */}
      {isActive && (partialTranscript || streamedResponse) && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          animation: 'slide-up 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}>
          {partialTranscript && (
            <div style={{
              alignSelf: 'flex-end',
              background: 'linear-gradient(135deg, #FFEDE0, #FFE4D3)',
              borderRadius: '20px 20px 6px 20px',
              padding: '12px 18px',
              maxWidth: '82%',
              opacity: 0.9,
              boxShadow: '0 2px 8px rgba(255, 180, 136, 0.15)',
              border: '1px solid rgba(255, 180, 136, 0.2)',
            }}>
              <p style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#FFB088',
                marginBottom: 3,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                You
              </p>
              <p style={{
                fontSize: 14,
                fontWeight: 500,
                color: '#5C3D2E',
                lineHeight: 1.55,
              }}>
                {partialTranscript}
              </p>
            </div>
          )}
          {streamedResponse && (
            <div style={{
              alignSelf: 'flex-start',
              background: '#FFFFFF',
              borderRadius: '20px 20px 20px 6px',
              padding: '12px 18px',
              maxWidth: '85%',
              boxShadow: '0 2px 10px rgba(255, 180, 136, 0.12)',
              border: '1px solid rgba(255, 140, 66, 0.15)',
            }}>
              <p style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#FF8C42',
                marginBottom: 3,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                &#x1F9B8; Buddy
              </p>
              <p style={{
                fontSize: 14,
                fontWeight: 500,
                color: '#5C3D2E',
                lineHeight: 1.55,
              }}>
                {streamedResponse}
                {pipelineStatus === 'processing' && (
                  <span style={{
                    display: 'inline-block',
                    width: 3,
                    height: 16,
                    background: '#FF8C42',
                    borderRadius: 2,
                    marginLeft: 2,
                    animation: 'pulse-cute 0.6s ease-in-out infinite',
                    verticalAlign: 'text-bottom',
                  }} />
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
