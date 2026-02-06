'use client';

import { View, Button } from 'reshaped';
import { ReactNode } from 'react';
import './LaFuenteLayout.css';

// Logo component - reusable
const imgLogo = "https://www.figma.com/api/mcp/asset/522d795a-7706-4c42-8c12-e5bb2cf7a025";
const imgLogo1 = "https://www.figma.com/api/mcp/asset/44b8cb43-3a8e-45d0-b450-4be86799e52c";
const imgLogo2 = "https://www.figma.com/api/mcp/asset/9cbaff1c-452a-4f3e-8486-d4d362bea2dd";

export function Logo() {
  return (
    <div style={{ 
      width: '250px', 
      height: '135px', 
      position: 'relative', 
      flexShrink: 0
    }}>
      <img 
        src={imgLogo} 
        alt="La Fuente Logo" 
        style={{ 
          width: '250px',
          height: '135px',
          display: 'block'
        }} 
      />
    </div>
  );
}

// Top menu component - reusable
export function TopMenu() {
  return (
    <View 
      direction="row" 
      gap={1} 
      attributes={{
        style: {
          background: '#fafafa',
          padding: '3px',
          borderRadius: '6px',
          boxShadow: '0px 1px 5px -4px rgba(0,0,0,0.5), 0px 4px 8px 0px rgba(0,0,0,0.05)',
          flexShrink: 0
        },
        className: 'top-menu'
      }}
    >
      <Button variant="ghost" size="medium">Cómo funciona</Button>
      <Button variant="ghost" size="medium">Recursos de emergencia</Button>
      <Button variant="ghost" size="medium">Preguntas frecuentes</Button>
    </View>
  );
}

// Trust cards component - reusable
export function TrustCards() {
  return (
    <View direction="row" gap={4} justify="center" attributes={{ style: { width: '100%' }, className: 'trust-cards-container' }}>
      <div style={{
        background: 'white',
        borderRadius: '6px',
        boxShadow: '0px 5px 10px 0px rgba(0,0,0,0.05), 0px 15px 25px 0px rgba(0,0,0,0.07)',
        width: '266px',
        padding: '16px',
        flexShrink: 0
      }}>
        <div style={{ fontSize: '14px', marginBottom: '8px' }}>
          🔒 <span style={{ fontSize: '18px', fontWeight: 'bold' }}>100% Anónimo</span>
        </div>
        <div style={{ fontSize: '18px', lineHeight: '28px' }}>
          No se requieren nombres reales ni información personal.
        </div>
      </div>

      <div style={{
        background: 'white',
        borderRadius: '6px',
        boxShadow: '0px 5px 10px 0px rgba(0,0,0,0.05), 0px 15px 25px 0px rgba(0,0,0,0.07)',
        width: '263px',
        padding: '16px',
        flexShrink: 0
      }}>
        <div style={{ fontSize: '14px', marginBottom: '8px' }}>
          👥 <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Moderado y Seguro</span>
        </div>
        <div style={{ fontSize: '18px', lineHeight: '28px' }}>
          Conversaciones monitoreadas para tu seguridad.
        </div>
      </div>

      <div style={{
        background: 'white',
        borderRadius: '6px',
        boxShadow: '0px 5px 10px 0px rgba(0,0,0,0.05), 0px 15px 25px 0px rgba(0,0,0,0.07)',
        width: '266px',
        padding: '16px',
        flexShrink: 0
      }}>
        <div style={{ fontSize: '14px', marginBottom: '8px' }}>
          ⚕️ <span style={{ fontSize: '18px', fontWeight: 'bold' }}>No es consejo médico</span>
        </div>
        <div style={{ fontSize: '18px', lineHeight: '28px' }}>
          Compartimos experiencias, no diagnósticos ni tratamientos.
        </div>
      </div>
    </View>
  );
}

// Footer logos - reusable
export function LogosFooter() {
  return (
    <View direction="row" gap={2} align="center" justify="center" attributes={{ style: { width: '100%' } }}>
      <div style={{ fontSize: '18px', lineHeight: '28px', flexShrink: 0 }}>Avalado por:</div>
      <div style={{ width: '146px', height: '138px', flexShrink: 0 }}>
        <img 
          src={imgLogo1} 
          alt="Logo 1" 
          style={{ width: '100%', height: '100%', display: 'block', mixBlendMode: 'multiply' }} 
        />
      </div>
      <div style={{ width: '190px', height: '95px', flexShrink: 0 }}>
        <img 
          src={imgLogo2} 
          alt="Logo 2" 
          style={{ width: '100%', height: '100%', display: 'block', mixBlendMode: 'multiply' }} 
        />
      </div>
    </View>
  );
}

// Main layout wrapper - reusable for all screens
export function LaFuenteLayout({ children, showFooter = true }: { children: ReactNode; showFooter?: boolean }) {
  return (
    <div style={{ background: '#fafafa', minHeight: '100vh' }}>
      <div className="layout-container" style={{ maxWidth: '1254px', margin: '0 auto', padding: '26px 20px' }}>
        <View gap={8}>
          {/* Header - FIXED WIDTH */}
          <View 
            direction="row" 
            justify="space-between" 
            align="center"
            attributes={{ style: { width: '100%' }, className: 'header-container' }}
          >
            <div className="logo-container" style={{ width: '250px', flexShrink: 0 }}>
              <Logo />
            </div>
            <TopMenu />
          </View>

          {/* Content Area - FIXED HEIGHT CONTAINER */}
          <div style={{ minHeight: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            {children}
          </div>

          {/* Trust Cards - FIXED (only if showFooter is true) */}
          {showFooter && <TrustCards />}

          {/* Footer Logos - FIXED (only if showFooter is true) */}
          {showFooter && <LogosFooter />}
        </View>
      </div>
    </div>
  );
}
