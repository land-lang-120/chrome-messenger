import { Avatar } from '../../components/Avatar';
import { Header } from '../../components/Header';
import { IconButton } from '../../components/IconButton';
import { IconBack, IconLock } from '../../components/Icons';
import { CM_APP_VERSION } from '../../config';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../contexts/I18nContext';
import { useToast } from '../../contexts/ToastContext';
import { LANGS } from '../../i18n';
import { resetAllData } from '../../services/localDb';

export interface SettingsScreenProps {
  readonly onBack: () => void;
  readonly onLangOpen: () => void;
  readonly onThemeTap: () => void;
  readonly onContactsOpen?: () => void;
  readonly onEventsOpen?: () => void;
}

export function SettingsScreen(props: SettingsScreenProps) {
  const { t, lang } = useI18n();
  const { user, setUser, setOnboarded, updateSettings } = useAuth();
  const toast = useToast();

  function toggle(key: keyof NonNullable<typeof user>['settings']) {
    if (!user) return;
    const current = user.settings[key];
    if (typeof current !== 'boolean') return;
    updateSettings({ [key]: !current } as Partial<typeof user.settings>);
  }

  const activeLang = LANGS.find((l) => l.code === lang) ?? LANGS[0]!;

  return (
    <div style={{ paddingBottom: 60, background: 'var(--cm-bg)' }}>
      <Header left={<IconButton label={t('back')} onClick={props.onBack}><IconBack /></IconButton>} onLogoTap={props.onThemeTap} />

      {/* Card profil */}
      <section
        style={{
          margin: '6px 16px 16px', padding: 18, borderRadius: 18,
          background: 'var(--cm-surface)', border: '1px solid var(--cm-line)',
          display: 'flex', alignItems: 'center', gap: 14,
        }}
      >
        <Avatar name={user?.name ?? '?'} size={60} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--cm-title)' }}>{user?.name ?? '—'}</div>
          <div style={{ fontSize: 13, color: 'var(--cm-sub)', marginTop: 3 }}>{user?.phone ?? '—'}</div>
          {user?.bio && <div style={{ fontSize: 12, color: 'var(--cm-muted)', marginTop: 3 }}>{user.bio}</div>}
        </div>
      </section>

      <div style={{ padding: '0 16px' }}>
        <H>Mes donnees</H>
        <Row icon="👥" label="Contacts" onClick={props.onContactsOpen} />
        <Row icon="🎉" label="Evenements" onClick={props.onEventsOpen} />

        <H>Apparence</H>
        <Row icon="🎨" label={t('theme')} value="Menthe" onClick={props.onThemeTap} />
        <Row icon="🌐" label={t('language')} value={activeLang.name} onClick={props.onLangOpen} />

        <H>Confidentialite & Securite</H>
        <Row icon={<IconLock width={16} height={16} />} label="Chiffrement bout en bout" value="Actif" />
        <Toggle label="Confirmations de lecture" value={user?.settings.readReceipts ?? false} onChange={() => toggle('readReceipts')} />
        <Toggle label="Statut « vu a »" value={user?.settings.lastSeenVisible ?? false} onChange={() => toggle('lastSeenVisible')} />
        <Toggle label="Photo de profil visible" value={user?.settings.profilePhotoVisible ?? false} onChange={() => toggle('profilePhotoVisible')} />

        <H>Notifications</H>
        <Toggle label="Notifications" value={user?.settings.notifications ?? false} onChange={() => toggle('notifications')} />
        <Toggle label="Sons" value={user?.settings.sound ?? false} onChange={() => toggle('sound')} />
        <Toggle label="Vibration" value={user?.settings.vibration ?? false} onChange={() => toggle('vibration')} />
        <Toggle label="Rappels taches (J-1 & J)" value={user?.settings.taskReminders ?? false} onChange={() => toggle('taskReminders')} />
        <Toggle label="Rappels evenements" value={user?.settings.eventReminders ?? false} onChange={() => toggle('eventReminders')} />

        <H>Discussions</H>
        <Toggle label="Entree pour envoyer" value={user?.settings.enterToSend ?? false} onChange={() => toggle('enterToSend')} />
        <Toggle label="Telechargement auto des medias" value={user?.settings.autoDownload ?? false} onChange={() => toggle('autoDownload')} />
        <Toggle label="Sauvegarde cloud chiffree" value={user?.settings.cloudBackup ?? false} onChange={() => toggle('cloudBackup')} />

        <H>Stockage et donnees</H>
        <Row icon="📊" label="Utilisation du stockage" value="—" />
        <Row icon="🌍" label="Reseau" value="Wi-Fi + Mobile" />

        <H>Compte</H>
        <Row icon="📱" label="Appareils lies" value="1 appareil actif" />
        <Row icon="👤" label="Numero" value={user?.phone ?? '—'} />

        <H>Aide</H>
        <Row icon="❓" label="FAQ & Aide" />
        <Row icon="📧" label="Nous contacter" />
        <Row icon="📜" label="Conditions d'utilisation" />
        <Row icon="🔐" label="Politique de confidentialite" />

        <H>{t('about')}</H>
        <Row icon="ℹ️" label="Version" value={CM_APP_VERSION} />

        <button
          type="button"
          onClick={() => {
            if (confirm(t('resetConfirm'))) {
              resetAllData();
              setUser(null);
              setOnboarded(false);
              location.reload();
            }
          }}
          style={{
            marginTop: 16, width: '100%', padding: 14,
            background: 'transparent', border: '1px solid #FF4757',
            color: '#FF4757', borderRadius: 14,
            fontFamily: 'inherit', fontWeight: 700, cursor: 'pointer',
          }}
        >
          {t('resetData')}
        </button>

        <button
          type="button"
          onClick={() => toast.show('Support via support@chrome-messenger.app', 'info')}
          style={{
            marginTop: 8, width: '100%', padding: 14,
            background: 'transparent', border: '1px solid var(--cm-line)',
            color: 'var(--cm-title)', borderRadius: 14,
            fontFamily: 'inherit', fontWeight: 700, cursor: 'pointer',
          }}
        >
          {t('logout')}
        </button>
      </div>
    </div>
  );
}

