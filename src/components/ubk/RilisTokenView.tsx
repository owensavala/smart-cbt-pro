'use client';

import React, { useState, useEffect } from 'react';
import {
  KeyRound,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  History,
  LayoutGrid,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

interface RilisTokenViewProps {
  activeToken?: string;
  tokenRequired?: boolean;
  onGenerateToken?: () => void;
  onToggleToken?: (required: boolean) => void;
}

interface TokenHistoryItem {
  id: number;
  token: string;
  generatedAt: string;
  duration: string;
  isActive: boolean;
}

export default function RilisTokenView({
  activeToken: externalToken,
  tokenRequired: externalRequired,
  onGenerateToken,
  onToggleToken,
}: RilisTokenViewProps) {
  const [token, setToken] = useState<string>(externalToken || '36S7KS');
  const [isRequired, setIsRequired] = useState<boolean>(externalRequired ?? true);
  const [copied, setCopied] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  const [tokenHistory, setTokenHistory] = useState<TokenHistoryItem[]>([
    {
      id: 1,
      token: '36S7KS',
      generatedAt: '26/02/2026 12:31:54',
      duration: '00:15:00',
      isActive: true,
    },
    {
      id: 2,
      token: '98B2LA',
      generatedAt: '26/02/2026 12:16:54',
      duration: '00:15:00',
      isActive: false,
    },
    {
      id: 3,
      token: '54ZX9Q',
      generatedAt: '26/02/2026 12:01:54',
      duration: '00:15:00',
      isActive: false,
    },
  ]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleGenerate = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let newToken = '';
    for (let i = 0; i < 6; i++) {
      newToken += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setToken(newToken);

    const now = new Date();
    const formatted = `${String(now.getDate()).padStart(2, '0')}/${String(
      now.getMonth() + 1
    ).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(
      2,
      '0'
    )}:${String(now.getMinutes()).padStart(2, '0')}:${String(
      now.getSeconds()
    ).padStart(2, '0')}`;

    setTokenHistory((prev) => [
      {
        id: prev.length + 1,
        token: newToken,
        generatedAt: formatted,
        duration: '00:15:00',
        isActive: true,
      },
      ...prev.map((item) => ({ ...item, isActive: false })),
    ]);

    if (onGenerateToken) {
      onGenerateToken();
    }
    showToast(`Token ujian baru berhasil digenerate: ${newToken}`);
  };

  const handleCopy = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(token);
      setCopied(true);
      showToast('Token berhasil disalin ke clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleToggle = () => {
    const nextVal = !isRequired;
    setIsRequired(nextVal);
    if (onToggleToken) {
      onToggleToken(nextVal);
    }
    showToast(
      nextVal
        ? 'Siswa sekarang WAJIB memasukkan token saat memulai ujian.'
        : 'Token ujian DINONAKTIFKAN (siswa bisa langsung ujian).'
    );
  };

  return (
    <div className="space-y-4">
      {notification && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl border border-emerald-500/50 bg-emerald-950 text-emerald-300 text-xs font-semibold shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight uppercase">
          Generate Token Ujian
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Token Card */}
        <div className="lg:col-span-6 bg-[#121620] border border-slate-800 rounded-xl p-5 md:p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wide">
                <LayoutGrid className="w-4 h-4 text-slate-400" />
                <span>Generate Token</span>
              </div>
              <button
                onClick={handleToggle}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isRequired
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                }`}
              >
                {isRequired ? (
                  <>
                    <ToggleRight className="w-4 h-4" />
                    <span>STATUS: WAJIB TOKEN</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-4 h-4" />
                    <span>STATUS: BEBAS (TANPA TOKEN)</span>
                  </>
                )}
              </button>
            </div>

            {/* Giant Token Display matching reference screenshot */}
            <div className="bg-[#181d28] border border-slate-700/60 rounded-xl p-10 text-center flex flex-col items-center justify-center my-6 group relative shadow-inner">
              <span className="text-5xl md:text-6xl font-black font-mono tracking-widest text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)] select-all">
                {token}
              </span>
              <span className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-3">
                TOKEN UJIAN AKTIF SAAT INI
              </span>

              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-600 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Tersalin!' : 'Salin Token'}</span>
                </button>
                <button
                  onClick={handleGenerate}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-lg hover:shadow-blue-500/25 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Generate Token Baru</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-slate-400 text-xs flex items-center gap-2">
            <span className="text-sky-400 font-bold">ℹ</span>
            <span>Token akan diganti setiap kali tombol ditekan.</span>
          </div>
        </div>

        {/* Right: Token History Table */}
        <div className="lg:col-span-6 bg-[#121620] border border-slate-800 rounded-xl p-5 md:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wide">
              <History className="w-4 h-4 text-slate-400" />
              <span>Data Token</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Tercatat: {tokenHistory.length} Token
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181d28] text-slate-300 font-bold uppercase border-b border-slate-700">
                <tr>
                  <th className="py-3 px-3 text-center w-12">#</th>
                  <th className="py-3 px-4">TOKEN</th>
                  <th className="py-3 px-4">WAKTU GENERATE</th>
                  <th className="py-3 px-4 text-center">MASA BERLAKU</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {tokenHistory.map((item, idx) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      item.isActive ? 'bg-blue-500/5' : ''
                    }`}
                  >
                    <td className="py-3 px-3 text-center font-mono text-slate-500">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-blue-400 font-black font-mono tracking-wider text-sm">
                        {item.token}
                      </span>
                      {item.isActive && (
                        <span className="ml-2 text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold">
                          AKTIF
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">
                      {item.generatedAt}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="bg-[#00c5c8]/20 text-[#00c5c8] border border-[#00c5c8]/40 px-2.5 py-1 rounded font-mono font-bold text-[11px]">
                        {item.duration}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
