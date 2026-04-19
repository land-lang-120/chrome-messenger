/**
 * Onboarding — feature pilote de la migration TypeScript.
 * Flow : welcome -> phone -> otp -> profile -> home.
 *
 * SECURITE :
 * - Generation de la paire ECDH au moment de la creation de profil
 * - Private key stockee en localStorage (chiffree plus tard si appLock)
 * - Public key destinee a Firestore (pour que les autres puissent chiffrer pour nous)
 */

import { useCallback, useState } from 'react';

import { Button } from '../../components/Button';
import { ChameleonLogo } from '../../components/ChameleonLogo';
import { IconButton } from '../../components/IconButton';
import { IconBack } from '../../components/Icons';
import { Input } from '../../components/Input';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../contexts/I18nContext';
import { generateUserKeypair } from '../../services/crypto';
import { lsSet } from '../../services/storage';
import { sendOtp, verifyOtp, AuthError } from '../../services/firebase/auth';
import { LIMITS, LS_KEYS } from '../../config';
import { PhoneSchema, DEFAULT_USER_SETTINGS, NameSchema } from '../../types/user';
import type { User } from '../../types/user';

type Step = 'welcome' | 'phone' | 'otp' | 'profile';

export function OnboardingScreen() {
  const { t } = useI18n();
  const { setUser, setOnboarded } = useAuth();
  const [step, setStep] = useState<Step>('welcome');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const sendOtpHandler = useCallback(async () => {
    setErr(null);
    const parsed = PhoneSchema.safeParse(phone);
    if (!parsed.success) {
      setErr(t('invalidPhone'));
      return;
    }
    setLoading(true);
    try {
      await sendOtp(parsed.data);
      setStep('otp');
    } catch (e) {
      setErr(e instanceof AuthError ? e.message : t('invalidPhone'));
    } finally {
      setLoading(false);
    }
  }, [phone, t]);

  const verifyOtpHandler = useCallback(async () => {
    setErr(null);
    if (code.length !== LIMITS.OTP_DIGITS) {
      setErr(t('invalidCode'));
      return;
    }
    setLoading(true);
    try {
      await verifyOtp(code);
      setStep('profile');
    } catch (e) {
      setErr(e instanceof AuthError ? e.message : t('invalidCode'));
    } finally {
      setLoading(false);
    }
  }, [code, t]);

  const finishHandler = useCallback(async () => {
    setErr(null);
    const parsed = NameSchema.safeParse(name);
    if (!parsed.success) {
      setErr(parsed.error.errors[0]?.message ?? 'Nom requis');
      return;
    }
    setLoading(true);
    try {
      // Generation paire ECDH — la cle privee ne doit JAMAIS etre uploadee.
      const { privateKeyJwk, publicKeyJwk } = await generateUserKeypair();
      lsSet(LS_KEYS.privateKey, privateKeyJwk);
      lsSet(LS_KEYS.publicKey, publicKeyJwk);

      const now = Date.now();
      const user: User = {
        uid: 'local-' + Math.random().toString(36).slice(2, 10),
        phone,
        name: parsed.data,
        avatar: null,
        bio: bio.trim(),
        publicKey: JSON.stringify(publicKeyJwk),
        createdAtMs: now,
        lastSeenMs: now,
        settings: DEFAULT_USER_SETTINGS,
      };
      setUser(user);
      setOnboarded(true);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [name, bio, phone, setUser, setOnboarded]);

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: 'var(--cm-bg)',
    display: 'flex',
    flexDirection: 'column',
    padding: 24,
  };

  const centerStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  };

  if (step === 'welcome') {
    return (
      <div style={containerStyle}>
        <div style={centerStyle}>
          <ChameleonLogo size={200} />
          <h1 style={{ fontSize: 16, fontWeight: 600, color: 'var(--cm-sub)', margin: '28px 0 6px' }}>
            {t('welcome')}
          </h1>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: 'var(--cm-title)', margin: '0 0 12px', letterSpacing: '-0.5px' }}>
            {t('appName')}
          </h2>
          <p style={{ fontSize: 15, color: 'var(--cm-sub)', margin: '0 0 40px', maxWidth: 320, lineHeight: 1.5 }}>
            {t('welcomeSub')}
          </p>
          <Button variant="primary" size="lg" fullWidth style={{ maxWidth: 320 }} onClick={() => setStep('phone')}>
            {t('getStarted')}
          </Button>
        </div>
      </div>
    );
  }

  // Layout : back en haut, contenu centre verticalement, CTA en bas
  const headingStyle: React.CSSProperties = { fontSize: 24, fontWeight: 800, color: 'var(--cm-title)', marginBottom: 8, textAlign: 'center' };
  const subStyle: React.CSSProperties = { fontSize: 14, color: 'var(--cm-sub)', marginBottom: 28, textAlign: 'center' };

  if (step === 'phone') {
    return (
      <div style={containerStyle}>
        <IconButton label={t('back')} onClick={() => setStep('welcome')}>
          <IconBack />
        </IconButton>
        <div style={centerStyle}>
          <ChameleonLogo size={130} />
          <div style={{ height: 28 }} />
          <h2 style={headingStyle}>{t('enterPhone')}</h2>
          <p style={subStyle}>{t('phoneDesc')}</p>
          <div style={{ width: '100%', maxWidth: 360 }}>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t('phonePlaceholder')}
              error={err ?? undefined}
              autoFocus
            />
          </div>
          <div id="recaptcha-container" />
        </div>
        <Button variant="primary" size="lg" fullWidth loading={loading} onClick={() => void sendOtpHandler()}>
          {t('sendCode')}
        </Button>
      </div>
    );
  }

  if (step === 'otp') {
    return (
      <div style={containerStyle}>
        <IconButton label={t('back')} onClick={() => setStep('phone')}>
          <IconBack />
        </IconButton>
        <div style={centerStyle}>
          <ChameleonLogo size={130} />
          <div style={{ height: 28 }} />
          <h2 style={headingStyle}>{t('enterCode')}</h2>
          <p style={subStyle}>{t('codeDesc')} ({phone})</p>
          <div style={{ width: '100%', maxWidth: 360 }}>
            <Input
              type="tel"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="• • • • • •"
              error={err ?? undefined}
              style={{ letterSpacing: '0.5em', textAlign: 'center', fontSize: 24, fontWeight: 700 }}
              autoFocus
            />
          </div>
          <button
            onClick={() => void sendOtpHandler()}
            style={{
              background: 'transparent', border: 'none',
              color: 'var(--cm-primary)', fontFamily: 'inherit',
              fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: '10px 0',
            }}
          >
            {t('codeNotReceived')}
          </button>
        </div>
        <Button
          variant="primary" size="lg" fullWidth
          disabled={code.length !== LIMITS.OTP_DIGITS}
          loading={loading}
          onClick={() => void verifyOtpHandler()}
        >
          {t('verify')}
        </Button>
      </div>
    );
  }

  // step === 'profile'
  return (
    <div style={containerStyle}>
      <IconButton label={t('back')} onClick={() => setStep('otp')}>
        <IconBack />
      </IconButton>
      <div style={centerStyle}>
        <ChameleonLogo size={130} />
        <div style={{ height: 28 }} />
        <h2 style={headingStyle}>{t('profileSetup')}</h2>
        <p style={subStyle}>{t('profileDesc')}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%', maxWidth: 360 }}>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('yourName')}
            maxLength={40}
            autoFocus
          />
          <Input
            type="text"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder={t('yourBio')}
            maxLength={200}
          />
          {err && <p style={{ color: '#FF4757', fontSize: 13, textAlign: 'center' }}>{err}</p>}
        </div>
      </div>
      <Button variant="primary" size="lg" fullWidth loading={loading} onClick={() => void finishHandler()}>
        {t('finish')}
      </Button>
    </div>
  );
}
