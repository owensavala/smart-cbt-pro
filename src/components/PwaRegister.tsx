'use client';

import React, { useEffect, useState } from 'react';
import { Wifi, WifiOff, Download, X, CheckCircle2 } from 'lucide-react';

export default function PwaRegister() {
  const [isOnline, setIsOnline] = useState(true);
  const [showStatusToast, setShowStatusToast] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  useEffect(() => {
    // 1. Initial online status
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);

      const handleOnline = () => {
        setIsOnline(true);
        setShowStatusToast(true);
        const timer = setTimeout(() => setShowStatusToast(false), 4000);
        return () => clearTimeout(timer);
      };

      const handleOffline = () => {
        setIsOnline(false);
        setShowStatusToast(true);
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      // 2. Register Service Worker
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker
            .register('/sw.js')
            .then((reg) => {
              console.log('[PWA] Service Worker registered successfully:', reg.scope);
            })
            .catch((err) => {
              console.warn('[PWA] Service Worker registration failed:', err);
            });
        });
      }

      // 3. Capture PWA Install Prompt
      const handleBeforeInstall = (e: Event) => {
        e.preventDefault();
        setInstallPrompt(e);
      };
      window.addEventListener('beforeinstallprompt', handleBeforeInstall);

      window.addEventListener('appinstalled', () => {
        setInstallPrompt(null);
        setInstalledSuccess(true);
        setTimeout(() => setInstalledSuccess(false), 5000);
      });

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  return (
    <>
      {/* Offline / Online Status Floating Toast */}
      {showStatusToast && (
        <div
          className={`fixed bottom-4 left-4 z-50 px-4 py-2.5 rounded-xl border shadow-2xl flex items-center gap-2.5 text-xs font-semibold backdrop-blur-md transition-all animate-fadeIn ${
            isOnline
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-300'
              : 'bg-amber-950/95 border-amber-500/60 text-amber-200'
          }`}
        >
          {isOnline ? (
            <>
              <Wifi className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Jaringan Kembali Online 🟢 Sinkronisasi aktif</span>
              <button
                onClick={() => setShowStatusToast(false)}
                className="ml-2 text-emerald-400/80 hover:text-emerald-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
              <div>
                <span className="block font-bold">Mode Offline Aktif 🟡</span>
                <span className="text-[10px] text-amber-300/80 font-normal">
                  Sistem tetap lancar. Jawaban tersimpan aman di IndexedDB lokal.
                </span>
              </div>
              <button
                onClick={() => setShowStatusToast(false)}
                className="ml-2 text-amber-400/80 hover:text-amber-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      )}

      {/* PWA Install Promotion Banner (if installable and not yet installed) */}
      {installPrompt && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#151922]/95 border border-blue-500/50 text-white p-3.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 text-xs max-w-sm animate-fadeIn">
          <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center shrink-0 text-blue-400">
            <Download className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <span className="font-bold text-white block">Install Smart CBT (PWA)</span>
            <span className="text-[10px] text-slate-400 block leading-tight">
              Buka cepat tanpa browser & lebih hemat kuota di Lab Sekolah.
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer shadow-xs transition-colors"
            >
              Install
            </button>
            <button
              onClick={() => setInstallPrompt(null)}
              className="text-slate-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {installedSuccess && (
        <div className="fixed bottom-4 right-4 z-50 bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Smart CBT PWA berhasil diinstal ke perangkat Anda!</span>
        </div>
      )}
    </>
  );
}
