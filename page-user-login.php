<?php
/**
 * Template Name: User Login Portal
 *
 * @package Mashud_Telecom
 */

get_header(); ?>

<main class="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full bg-white p-8 rounded-2xl shadow-md border border-slate-200 space-y-6">
        
        <div class="text-center space-y-2">
            <div class="bg-sky-500/10 text-sky-600 p-3 rounded-full inline-flex">
                <i data-lucide="key-round" class="w-6 h-6"></i>
            </div>
            <h1 class="text-2xl font-bold tracking-tight text-slate-900 font-display">Client Login</h1>
            <p class="text-xs text-slate-500">Access your digital wallet using email or mobile number</p>
        </div>

        <form id="user-login-form" class="space-y-4">
            <div>
                <label for="username" class="block text-xs font-semibold uppercase text-slate-600 mb-1">Email or Mobile</label>
                <div class="relative">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                        <i data-lucide="user" class="w-4 h-4"></i>
                    </span>
                    <input type="text" id="username" name="username" required class="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50" placeholder="email@example.com or +8801...">
                </div>
            </div>

            <div>
                <div class="flex justify-between items-center mb-1">
                    <label for="password" class="block text-xs font-semibold uppercase text-slate-600">Password</label>
                    <button type="button" id="trigger-forgot" class="text-xs font-medium text-sky-600 hover:text-sky-500">Forgot Password?</button>
                </div>
                <div class="relative">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                        <i data-lucide="lock" class="w-4 h-4"></i>
                    </span>
                    <input type="password" id="password" name="password" required class="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50" placeholder="••••••••">
                </div>
            </div>

            <div id="login-message" class="text-xs font-medium text-center py-1 hidden"></div>

            <button type="submit" class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 transition duration-150">
                Log In Securely
            </button>
        </form>

        <!-- Forgot Password Modal Segment -->
        <div id="forgot-modal" class="hidden border-t border-slate-100 pt-6 space-y-4">
            <h3 class="text-sm font-semibold text-slate-800">Restore Password Access via OTP</h3>
            <div id="forgot-step-1" class="space-y-3">
                <input type="email" id="forgot-email" class="block w-full p-2 border border-slate-300 rounded-lg text-sm bg-slate-50" placeholder="Registered email address">
                <button type="button" id="send-otp-btn" class="w-full py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800">Send OTP</button>
            </div>
            
            <div id="forgot-step-2" class="hidden space-y-3">
                <p class="text-[10px] text-slate-500">Verify OTP code and set your updated system password.</p>
                <input type="text" id="otp-code" class="block w-full p-2 border border-slate-300 rounded-lg text-sm bg-slate-50" placeholder="Enter 6-digit OTP code">
                <input type="password" id="new-password" class="block w-full p-2 border border-slate-300 rounded-lg text-sm bg-slate-50" placeholder="Brand new secure password">
                <button type="button" id="verify-otp-btn" class="w-full py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-500">Set Password</button>
            </div>
            <div id="forgot-message" class="text-xs text-center font-medium"></div>
        </div>

        <div class="text-center">
            <p class="text-xs text-slate-500">
                Don't have an account? <a href="<?php echo esc_url( home_url('/user-register/') ); ?>" class="font-semibold text-sky-600 hover:text-sky-500">Create Account</a>
            </p>
        </div>
    </div>
</main>

<script>
jQuery(document).ready(function($) {
    // Regular Login
    $('#user-login-form').on('submit', function(e) {
        e.preventDefault();
        var msg = $('#login-message');
        msg.removeClass('hidden text-red-500 text-emerald-500').addClass('text-slate-500').text('Authorizing wallet access...');

        $.ajax({
            url: mashud_ajax.ajaxurl,
            type: 'POST',
            data: {
                action: 'mashud_login_user',
                security: mashud_ajax.nonce,
                username: $('#username').val(),
                password: $('#password').val()
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

    // Forgot password modal toggle
    $('#trigger-forgot').on('click', function() {
        $('#forgot-modal').toggleClass('hidden');
    });

    // Send OTP handler
    $('#send-otp-btn').on('click', function() {
        var email = $('#forgot-email').val();
        var fmsg = $('#forgot-message');
        fmsg.text('Requesting reset validation...');
        $.ajax({
            url: mashud_ajax.ajaxurl,
            type: 'POST',
            data: {
                action: 'mashud_forgot_password',
                security: mashud_ajax.nonce,
                email: email
            },
            success: function(response) {
                if(response.success) {
                    fmsg.addClass('text-emerald-600').text(response.data.message);
                    $('#forgot-step-1').addClass('hidden');
                    $('#forgot-step-2').removeClass('hidden');
                } else {
                    fmsg.addClass('text-red-500').text(response.data.message);
                }
            }
        });
    });

    // OTP Verify and set password
    $('#verify-otp-btn').on('click', function() {
        var otp = $('#otp-code').val();
        var newPass = $('#new-password').val();
        var fmsg = $('#forgot-message');
        fmsg.text('Resetting password variables...');
        $.ajax({
            url: mashud_ajax.ajaxurl,
            type: 'POST',
            data: {
                action: 'mashud_verify_otp',
                security: mashud_ajax.nonce,
                otp: otp,
                newPassword: newPass
            },
            success: function(response) {
                if(response.success) {
                    fmsg.removeClass('text-red-500').addClass('text-emerald-600').text(response.data.message);
                    setTimeout(function() {
                        $('#forgot-modal').addClass('hidden');
                        $('#user-login-form')[0].reset();
                    }, 2000);
                } else {
                    fmsg.removeClass('text-emerald-600').addClass('text-red-500').text(response.data.message);
                }
            }
        });
    });
});
</script>

<?php get_footer(); ?>
