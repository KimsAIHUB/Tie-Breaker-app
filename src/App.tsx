/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scale, 
  Table as TableIcon, 
  Zap, 
  Loader2, 
  ChevronRight, 
  Plus, 
  Minus, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  AlertTriangle,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { analyzeDecision, type AnalysisType, type AnalysisResult } from './services/geminiService';
import { cn } from './lib/utils';

export default function App() {
  const [decision, setDecision] = useState('');
  const [type, setType] = useState<AnalysisType>('pros-cons');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!decision.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeDecision(decision, type);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze decision. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A] font-sans selection:bg-[#1A1A1A] selection:text-white">
      {/* Header */}
      <header className="border-b border-[#E5E5E5] bg-white sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1A1A1A] flex items-center justify-center rounded-sm">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold tracking-tight uppercase">The Tiebreaker</h1>
          </div>
          <div className="text-[10px] font-mono uppercase tracking-widest opacity-50 hidden sm:block">
            AI-Powered Decision Engine v1.0
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Input Section */}
          <div className="lg:col-span-5 space-y-8">
            <section>
              <h2 className="text-xs font-mono uppercase tracking-widest opacity-50 mb-4">01. The Decision</h2>
              <div className="relative group">
                <textarea
                  value={decision}
                  onChange={(e) => setDecision(e.target.value)}
                  placeholder="Should I move to a new city? / Compare MacBook Pro vs Dell XPS..."
                  className="w-full h-40 p-6 bg-white border border-[#E5E5E5] focus:border-[#1A1A1A] outline-none transition-all resize-none text-lg leading-relaxed shadow-sm group-hover:shadow-md"
                />
                <div className="absolute bottom-4 right-4 text-[10px] font-mono opacity-30">
                  {decision.length} characters
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xs font-mono uppercase tracking-widest opacity-50 mb-4">02. Analysis Mode</h2>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { id: 'pros-cons', label: 'Pros & Cons', icon: Scale, desc: 'Balanced list of advantages and disadvantages' },
                  { id: 'comparison', label: 'Comparison Table', icon: TableIcon, desc: 'Side-by-side feature comparison' },
                  { id: 'swot', label: 'SWOT Analysis', icon: Zap, desc: 'Strengths, Weaknesses, Opportunities, Threats' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setType(mode.id as AnalysisType)}
                    className={cn(
                      "flex items-start gap-4 p-4 border transition-all text-left group",
                      type === mode.id 
                        ? "bg-[#1A1A1A] border-[#1A1A1A] text-white shadow-lg translate-x-1" 
                        : "bg-white border-[#E5E5E5] hover:border-[#1A1A1A] hover:translate-x-1"
                    )}
                  >
                    <mode.icon className={cn("w-5 h-5 mt-0.5", type === mode.id ? "text-white" : "text-[#1A1A1A]")} />
                    <div>
                      <div className="font-bold text-sm uppercase tracking-tight">{mode.label}</div>
                      <div className={cn("text-xs opacity-60", type === mode.id ? "text-white/70" : "")}>{mode.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <button
              onClick={handleAnalyze}
              disabled={loading || !decision.trim()}
              className="w-full py-4 bg-[#1A1A1A] text-white font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  Generate Analysis
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-7">
            <h2 className="text-xs font-mono uppercase tracking-widest opacity-50 mb-4">03. Output</h2>
            <div className="min-h-[400px] bg-white border border-[#E5E5E5] p-8 relative shadow-sm">
              <AnimatePresence mode="wait">
                {!result && !loading && !error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20"
                  >
                    <div className="w-16 h-16 bg-[#F5F5F5] rounded-full flex items-center justify-center">
                      <Scale className="w-8 h-8 opacity-20" />
                    </div>
                    <div>
                      <p className="font-bold uppercase tracking-tight text-sm">Awaiting Input</p>
                      <p className="text-xs opacity-50 max-w-[200px] mx-auto mt-1">Provide a decision and select a mode to begin analysis.</p>
                    </div>
                  </motion.div>
                )}

                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center text-center space-y-6 py-20"
                  >
                    <div className="relative">
                      <div className="w-12 h-12 border-2 border-[#E5E5E5] rounded-full" />
                      <div className="w-12 h-12 border-2 border-t-[#1A1A1A] border-transparent rounded-full absolute top-0 animate-spin" />
                    </div>
                    <div className="space-y-2">
                      <p className="font-bold uppercase tracking-tight text-sm animate-pulse">Processing Data</p>
                      <div className="flex gap-1 justify-center">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ opacity: [0.2, 1, 0.2] }}
                            transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                            className="w-1 h-1 bg-[#1A1A1A] rounded-full"
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20 text-red-500"
                  >
                    <AlertTriangle className="w-12 h-12" />
                    <p className="font-bold uppercase tracking-tight text-sm">{error}</p>
                    <button onClick={handleAnalyze} className="text-xs underline uppercase tracking-widest font-bold">Try Again</button>
                  </motion.div>
                )}

                {result && !loading && (
                  <motion.div
                    key={result.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    <header className="border-b border-[#F5F5F5] pb-6">
                      <h3 className="text-2xl font-bold tracking-tight leading-tight">{result.title}</h3>
                      <p className="text-sm opacity-60 mt-2 leading-relaxed">{result.summary}</p>
                    </header>

                    {type === 'pros-cons' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-green-600">
                            <Plus className="w-4 h-4" />
                            <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Pros</span>
                          </div>
                          <ul className="space-y-3">
                            {result.data.pros.map((pro: string, i: number) => (
                              <motion.li 
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                key={i} 
                                className="text-sm flex gap-3 leading-relaxed"
                              >
                                <span className="opacity-20 font-mono text-[10px] mt-1">{String(i + 1).padStart(2, '0')}</span>
                                {pro}
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-red-600">
                            <Minus className="w-4 h-4" />
                            <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Cons</span>
                          </div>
                          <ul className="space-y-3">
                            {result.data.cons.map((con: string, i: number) => (
                              <motion.li 
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                key={i} 
                                className="text-sm flex gap-3 leading-relaxed"
                              >
                                <span className="opacity-20 font-mono text-[10px] mt-1">{String(i + 1).padStart(2, '0')}</span>
                                {con}
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {type === 'comparison' && (
                      <div className="overflow-x-auto -mx-8 px-8">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-[#E5E5E5]">
                              {result.data.headers.map((header: string, i: number) => (
                                <th key={i} className="py-4 pr-4 text-[10px] font-mono uppercase tracking-widest opacity-50 font-bold">
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#F5F5F5]">
                            {result.data.rows.map((row: string[], i: number) => (
                              <tr key={i} className="group hover:bg-[#F9F9F9] transition-colors">
                                {row.map((cell: string, j: number) => (
                                  <td key={j} className={cn(
                                    "py-4 pr-4 text-sm leading-relaxed",
                                    j === 0 ? "font-bold" : "opacity-80"
                                  )}>
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {type === 'swot' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#E5E5E5] border border-[#E5E5E5]">
                        {[
                          { label: 'Strengths', key: 'strengths', icon: TrendingUp, color: 'text-green-600' },
                          { label: 'Weaknesses', key: 'weaknesses', icon: TrendingDown, color: 'text-red-600' },
                          { label: 'Opportunities', key: 'opportunities', icon: Target, color: 'text-blue-600' },
                          { label: 'Threats', key: 'threats', icon: AlertTriangle, color: 'text-orange-600' },
                        ].map((quadrant) => (
                          <div key={quadrant.key} className="bg-white p-6 space-y-4">
                            <div className={cn("flex items-center gap-2", quadrant.color)}>
                              <quadrant.icon className="w-4 h-4" />
                              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">{quadrant.label}</span>
                            </div>
                            <ul className="space-y-2">
                              {result.data[quadrant.key].map((item: string, i: number) => (
                                <li key={i} className="text-xs leading-relaxed opacity-80 flex gap-2">
                                  <span className="opacity-30">•</span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}

                    <footer className="pt-8 flex justify-between items-center">
                      <div className="text-[10px] font-mono opacity-30">
                        ANALYSIS COMPLETED AT {new Date().toLocaleTimeString()}
                      </div>
                      <button 
                        onClick={() => setResult(null)}
                        className="text-[10px] font-mono uppercase tracking-widest font-bold flex items-center gap-2 hover:opacity-50 transition-opacity"
                      >
                        <RefreshCw className="w-3 h-3" />
                        New Analysis
                      </button>
                    </footer>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-5xl mx-auto px-6 py-12 border-t border-[#E5E5E5] mt-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-tight">The Tiebreaker</p>
            <p className="text-[10px] opacity-40">Helping you make better decisions, one analysis at a time.</p>
          </div>
          <div className="flex gap-6 text-[10px] font-mono uppercase tracking-widest opacity-40">
            <a href="#" className="hover:opacity-100">Privacy</a>
            <a href="#" className="hover:opacity-100">Terms</a>
            <a href="#" className="hover:opacity-100">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

