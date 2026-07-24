<?php
/**
 * Template Name: Mashud Telecom Frontpage
 *
 * @package Mashud_Telecom
 */

get_header(); ?>

<!-- Immersive Digital Banking Hero Section -->
<section class="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white py-16 md:py-24 relative overflow-hidden">
    <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:16px_16px]"></div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <!-- Hero Left: Strategic Headlines -->
            <div class="lg:col-span-6 space-y-6">
                <span class="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase inline-flex items-center">
                    <span class="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                    Telecom & Mobile Financial Systems
                </span>
                <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-display leading-tight">
                    Smart Fintech <br />
                    <span class="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-400 to-emerald-400">Telecom Banking</span>
                </h1>
                <p class="text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl">
                    Mashud Telecom streamlines high-speed financial transactions, wallet top-ups, send money networks, and direct admin processing. Welcome to professional-grade digital utility banking.
                </p>
                <div class="flex flex-wrap gap-4 pt-2">
                    <div class="flex items-center text-sm text-slate-300">
                        <i data-lucide="shield-check" class="w-5 h-5 text-emerald-400 mr-2"></i> Custom PIN Protections
                    </div>
                    <div class="flex items-center text-sm text-slate-300">
                        <i data-lucide="zap" class="w-5 h-5 text-sky-400 mr-2"></i> Real-time Settlements
                    </div>
                </div>
            </div>

            <!-- Hero Right: 2x2 Core Action Grid Menu -->
            <div class="lg:col-span-6">
                <div class="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl backdrop-blur-sm max-w-md mx-auto">
                    <h2 class="text-xl font-bold mb-1 font-display text-white">System Access Panel</h2>
                    <p class="text-xs text-slate-400 mb-6">Access your respective dashboard or create security credentials below.</p>
                    
                    <div class="grid grid-cols-2 gap-4">
                        
                        <!-- Button 1: User Register -->
                        <a href="<?php echo esc_url( home_url('/user-register/') ); ?>" class="group bg-slate-950 hover:bg-sky-950/30 border border-slate-800 hover:border-sky-500/50 p-4 rounded-xl text-center transition duration-200 block">
                            <div class="bg-sky-500/10 text-sky-400 p-2.5 rounded-lg inline-flex mb-3 transition duration-200 group-hover:scale-110">
                                <i data-lucide="user-plus" class="w-5 h-5"></i>
                            </div>
                            <h3 class="text-sm font-semibold text-white">User Register</h3>
                            <p class="text-[10px] text-slate-500 mt-1">Join as digital client</p>
                        </a>

                        <!-- Button 2: User Login -->
                        <a href="<?php echo esc_url( home_url('/user-login/') ); ?>" class="group bg-slate-950 hover:bg-sky-950/30 border border-slate-800 hover:border-sky-500/50 p-4 rounded-xl text-center transition duration-200 block">
                            <div class="bg-sky-500/10 text-sky-400 p-2.5 rounded-lg inline-flex mb-3 transition duration-200 group-hover:scale-110">
                                <i data-lucide="key-round" class="w-5 h-5"></i>
                            </div>
                            <h3 class="text-sm font-semibold text-white">User Login</h3>
                            <p class="text-[10px] text-slate-500 mt-1">Client secure portal</p>
                        </a>

                        <!-- Button 3: Admin Register -->
                        <a href="<?php echo esc_url( home_url('/admin-register/') ); ?>" class="group bg-slate-950 hover:bg-emerald-950/30 border border-slate-800 hover:border-emerald-500/50 p-4 rounded-xl text-center transition duration-200 block">
                            <div class="bg-emerald-500/10 text-emerald-400 p-2.5 rounded-lg inline-flex mb-3 transition duration-200 group-hover:scale-110">
                                <i data-lucide="shield-alert" class="w-5 h-5"></i>
                            </div>
                            <h3 class="text-sm font-semibold text-white">Admin Register</h3>
                            <p class="text-[10px] text-slate-500 mt-1">Management setup</p>
                        </a>

                        <!-- Button 4: Admin Login -->
                        <a href="<?php echo esc_url( home_url('/admin-login/') ); ?>" class="group bg-slate-950 hover:bg-emerald-950/30 border border-slate-800 hover:border-emerald-500/50 p-4 rounded-xl text-center transition duration-200 block">
                            <div class="bg-emerald-500/10 text-emerald-400 p-2.5 rounded-lg inline-flex mb-3 transition duration-200 group-hover:scale-110">
                                <i data-lucide="fingerprint" class="w-5 h-5"></i>
                            </div>
                            <h3 class="text-sm font-semibold text-white">Admin Login</h3>
                            <p class="text-[10px] text-slate-500 mt-1">Secure command access</p>
                        </a>

                    </div>
                </div>
            </div>

        </div>
    </div>
</section>

<!-- Features Info Grid -->
<section class="py-16 bg-slate-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 mb-12">
        <h2 class="text-3xl font-bold tracking-tight text-slate-950 font-display">Fintech Features Platform</h2>
        <p class="text-slate-600 max-w-2xl mx-auto text-sm">Empowering users with simplified mobile topups and secure administrative oversight.</p>
    </div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div class="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm space-y-4">
            <div class="w-12 h-12 rounded-lg bg-sky-500/10 text-sky-600 flex items-center justify-center">
                <i data-lucide="banknote" class="w-6 h-6"></i>
            </div>
            <h3 class="text-lg font-bold text-slate-900 font-display">Deposit Approvals</h3>
            <p class="text-sm text-slate-500 leading-normal">Fast and reliable deposit request pipelines supporting Bkash, Nagad and Rocket channels under manual admin confirmations.</p>
        </div>

        <div class="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm space-y-4">
            <div class="w-12 h-12 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <i data-lucide="send" class="w-6 h-6"></i>
            </div>
            <h3 class="text-lg font-bold text-slate-900 font-display">Send Money Engine</h3>
            <p class="text-sm text-slate-500 leading-normal">Transfer instantly using internal wallet systems. Recipient wallets load balances synchronously upon approval.</p>
        </div>

        <div class="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm space-y-4">
            <div class="w-12 h-12 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                <i data-lucide="file-spreadsheet" class="w-6 h-6"></i>
            </div>
            <h3 class="text-lg font-bold text-slate-900 font-display">PDF & Excel Reporting</h3>
            <p class="text-sm text-slate-500 leading-normal">Generate detailed user summaries, transactional histories, audit logs, and export database tables instantly.</p>
        </div>

    </div>
</section>

<?php get_footer(); ?>
