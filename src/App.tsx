/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import LiveSimulation from './components/LiveSimulation';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-800 flex flex-col font-sans relative overflow-x-hidden">
      {/* Decorative Ambient Soft Radial Gradients */}
      <div className="absolute top-0 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-blue-400/10 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute top-1/3 right-1/4 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-emerald-400/5 rounded-full blur-[100px] sm:blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute bottom-10 left-1/3 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-indigo-400/10 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none z-0"></div>

      {/* Main Web App / Mobile App Container */}
      <main className="flex-grow w-full relative z-10 p-0 md:p-4">
        <LiveSimulation />
      </main>
    </div>
  );
}
