/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  Wallet, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Sparkles, 
  Info,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  Send,
  ExternalLink,
  X
} from 'lucide-react';
import SttNfLogo from './components/Logo';

export default function App() {
  // View states
  const [view, setView] = useState<'welcome' | 'form'>('welcome');

  // Input states
  const [ipk, setIpk] = useState<string>('');
  const [pendapatan, setPendapatan] = useState<string>('');
  
  // Validation states
  const [errors, setErrors] = useState<{ ipk?: string; pendapatan?: string }>({});
  
  // Calculation / Result states
  const [showResult, setShowResult] = useState<boolean>(false);
  const [resultStatus, setResultStatus] = useState<'lolos' | 'tidak_lolos' | null>(null);
  const [resultText, setResultText] = useState<string>('');
  const [calculatedData, setCalculatedData] = useState<{ ipk: number; pendapatan: number } | null>(null);

  // Format Helper for Rupiah Currency
  const formatRupiah = (value: number | string): string => {
    if (!value && value !== 0) return 'Rp 0';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  // Main evaluation logic
  const handleCheckEligibility = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const newErrors: { ipk?: string; pendapatan?: string } = {};
    const ipkVal = parseFloat(ipk);
    const pendapatanVal = parseFloat(pendapatan);
    
    // Validation
    if (!ipk) {
      newErrors.ipk = 'IPK wajib diisi';
    } else if (isNaN(ipkVal)) {
      newErrors.ipk = 'IPK harus diisi dengan angka valid';
    } else if (ipkVal < 0 || ipkVal > 4.00) {
      newErrors.ipk = 'IPK tidak boleh negatif dan tidak boleh lebih dari 4.00';
    }
    
    if (!pendapatan) {
      newErrors.pendapatan = 'Pendapatan orang tua wajib diisi';
    } else if (isNaN(pendapatanVal)) {
      newErrors.pendapatan = 'Pendapatan harus diisi dengan angka valid';
    } else if (pendapatanVal < 0) {
      newErrors.pendapatan = 'Pendapatan orang tua tidak boleh bernilai negatif';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setShowResult(false);
      return;
    }
    
    // Reset errors if inputs are valid
    setErrors({});
    setCalculatedData({ ipk: ipkVal, pendapatan: pendapatanVal });
    
    // Eligibility Criteria & Custom Result Status Texts
    const isIpkValid = ipkVal >= 3.00;
    const isPendapatanValid = pendapatanVal <= 3000000;
    
    if (isIpkValid && isPendapatanValid) {
      setResultStatus('lolos');
      setResultText('Selamat Anda Layak mendapatkan Beasiswa');
    } else if (!isIpkValid && isPendapatanValid) {
      setResultStatus('tidak_lolos');
      setResultText('Maaf IPK Anda Tidak memenuhi Syarat Ketentuan.');
    } else if (isIpkValid && !isPendapatanValid) {
      setResultStatus('tidak_lolos');
      setResultText('Maaf pendapatan orang tua Anda melebihi Syarat Ketentuan.');
    } else {
      setResultStatus('tidak_lolos');
      setResultText('Maaf IPK dan pendapatan Orang Tua anda tidak memenuhi syarat ketentuan');
    }
    
    setShowResult(true);
  };

  // Quick Preset Handlers
  const applyPreset = (presetIpk: string, presetPendapatan: string) => {
    setIpk(presetIpk);
    setPendapatan(presetPendapatan);
    setErrors({});
    setShowResult(false);
    
    // Auto-evaluate immediately for seamless preset testing
    const ipkVal = parseFloat(presetIpk);
    const pendapatanVal = parseFloat(presetPendapatan);
    setCalculatedData({ ipk: ipkVal, pendapatan: pendapatanVal });
    
    const isIpkValid = ipkVal >= 3.00;
    const isPendapatanValid = pendapatanVal <= 3000000;
    
    if (isIpkValid && isPendapatanValid) {
      setResultStatus('lolos');
      setResultText('Selamat Anda Layak mendapatkan Beasiswa');
    } else if (!isIpkValid && isPendapatanValid) {
      setResultStatus('tidak_lolos');
      setResultText('Maaf IPK Anda Tidak memenuhi Syarat Ketentuan.');
    } else if (isIpkValid && !isPendapatanValid) {
      setResultStatus('tidak_lolos');
      setResultText('Maaf pendapatan orang tua Anda melebihi Syarat Ketentuan.');
    } else {
      setResultStatus('tidak_lolos');
      setResultText('Maaf IPK dan pendapatan Orang Tua anda tidak memenuhi syarat ketentuan');
    }
    
    setShowResult(true);
  };

  // Reset form
  const handleReset = () => {
    setIpk('');
    setPendapatan('');
    setErrors({});
    setShowResult(false);
    setResultStatus(null);
    setResultText('');
    setCalculatedData(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans antialiased flex flex-col items-center justify-center p-4 sm:p-6 md:p-10 relative">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_80%,transparent_100%)] pointer-events-none" />
      
      <div className="w-full max-w-[540px] relative z-10 my-8">
        <AnimatePresence mode="wait">
          {view === 'welcome' ? (
            <motion.div
              key="welcome-screen"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-[#F1F5F9] rounded-[24px] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05),0_8px_10px_-6px_rgba(0,0,0,0.05)] overflow-hidden p-8 sm:p-10 text-center flex flex-col items-center space-y-6"
            >
              {/* STT-NF Logo */}
              <SttNfLogo className="h-32 w-32 filter drop-shadow-sm" />

              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight uppercase leading-snug">
                  Selamat Datang
                </h2>
                <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">
                  di Cek Kelayakan Beasiswa
                </p>
              </div>

              <p className="text-[#64748B] text-sm leading-relaxed max-w-sm">
                Portal simulasi interaktif untuk menguji kesesuaian prestasi akademik (IPK) dan profil ekonomi keluarga Anda terhadap kriteria penerimaan beasiswa STT-NF.
              </p>

              <div className="w-full pt-4">
                <button
                  type="button"
                  id="start-simulation-btn"
                  onClick={() => setView('form')}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold rounded-xl shadow-lg shadow-indigo-100 hover:shadow-xl hover:shadow-indigo-200/40 active:scale-[0.99] transition-all cursor-pointer group"
                >
                  <span>Mulai Cek Kelayakan</span>
                  <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
                </button>
              </div>

              {/* Portal Footer */}
              <div className="pt-4 text-[10px] text-[#94A3B8] font-semibold tracking-wider uppercase">
                Portal Layanan Pendidikan &bull; 2026
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form-screen"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Brand / Logo Header */}
              <div className="flex flex-col items-center mb-8 text-center">
                <SttNfLogo className="h-16 w-16 filter drop-shadow-sm mb-3" />
                <h1 className="font-display text-xl sm:text-2xl font-black text-[#0F172A] tracking-wider uppercase">
                  CEK KELAYAKAN BEASISWA
                </h1>
                <p className="text-[#64748B] text-sm mt-1 max-w-sm font-medium">
                  Cek kelayakan pendaftaran secara instan dan mandiri anda disini✨
                </p>
              </div>

              {/* Main Card */}
              <div className="bg-white border border-[#F1F5F9] rounded-[24px] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05),0_8px_10px_-6px_rgba(0,0,0,0.05)] overflow-hidden">
                <div className="p-6 sm:p-8 space-y-6">
                  
                  {/* Input Form */}
                  <form onSubmit={handleCheckEligibility} className="space-y-5">
                    
                    {/* Input IPK */}
                    <div className="form-group">
                      <label htmlFor="ipk-input" className="block text-sm font-semibold text-[#475569] mb-1.5 flex items-center justify-between">
                        <span>Indeks Prestasi Kumulatif (IPK)</span>
                        <span className="text-[#94A3B8] font-mono text-xs font-normal">Skala 0.00 - 4.00</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <TrendingUp className="h-4 w-4 text-[#94A3B8]" />
                        </div>
                        <input
                          type="number"
                          id="ipk-input"
                          step="0.01"
                          min="0"
                          max="4"
                          value={ipk}
                          onChange={(e) => {
                            setIpk(e.target.value);
                            if (errors.ipk) {
                              setErrors(prev => ({ ...prev, ipk: undefined }));
                            }
                          }}
                          placeholder="Contoh: 3.40"
                          className={`w-full font-mono pl-10 pr-4 py-3 bg-white border-2 rounded-xl text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/10 transition-all ${
                            errors.ipk ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/10' : 'border-[#E2E8F0]'
                          }`}
                        />
                      </div>
                      {errors.ipk && (
                        <p id="ipk-error" className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                          {errors.ipk}
                        </p>
                      )}
                    </div>

                    {/* Input Pendapatan */}
                    <div className="form-group">
                      <label htmlFor="pendapatan-input" className="block text-sm font-semibold text-[#475569] mb-1.5 flex items-center justify-between">
                        <span>Pendapatan Orang Tua (Per Bulan)</span>
                        {pendapatan && !errors.pendapatan && (
                          <span className="text-[#6366F1] font-mono font-semibold text-xs">
                            {formatRupiah(pendapatan)}
                          </span>
                        )}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Wallet className="h-4 w-4 text-[#94A3B8]" />
                        </div>
                        <input
                          type="number"
                          id="pendapatan-input"
                          min="0"
                          value={pendapatan}
                          onChange={(e) => {
                            setPendapatan(e.target.value);
                            if (errors.pendapatan) {
                              setErrors(prev => ({ ...prev, pendapatan: undefined }));
                            }
                          }}
                          placeholder="Contoh: 2500000"
                          className={`w-full font-mono pl-10 pr-4 py-3 bg-white border-2 rounded-xl text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/10 transition-all ${
                            errors.pendapatan ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/10' : 'border-[#E2E8F0]'
                          }`}
                        />
                      </div>
                      {errors.pendapatan && (
                        <p id="pendapatan-error" className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                          {errors.pendapatan}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-1">
                      <button
                        type="submit"
                        id="submit-check-btn"
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold rounded-xl shadow-md shadow-indigo-100 hover:shadow-lg hover:shadow-indigo-200/30 active:scale-[0.995] transition-all cursor-pointer group"
                      >
                        <span>Cek Status Kelayakan</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </button>

                      <button
                        type="button"
                        id="back-welcome-btn"
                        onClick={() => {
                          handleReset();
                          setView('welcome');
                        }}
                        className="px-4 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium rounded-xl transition-all cursor-pointer flex items-center justify-center"
                        title="Kembali ke Beranda"
                      >
                        <RotateCcw className="h-5 w-5" />
                      </button>
                    </div>

                  </form>

                </div>
                
                {/* Card Footer */}
                <div className="bg-[#F8FAFC] border-t border-[#F1F5F9] px-6 py-4 flex items-center justify-between text-[10px] text-[#94A3B8] font-semibold tracking-wider uppercase font-sans">
                  <span>Portal Layanan Pendidikan</span>
                  <span>&bull; 2026</span>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal Popup for Eligibility Analysis Result */}
      <AnimatePresence>
        {showResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResult(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.35, bounce: 0.1 }}
              className="bg-white border border-slate-100 rounded-[24px] shadow-2xl overflow-hidden w-full max-w-md relative z-10 mx-auto"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-indigo-500" />
                  Hasil Analisis Kelayakan
                </h3>
                <button
                  onClick={() => setShowResult(false)}
                  className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors cursor-pointer"
                  title="Tutup"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                <div className={`p-5 rounded-xl border transition-all ${
                  resultStatus === 'lolos' 
                    ? 'bg-[#F0FDF4] border-[#BBF7D0]' 
                    : 'bg-[#FEF2F2] border-[#FECACA]'
                }`}>
                  
                  <div className="flex items-start gap-3">
                    {resultStatus === 'lolos' ? (
                      <CheckCircle2 className="h-6 w-6 text-[#166534] flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-6 w-6 text-[#991B1B] flex-shrink-0 mt-0.5" />
                    )}
                    
                    <div className="flex-1 space-y-4">
                      {/* Status */}
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                          Status Kelayakan
                        </p>
                        <p id="output-text" className={`text-base sm:text-lg font-bold leading-snug ${
                          resultStatus === 'lolos' ? 'text-[#166534]' : 'text-[#991B1B]'
                        }`}>
                          {resultText}
                        </p>
                      </div>

                      {/* Breakdown Metrics */}
                      {calculatedData && (
                        <div className="grid grid-cols-2 gap-2.5 pt-2.5 border-t border-slate-200/50">
                          <div>
                            <span className="text-slate-400 text-xs block font-medium">IPK Terbaca</span>
                            <span className="font-mono font-semibold text-slate-800 text-sm">
                              {calculatedData.ipk.toFixed(2)}
                              <span className={`text-[10px] ml-1 font-sans ${calculatedData.ipk >= 3.00 ? 'text-[#166534] font-semibold' : 'text-[#991B1B] font-semibold'}`}>
                                ({calculatedData.ipk >= 3.00 ? '≥ 3.00' : '< 3.00'})
                              </span>
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-xs block font-medium">Pendapatan Terbaca</span>
                            <span className="font-mono font-semibold text-slate-800 text-xs">
                              {formatRupiah(calculatedData.pendapatan)}
                              <span className={`text-[10px] block font-sans ${calculatedData.pendapatan <= 3000000 ? 'text-[#166534] font-semibold' : 'text-[#991B1B] font-semibold'}`}>
                                ({calculatedData.pendapatan <= 3000000 ? '≤ 3Jt' : '> 3Jt'})
                              </span>
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Next Steps */}
                      {resultStatus === 'lolos' ? (
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                            Langkah Selanjutnya
                          </span>
                          <p className="text-sm font-semibold text-emerald-600">
                            Silakan hubungi Admin Telegram
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                            Langkah Selanjutnya
                          </span>
                          <p className="text-sm font-semibold text-red-600">
                            Silahkan Coba dilain Waktu
                          </p>
                        </div>
                      )}

                      {/* Extra Action for Eligible Users */}
                      {resultStatus === 'lolos' && (
                        <div className="pt-1.5">
                          <a
                            href="https://t.me"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#166534] hover:bg-[#14532d] text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
                          >
                            <Send className="h-3 w-3" />
                            <span>Hubungi Admin Telegram</span>
                            <ExternalLink className="h-3 w-3 opacity-80" />
                          </a>
                        </div>
                      )}

                    </div>
                  </div>

                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowResult(false)}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition-colors cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
