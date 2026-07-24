<?php
/**
 * Template Name: Admin Registration Portal
 *
 * @package Mashud_Telecom
 */

get_header(); ?>

<main class="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full bg-white p-8 rounded-2xl shadow-md border border-slate-200">
        <div class="text-center space-y-2 mb-8">
            <div class="bg-emerald-500/10 text-emerald-600 p-3 rounded-full inline-flex">
                <i data-lucide="shield-alert" class="w-6 h-6"></i>
            </div>
            <h1 class="text-2xl font-bold tracking-tight text-slate-900 font-display">Admin Registration</h1>
            <p class="text-xs text-slate-500">Configure corporate command panel access permissions</p>
        </div>

        <form id="admin-register-form" class="space-y-4">
            <div>
                <label for="fullName" class="block text-xs font-semibold uppercase text-slate-600 mb-1">Full Name</label>
                <input type="text" id="fullName" required class="block w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50" placeholder="e.g. Administrator">
            </div>

            <div>
                <label for="email" class="block text-xs font-semibold uppercase text-slate-600 mb-1">Corporate Email</label>
                <input type="email" id="email" required class="block w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50" placeholder="e.g. admin@mashudtelecom.com">
            </div>

            <div>
                <label for="mobile" class="block text-xs font-semibold uppercase text-slate-600 mb-1">Direct Mobile</label>
                <input type="tel" id="mobile" required class="block w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50" placeholder="e.g. +8801...">
            </div>

            <div>
                <label for="password" class="block text-xs font-semibold uppercase text-slate-600 mb-1">Strong Password</label>
                <input type="password" id="password" required class="block w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50" placeholder="••••••••">
            </div>

            <div>
                <label for="adminPin" class="block text-xs font-semibold uppercase text-slate-600 mb-1">6-Digit Confirmation PIN</label>
                <input type="password" id="adminPin" required maxlength="6" class="block w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 font-mono text-center tracking-widest" placeholder="123456">
                <span class="block text-[10px] text-slate-400 mt-1">Required to approve or decline user transactions.</span>
            </div>

            <div id="admin-reg-message" class="text-xs font-medium text-center py-1 hidden"></div>

            <button type="submit" class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition duration-150">
                Register Administrator
            </button>
        </form>

        <div class="text-center mt-6">
            <p class="text-xs text-slate-500">
                Already registered? <a href="<?php echo esc_url( home_url('/admin-login/') ); ?>" class="font-semibold text-emerald-600 hover:text-emerald-500">Admin Login Portal</a>
            </p>
        </div>
    </div>
</main>

<script>
jQuery(document).ready(function($) {
    $('#admin-register-form').on('submit', function(e) {
        e.preventDefault();
        var msg = $('#admin-reg-message');
        msg.removeClass('hidden text-red-500 text-emerald-500').addClass('text-slate-500').text('Generating secure clearance key...');

        $.ajax({
            url: mashud_ajax.ajaxurl,
            type: 'POST',
            data: {
                action: 'mashud_register_admin',
                security: mashud_ajax.nonce,
                fullName: $('#fullName').val(),
                email: $('#email').val(),
                mobile: $('#mobile').val(),
                password: $('#password').val(),
                adminPin: $('#adminPin').val()
            },
            success: function(response) {
                if(response.success) {
                    msg.removeClass('text-slate-500').addClass('text-emerald-600').text(response.data.message);
                    $('#admin-register-form')[0].reset();
                } else {
                    msg.removeClass('text-slate-500').addClass('text-red-500').text(response.data.message);
                }
            }
        });
    });
});
</script>

<?php get_footer(); ?>
