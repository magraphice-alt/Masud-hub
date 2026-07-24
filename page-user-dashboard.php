<?php
/**
 * Template Name: Client Dashboard Portal
 *
 * @package Mashud_Telecom
 */

if ( !session_id() ) { session_start(); }
if ( !isset($_SESSION['mashud_user_id']) || $_SESSION['mashud_role'] !== 'user' ) {
    wp_redirect( home_url('/user-login/') );
    exit;
}

get_header();

global $wpdb;
$user_id = $_SESSION['mashud_user_id'];
$user_data = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM {$wpdb->prefix}mashud_users WHERE id = %d", $user_id ) );

// Fetch transactions log
$transactions = $wpdb->get_results( $wpdb->prepare( "SELECT * FROM {$wpdb->prefix}mashud_transactions WHERE user_id = %d ORDER BY created_at DESC LIMIT 10", $user_id ) );

// Fetch notifications log
$notifications = $wpdb->get_results( $wpdb->prepare( "SELECT * FROM {$wpdb->prefix}mashud_notifications WHERE user_id = %d ORDER BY created_at DESC LIMIT 5", $user_id ) );
?>

<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-grow">
    
    <!-- Dashboard Navigation Bar -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 border-b border-slate-200 pb-6">
        <div>
            <h1 class="text-3xl font-bold text-slate-950 font-display">Welcome Back, <?php echo esc_html($user_data->full_name); ?></h1>
            <p class="text-sm text-slate-500">Secure digital banking and telecom transfers</p>
        </div>
        <div class="flex flex-wrap gap-2">
            <!-- Dynamic PDF / Excel Generation triggers -->
            <a href="?export=pdf&user_id=<?php echo $user_id; ?>" target="_blank" class="bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold py-2 px-3 rounded-lg border border-red-200 flex items-center space-x-1">
                <i data-lucide="file-text" class="w-4 h-4"></i>
                <span>Export PDF Report</span>
            </a>
            <a href="?export=excel&user_id=<?php echo $user_id; ?>" target="_blank" class="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold py-2 px-3 rounded-lg border border-emerald-200 flex items-center space-x-1">
                <i data-lucide="file-spreadsheet" class="w-4 h-4"></i>
                <span>Export Excel Report</span>
            </a>
        </div>
    </div>

    <!-- Stats Widget Layout -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- Slate Wallet Balance -->
        <div class="bg-slate-950 text-white rounded-2xl p-6 border border-slate-800 flex items-center justify-between shadow-md relative overflow-hidden">
            <div class="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-4 translate-y-4">
                <i data-lucide="wallet" class="w-48 h-48"></i>
            </div>
            <div class="space-y-1 relative z-10">
                <span class="text-slate-400 text-xs uppercase tracking-wider font-semibold">Available Wallet Balance</span>
                <div class="text-4xl font-bold font-display text-emerald-400"><?php echo number_format($user_data->balance, 2); ?> <span class="text-lg">TK</span></div>
                <span class="text-[10px] text-slate-500 block">System auto-authorized welcome bonus included</span>
            </div>
            <div class="bg-sky-500/10 text-sky-400 p-3 rounded-xl relative z-10">
                <i data-lucide="coins" class="w-8 h-8"></i>
            </div>
        </div>

        <!-- Personal Info Registry -->
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
            <div class="space-y-2">
                <span class="text-slate-500 text-xs uppercase tracking-wider font-semibold">Security Profile Details</span>
                <div class="space-y-1">
                    <p class="text-sm font-semibold text-slate-900"><?php echo esc_html($user_data->email); ?></p>
                    <p class="text-xs text-slate-500">Phone: <?php echo esc_html($user_data->mobile); ?></p>
                </div>
            </div>
            <div class="bg-indigo-50 text-indigo-600 p-3 rounded-xl">
                <i data-lucide="shield" class="w-8 h-8"></i>
            </div>
        </div>

        <!-- Dynamic Account Activity Status -->
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
            <div class="space-y-1">
                <span class="text-slate-500 text-xs uppercase tracking-wider font-semibold">System Clearances</span>
                <div class="text-xl font-bold text-slate-900 font-display">ACTIVE PORTAL</div>
                <span class="text-xs text-slate-500 block">IP: <?php echo esc_html($_SERVER['REMOTE_ADDR']); ?></span>
            </div>
            <div class="bg-emerald-50 text-emerald-600 p-3 rounded-xl">
                <i data-lucide="activity" class="w-8 h-8"></i>
            </div>
        </div>

    </div>

    <!-- Active Features Hub: Operations Forms and Dynamic History Tabs -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- Left: Deposit and Send Money AJAX Handlers (7 Cols) -->
        <div class="lg:col-span-7 space-y-8">
            
            <!-- Deposit Request Form -->
            <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div class="flex items-center space-x-2">
                    <div class="bg-sky-100 text-sky-700 p-2 rounded-lg">
                        <i data-lucide="banknote" class="w-5 h-5"></i>
                    </div>
                    <h2 class="text-lg font-bold text-slate-900 font-display">Wallet Fund Deposit Request</h2>
                </div>
                <form id="deposit-request-form" class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 mb-1">Amount (TK)</label>
                            <input type="number" id="deposit-amount" required class="block w-full p-2 border border-slate-300 rounded-lg text-sm bg-slate-50" placeholder="e.g. 500">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 mb-1">Payment Channel</label>
                            <select id="deposit-method" required class="block w-full p-2 border border-slate-300 rounded-lg text-sm bg-slate-50">
                                <option value="bKash">bKash Personal</option>
                                <option value="Nagad">Nagad Personal</option>
                                <option value="Rocket">Rocket Agent</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-slate-600 mb-1">Transaction Reference No / TxnID</label>
                        <input type="text" id="deposit-reference" required class="block w-full p-2 border border-slate-300 rounded-lg text-sm bg-slate-50 font-mono" placeholder="e.g. TRK9120831">
                    </div>
                    <div id="deposit-message" class="text-xs text-center font-semibold hidden"></div>
                    <button type="submit" class="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm rounded-lg transition duration-150">
                        Submit Deposit Request
                    </button>
                </form>
            </div>

            <!-- Send Money Form -->
            <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div class="flex items-center space-x-2">
                    <div class="bg-emerald-100 text-emerald-700 p-2 rounded-lg">
                        <i data-lucide="send" class="w-5 h-5"></i>
                    </div>
                    <h2 class="text-lg font-bold text-slate-900 font-display">Send Money Transfer</h2>
                </div>
                <form id="send-money-form" class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 mb-1">Recipient Mobile</label>
                            <input type="tel" id="send-recipient" required class="block w-full p-2 border border-slate-300 rounded-lg text-sm bg-slate-50" placeholder="+8801...">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 mb-1">Transfer Amount (TK)</label>
                            <input type="number" id="send-amount" required class="block w-full p-2 border border-slate-300 rounded-lg text-sm bg-slate-50" placeholder="e.g. 200">
                        </div>
                    </div>
                    <div id="send-message" class="text-xs text-center font-semibold hidden"></div>
                    <button type="submit" class="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg transition duration-150">
                        Initiate Money Transfer
                    </button>
                </form>
            </div>

        </div>

        <!-- Right: Recent Activity logs & Notifications (5 Cols) -->
        <div class="lg:col-span-5 space-y-8">
            
            <!-- Realtime Bulletins and Notifications -->
            <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h2 class="text-base font-bold text-slate-900 font-display">System Notifications</h2>
                <div class="space-y-3">
                    <?php if ( !empty($notifications) ) : ?>
                        <?php foreach ( $notifications as $notif ) : ?>
                            <div class="p-3 bg-slate-50 border-l-4 border-sky-500 rounded-r-lg space-y-1">
                                <h4 class="text-xs font-bold text-slate-900"><?php echo esc_html($notif->title); ?></h4>
                                <p class="text-[10px] text-slate-500 leading-normal"><?php echo esc_html($notif->message); ?></p>
                                <span class="block text-[8px] text-slate-400 font-mono"><?php echo esc_html($notif->created_at); ?></span>
                            </div>
                        <?php endforeach; ?>
                    <?php else : ?>
                        <p class="text-xs text-slate-400">No recent notifications received.</p>
                    <?php endif; ?>
                </div>
            </div>

            <!-- Profile Parameters Form Setup -->
            <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h2 class="text-base font-bold text-slate-900 font-display">Security Settings</h2>
                <form id="settings-form" class="space-y-4">
                    <div>
                        <label class="block text-[10px] font-bold text-slate-500 uppercase">Update Display Name</label>
                        <input type="text" id="settings-name" value="<?php echo esc_attr($user_data->full_name); ?>" required class="block w-full p-2 border border-slate-300 rounded-lg text-sm bg-slate-50 mt-1">
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-slate-500 uppercase">New Security Password</label>
                        <input type="password" id="settings-pass" class="block w-full p-2 border border-slate-300 rounded-lg text-sm bg-slate-50 mt-1" placeholder="Leave blank to keep current">
                    </div>
                    <div id="settings-message" class="text-xs text-center font-medium hidden"></div>
                    <button type="submit" class="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg">
                        Save Configurations
                    </button>
                </form>
            </div>

        </div>

    </div>

    <!-- Bottom: Master Transaction Log Grid -->
    <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 class="text-lg font-bold text-slate-900 font-display">Recent Transactions</h2>
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200 text-sm">
                <thead>
                    <tr class="text-xs text-slate-400 uppercase text-left">
                        <th class="py-3 font-semibold">Reference</th>
                        <th class="py-3 font-semibold">Action</th>
                        <th class="py-3 font-semibold">Amount (TK)</th>
                        <th class="py-3 font-semibold">Recipient</th>
                        <th class="py-3 font-semibold">Clearance Status</th>
                        <th class="py-3 font-semibold">Time UTC</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 font-medium text-slate-700">
                    <?php if ( !empty($transactions) ) : ?>
                        <?php foreach ( $transactions as $txn ) : ?>
                            <tr>
                                <td class="py-3 font-mono text-xs"><?php echo esc_html($txn->reference_no); ?></td>
                                <td class="py-3">
                                    <span class="capitalize text-xs font-semibold"><?php echo str_replace('_', ' ', $txn->type); ?></span>
                                </td>
                                <td class="py-3 font-bold"><?php echo number_format($txn->amount, 2); ?></td>
                                <td class="py-3 text-xs text-slate-500"><?php echo $txn->recipient_mobile ? esc_html($txn->recipient_mobile) : '-'; ?></td>
                                <td class="py-3">
                                    <?php if ( $txn->status === 'approved' ) : ?>
                                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">Approved</span>
                                    <?php elseif ( $txn->status === 'rejected' ) : ?>
                                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-800">Rejected</span>
                                    <?php else : ?>
                                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">Awaiting Approval</span>
                                    <?php endif; ?>
                                </td>
                                <td class="py-3 text-xs text-slate-400 font-mono"><?php echo esc_html($txn->created_at); ?></td>
                            </tr>
                        <?php endforeach; ?>
                    <?php else : ?>
                        <tr>
                            <td colspan="6" class="py-8 text-center text-slate-400 text-xs">No transaction records logged yet.</td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>

