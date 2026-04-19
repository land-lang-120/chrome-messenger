/**
 * QrScannerScreen — Ecran plein pour scanner un QR d'invitation.
 * V1 : UI + feedback visuel + saisie manuelle fallback.
 * V2 : vrai scanner via BarcodeDetector API (Chrome/Android) ou jsQR.
 */

import { useState } from 'react';

import { Button } from '../../components/Button';
import { IconButton } from '../../components/IconButton';
import { IconBack, IconClose } from '../../components/Icons';
import { useI18n } from '../../contexts/I18nContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import { getEvents } from '../../services/events';

export interface QrScannerScreenProps {
  readonly onBack: () => void;
}

export function QrScannerScreen({ onBack }: QrScannerScreenProps) {
  const { t } = useI18n();
  const { theme } = useTheme();
  const toast = useToast();
  const [manualSeed, setManualSeed] = useState('');
  const [scanned, setScanned] = useState<null | { found: boolean; eventTitle?: string }>(null);

  function matchSeed(seed: string) {
    const ev = getEvents().find((e) => e.qrSeed === seed.trim());
    if (ev) {
      setScanned({ found: true, eventTitle: ev.title });
      toast.show(`Invitation trouvee : ${ev.title}`, 'success');
    } else {
      setScanned({ found: false });
      toast.show('QR code non reconnu', 'warning');
    }
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#0A0E14', color: '#FFF' }}>
      <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <IconButton label={t('back')} onClick={onBack}><IconBack /></IconButton>
        <h1 style={{ flex: 1, fontSize: 18, fontWeight: 800 }}>Scanner QR code</h1>
      </div>

      {/* Viewfinder (placeholder visuel) */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <div
          style={{
            width: 260, height: 260, position: 'relative',
            border: `2px solid ${theme.primary}`, borderRadius: 20,
          }}
        >
          {/* Coins decoratifs */}
          {[
            { top: -2, left: -2, borderT: theme.primary, borderL: theme.primary },
            { top: -2, right: -2, borderT: theme.primary, borderR: theme.primary },
            { bottom: -2, left: -2, borderB: theme.primary, borderL: theme.primary },
            { bottom: -2, right: -2, borderB: theme.primary, borderR: theme.primary },
          ].map((c, i) => (
            <div
              key={i}
              aria-hidden
              style={{
                position: 'absolute',
                ...c,
                width: 28, height: 28,
                borderTop: c.borderT ? `4px solid ${c.borderT}` : undefined,
                borderBottom: c.borderB ? `4px solid ${c.borderB}` : undefined,
                borderLeft: c.borderL ? `4px solid ${c.borderL}` : undefined,
                borderRight: c.borderR ? `4px solid ${c.borderR}` : undefined,
                borderRadius: 6,
              }}
            />
          ))}
          {/* Ligne de scan animee */}
          <div
            aria-hidden
            style={{
              position: 'absolute', left: 12, right: 12, top: '50%',
              height: 2, background: theme.primary, opacity: 0.8,
              animation: 'cm-scanline 2s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes cm-scanline {
          0%, 100% { transform: translateY(-80px); }
          50%      { transform: translateY(80px); }
        }
      `}</style>

      {/* Feedback scan */}
      {scanned && (
        <div
          style={{
            margin: '0 16px 10px', padding: 12, borderRadius: 12,
            background: scanned.found ? theme.primary : '#FF4757',
            color: '#FFF', fontSize: 13, fontWeight: 700, textAlign: 'center',
          }}
        >
          {scanned.found ? `✓ ${scanned.eventTitle}` : '✗ QR code invalide'}
          <button
            type="button"
            onClick={() => setScanned(null)}
            style={{ marginLeft: 10, background: 'transparent', border: 'none', color: '#FFF', cursor: 'pointer' }}
          >
            <IconClose width={16} height={16} />
          </button>
        </div>
      )}

      {/* Saisie manuelle */}
      <div style={{ padding: '0 16px 20px', background: '#111723', borderTop: '1px solid #1F2633' }}>
        <p style={{ fontSize: 12, color: '#8B96A6', marginTop: 16, marginBottom: 8 }}>
          Pas de camera ? Saisis le code manuellement :
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={manualSeed}
            onChange={(e) => setManualSeed(e.target.value)}
            placeholder="Code d'invitation"
            style={{
              flex: 1, padding: '12px 14px', borderRadius: 12,
              background: '#1A2230', border: '1px solid #2A3340',
              color: '#FFF', fontSize: 14, fontFamily: 'inherit', outline: 'none',
            }}
          />
          <Button variant="primary" onClick={() => matchSeed(manualSeed)}>Valider</Button>
        </div>
        <p style={{ fontSize: 11, color: '#5B6472', marginTop: 12, textAlign: 'center' }}>
          💡 Un vrai scanner camera sera ajoute en v1.1
        </p>
      </div>
    </div>
  );
}
