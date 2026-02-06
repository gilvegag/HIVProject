'use client';

import { View, Card, Button } from 'reshaped';
import { useState } from 'react';

interface TermsConditionsProps {
  onAccept: () => void;
  onBack: () => void;
}

export function TermsConditions({ onAccept, onBack }: TermsConditionsProps) {
  const [checks, setChecks] = useState({
    emotional: false,
    respectful: false,
    moderated: false
  });

  const allChecked = checks.emotional && checks.respectful && checks.moderated;

  return (
    <div style={{ width: '1089px', display: 'flex', justifyContent: 'center' }}>
      <Card 
        padding={6} 
        attributes={{
          style: {
            background: 'white',
            borderRadius: '6px',
            boxShadow: '0px 5px 10px 0px rgba(0,0,0,0.05), 0px 15px 25px 0px rgba(0,0,0,0.07)',
            width: '359px',
            height: '600px',
            maxWidth: '90vw',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        <View gap={4}>
          {/* Back button */}
          <Button 
            onClick={onBack}
            attributes={{
              style: {
                background: '#e1e5eb',
                borderRadius: '999px',
                padding: '8px 16px',
                border: 'none',
                cursor: 'pointer',
                width: 'fit-content',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }
            }}
          >
            ←
            <span style={{ fontSize: '14px', fontWeight: 500 }}>Volver</span>
          </Button>

          {/* Title */}
          <div style={{ fontSize: '24px', lineHeight: '32px', color: 'black', fontWeight: 600 }}>
            Consentimiento y acuerdo
          </div>

          {/* Disclaimer */}
          <div style={{
            background: '#fff8e1',
            padding: '16px',
            borderRadius: '6px',
            border: '1px solid #ffd54f'
          }}>
            <div style={{ fontSize: '14px', lineHeight: '20px', color: '#333' }}>
              <strong>Importante:</strong> Esta plataforma conecta personas que comparten experiencias vividas. No reemplaza la atención médica profesional.
            </div>
          </div>

          {/* Checkboxes */}
          <View gap={3}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={checks.emotional}
                onChange={(e) => setChecks({...checks, emotional: e.target.checked})}
                style={{ 
                  width: '20px', 
                  height: '20px', 
                  cursor: 'pointer',
                  marginTop: '2px',
                  accentColor: '#305dfb'
                }}
              />
              <span style={{ fontSize: '14px', lineHeight: '20px', color: 'black' }}>
                Entiendo que esta plataforma es para apoyo emocional, no para asesoramiento médico.
              </span>
            </label>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={checks.respectful}
                onChange={(e) => setChecks({...checks, respectful: e.target.checked})}
                style={{ 
                  width: '20px', 
                  height: '20px', 
                  cursor: 'pointer',
                  marginTop: '2px',
                  accentColor: '#305dfb'
                }}
              />
              <span style={{ fontSize: '14px', lineHeight: '20px', color: 'black' }}>
                Acepto mantener las conversaciones respetuosas y no compartir información personalmente identificable.
              </span>
            </label>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={checks.moderated}
                onChange={(e) => setChecks({...checks, moderated: e.target.checked})}
                style={{ 
                  width: '20px', 
                  height: '20px', 
                  cursor: 'pointer',
                  marginTop: '2px',
                  accentColor: '#305dfb'
                }}
              />
              <span style={{ fontSize: '14px', lineHeight: '20px', color: 'black' }}>
                Entiendo que las conversaciones son moderadas por la seguridad de todos.
              </span>
            </label>
          </View>

          {/* Accept button */}
          <Button 
            onClick={onAccept}
            disabled={!allChecked}
            attributes={{
              style: {
                background: allChecked ? '#305dfb' : '#ccc',
                borderRadius: '999px',
                padding: '12px 20px',
                border: 'none',
                cursor: allChecked ? 'pointer' : 'not-allowed',
                width: '100%',
                boxShadow: allChecked ? '0px 1px 5px -4px rgba(0,0,0,0.5), 0px 4px 8px 0px rgba(0,0,0,0.05)' : 'none',
                transition: 'all 0.2s'
              }
            }}
          >
            <span style={{ fontSize: '14px', fontWeight: 500, color: 'white' }}>
              Aceptar y continuar
            </span>
          </Button>
        </View>
      </Card>
    </div>
  );
}
