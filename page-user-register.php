<?php
/**
 * Template Name: User Registration Portal
 *
 * @package Mashud_Telecom
 */

get_header(); ?>

<main class="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full bg-white p-8 rounded-2xl shadow-md border border-slate-200">
        <div class="text-center space-y-2 mb-8">
            <div class="bg-sky-500/10 text-sky-600 p-3 rounded-full inline-flex">
                <i data-lucide="user-plus" class="w-6 h-6"></i>
            </div>
            <h1 class="text-2xl font-bold tracking-tight text-slate-900 font-display">Create Account</h1>
            <p class="text-xs text-slate-500">Sign up below for Mashud Telecom wallet portal</p>
        </div>

        <!-- AJAX Form Container -->
        <form id="user-register-form" class="space-y-4">
            
            <div>
                <label for="fullName" class="block text-xs font-semibold uppercase text-slate-600 mb-1">Full Name</label>
                <div class="relative">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                        <i data-lucide="user" class="w-4 h-4"></i>
                    </span>
                    <input type="text" id="fullName" name="fullName" required class="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-sky-500 focus:border-sky-500 bg-slate-50" placeholder="e.g. Mashud Rana">
                </div>
            </div>

            <div>
                <label for="email" class="block text-xs font-semibold uppercase text-slate-600 mb-1">Email Address</label>
                <div class="relative">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                        <i data-lucide="mail" class="w-4 h-4"></i>
                    </span>
                    <input type="email" id="email" name="email" required class="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-sky-500 focus:border-sky-500 bg-slate-50" placeholder="e.g. client@example.com">
                </div>
            </div>

            <div>
                <label for="mobile" class="block text-xs font-semibold uppercase text-slate-600 mb-1">Mobile Number</label>
                <div class="relative">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                        <i data-lucide="smartphone" class="w-4 h-4"></i>
                    </span>
                    <input type="tel" id="mobile" name="mobile" required class="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-sky-500 focus:border-sky-500 bg-slate-50" placeholder="e.g. +8801700000000">
                </div>
            </div>

            <div>
                <label for="password" class="block text-xs font-semibold uppercase text-slate-600 mb-1">Password</label>
                <div class="relative">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                        <i data-lucide="lock" class="w-4 h-4"></i>
                    </span>
                    <input type="password" id="password" name="password" required class="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-sky-500 focus:border-sky-500 bg-slate-50" placeholder="••••••••">
                </div>
            </div>

            <div>
                <label for="confirmPassword" class="block text-xs font-semibold uppercase text-slate-600 mb-1">Confirm Password</label>
                <div class="relative">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                        <i data-lucide="shield-check" class="w-4 h-4"></i>
                    </span>
                    <input type="password" id="confirmPassword" name="confirmPassword" required class="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-sky-500 focus:border-sky-500 bg-slate-50" placeholder="••••••••">
                </div>
            </div>

            <div id="register-message" class="text-xs font-medium text-center py-2 hidden"></div>

            <button type="submit" class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition duration-150">
                Register Account
            </button>
        </form>

        <div class="text-center mt-6">
            <p class="text-xs text-slate-500">
                Already registered? <a href="<?php echo esc_url( home_url('/user-login/') ); ?>" class="font-semibold text-sky-600 hover:text-sky-500">Login Portal</a>
            </p>
        </div>
    </div>
</main>

<script>
jQuery(document).ready(function($) {
    $('#user-register-form').on('submit', function(e) {
        e.preventDefault();
        var msg = $('#register-message');
        msg.removeClass('hidden text-red-500 text-emerald-500').addClass('text-slate-500').text('Validating credential schemas...');

        $.ajax({
            url: mashud_ajax.ajaxurl,
            type: 'POST',
            data: {
                action: 'mashud_register_user',
                security: mashud_ajax.nonce,
                fullName: $('#fullName').val(),
                email: $('#email').val(),
                mobile: $('#mobile').val(),
                password: $('#password').val(),
                confirmPassword: $('#confirmPassword').val()
            },
            success: function(response) {
                if(response.success) {
                    msg.removeClass('text-slate-500').addClass('text-emerald-600').text(response.data.message);
                    $('#user-register-form')[0].reset();
                } else {
                    msg.removeClass('text-slate-500').addClass('text-red-500').text(response.data.message);
                }
            },
            error: function() {
                msg.removeClass('text-slate-500').addClass('text-red-500').text('Security server handshake error.');
            }
        });
    });
});
</script>

<?php get_footer(); ?>
