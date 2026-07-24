/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import CodeExplorer from './components/CodeExplorer';
import LiveSimulation from './components/LiveSimulation';
import { getWordPressThemeFiles } from './wordpressThemeCode';
import { 
  Pocket, 
  Terminal, 
  Laptop, 
  Download, 
  Settings, 
  Users, 
  Database, 
  FileCode, 
  ArrowUpRight, 
  Info, 
  CheckCircle2, 
  Heart 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulation' | 'code'>('simulation');
  const files = getWordPressThemeFiles();

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-800 flex flex-col font-sans relative overflow-x-hidden">
      {/* Decorative Ambient Soft Radial Gradients for premium page transparency on all viewports */}
      <div className="absolute top-0 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-blue-400/10 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute top-1/3 right-1/4 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-emerald-400/5 rounded-full blur-[100px] sm:blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute bottom-10 left-1/3 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-indigo-400/10 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none z-0"></div>

      {/* Top Navigation Bar in High Density Theme */}
      <header className="h-16 bg-blue-900/90 backdrop-blur-md text-white flex items-center justify-between px-4 sm:px-6 shadow-md shrink-0 sticky top-0 z-45 border-b border-blue-800/40 relative">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center">
            <Pocket className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <h1 className="text-sm sm:text-base md:text-lg font-black tracking-tight uppercase text-white">Mashud Telecom Theme Hub</h1>
              <span className="hidden xs:inline-block bg-blue-950/80 text-blue-200 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-700">v1.2</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="hidden md:block text-right mr-2">
            <p className="text-[9px] text-blue-200 uppercase tracking-widest">System Status</p>
            <p className="text-xs font-medium text-emerald-400">Operational • Online</p>
          </div>

          <div className="flex items-center space-x-1 bg-blue-950/50 p-1 rounded-xl border border-blue-800/80">
            <button
              onClick={() => setActiveTab('simulation')}
              className={`px-2 sm:px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold flex items-center space-x-1 sm:space-x-1.5 transition duration-150 cursor-pointer ${
                activeTab === 'simulation'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-blue-200 hover:text-white hover:bg-blue-900/50'
              }`}
            >
              <Laptop className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
              <span>Sandbox</span>
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-2 sm:px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold flex items-center space-x-1 sm:space-x-1.5 transition duration-150 cursor-pointer ${
                activeTab === 'code'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-blue-200 hover:text-white hover:bg-blue-900/50'
              }`}
            >
              <FileCode className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
              <span>Theme Files</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Dashboard Layout */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 py-5 w-full space-y-5 relative z-10">
        
        {/* Intro Info Banner with High Density Card gradient & shapes */}
        <div className="bg-gradient-to-br from-blue-900/90 via-blue-950/85 to-indigo-950/90 text-white rounded-2xl p-5 sm:p-6 border border-blue-800/55 shadow-xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute right-0 top-0 opacity-10 pointer-events-none translate-x-12 -translate-y-12">
            <Terminal className="w-96 h-96" />
          </div>
          {/* Circular decorations from the High Density template */}
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/5 rounded-full"></div>
          <div className="absolute right-8 top-0 w-16 h-16 bg-white/5 rounded-full"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
            <div className="md:col-span-8 space-y-3">
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase inline-flex items-center">
                <CheckCircle2 className="w-3 mr-1" /> Approved Development Environment
              </span>
              <h2 className="text-lg sm:text-xl md:text-2xl font-black tracking-tight leading-tight">
                Complete Native WordPress Theme Scaffolding
              </h2>
              <p className="text-xs text-blue-100 leading-relaxed max-w-2xl">
                We generated all 12 core files required to run <strong className="text-white font-bold">Mashud Telecom</strong> as a premium, fully customized native WordPress theme. It includes custom table schemas via switches, fully hooked jQuery-AJAX endpoints for logins, registrations, forgot-password (OTP), deposit reviews, money transfers, and PDF/Excel spreadsheet reports.
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-3 pt-1">
                <div className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg text-blue-100 text-[10px] flex items-center space-x-1.5">
                  <Database className="w-3 h-3 text-emerald-400" />
                  <span>5 Custom Tables Schema</span>
                </div>
                <div className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg text-blue-100 text-[10px] flex items-center space-x-1.5">
                  <Settings className="w-3 h-3 text-sky-400" />
                  <span>AJAX / REST Endpoints</span>
                </div>
                <div className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg text-blue-100 text-[10px] flex items-center space-x-1.5">
                  <Users className="w-3 h-3 text-indigo-400" />
                  <span>Dual Role Dashboards</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-4 bg-blue-950/40 border border-blue-800/40 rounded-xl p-4 text-blue-200 space-y-3 backdrop-blur-xs">
              <h3 className="text-white text-[10px] font-black uppercase tracking-wider">Scaffolding Statistics</h3>
              <div className="space-y-1.5 text-xs text-left">
                <div className="flex justify-between">
                  <span className="opacity-80">Standard Theme Files:</span>
                  <span className="font-bold text-white">12 Files Compiled</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-80">Language Framework:</span>
                  <span className="font-bold text-emerald-400 font-mono">WordPress PHP</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-80">Design Theme:</span>
                  <span className="font-bold text-sky-300">High Density Slate</span>
                </div>
              </div>
              <button
                onClick={() => {
                  const el = document.getElementById('code-explorer-container');
                  if (el) {
                    setActiveTab('code');
                    setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
                  }
                }}
                className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg flex items-center justify-center space-x-1.5 transition duration-150 cursor-pointer shadow-sm"
              >
                <span>Export Theme Files</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Tab content rendering */}
        <div className="transition-all duration-300">
          {activeTab === 'simulation' ? (
            <div className="space-y-4">
              <div className="bg-blue-50/90 border border-blue-200/60 text-blue-900 rounded-xl p-3.5 flex items-start space-x-3 text-xs leading-normal shadow-xs backdrop-blur-sm">
                <Info className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                <div className="text-left">
                  <span className="font-black uppercase text-[10px] tracking-wider text-blue-800 block mb-1">Sandbox System Access Guide</span>
                  Below is a running, live-simulated prototype representing the active theme frontend. Pre-loaded accounts include Client: <code className="bg-blue-100/80 px-1 py-0.5 rounded text-[10px] font-mono">masud@gmail.com</code> (pass: <code className="bg-blue-100/80 px-1 py-0.5 rounded text-[10px] font-mono">123456</code>) and Admin: <code className="bg-blue-100/80 px-1 py-0.5 rounded text-[10px] font-mono">admin@mashudtelecom.com</code> (pass: <code className="bg-blue-100/80 px-1 py-0.5 rounded text-[10px] font-mono">demo123</code>, PIN: <code className="bg-blue-100/80 px-1 py-0.5 rounded text-[10px] font-mono">258096</code>). Submit deposit requests, approve transactions, search users, and export reports instantly!
                </div>
              </div>
              <LiveSimulation />
            </div>
          ) : (
            <CodeExplorer />
          )}
        </div>

      </main>

      {/* Footer Status Bar matching High Density Design HTML */}
      <footer className="h-10 bg-slate-800/90 text-slate-400 px-6 flex items-center justify-between text-[10px] uppercase font-bold tracking-widest shrink-0 border-t border-slate-700/80 select-none backdrop-blur-sm">
        <div className="flex space-x-4">
          <span>Version 1.2.0-STABLE</span>
          <span className="text-emerald-500">● Database Connected</span>
        </div>
        <div className="flex space-x-4 items-center">
          <span className="flex items-center gap-1">Designed with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for magraphice</span>
        </div>
      </footer>
    </div>
  );
}
