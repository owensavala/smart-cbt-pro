'use client';

import React, { useState, useMemo } from 'react';
import {
  Code,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Zap,
  Wand2,
  Trash2,
  Edit2,
  Layers,
  Eye,
  PenTool,
} from 'lucide-react';
import katex from 'katex';

export default function MathStudio() {
  const [activeTab, setActiveTab] = useState<'BASIC' | 'GREEK' | 'MATH OP' | 'RELATIONS' | 'TRIG' | 'MATRIX'>('BASIC');
  const [format, setFormat] = useState<'LaTeX' | 'MathML' | 'AsciiMath'>('LaTeX');
  const [latexCode, setLatexCode] = useState('');
  const [magicPasteInput, setMagicPasteInput] = useState('');
  const [copied, setCopied] = useState(false);

  const insertSymbol = (code: string) => {
    setLatexCode((prev) => (prev ? prev + ' ' + code : code));
  };

  const handleCopy = () => {
    if (!latexCode.trim()) return;
    navigator.clipboard.writeText(latexCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMagicConvert = () => {
    if (!magicPasteInput.trim()) return;
    let converted = magicPasteInput
      .replace(/sqrt\((.*?)\)/g, '\\sqrt{$1}')
      .replace(/([a-zA-Z0-9]+)\/([a-zA-Z0-9]+)/g, '\\frac{$1}{$2}')
      .replace(/\*/g, '\\times ')
      .replace(/<=/g, '\\le ')
      .replace(/>=/g, '\\ge ')
      .replace(/!=/g, '\\ne ')
      .replace(/pi/g, '\\pi ')
      .replace(/theta/g, '\\theta ')
      .replace(/alpha/g, '\\alpha ')
      .replace(/beta/g, '\\beta ')
      .replace(/integral/g, '\\int ');

    setLatexCode((prev) => (prev ? prev + ' ' + converted : converted));
    setMagicPasteInput('');
  };

  // Render KaTeX HTML
  const renderedHtml = useMemo(() => {
    if (!latexCode.trim()) return null;
    try {
      return katex.renderToString(latexCode, {
        displayMode: true,
        throwOnError: false,
      });
    } catch (e: any) {
      return `<span class="text-rose-400 font-mono text-xs">Error parsing LaTeX: ${e?.message || 'Invalid syntax'}</span>`;
    }
  }, [latexCode]);

  const basicSymbols = [
    { symbol: 'x/y', label: 'FRACTION', code: '\\frac{x}{y}' },
    { symbol: 'eˣ', label: 'EXPONENT', code: 'e^{x}' },
    { symbol: '√x', label: 'ROOT', code: '\\sqrt{x}' },
    { symbol: 'lim', label: 'LIMIT', code: '\\lim_{x \\to 0}' },
    { symbol: 'xⁿ', label: 'POWER', code: 'x^{n}' },
    { symbol: 'x₁', label: 'SUBSCRIPT', code: 'x_{1}' },
    { symbol: 'ln', label: 'LN', code: '\\ln(x)' },
    { symbol: '∑', label: 'SIGMA', code: '\\sum_{i=1}^{n}' },
    { symbol: '∏', label: 'PRODUCT', code: '\\prod_{i=1}^{n}' },
    { symbol: '∬', label: 'DBLINTEG', code: '\\iint' },
    { symbol: '∮', label: 'CONTOUR', code: '\\oint' },
    { symbol: '∂', label: 'PARTIAL', code: '\\partial' },
    { symbol: '()', label: 'PARENS', code: '\\left( x \\right)' },
    { symbol: '[]', label: 'BRACKETS', code: '\\left[ x \\right]' },
    { symbol: '{}', label: 'BRACES', code: '\\left\\{ x \\right\\}' },
    { symbol: '(n r)', label: 'BINOM', code: '\\binom{n}{r}' },
    { symbol: 'ẋ', label: 'DOT', code: '\\dot{x}' },
    { symbol: 'x̂', label: 'HAT', code: '\\hat{x}' },
  ];

  const greekSymbols = [
    { symbol: 'α', label: 'ALPHA', code: '\\alpha' },
    { symbol: 'β', label: 'BETA', code: '\\beta' },
    { symbol: 'γ', label: 'GAMMA', code: '\\gamma' },
    { symbol: 'δ', label: 'DELTA', code: '\\delta' },
    { symbol: 'θ', label: 'THETA', code: '\\theta' },
    { symbol: 'λ', label: 'LAMBDA', code: '\\lambda' },
    { symbol: 'μ', label: 'MU', code: '\\mu' },
    { symbol: 'π', label: 'PI', code: '\\pi' },
    { symbol: 'σ', label: 'SIGMA', code: '\\sigma' },
    { symbol: 'ω', label: 'OMEGA', code: '\\omega' },
    { symbol: 'Δ', label: 'CAP DELTA', code: '\\Delta' },
    { symbol: 'Ω', label: 'CAP OMEGA', code: '\\Omega' },
    { symbol: 'φ', label: 'PHI', code: '\\phi' },
    { symbol: 'ψ', label: 'PSI', code: '\\psi' },
    { symbol: 'ρ', label: 'RHO', code: '\\rho' },
    { symbol: 'τ', label: 'TAU', code: '\\tau' },
    { symbol: 'ε', label: 'EPSILON', code: '\\varepsilon' },
    { symbol: '∞', label: 'INFINITY', code: '\\infty' },
  ];

  const mathOpSymbols = [
    { symbol: '±', label: 'PLUS-MINUS', code: '\\pm' },
    { symbol: '×', label: 'TIMES', code: '\\times' },
    { symbol: '÷', label: 'DIVIDE', code: '\\div' },
    { symbol: '·', label: 'CDOT', code: '\\cdot' },
    { symbol: '∘', label: 'COMP', code: '\\circ' },
    { symbol: '∩', label: 'INTERSECT', code: '\\cap' },
    { symbol: '∪', label: 'UNION', code: '\\cup' },
    { symbol: '⊕', label: 'OPLUS', code: '\\oplus' },
    { symbol: '⊗', label: 'OTIMES', code: '\\otimes' },
    { symbol: '∀', label: 'FOR ALL', code: '\\forall' },
    { symbol: '∃', label: 'EXISTS', code: '\\exists' },
    { symbol: '¬', label: 'NOT', code: '\\neg' },
  ];

  const relationSymbols = [
    { symbol: '≤', label: 'LESS EQUAL', code: '\\le' },
    { symbol: '≥', label: 'GREATER EQ', code: '\\ge' },
    { symbol: '≠', label: 'NOT EQUAL', code: '\\ne' },
    { symbol: '≈', label: 'APPROX', code: '\\approx' },
    { symbol: '≡', label: 'EQUIV', code: '\\equiv' },
    { symbol: '∼', label: 'SIMILAR', code: '\\sim' },
    { symbol: '⊂', label: 'SUBSET', code: '\\subset' },
    { symbol: '⊃', label: 'SUPERSET', code: '\\supset' },
    { symbol: '∈', label: 'ELEMENT OF', code: '\\in' },
    { symbol: '∉', label: 'NOT IN', code: '\\notin' },
    { symbol: '∝', label: 'PROPORTIONAL', code: '\\propto' },
    { symbol: '⊥', label: 'PERPENDICULAR', code: '\\perp' },
  ];

  const trigSymbols = [
    { symbol: 'sin', label: 'SINE', code: '\\sin(\\theta)' },
    { symbol: 'cos', label: 'COSINE', code: '\\cos(\\theta)' },
    { symbol: 'tan', label: 'TANGENT', code: '\\tan(\\theta)' },
    { symbol: 'sec', label: 'SECANT', code: '\\sec(\\theta)' },
    { symbol: 'csc', label: 'COSECANT', code: '\\csc(\\theta)' },
    { symbol: 'cot', label: 'COTANGENT', code: '\\cot(\\theta)' },
    { symbol: 'arcsin', label: 'ARCSIN', code: '\\arcsin(x)' },
    { symbol: 'arccos', label: 'ARCCOS', code: '\\arccos(x)' },
    { symbol: 'arctan', label: 'ARCTAN', code: '\\arctan(x)' },
  ];

  const matrixSymbols = [
    { symbol: '(M)', label: 'MATRIKS 2x2', code: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' },
    { symbol: '[M]', label: 'MATRIKS SIKU', code: '\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}' },
    { symbol: '|M|', label: 'DETERMINAN', code: '\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}' },
    { symbol: '3x3', label: 'MATRIKS 3x3', code: '\\begin{pmatrix} a & b & c \\\\ d & e & f \\\\ g & h & i \\end{pmatrix}' },
  ];

  const templates = [
    { title: 'x² Persamaan Kuadrat', code: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}' },
    { title: 'a²+b² Pythagoras', code: 'a^2 + b^2 = c^2' },
    { title: '(a+b)ⁿ Teorema Binomial', code: '(x + y)^n = \\sum_{k=0}^{n} \\binom{n}{k} x^{n-k} y^k' },
    { title: "f' Turunan", code: "\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}" },
    { title: '∫ab Integral Tentu', code: '\\int_{a}^{b} f(x)\\,dx = F(b) - F(a)' },
    { title: 'Σ Deret Taylor', code: 'f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x - a)^n' },
    { title: 'e^iπ Euler', code: 'e^{i\\pi} + 1 = 0' },
    { title: 'sin² Trigonometri', code: '\\sin^2(\\theta) + \\cos^2(\\theta) = 1' },
    { title: 'log Logaritma', code: '\\log_a(b) = \\frac{\\ln(b)}{\\ln(a)}' },
    { title: 'lim Limit', code: '\\lim_{x \\to \\infty} \\left(1 + \\frac{1}{x}\\right)^x = e' },
    { title: '[A] Matriks', code: 'A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' },
    { title: '→v Vektor', code: '\\vec{v} = v_x\\hat{i} + v_y\\hat{j} + v_z\\hat{k}' },
  ];

  return (
    <div className="space-y-4">
      {/* Top Header outside card matching Image 2 */}
      <div className="flex items-center justify-between pb-1">
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Math Studio - Editor Rumus Matematika
        </h1>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          REALTIME
        </span>
      </div>

      {/* Main Purple Gradient Bar matching Image 2 */}
      <div className="bg-gradient-to-r from-[#7c3aed] via-[#6366f1] to-[#4f46e5] rounded-2xl p-5 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold text-2xl shadow-inner">
            ∑
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight leading-none">Math Studio</h2>
            <span className="text-[10px] tracking-wider font-extrabold text-indigo-200 uppercase mt-1 block">
              ULTIMATE MATH CONVERTER
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl border border-white/10">
            <span className="font-bold text-[11px] text-indigo-100">FORMAT:</span>
            <select
              value={format}
              onChange={(e: any) => setFormat(e.target.value)}
              className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
            >
              <option value="LaTeX" className="bg-slate-900 text-white">LaTeX</option>
              <option value="MathML" className="bg-slate-900 text-white">MathML</option>
              <option value="AsciiMath" className="bg-slate-900 text-white">AsciiMath</option>
            </select>
          </div>

          <button
            onClick={handleCopy}
            className="py-2.5 px-5 bg-[#f97316] hover:bg-[#ea580c] text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'BERHASIL DISALIN!' : 'SALIN KODE'}</span>
          </button>
        </div>
      </div>

      {/* 3-Column Work Area matching Image 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* PANEL 1 (Left 4/12): SIMBOL & STRUKTUR */}
        <div className="lg:col-span-4 bg-[#141824] p-4 rounded-2xl border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wide">
            <Layers className="w-4 h-4 text-purple-400" />
            <span>SIMBOL & STRUKTUR</span>
          </div>

          {/* Sub-Tabs matching Image 2 */}
          <div className="flex flex-wrap gap-1 bg-[#10131d] p-1 rounded-xl border border-slate-800 text-[10px] font-bold">
            {(['BASIC', 'GREEK', 'MATH OP', 'RELATIONS', 'TRIG', 'MATRIX'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  activeTab === tab
                    ? 'bg-[#6366f1] text-white font-black shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Grid of Symbol Buttons */}
          <div className="grid grid-cols-3 gap-2 pt-1 max-h-[380px] overflow-y-auto pr-1">
            {activeTab === 'BASIC' &&
              basicSymbols.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => insertSymbol(item.code)}
                  className="p-2.5 bg-[#1a1f30] hover:bg-[#252c42] border border-slate-800 hover:border-indigo-500/50 rounded-xl text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[58px]"
                  title={`Sisipkan ${item.label}`}
                >
                  <span className="font-serif text-sm font-bold text-indigo-300">{item.symbol}</span>
                  <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">
                    {item.label}
                  </span>
                </button>
              ))}

            {activeTab === 'GREEK' &&
              greekSymbols.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => insertSymbol(item.code)}
                  className="p-2.5 bg-[#1a1f30] hover:bg-[#252c42] border border-slate-800 hover:border-indigo-500/50 rounded-xl text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[58px]"
                  title={`Sisipkan ${item.label}`}
                >
                  <span className="font-serif text-sm font-bold text-indigo-300">{item.symbol}</span>
                  <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">
                    {item.label}
                  </span>
                </button>
              ))}

            {activeTab === 'MATH OP' &&
              mathOpSymbols.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => insertSymbol(item.code)}
                  className="p-2.5 bg-[#1a1f30] hover:bg-[#252c42] border border-slate-800 hover:border-indigo-500/50 rounded-xl text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[58px]"
                  title={`Sisipkan ${item.label}`}
                >
                  <span className="font-serif text-sm font-bold text-indigo-300">{item.symbol}</span>
                  <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">
                    {item.label}
                  </span>
                </button>
              ))}

            {activeTab === 'RELATIONS' &&
              relationSymbols.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => insertSymbol(item.code)}
                  className="p-2.5 bg-[#1a1f30] hover:bg-[#252c42] border border-slate-800 hover:border-indigo-500/50 rounded-xl text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[58px]"
                  title={`Sisipkan ${item.label}`}
                >
                  <span className="font-serif text-sm font-bold text-indigo-300">{item.symbol}</span>
                  <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">
                    {item.label}
                  </span>
                </button>
              ))}

            {activeTab === 'TRIG' &&
              trigSymbols.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => insertSymbol(item.code)}
                  className="p-2.5 bg-[#1a1f30] hover:bg-[#252c42] border border-slate-800 hover:border-indigo-500/50 rounded-xl text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[58px]"
                  title={`Sisipkan ${item.label}`}
                >
                  <span className="font-serif text-sm font-bold text-indigo-300">{item.symbol}</span>
                  <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">
                    {item.label}
                  </span>
                </button>
              ))}

            {activeTab === 'MATRIX' &&
              matrixSymbols.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => insertSymbol(item.code)}
                  className="p-2.5 col-span-3 bg-[#1a1f30] hover:bg-[#252c42] border border-slate-800 hover:border-indigo-500/50 rounded-xl text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[58px]"
                  title={`Sisipkan ${item.label}`}
                >
                  <span className="font-serif text-sm font-bold text-indigo-300">{item.symbol}</span>
                  <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">
                    {item.label}
                  </span>
                </button>
              ))}
          </div>
        </div>

        {/* PANEL 2 (Middle 4/12 or 5/12): MAGIC PASTE & EDITOR WORKSPACE */}
        <div className="lg:col-span-4 space-y-4">
          {/* Card: Magic Paste */}
          <div className="bg-[#141824] p-4 rounded-2xl border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wide">
              <PenTool className="w-4 h-4 text-purple-400" />
              <span>MAGIC PASTE (WORD/MATHML/OMML)</span>
            </div>
            <textarea
              rows={3}
              placeholder="Paste Linear Format atau XML Word..."
              value={magicPasteInput}
              onChange={(e) => setMagicPasteInput(e.target.value)}
              className="w-full p-3 bg-[#10131d] border border-slate-800 rounded-xl text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
            <div className="flex justify-end">
              <button
                onClick={handleMagicConvert}
                className="px-5 py-2 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
              >
                KONVERSI
              </button>
            </div>
          </div>

          {/* Card: Editor Workspace */}
          <div className="bg-[#141824] p-4 rounded-2xl border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wide">
                <Code className="w-4 h-4 text-indigo-400" />
                <span>EDITOR WORKSPACE</span>
              </div>
              <button
                onClick={() => setLatexCode('')}
                className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 cursor-pointer transition-colors"
                title="Bersihkan Editor"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>
            <textarea
              rows={5}
              placeholder="Tulis LaTeX di sini..."
              value={latexCode}
              onChange={(e) => setLatexCode(e.target.value)}
              className="w-full p-3 bg-[#10131d] border border-slate-800 rounded-xl text-xs font-mono text-indigo-300 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* PANEL 3 (Right 4/12 or 3/12): LIVE RENDERING */}
        <div className="lg:col-span-4 bg-[#141824] p-4 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wide mb-3">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>LIVE RENDERING</span>
            </div>

            <div className="min-h-[300px] bg-[#10131d] border border-slate-800 rounded-xl p-6 flex items-center justify-center text-center overflow-x-auto">
              {renderedHtml ? (
                <div
                  className="text-white text-lg font-serif"
                  dangerouslySetInnerHTML={{ __html: renderedHtml }}
                />
              ) : (
                <div className="text-slate-500 flex flex-col items-center justify-center gap-2 text-xs">
                  <Edit2 className="w-6 h-6 text-slate-600" />
                  <span>Ketik rumus di editor untuk melihat preview...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM CARD: TEMPLATE CEPAT matching Image 3 */}
      <div className="bg-[#141824] p-4 rounded-2xl border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wide">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>TEMPLATE CEPAT</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {templates.map((tpl, idx) => (
            <button
              key={idx}
              onClick={() => setLatexCode(tpl.code)}
              className="px-3 py-1.5 bg-[#1a1f30] hover:bg-[#252c42] border border-slate-800 hover:border-indigo-500 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs"
            >
              {tpl.title}
            </button>
          ))}
        </div>
      </div>

      {/* Footer matching Image 3 */}
      <div className="pt-4 pb-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
        <span>Copyright &copy; 2026 EL-CBT. All rights reserved.</span>
        <span>Version 3.2.0</span>
      </div>
    </div>
  );
}
