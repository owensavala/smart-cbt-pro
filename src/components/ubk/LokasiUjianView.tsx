'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Crosshair,
  Save,
  CheckCircle2,
  Navigation,
  Globe2,
  AlertCircle,
  Plus,
  Minus,
  Layers,
} from 'lucide-react';

export default function LokasiUjianView() {
  const [geofencingStatus, setGeofencingStatus] = useState<'AKTIF' | 'NON_AKTIF'>('AKTIF');
  const [latitude, setLatitude] = useState('0.785958656841129');
  const [longitude, setLongitude] = useState('127.38218892099408');
  const [radius, setRadius] = useState('5000');
  const [zoomLevel, setZoomLevel] = useState(14);
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDetectLocation = () => {
    if (navigator?.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude.toFixed(15));
          setLongitude(pos.coords.longitude.toFixed(14));
          showToast('Koordinat GPS Anda berhasil dideteksi!');
        },
        () => {
          showToast('Gagal membaca GPS perangkat. Menggunakan koordinat default.');
        }
      );
    } else {
      showToast('Geolocation tidak didukung oleh browser Anda.');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'cbt_geofence_settings',
        JSON.stringify({ geofencingStatus, latitude, longitude, radius })
      );
    }
    showToast('Pengaturan Geofencing lokasi ujian berhasil disimpan!');
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
          Atur Pembatasan Lokasi Peserta
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Settings */}
        <div className="lg:col-span-6 bg-[#121620] border border-slate-800 rounded-xl p-5 md:p-6 shadow-xl space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-white font-bold text-sm tracking-wide">
            <MapPin className="w-4 h-4 text-rose-500" />
            <span>Pengaturan Geofencing Peserta</span>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            {/* Status Geofencing */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-200">
                Status Geofencing:
              </label>
              <select
                value={geofencingStatus}
                onChange={(e) => setGeofencingStatus(e.target.value as any)}
                className="w-full bg-[#1e2330] border border-slate-700 rounded-lg px-4 py-2.5 text-xs font-medium text-white focus:outline-none focus:border-blue-500"
              >
                <option value="AKTIF">AKTIF (Peserta Wajib di Lokasi)</option>
                <option value="NON_AKTIF">NON-AKTIF (Bebas / Tanpa GPS)</option>
              </select>
              <p className="text-[11px] text-slate-400">
                Jika aktif, siswa hanya bisa login di radius yang ditentukan.
              </p>
            </div>

            {/* Latitude and Longitude Side by Side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-200">
                  Latitude:
                </label>
                <input
                  type="text"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="w-full bg-[#1e2330] border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-200">
                  Longitude:
                </label>
                <input
                  type="text"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="w-full bg-[#1e2330] border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Radius Toleransi (Meter) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-200">
                Radius Toleransi (Meter):
              </label>
              <div className="flex">
                <input
                  type="number"
                  value={radius}
                  onChange={(e) => setRadius(e.target.value)}
                  className="w-full bg-[#1e2330] border border-r-0 border-slate-700 rounded-l-lg px-4 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                />
                <span className="bg-slate-800 border border-slate-700 rounded-r-lg px-4 py-2 text-xs text-slate-300 font-semibold flex items-center">
                  Meter
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Sangat disarankan set minimal 100 meter untuk akurasi GPS HP.
              </p>
            </div>

            {/* Action Buttons matching reference screenshot */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                type="button"
                onClick={handleDetectLocation}
                className="px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <Crosshair className="w-4 h-4" />
                <span>Deteksi Lokasi Saya</span>
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg hover:shadow-blue-500/25 flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Pengaturan</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Preview Map matching reference screenshot */}
        <div className="lg:col-span-6 bg-[#121620] border border-slate-800 rounded-xl p-5 md:p-6 shadow-xl space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wide">
                <Globe2 className="w-4 h-4 text-sky-400" />
                <span>Preview Lokasi</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                Lat: {parseFloat(latitude || '0').toFixed(4)}, Lon:{' '}
                {parseFloat(longitude || '0').toFixed(4)}
              </span>
            </div>

            {/* Map Canvas / Simulated GIS View */}
            <div className="mt-3 relative w-full h-[280px] sm:h-[320px] rounded-xl overflow-hidden border border-slate-700 bg-[#0f172a] shadow-inner select-none">
              {/* Map Grid / Aerial Simulation */}
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-80" />

              {/* Road / Land vectors */}
              <svg className="absolute inset-0 w-full h-full stroke-slate-800/80 fill-none stroke-[2]">
                <line x1="0" y1="80" x2="100%" y2="80" />
                <line x1="0" y1="220" x2="100%" y2="220" />
                <line x1="120" y1="0" x2="120" y2="100%" />
                <line x1="320" y1="0" x2="320" y2="100%" />
                <path d="M 50,0 Q 200,180 400,280" className="stroke-slate-700/60 stroke-[3]" />
              </svg>

              {/* Geofence circular radius wave */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-2 border-dashed border-sky-400 bg-sky-500/10 pointer-events-none animate-pulse flex items-center justify-center">
                <span className="text-[10px] font-mono text-sky-300 font-bold bg-slate-900/80 px-2 py-0.5 rounded border border-sky-500/30">
                  Radius: {radius} m
                </span>
              </div>

              {/* Center Map Pin Marker matching reference */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full flex flex-col items-center group cursor-grab">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-2xl border-2 border-white ring-4 ring-blue-500/40">
                  <MapPin className="w-4 h-4 fill-white" />
                </div>
                <div className="w-2 h-2 bg-blue-600 rotate-45 -mt-1" />
                <span className="mt-1 bg-slate-900/95 text-white text-[10px] font-bold px-2 py-0.5 rounded border border-slate-700 shadow-md whitespace-nowrap">
                  SMA INTEGRAL HIDAYATULLAH
                </span>
              </div>

              {/* Zoom Controls */}
              <div className="absolute top-3 right-3 flex flex-col gap-1 z-10">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(18, z + 1))}
                  className="w-8 h-8 bg-slate-800/90 hover:bg-slate-700 text-white rounded border border-slate-600 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(8, z - 1))}
                  className="w-8 h-8 bg-slate-800/90 hover:bg-slate-700 text-white rounded border border-slate-600 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>

              {/* Watermark / Attribution */}
              <div className="absolute bottom-2 right-2 text-[9px] text-slate-500 font-mono bg-slate-950/80 px-2 py-0.5 rounded">
                Leaflet | © OpenStreetMap contributors
              </div>
            </div>
          </div>

          <div className="pt-2 text-xs text-sky-400 flex items-center gap-2">
            <span className="font-bold">ℹ</span>
            <span>Tips: Geser marker biru untuk menyesuaikan lokasi presisi.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
