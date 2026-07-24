/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { getWordPressThemeFiles } from '../wordpressThemeCode';
import { WPThemeFile } from '../types';
import { FileCode, Copy, Check, Download, Info, Code, FileText } from 'lucide-react';
import JSZip from 'jszip';

export default function CodeExplorer() {
  const files = getWordPressThemeFiles();
  const [selectedFile, setSelectedFile] = useState<WPThemeFile>(files[0]);
  const [copied, setCopied] = useState<boolean>(false);
  const [zipping, setZipping] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');

  const filteredFiles = files.filter(f => 
    f.name.toLowerCase().includes(search.toLowerCase()) || 
    f.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setZipping(true);
      const zip = new JSZip();
      
      // Optimized for direct WordPress theme uploads. Theme files are placed
      // directly at the root of the ZIP. When uploaded, WordPress extracts
      // them into a 'mashud-telecom' directory automatically.
      
      // Add all theme files at the root of the ZIP
      files.forEach(file => {
        zip.file(file.path, file.code);
      });

      // Create readme at the root
      zip.file('README.txt', `Theme Name: Mashud Telecom\nAuthor: magraphice\nVersion: 1.0.0\nDescription: Installable modern digital banking WordPress Theme code package.\n\nInstructions:\n1. Upload this zip file through WordPress Appearance -> Themes -> Add New -> Upload.\n2. Activate the theme.\n3. Create pages and assign templates: User Register, User Login, Admin Register, Admin Login, Client Dashboard, and Admin Dashboard.`);
      
      // Add empty javascript folder structure at the root
      const jsFolder = zip.folder('js');
      if (jsFolder) {
        jsFolder.file('custom-ajax.js', `/* jQuery AJAX scripts for Mashud Telecom Theme */\njQuery(document).ready(function($) {\n    console.log("Mashud Telecom Core Security System Loaded Synchronously");\n});`);
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'mashud-telecom.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Zip packing failure. Please check browser permissions.');
    } finally {
      setZipping(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="code-explorer-container">
      {/* Left Sidebar: File list (4 Cols) */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-950 font-sans tracking-tight text-lg">Theme Files ({files.length})</h3>
            <span className="bg-sky-50 text-sky-700 text-xs px-2.5 py-1 rounded-full font-semibold">Active Scaffolding</span>
          </div>
          
          <p className="text-xs text-slate-500 leading-normal">
            Click any file below to inspect, review custom SQL databases, secure AJAX hooks, or copy source segments.
          </p>

          <input 
            type="text" 
            placeholder="Search theme files..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />

          <div className="space-y-1 max-h-[420px] overflow-y-auto pr-1">
            {filteredFiles.map((file) => {
              const isSelected = selectedFile.name === file.name;
              return (
                <button
                  key={file.name}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-3.5 py-3 rounded-xl flex items-start space-x-3 transition duration-150 ${
                    isSelected 
                      ? 'bg-sky-50 border border-sky-100 text-sky-950' 
                      : 'hover:bg-slate-50 border border-transparent text-slate-600'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-sky-500/15 text-sky-600' : 'bg-slate-100 text-slate-500'}`}>
                    {file.name.endsWith('.css') ? <FileText className="w-4 h-4" /> : <FileCode className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs font-semibold font-mono truncate">{file.name}</span>
                    <span className="block text-[10px] text-slate-400 truncate mt-0.5">{file.description}</span>
                  </div>
                </button>
              );
            })}
            {filteredFiles.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-6">No matching files found.</p>
            )}
          </div>

          <button
            onClick={handleDownloadZip}
            disabled={zipping}
            className="w-full mt-4 flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white text-xs font-semibold py-3 px-4 rounded-xl transition duration-150 shadow-sm cursor-pointer"
          >
            <Download className={`w-4 h-4 ${zipping ? 'animate-bounce' : ''}`} />
            <span>{zipping ? 'Compiling Theme ZIP...' : 'Download Full Theme (.zip)'}</span>
          </button>
        </div>

        <div className="bg-slate-900 text-slate-400 p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-white">
            <Info className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider">WP Integration Guidelines</h4>
          </div>
          <ul className="space-y-2 text-[11px] leading-relaxed">
            <li className="bg-emerald-950/40 border border-emerald-900/50 rounded-xl p-2.5 text-emerald-400 mb-2">
              <strong className="text-white block mb-0.5 text-xs font-sans">✓ Optimized ZIP Structure:</strong>
              We have compiled the theme ZIP with files at the root. This is 100% compatible with WordPress theme uploads and prevents the <code className="bg-emerald-900/80 text-white px-1 py-0.5 rounded text-[9px]">style.css is missing</code> error.
            </li>
            <li>
              <strong className="text-white">Custom Tables:</strong> Tables for user sessions, logs, and deposits are initialized automatically on theme switch using WordPress <code className="bg-slate-800 text-emerald-300 px-1 py-0.5 rounded text-[10px]">dbDelta</code>.
            </li>
            <li>
              <strong className="text-white">AJAX Hooking:</strong> Endpoints register on both <code className="bg-slate-800 text-emerald-300 px-1 py-0.5 rounded text-[10px]">wp_ajax_</code> (auth only) and <code className="bg-slate-800 text-emerald-300 px-1 py-0.5 rounded text-[10px]">wp_ajax_nopriv_</code> (public) hooks.
            </li>
            <li>
              <strong className="text-white">Custom Templates:</strong> Dashboards and signups are mapped to WordPress Custom Page Templates. Create pages in WP-Admin and set their template properties to matching files.
            </li>
          </ul>
        </div>
      </div>

      {/* Right Content Area: Code Viewer (8 Cols) */}
      <div className="lg:col-span-8 flex flex-col h-full bg-slate-950 rounded-2xl border border-slate-800/60 overflow-hidden shadow-lg min-h-[580px]">
        {/* Header toolbar */}
        <div className="bg-slate-900 px-5 py-3.5 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded font-mono text-[10px] uppercase font-semibold">
              PHP / CSS
            </div>
            <div>
              <span className="text-xs font-bold text-white font-mono">{selectedFile.path}</span>
              <span className="block text-[10px] text-slate-400">{selectedFile.description}</span>
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-800 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-800 flex items-center space-x-2 transition duration-150 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 text-[11px]">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="text-[11px]">Copy Source</span>
              </>
            )}
          </button>
        </div>

        {/* Code Content */}
        <div className="flex-grow p-5 overflow-auto max-h-[580px] font-mono text-xs text-slate-300 leading-relaxed bg-slate-950/95 scrollbar-thin">
          <pre className="whitespace-pre overflow-x-auto select-text selection:bg-sky-500/30">
            <code>{selectedFile.code}</code>
          </pre>
        </div>

        {/* Bottom stats bar */}
        <div className="bg-slate-900 border-t border-slate-800 px-5 py-3 flex justify-between items-center text-[10px] text-slate-500 font-mono">
          <span>File size: ~{Math.round(selectedFile.code.length / 100) / 10} KB</span>
          <span>Lines: {selectedFile.code.split('\n').length} lines</span>
          <span className="text-emerald-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
            Production Ready Code
          </span>
        </div>
      </div>
    </div>
  );
}
