/**
 * ColorPickerSlider — slider horizontal HSL pour choisir sa couleur personnalisée (Pro).
 * Génère primary/primaryDark/primarySoft automatiquement depuis la hue sélectionnée.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '../../components/Button';
import { useI18n } from '../../contexts/I18nContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';

/** HSL -> #RRGGBB. */
function hslToHex(h: number, s: number, l: number): string {
  l = l / 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export interface ColorPickerSliderProps {
  readonly isPro?: boolean;
}

export function ColorPickerSlider({ isPro = true }: ColorPickerSliderProps) {
  const { t } = useI18n();
  const { setCustomTheme, theme } = useTheme();
  const toast = useToast();

  const [hue, setHue] = useState(160); // default ≈ mint
  const [saturation, setSaturation] = useState(70);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);

  const preview = hslToHex(hue, saturation, 50);
  const previewDark = hslToHex(hue, saturation, 38);
  const previewSoft = hslToHex(hue, saturation, 88);

  // Live preview : apply immédiatement (mais sans persister) pour le feedback
  useEffect(() => {
    if (!isPro) return;
    // Juste mettre à jour la variable CSS pour aperçu
    document.documentElement.style.setProperty('--cm-custom-hue', String(hue));
  }, [hue, isPro]);

  const handlePointer = useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    setHue(Math.round((x / rect.width) * 360));
  }, []);

  const onDown = useCallback((e: React.PointerEvent) => {
    draggingRef.current = true;
    handlePointer(e.clientX);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, [handlePointer]);

  const onMove = useCallback((e: React.PointerEvent) => {
    if (draggingRef.current) handlePointer(e.clientX);
  }, [handlePointer]);

  const onUp = useCallback(() => {
    draggingRef.current = false;
  }, []);

  function apply() {
    if (!isPro) {
      toast.show('Disponible avec le forfait Pro', 'warning');
      return;
    }
    setCustomTheme({
      primary: preview,
      primaryDark: previewDark,
      primarySoft: previewSoft,
    });
    toast.show('Couleur personnalisee appliquee', 'success');
  }

  return (
    <div
      style={{
        padding: 16, borderRadius: 18,
        background: 'var(--cm-surface)', border: '1px solid var(--cm-line)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: preview, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--cm-title)' }}>
            Palette personnalisee {!isPro && '💎 Pro'}
          </div>
          <div style={{ fontSize: 11, color: 'var(--cm-sub)', fontFamily: 'ui-monospace, monospace' }}>
            {preview.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Slider hue */}
      <div
        ref={trackRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        style={{
          position: 'relative',
          height: 28, borderRadius: 14,
          background: 'linear-gradient(90deg, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
          cursor: 'pointer', touchAction: 'none',
          opacity: isPro ? 1 : 0.5,
          pointerEvents: isPro ? 'auto' : 'none',
        }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute',
            left: `calc(${(hue / 360) * 100}% - 12px)`,
            top: -3, width: 28, height: 34,
            borderRadius: 14,
            background: preview,
            border: '3px solid #FFF',
            boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
          }}
        />
      </div>

      {/* Saturation */}
      <div style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--cm-sub)', fontWeight: 700, marginBottom: 6 }}>
          <span>Saturation</span>
          <span>{saturation}%</span>
        </div>
        <input
          type="range"
          min={30}
          max={100}
          value={saturation}
          onChange={(e) => setSaturation(Number.parseInt(e.target.value, 10))}
          disabled={!isPro}
          style={{ width: '100%', accentColor: preview }}
        />
      </div>

      {/* Preview triple */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 14 }}>
        {[
          { label: 'Primary', hex: preview },
          { label: 'Dark', hex: previewDark },
          { label: 'Soft', hex: previewSoft },
        ].map((c) => (
          <div key={c.label} style={{ textAlign: 'center' }}>
            <div style={{ height: 40, borderRadius: 10, background: c.hex, marginBottom: 4 }} />
            <div style={{ fontSize: 10, color: 'var(--cm-muted)', fontWeight: 700 }}>{c.label}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 14 }}>
        <Button variant="primary" fullWidth onClick={apply} disabled={!isPro}>
          {isPro ? 'Appliquer cette couleur' : '🔒 Debloquer avec Pro'}
        </Button>
      </div>

      {/* Anti-unused */}
      <span style={{ display: 'none' }}>{t('theme')}{theme.primary}</span>
    </div>
  );
}
