/**
 * Premium service — gestion des abonnements + essai gratuit.
 *
 * Plans : free / plus / pro / yearly
 * Essai gratuit : 30 jours avec acces a TOUTES les fonctionnalites (meme Pro)
 *   - Active automatiquement a la 1ere installation apres deploiement stores
 *   - Passe en 'free' a l'expiration (sauf si l'user a souscrit)
 *
 * IAP (in-app purchase) : abstraction prête pour Stripe (web) / Google Play Billing / Apple IAP.
 *   - Pour le MVP local : simulation pure (achat = set direct).
 *   - Production : brancher sur les SDKs dans services/iap/*.
 */

import { lsGet, lsSet } from './storage';

export type PlanId = 'free' | 'plus' | 'pro' | 'yearly';

export interface PremiumState {
  /** Plan actif (après essai). */
  readonly plan: PlanId;
  /** Début de l'abonnement ou de l'essai (ms). */
  readonly sinceMs: number;
  /** Fin de l'abonnement ou de l'essai (ms). 0 = illimité. */
  readonly expiresAtMs: number;
  /** True si l'user est actuellement en période d'essai gratuit. */
  readonly trial: boolean;
  /** ID de transaction IAP (pour reconciliation). */
  readonly receiptId: string | null;
  /** Plateforme d'achat : 'web' (Stripe), 'android' (Play), 'ios' (Apple). */
  readonly platform: 'web' | 'android' | 'ios' | null;
}

const KEY = 'cm_premium';
const TRIAL_DAYS = 30;
const TRIAL_STARTED_KEY = 'cm_trial_started';

const DEFAULT_STATE: PremiumState = {
  plan: 'free',
  sinceMs: 0,
  expiresAtMs: 0,
  trial: false,
  receiptId: null,
  platform: null,
};

export function getPremium(): PremiumState {
  const state = lsGet<PremiumState>(KEY, DEFAULT_STATE);
  // Expiration automatique
  if (state.expiresAtMs > 0 && Date.now() > state.expiresAtMs) {
    const expired: PremiumState = { ...state, plan: 'free', trial: false, expiresAtMs: 0 };
    lsSet(KEY, expired);
    return expired;
  }
  return state;
}

export function setPremium(state: PremiumState): void {
  lsSet(KEY, state);
}

/**
 * Lance l'essai gratuit (1 fois par device, au 1er lancement post-déploiement).
 * Appelé depuis App.tsx après l'onboarding.
 */
export function startTrialIfEligible(): boolean {
  if (lsGet<boolean>(TRIAL_STARTED_KEY, false)) return false; // déjà démarré
  const now = Date.now();
  const state: PremiumState = {
    plan: 'pro', // Essai = accès Pro complet
    sinceMs: now,
    expiresAtMs: now + TRIAL_DAYS * 24 * 3600 * 1000,
    trial: true,
    receiptId: null,
    platform: null,
  };
  lsSet(KEY, state);
  lsSet(TRIAL_STARTED_KEY, true);
  return true;
}

/** Retourne true si l'user a accès aux fonctionnalités Plus ou supérieur. */
export function isPlusOrAbove(): boolean {
  const p = getPremium().plan;
  return p === 'plus' || p === 'pro' || p === 'yearly';
}

/** Retourne true si l'user a accès aux fonctionnalités Pro (inclus Pro, Yearly, ou Trial). */
export function isPro(): boolean {
  const s = getPremium();
  return s.plan === 'pro' || s.plan === 'yearly' || s.trial;
}

/** Jours restants avant expiration (0 si pas d'expiration, négatif si expiré). */
export function daysUntilExpiry(): number {
  const s = getPremium();
  if (s.expiresAtMs === 0) return 0;
  return Math.ceil((s.expiresAtMs - Date.now()) / (24 * 3600 * 1000));
}

/* =============================================================
   IN-APP PURCHASE — abstraction multi-plateformes
   ============================================================= */

export interface PurchaseResult {
  readonly ok: boolean;
  readonly receiptId?: string;
  readonly error?: string;
}

/**
 * Achat d'un plan. Détecte la plateforme et route vers le bon SDK.
 * - Web : Stripe Checkout redirect
 * - Android (TWA / Capacitor) : Google Play Billing
 * - iOS (Capacitor) : StoreKit
 *
 * Pour le MVP dev, on simule succès immédiat.
 */
export async function purchasePlan(plan: PlanId): Promise<PurchaseResult> {
  const platform = detectPlatform();
  try {
    // TODO(prod) : appeler le vrai SDK selon la plateforme
    // Stripe: const sess = await stripe.redirectToCheckout({...})
    // Play:   const r = await google.payments.subscribe(plan)
    // Apple:  const r = await storekit.purchase(plan)

    // MVP dev : simulation
    await new Promise((r) => setTimeout(r, 800));
    const receiptId = 'mock_' + Date.now();
    const now = Date.now();
    const durationMs = plan === 'yearly' ? 365 * 24 * 3600 * 1000 : 30 * 24 * 3600 * 1000;
    setPremium({
      plan,
      sinceMs: now,
      expiresAtMs: plan === 'free' ? 0 : now + durationMs,
      trial: false,
      receiptId,
      platform,
    });
    return { ok: true, receiptId };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

/** Restore purchases (iOS / Android requirement pour app store compliance). */
export async function restorePurchases(): Promise<PurchaseResult> {
  // TODO(prod) : récupérer le receipt depuis le SDK natif et vérifier côté serveur
  await new Promise((r) => setTimeout(r, 500));
  return { ok: true };
}

function detectPlatform(): 'web' | 'android' | 'ios' {
  if (typeof navigator === 'undefined') return 'web';
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('android')) return 'android';
  if (/iphone|ipad|ipod/.test(ua)) return 'ios';
  return 'web';
}
