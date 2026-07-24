<?php
/**
 * Template Name: Admin Login Portal
 *
 * @package Mashud_Telecom
 */

get_header(); ?>

<main class="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full bg-white p-8 rounded-2xl shadow-md border border-slate-200 space-y-6">
        
        <div class="text-center space-y-2">
            <div class="bg-emerald-500/10 text-emerald-600 p-3 rounded-full inline-flex">
                <i data-lucide="fingerprint" class="w-6 h-6"></i>
            </div>
            <h1 class="text-2xl font-bold tracking-tight text-slate-900 font-display">Admin Core Login</h1>
            <p class="text-xs text-slate-500">Provide credentials to load supervisor logs and settings</p>
        </div>

        <form id="admin-login-form" class="space-y-4">
            <div>
                <label for="admin-email" class="block text-xs font-semibold uppercase text-slate-600 mb-1">Corporate Email</label>
                <div class="relative">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                        <i data-lucide="mail" class="w-4 h-4"></i>
                    </span>
                    <input type="email" id="admin-email" name="email" required class="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50" placeholder="admin@mashudtelecom.com">
                </div>
            </div>

            <div>
                <label for="admin-password" class="block text-xs font-semibold uppercase text-slate-600 mb-1">Password</label>
                <div class="relative">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                        <i data-lucide="lock" class="w-4 h-4"></i>
                    </span>
                    <input type="password" id="admin-password" name="password" required class="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50" placeholder="••••••••">
                </div>
            </div>

            <div id="admin-login-message" class="text-xs font-medium text-center py-1 hidden"></div>

            <button type="submit" class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition duration-150">
                Authenticate Admin
            </button>
        </form>

        <div class="text-center">
            <p class="text-xs text-slate-500">
                Need manager credentials? <a href="<?php echo esc_url( home_url('/admin-register/') ); ?>" class="font-semibold text-emerald-600 hover:text-emerald-500">Register Admin</a>
            </p>
        </div>
    </div>
</main>

<script>
jQuery(document).ready(function($) {
    $('#admin-login-form').on('submit', function(e) {
        e.preventDefault();
        var msg = $('#admin-login-message');
        msg.removeClass('hidden text-red-500 text-emerald-500').addClass('text-slate-500').text('Loading security credentials...');

        $.ajax({
            url: mashud_ajax.ajaxurl,
            type: 'POST',
            data: {
                action: 'mashud_login_admin',
                security: mashud_ajax.nonce,
                email: $('#admin-email').val(),
                password: $('#admin-password').val()
            },
            success: function(response) {
                if(response.success) {
                    msg.removeClass('text-slate-500').addClass('text-emerald-600').text(response.data.message);
                    window.location.href = response.data.redirect;
                } else {
                    msg.removeClass('text-slate-500').addClass('text-red-500').text(response.data.message);
                }
            }
        });
    });
});
</script>

<?php get_footer(); ?>
