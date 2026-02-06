'use client';

import { View, Text, Button } from 'reshaped';
import './HeroContent.css';

const imgOpenDoodlesIllustration = "https://www.figma.com/api/mcp/asset/b6faf763-3216-448a-bbed-43a4b5112c34";
const imgMessageIcon = "https://www.figma.com/api/mcp/asset/8a8591a5-7b0c-460b-996d-efd237fce6e1";

interface HeroContentProps {
  onStartChat: () => void;
}

export function HeroContent({ onStartChat }: HeroContentProps) {
  return (
    <div className="hero-container" style={{ 
      display: 'flex', 
      flexDirection: 'row', 
      alignItems: 'center', 
      gap: '48px',
      width: '100%',
      maxWidth: '1089px'
    }}>
      {/* Left: Text and CTA */}
      <div className="hero-text" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '32px',
        flex: '0 0 424px',
        minWidth: '300px'
      }}>
        <div className="hero-title" style={{ fontSize: '48px', fontWeight: 800, lineHeight: '52px', color: '#262726' }}>
          No estás sol@
        </div>
        
        <div className="hero-subtitle" style={{ fontSize: '24px', lineHeight: '32px', color: 'black' }}>
          Este es un espacio seguro y anónimo donde personas que viven con VIH comparten experiencias y se acompañan.
        </div>

        <Button 
          variant="solid" 
          color="primary"
          size="large"
          onClick={onStartChat}
          attributes={{
            style: {
              background: '#1860fa',
              borderRadius: '999px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              minHeight: '56px',
              boxShadow: '0px 1px 5px -4px rgba(0,0,0,0.5), 0px 4px 8px 0px rgba(0,0,0,0.05)',
              width: 'fit-content'
            }
          }}
        >
          <img src={imgMessageIcon} alt="" style={{ width: '24px', height: '24px' }} />
          <span style={{ fontSize: '16px', fontWeight: 500 }}>Hablar con alguien ahora</span>
        </Button>
      </div>

      {/* Right: Illustration */}
      <div className="hero-illustration" style={{ flex: '0 0 auto', width: '665px', height: '369px' }}>
        <img 
          src={imgOpenDoodlesIllustration} 
          alt="Illustration" 
          style={{ width: '100%', height: '100%', display: 'block' }} 
        />
      </div>
    </div>
  );
}