</main>

<script>
jQuery(document).ready(function($) {
    // Submit Deposit Request AJAX
    $('#deposit-request-form').on('submit', function(e) {
        e.preventDefault();
        var msg = $('#deposit-message');
        msg.removeClass('hidden text-red-500 text-emerald-500').addClass('text-slate-500').text('Broadcasting secure request parameters...');

        $.ajax({
            url: mashud_ajax.ajaxurl,
            type: 'POST',
            data: {
                action: 'mashud_submit_deposit',
                security: mashud_ajax.nonce,
                amount: $('#deposit-amount').val(),
                method: $('#deposit-method').val(),
                reference: $('#deposit-reference').val()
            },
            success: function(response) {
                if(response.success) {
                    msg.removeClass('text-slate-500').addClass('text-emerald-600').text(response.data.message);
                    $('#deposit-request-form')[0].reset();
                } else {
                    msg.removeClass('text-slate-500').addClass('text-red-500').text(response.data.message);
                }
            }
        });
    });

    // Send Money AJAX
    $('#send-money-form').on('submit', function(e) {
        e.preventDefault();
        var msg = $('#send-message');
        msg.removeClass('hidden text-red-500 text-emerald-500').addClass('text-slate-500').text('Transmitting secure money orders...');

        $.ajax({
            url: mashud_ajax.ajaxurl,
            type: 'POST',
            data: {
                action: 'mashud_submit_send_money',
                security: mashud_ajax.nonce,
                recipientMobile: $('#send-recipient').val(),
                amount: $('#send-amount').val()
            },
            success: function(response) {
                if(response.success) {
                    msg.removeClass('text-slate-500').addClass('text-emerald-600').text(response.data.message);
                    $('#send-money-form')[0].reset();
                } else {
                    msg.removeClass('text-slate-500').addClass('text-red-500').text(response.data.message);
                }
            }
        });
    });

    // Security settings update AJAX
    $('#settings-form').on('submit', function(e) {
        e.preventDefault();
        var msg = $('#settings-message');
        msg.removeClass('hidden text-red-500 text-emerald-500').addClass('text-slate-500').text('Applying profile settings...');

        $.ajax({
            url: mashud_ajax.ajaxurl,
            type: 'POST',
            data: {
                action: 'mashud_update_settings',
                security: mashud_ajax.nonce,
                fullName: $('#settings-name').val(),
                password: $('#settings-pass').val()
            },
            success: function(response) {
                if(response.success) {
                    msg.removeClass('text-slate-500').addClass('text-emerald-600').text(response.data.message);
                } else {
                    msg.removeClass('text-slate-500').addClass('text-red-500').text(response.data.message);
                }
            }
        });
    });
});
</script>

<?php get_footer(); ?>
