/*
 * LINE 10's own strings, registered through Video.js i18n like the built-in labels.
 * Each locale's full pack is imported first so registering these keys doesn't stop the
 * rest of that language from loading (see "Override specific strings" in the i18n guide).
 */
import '@videojs/html/i18n/locales/es/register';
import '@videojs/html/i18n/locales/fr/register';
import '@videojs/html/i18n/locales/de/register';
import '@videojs/html/i18n/locales/ja/register';
import '@videojs/html/i18n/locales/ar/register';
import { registerI18n } from '@videojs/html/i18n';

type Line10Strings = {
  towards: string; stops: string; stopAt: string; now: string; next: string;
  pid: Record<'ready' | 'held' | 'moving' | 'approaching' | 'terminus' | 'quiet' | 'express' | 'stopping' | 'disruption', string>;
  service: Record<'stopping' | 'local' | 'limited' | 'express' | 'rapid', string>;
};

const strings: Record<string, Line10Strings> = {
  en: {
    towards: 'towards', stops: 'Stops', stopAt: 'Go to {stop}, {time}', now: 'Now at', next: 'Next',
    pid: { ready: 'Ready to depart', held: 'Holding at platform', moving: 'In service', approaching: 'Approaching', terminus: 'This service terminates here', quiet: 'Quiet carriage', express: 'Express service', stopping: 'Stopping service', disruption: 'Service disruption' },
    service: { stopping: 'Stopping', local: 'Local', limited: 'Limited', express: 'Express', rapid: 'Rapid' },
  },
  es: {
    towards: 'dirección', stops: 'Paradas', stopAt: 'Ir a {stop}, {time}', now: 'Ahora en', next: 'Próxima',
    pid: { ready: 'Listo para salir', held: 'Detenido en andén', moving: 'En servicio', approaching: 'Llegando', terminus: 'Este servicio termina aquí', quiet: 'Vagón silencioso', express: 'Servicio exprés', stopping: 'Servicio con paradas', disruption: 'Servicio interrumpido' },
    service: { stopping: 'Paradas', local: 'Local', limited: 'Semidirecto', express: 'Exprés', rapid: 'Rápido' },
  },
  fr: {
    towards: 'direction', stops: 'Arrêts', stopAt: 'Aller à {stop}, {time}', now: 'Arrêt', next: 'Prochain',
    pid: { ready: 'Prêt au départ', held: 'À quai', moving: 'En service', approaching: 'À l’approche', terminus: 'Terminus, tout le monde descend', quiet: 'Voiture silencieuse', express: 'Service express', stopping: 'Omnibus', disruption: 'Trafic perturbé' },
    service: { stopping: 'Omnibus', local: 'Normal', limited: 'Semi-direct', express: 'Express', rapid: 'Rapide' },
  },
  de: {
    towards: 'Richtung', stops: 'Halte', stopAt: 'Zu {stop}, {time}', now: 'Halt', next: 'Nächster Halt',
    pid: { ready: 'Bereit zur Abfahrt', held: 'Hält am Bahnsteig', moving: 'In Fahrt', approaching: 'Fährt ein', terminus: 'Endstation, bitte aussteigen', quiet: 'Ruhebereich', express: 'Schnellzug', stopping: 'Bummelzug', disruption: 'Betriebsstörung' },
    service: { stopping: 'Bummelzug', local: 'Regional', limited: 'Eilzug', express: 'Express', rapid: 'Schnell' },
  },
  ja: {
    towards: '行き', stops: '停車駅', stopAt: '{stop}へ移動 {time}', now: '現在', next: '次は',
    pid: { ready: 'まもなく発車', held: '停車中', moving: '運行中', approaching: 'まもなく到着', terminus: '終点です', quiet: '静かな車両', express: '急行運転', stopping: '各駅停車', disruption: '運転見合わせ' },
    service: { stopping: '各停', local: '普通', limited: '準急', express: '急行', rapid: '快速' },
  },
  ar: {
    towards: 'باتجاه', stops: 'المحطات', stopAt: 'انتقل إلى {stop}، {time}', now: 'المحطة', next: 'التالية',
    pid: { ready: 'جاهز للانطلاق', held: 'متوقف على الرصيف', moving: 'في الخدمة', approaching: 'يقترب', terminus: 'هذه المحطة الأخيرة', quiet: 'عربة هادئة', express: 'خدمة سريعة', stopping: 'خدمة بطيئة', disruption: 'تعطل الخدمة' },
    service: { stopping: 'بطيء', local: 'عادي', limited: 'محدود', express: 'سريع', rapid: 'فائق' },
  },
};
for (const [locale, line10] of Object.entries(strings)) {
  registerI18n(locale, { line10 } as never);
}
