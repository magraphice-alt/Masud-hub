<footer class="bg-slate-900 border-t border-slate-800 text-slate-400 py-12 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
                <h3 class="text-white font-bold mb-3 font-display">Mashud Telecom</h3>
                <p class="text-sm text-slate-400 leading-relaxed max-w-sm">
                    Next-generation mobile finance, telecom banking, and seamless wallet transfers. Simple, secure, fast, and compliant.
                </p>
            </div>
            <div>
                <h4 class="text-white font-semibold mb-3 text-sm tracking-wider uppercase">System Gateways</h4>
                <ul class="space-y-2 text-sm">
                    <li><a href="<?php echo esc_url(home_url('/user-login/')); ?>" class="hover:text-white transition duration-150">Customer Login Portal</a></li>
                    <li><a href="<?php echo esc_url(home_url('/user-register/')); ?>" class="hover:text-white transition duration-150">Open Customer Account</a></li>
                    <li><a href="<?php echo esc_url(home_url('/admin-login/')); ?>" class="hover:text-white transition duration-150">Administrator Command</a></li>
                </ul>
            </div>
            <div>
                <h4 class="text-white font-semibold mb-3 text-sm tracking-wider uppercase">Security & Compliance</h4>
                <p class="text-xs text-slate-500 leading-normal mb-3">
                    Mashud Telecom uses 256-bit encryption, strict Admin PIN authorization protocols, and persistent activity logging registers.
                </p>
                <div class="flex space-x-2 text-xs">
                    <span class="bg-emerald-950/40 text-emerald-400 border border-emerald-900 px-2 py-1 rounded">SSL Secure</span>
                    <span class="bg-sky-950/40 text-sky-400 border border-sky-900 px-2 py-1 rounded">PCI Compliant</span>
                </div>
            </div>
        </div>
        <div class="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
            <p>&copy; <?php echo date('Y'); ?> Mashud Telecom. All rights reserved.</p>
            <p class="mt-2 md:mt-0">Developed for magraphice | Secure Core v1.2</p>
        </div>
    </div>
</footer>

<script>
    // Trigger Lucide SVG Icon Rendering across elements
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
</script>

<?php wp_footer(); ?>
</body>
</html>
