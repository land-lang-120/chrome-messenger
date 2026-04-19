/**
 * EditProfileScreen — édition du profil utilisateur (nom, bio, avatar placeholder).
 */

import { useState } from 'react';

import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { IconButton } from '../../components/IconButton';
import { IconBack } from '../../components/Icons';
import { Input } from '../../components/Input';
import { LIMITS } from '../../config';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../contexts/I18nContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import { BioSchema, NameSchema } from '../../types/user';

export interface EditProfileScreenProps {
  readonly onBack: () => void;
}

export function EditProfileScreen({ onBack }: EditProfileScreenProps) {
  const { t } = useI18n();
  const { theme } = useTheme();
  const { user, setUser } = useAuth();
  const toast = useToast();

  const [name, setName] = useState(user?.name ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [err, setErr] = useState<string | null>(null);

  function save() {
    if (!user) return;
    const nameParsed = NameSchema.safeParse(name);
    if (!nameParsed.success) { setErr('Nom invalide (1-40 caracteres)'); return; }
    const bioParsed = BioSchema.safeParse(bio);
    if (!bioParsed.success) { setErr('Bio trop longue (max 200 caracteres)'); return; }
    setUser({ ...user, name: nameParsed.data, bio: bioParsed.data });
    toast.show('Profil mis a jour', 'success');
    onBack();
  }

  return (
    <div style={{ paddingBottom: 40, background: 'var(--cm-bg)', minHeight: '100vh' }}>
      <Header
        left={<IconButton label={t('back')} onClick={onBack}><IconBack /></IconButton>}
        title="Modifier le profil"
        hideLogo
      />

      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Avatar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <Avatar name={name || '?'} size={100} border={theme.primary} />
          <button
            type="button"
            onClick={() => toast.show('Upload photo : a venir en v1.1', 'info')}
            style={{
              padding: '8px 16px', borderRadius: 12,
              background: theme.primarySoft, color: theme.primaryDark,
              border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 13, fontWeight: 700,
            }}
          >
            📷 Changer la photo
          </button>
        </div>

        {/* Nom */}
        <div>
          <Label>Nom complet</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ton nom"
            maxLength={LIMITS.NAME_MAX}
          />
        </div>

        {/* Bio */}
        <div>
          <Label>Bio (optionnel)</Label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Parle un peu de toi…"
            maxLength={LIMITS.BIO_MAX}
            style={{
              width: '100%', padding: '12px 14px', borderRadius: 14,
              background: 'var(--cm-surface)', border: '1px solid var(--cm-line)',
              fontSize: 15, fontFamily: 'inherit', outline: 'none',
              color: 'var(--cm-title)', resize: 'none', minHeight: 80,
            }}
          />
          <div style={{ fontSize: 11, color: 'var(--cm-muted)', textAlign: 'right', marginTop: 4 }}>
            {bio.length}/{LIMITS.BIO_MAX}
          </div>
        </div>

        {/* Numéro (non éditable) */}
        <div>
          <Label>Numero de telephone</Label>
          <div
            style={{
              padding: '14px 16px', borderRadius: 14,
              background: 'var(--cm-surface-2)', color: 'var(--cm-sub)',
              fontSize: 15, fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            {user?.phone ?? '—'}
            <span style={{ fontSize: 11, color: 'var(--cm-muted)', marginLeft: 'auto' }}>verrouille</span>
          </div>
        </div>

        {err && <p style={{ color: '#FF4757', fontSize: 13, textAlign: 'center' }}>{err}</p>}

        <Button variant="primary" size="lg" fullWidth onClick={save}>
          Enregistrer
        </Button>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, color: 'var(--cm-sub)', fontWeight: 700, marginBottom: 8, letterSpacing: 0.5, textTransform: 'uppercase' }}>
      {children}
    </div>
  );
}
