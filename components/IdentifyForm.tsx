'use client';

import { View, Text, Button, Card, TextField } from 'reshaped';
import './IdentifyForm.css';

const imgArrowLeft = "https://www.figma.com/api/mcp/asset/6d5acea7-5183-4529-b3c7-aa0245408175";

interface IdentifyFormProps {
  username: string;
  age: string;
  province: string;
  onUsernameChange: (value: string) => void;
  onAgeChange: (value: string) => void;
  onProvinceChange: (value: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

export function IdentifyForm({
  username,
  age,
  province,
  onUsernameChange,
  onAgeChange,
  onProvinceChange,
  onBack,
  onContinue
}: IdentifyFormProps) {
  return (
    <div className="identify-form-wrapper" style={{ width: '1089px', display: 'flex', justifyContent: 'center' }}>
      <Card 
        padding={6} 
        attributes={{
          style: {
            background: 'white',
            borderRadius: '6px',
            boxShadow: '0px 5px 10px 0px rgba(0,0,0,0.05), 0px 15px 25px 0px rgba(0,0,0,0.07)',
            width: '359px',
            height: '600px',
            display: 'flex',
            flexDirection: 'column'
          },
          className: 'identify-form-card'
        }}
      >
        <View gap={4}>
          {/* Back button */}
          <Button
            variant="ghost"
            size="small"
            onClick={onBack}
            attributes={{ 
              style: { 
                width: 'fit-content',
                background: '#e1e5eb',
                borderRadius: '4px',
                padding: '4px 8px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              } 
            }}
          >
            <img src={imgArrowLeft} alt="" style={{ width: '16px', height: '16px' }} />
            <span style={{ fontSize: '14px', fontWeight: 500 }}>Volver</span>
          </Button>

          {/* Title and subtitle */}
          <View gap={3}>
            <div style={{ fontSize: '24px', lineHeight: '32px', color: 'black' }}>
              Solo un poco de contexto
            </div>
            
            <div style={{ fontSize: '14px', lineHeight: '20px', color: 'black' }}>
              No necesitás decir quién sos.{'\n'}
              Esto es únicamente para que la conversación se sienta más cercana y respetuosa.
            </div>
          </View>

          {/* Form Fields */}
          <View gap={4}>
            {/* Nickname field */}
            <View gap={1}>
              <div style={{ fontSize: '14px', fontWeight: 500, lineHeight: '20px', color: '#14161b' }}>
                ¿Cómo te gustaría que te llamen acá?
              </div>
              <input
                type="text"
                placeholder="Ej. Luz, Tico87, Azul"
                value={username}
                onChange={(e) => onUsernameChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid rgba(0,0,0,0.12)',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  background: 'white',
                  outline: 'none'
                }}
              />
              <div style={{ fontSize: '12px', lineHeight: '16px', color: '#52555b' }}>
                Puede ser cualquier nombre. No tiene que ser real.
              </div>
            </View>

            {/* Age field */}
            <View gap={1}>
              <div style={{ fontSize: '14px', fontWeight: 500, lineHeight: '20px', color: '#14161b' }}>
                Tu edad (opcional)
              </div>
              <input
                type="number"
                placeholder="Ej. 25"
                value={age}
                onChange={(e) => onAgeChange(e.target.value)}
                min={18}
                max={99}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid rgba(0,0,0,0.12)',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  background: 'white',
                  outline: 'none'
                }}
              />
              <div style={{ fontSize: '12px', lineHeight: '16px', color: '#52555b' }}>
                Nos ayuda a conectar personas en momentos de vida similares.
              </div>
            </View>

            {/* Province field */}
            <View gap={1}>
              <div style={{ fontSize: '14px', fontWeight: 500, lineHeight: '20px', color: '#14161b' }}>
                Provincia donde estás (opcional)
              </div>
              <select
                value={province}
                onChange={(e) => onProvinceChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: '1px solid rgba(0,0,0,0.12)',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  background: 'white',
                  outline: 'none'
                }}
              >
                <option value="">Escoja su provincia</option>
                <option value="San José">San José</option>
                <option value="Heredia">Heredia</option>
                <option value="Alajuela">Alajuela</option>
                <option value="Puntarenas">Puntarenas</option>
                <option value="Limón">Limón</option>
                <option value="Guanacaste">Guanacaste</option>
                <option value="Cartago">Cartago</option>
              </select>
              <div style={{ fontSize: '12px', lineHeight: '16px', color: '#52555b' }}>
                Solo para contexto general. No compartimos tu ubicación exacta.
              </div>
            </View>
          </View>

          {/* Continue Button */}
          <Button
            variant="solid"
            color="primary"
            onClick={onContinue}
            disabled={!username.trim()}
            attributes={{ 
              style: { 
                width: 'fit-content',
                background: '#305dfb',
                borderRadius: '4px',
                padding: '8px 12px',
                minHeight: '36px'
              } 
            }}
          >
            <span style={{ fontSize: '14px', fontWeight: 500 }}>Continuar</span>
          </Button>
        </View>
      </Card>
    </div>
  );
}