function H({ children }: { children: React.ReactNode }) {
  return <h3 style={{ fontSize: 11, fontWeight: 800, color: 'var(--cm-muted)', letterSpacing: 1, margin: '18px 0 6px', textTransform: 'uppercase' }}>{children}</h3>;
}

function Row({ icon, label, value, onClick }: { icon: React.ReactNode; label: string; value?: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      style={{
        width: '100%', padding: '14px 16px',
        borderRadius: 14,
        background: 'var(--cm-surface)', border: '1px solid var(--cm-line)',
        display: 'flex', alignItems: 'center', gap: 12,
        cursor: onClick ? 'pointer' : 'default',
        textAlign: 'left', fontFamily: 'inherit',
        marginBottom: 6,
      }}
    >
      <span style={{ display: 'inline-flex', width: 22, justifyContent: 'center', fontSize: 16 }}>{icon}</span>
      <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: 'var(--cm-title)' }}>{label}</span>
      {value && <span style={{ fontSize: 13, color: 'var(--cm-sub)' }}>{value}</span>}
    </button>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: () => void }) {
  return (
    <div
      style={{
        padding: '14px 16px', borderRadius: 14,
        background: 'var(--cm-surface)', border: '1px solid var(--cm-line)',
        display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6,
      }}
    >
      <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: 'var(--cm-title)' }}>{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={onChange}
        style={{
          width: 44, height: 26, borderRadius: 13,
          background: value ? 'var(--cm-primary)' : 'var(--cm-line)',
          border: 'none', cursor: 'pointer',
          position: 'relative', transition: 'background 0.15s',
        }}
      >
        <span
          aria-hidden
          style={{
            position: 'absolute', top: 3,
            left: value ? 21 : 3,
            width: 20, height: 20, borderRadius: '50%',
            background: '#FFF',
            transition: 'left 0.15s',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        />
      </button>
    </div>
  );
}
