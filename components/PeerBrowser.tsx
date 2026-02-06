'use client';

import { View, Card, Button } from 'reshaped';
import { useState } from 'react';
import type { Peer } from '@/lib/socketClient';

interface PeerBrowserProps {
  peers: Peer[];
  onSelectPeer: (peer: Peer) => void;
  onBack: () => void;
}

export function PeerBrowser({ peers, onSelectPeer, onBack }: PeerBrowserProps) {
  const [provinceFilter, setProvinceFilter] = useState('');
  const [ageFilter, setAgeFilter] = useState('');

  const filteredPeers = peers.filter(peer => {
    if (provinceFilter && peer.province !== provinceFilter) return false;
    if (ageFilter) {
      const age = peer.age;
      if (ageFilter === '18-25' && (age < 18 || age > 25)) return false;
      if (ageFilter === '26-35' && (age < 26 || age > 35)) return false;
      if (ageFilter === '36-45' && (age < 36 || age > 45)) return false;
      if (ageFilter === '46+' && age < 46) return false;
    }
    return true;
  });

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
          <div>
            <div style={{ fontSize: '24px', lineHeight: '32px', color: 'black', fontWeight: 600 }}>
              Personas disponibles
            </div>
            <div style={{ fontSize: '14px', lineHeight: '20px', color: '#666', marginTop: '4px' }}>
              Elige alguien para conectar basándote en su perfil.
            </div>
          </div>

          {/* Filters */}
          <View direction="row" gap={2}>
            <select 
              value={provinceFilter}
              onChange={(e) => setProvinceFilter(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '14px',
                cursor: 'pointer',
                flex: 1,
                background: 'white'
              }}
            >
              <option value="">Todas las provincias</option>
              <option value="San José">San José</option>
              <option value="Alajuela">Alajuela</option>
              <option value="Cartago">Cartago</option>
              <option value="Heredia">Heredia</option>
              <option value="Guanacaste">Guanacaste</option>
              <option value="Puntarenas">Puntarenas</option>
              <option value="Limón">Limón</option>
            </select>

            <select 
              value={ageFilter}
              onChange={(e) => setAgeFilter(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '14px',
                cursor: 'pointer',
                flex: 1,
                background: 'white'
              }}
            >
              <option value="">Todas las edades</option>
              <option value="18-25">18-25</option>
              <option value="26-35">26-35</option>
              <option value="36-45">36-45</option>
              <option value="46+">46+</option>
            </select>
          </View>

          {/* Peer List */}
          <View gap={2}>
            {filteredPeers.length === 0 ? (
              <div style={{
                padding: '40px',
                textAlign: 'center',
                color: '#666'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏸</div>
                <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
                  No hay personas disponibles ahora
                </div>
                <div style={{ fontSize: '14px' }}>
                  Intenta ajustar los filtros o vuelve más tarde
                </div>
              </div>
            ) : (
              filteredPeers.map((peer) => (
                <div
                  key={peer.id}
                  onClick={() => onSelectPeer(peer)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px',
                    borderRadius: '6px',
                    border: '1px solid #e0e0e0',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: 'white'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#305dfb';
                    e.currentTarget.style.background = '#f8f9ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e0e0e0';
                    e.currentTarget.style.background = 'white';
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    flexShrink: 0
                  }}>
                    {peer.avatar}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: 'black', marginBottom: '4px' }}>
                      {peer.username}
                    </div>
                    <div style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>
                      {peer.age} años • {peer.province}
                    </div>
                    <div style={{ fontSize: '12px', color: '#4CAF50', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ 
                        width: '8px', 
                        height: '8px', 
                        borderRadius: '50%', 
                        background: '#4CAF50',
                        display: 'inline-block'
                      }}></span>
                      Disponible ahora
                    </div>
                  </div>

                  {/* Arrow */}
                  <div style={{ fontSize: '20px', color: '#999' }}>
                    →
                  </div>
                </div>
              ))
            )}
          </View>
        </View>
      </Card>
    </div>
  );
}
