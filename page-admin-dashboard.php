<?php
/**
 * Template Name: Admin Control Dashboard
 *
 * @package Mashud_Telecom
 */

if ( !session_id() ) { session_start(); }
if ( !isset($_SESSION['mashud_user_id']) || $_SESSION['mashud_role'] !== 'admin' ) {
    wp_redirect( home_url('/admin-login/') );
    exit;
}

get_header();

global $wpdb;
$admin_id = $_SESSION['mashud_user_id'];

// 1. Calculations: Dynamic Stat Summaries
$users_table = $wpdb->prefix . 'mashud_users';
$deposits_table = $wpdb->prefix . 'mashud_deposits';
$txns_table = $wpdb->prefix . 'mashud_transactions';
$logs_table = $wpdb->prefix . 'mashud_activity_logs';

$total_clients = $wpdb->get_var( "SELECT COUNT(*) FROM $users_table WHERE role = 'user'" );
$total_dep_sum = $wpdb->get_var( "SELECT SUM(amount) FROM $deposits_table WHERE status = 'approved'" );
$total_dep_sum = $total_dep_sum ? $total_dep_sum : 0;

$pending_deposits = $wpdb->get_results( "SELECT d.*, u.full_name, u.mobile FROM $deposits_table d JOIN $users_table u ON d.user_id = u.id WHERE d.status = 'pending' ORDER BY d.created_at DESC" );
$pending_transfers = $wpdb->get_results( "SELECT t.*, u.full_name, u.mobile FROM $txns_table t JOIN $users_table u ON t.user_id = u.id WHERE t.type = 'send_money' AND t.status = 'pending' ORDER BY t.created_at DESC" );

// Get Activity logs
$activity_logs = $wpdb->get_results( "SELECT l.*, u.full_name, u.email FROM $logs_table l JOIN $users_table u ON l.user_id = u.id ORDER BY l.created_at DESC LIMIT 20" );

// User Search parameters
$search_query = isset($_POST['client_search']) ? sanitize_text_field($_POST['client_search']) : '';
if ( !empty($search_query) ) {
    $client_directory = $wpdb->get_results( $wpdb->prepare("SELECT * FROM $users_table WHERE role = 'user' AND (full_name LIKE %s OR mobile LIKE %s OR email LIKE %s)", '%'.$search_query.'%', '%'.$search_query.'%', '%'.$search_query.'%') );
} else {
    $client_directory = $wpdb->get_results( "SELECT * FROM $users_table WHERE role = 'user' ORDER BY created_at DESC LIMIT 20" );
}
?>

<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-grow">
    
    <!-- Header Command Segment -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 border-b border-slate-200 pb-6">
        <div>
            <h1 class="text-3xl font-bold text-slate-950 font-display">Supervisor Command Center</h1>
            <p class="text-sm text-slate-500">Authorized Access Gate | Secure Session Key Live</p>
        </div>
        <div class="flex flex-wrap gap-2">
            <a href="?export=all_clients" class="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2 px-3 rounded-lg flex items-center space-x-1 shadow">
                <i data-lucide="download" class="w-4 h-4"></i>
                <span>Download Client Ledger</span>
            </a>
        </div>
    </div>

    <!-- Administrative Statistics Bento Grid -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        <!-- Total Users Widget -->
        <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div class="space-y-1">
                <span class="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Registered Clients</span>
                <div class="text-3xl font-bold font-display text-slate-900"><?php echo esc_html($total_clients); ?></div>
                <span class="text-[9px] text-emerald-600 block">&#11014; Steady registration rates</span>
            </div>
            <div class="bg-sky-50 text-sky-600 p-3 rounded-lg">
                <i data-lucide="users" class="w-6 h-6"></i>
            </div>
        </div>

        <!-- Total System Deposits Sum -->
        <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div class="space-y-1">
                <span class="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Authorized Deposits</span>
                <div class="text-3xl font-bold font-display text-slate-900"><?php echo number_format($total_dep_sum, 2); ?> <span class="text-xs">TK</span></div>
                <span class="text-[9px] text-slate-400 block">Total net wallet value handled</span>
            </div>
            <div class="bg-emerald-50 text-emerald-600 p-3 rounded-lg">
                <i data-lucide="banknote" class="w-6 h-6"></i>
            </div>
        </div>

        <!-- Pending Tasks Indicator -->
        <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div class="space-y-1">
                <span class="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Deposits Pending</span>
                <div class="text-3xl font-bold font-display text-amber-600"><?php echo count($pending_deposits); ?></div>
                <span class="text-[9px] text-slate-400 block">Requires manual secure review</span>
            </div>
            <div class="bg-amber-50 text-amber-600 p-3 rounded-lg">
                <i data-lucide="clock-alert" class="w-6 h-6"></i>
            </div>
        </div>

        <!-- Transfer Requests Queued -->
        <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div class="space-y-1">
                <span class="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Pending Transfers</span>
                <div class="text-3xl font-bold font-display text-violet-600"><?php echo count($pending_transfers); ?></div>
                <span class="text-[9px] text-slate-400 block">Money send reviews pending</span>
            </div>
            <div class="bg-violet-50 text-violet-600 p-3 rounded-lg">
                <i data-lucide="arrow-right-left" class="w-6 h-6"></i>
            </div>
        </div>

    </div>

    <!-- Active Management Columns -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- Left: Pending Reviews with PIN Handlers (7 Cols) -->
        <div class="lg:col-span-7 space-y-8">
            
            <!-- Pending Deposits Queue -->
            <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div class="flex justify-between items-center">
                    <h2 class="text-lg font-bold text-slate-950 font-display">Deposit Confirmations Portal</h2>
                    <span class="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full"><?php echo count($pending_deposits); ?> Actionable</span>
                </div>
                
                <div class="space-y-4">
                    <?php if ( !empty($pending_deposits) ) : ?>
                        <?php foreach ( $pending_deposits as $dep ) : ?>
                            <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div class="space-y-1">
                                    <h4 class="text-sm font-bold text-slate-900"><?php echo esc_html($dep->full_name); ?> (<?php echo esc_html($dep->mobile); ?>)</h4>
                                    <p class="text-xs text-slate-500">Method: <strong class="text-slate-800"><?php echo esc_html($dep->method); ?></strong> | TxnID: <code class="bg-slate-200/60 px-1 py-0.5 rounded text-xs font-mono"><?php echo esc_html($dep->reference); ?></code></p>
                                    <div class="text-lg font-bold text-sky-600 font-display"><?php echo number_format($dep->amount, 2); ?> TK</div>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <button onclick="triggerAction('approve_deposit', <?php echo $dep->id; ?>)" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-1.5 px-3 rounded-lg">Approve</button>
                                    <button onclick="triggerAction('reject_deposit', <?php echo $dep->id; ?>)" class="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold py-1.5 px-3 rounded-lg border border-red-200">Decline</button>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    <?php else : ?>
                        <p class="text-xs text-slate-400 py-4 text-center">No pending deposit requests logged.</p>
                    <?php endif; ?>
                </div>
            </div>

            <!-- Pending Transfers Queue -->
            <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div class="flex justify-between items-center">
                    <h2 class="text-lg font-bold text-slate-950 font-display">Pending Send Money Requests</h2>
                    <span class="bg-violet-100 text-violet-800 text-[10px] font-bold px-2.5 py-1 rounded-full"><?php echo count($pending_transfers); ?> Actionable</span>
                </div>
                
                <div class="space-y-4">
                    <?php if ( !empty($pending_transfers) ) : ?>
                        <?php foreach ( $pending_transfers as $txn ) : ?>
                            <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div class="space-y-1">
                                    <h4 class="text-sm font-bold text-slate-900"><?php echo esc_html($txn->full_name); ?> (<?php echo esc_html($txn->mobile); ?>)</h4>
                                    <p class="text-xs text-slate-500">Destination Mobile: <strong class="text-slate-800"><?php echo esc_html($txn->recipient_mobile); ?></strong></p>
                                    <div class="text-lg font-bold text-violet-600 font-display"><?php echo number_format($txn->amount, 2); ?> TK</div>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <button onclick="triggerAction('approve_send', <?php echo $txn->id; ?>)" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-1.5 px-3 rounded-lg">Approve</button>
                                    <button onclick="triggerAction('reject_send', <?php echo $txn->id; ?>)" class="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold py-1.5 px-3 rounded-lg border border-red-200">Decline</button>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    <?php else : ?>
                        <p class="text-xs text-slate-400 py-4 text-center">No pending send-money orders registered.</p>
                    <?php endif; ?>
                </div>
            </div>

        </div>

        <!-- Right: Client Directory Search & Verification (5 Cols) -->
        <div class="lg:col-span-5 space-y-8">
            
            <!-- User Directory Search Layout -->
            <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h2 class="text-base font-bold text-slate-900 font-display">Client Directory Lookup</h2>
                <form method="POST" class="flex space-x-2">
                    <input type="text" name="client_search" value="<?php echo esc_attr($search_query); ?>" class="block w-full p-2 border border-slate-300 rounded-lg text-xs bg-slate-50" placeholder="Search name, phone or email...">
                    <button type="submit" class="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg">Search</button>
                </form>
                
                <div class="space-y-3 max-h-72 overflow-y-auto divide-y divide-slate-100 pr-2">
                    <?php foreach ( $client_directory as $client ) : ?>
                        <div class="pt-2 flex justify-between items-center text-xs">
                            <div>
                                <h4 class="font-bold text-slate-900"><?php echo esc_html($client->full_name); ?></h4>
                                <p class="text-slate-400 font-mono text-[10px]"><?php echo esc_html($client->mobile); ?></p>
                            </div>
                            <div class="text-right">
                                <span class="font-bold text-emerald-600"><?php echo number_format($client->balance, 2); ?> TK</span>
                                <span class="block text-[8px] text-slate-400"><?php echo esc_html($client->status); ?></span>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>

            <!-- Corporate Commission Management -->
            <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h2 class="text-base font-bold text-slate-900 font-display">Commission & Security Parameters</h2>
                <div class="p-3 bg-slate-50 border border-slate-100 rounded-lg space-y-2 text-xs">
                    <div class="flex justify-between font-semibold">
                        <span>Current Commission Rate:</span>
                        <span class="text-sky-600">1.85% Per Transaction</span>
                    </div>
                    <div class="flex justify-between font-semibold">
                        <span>System Reserves:</span>
                        <span class="text-emerald-600"><?php echo number_format($total_dep_sum * 0.0185, 2); ?> TK</span>
                    </div>
                </div>
                <div class="space-y-3">
                    <label class="block text-[10px] font-bold text-slate-500 uppercase">Adjust Base Rate</label>
                    <div class="flex space-x-2">
                        <input type="number" id="commission-rate" value="1.85" step="0.01" class="block w-24 p-2 border border-slate-300 rounded-lg text-xs bg-slate-50">
                        <button onclick="alert('System rates locked. Update security variables first.')" class="bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold py-2 px-3 rounded-lg flex-grow">Apply Rates</button>
                    </div>
                </div>
            </div>

        </div>

    </div>

    <!-- Bottom: Central Security Audit Register -->
    <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 class="text-lg font-bold text-slate-900 font-display">System Integrity & Security Activity Logs</h2>
        <div class="overflow-y-auto max-h-80 pr-2">
            <table class="min-w-full divide-y divide-slate-200 text-xs">
                <thead>
                    <tr class="text-slate-400 uppercase text-left font-semibold">
                        <th class="py-2.5">User Context</th>
                        <th class="py-2.5">Corporate Action Logged</th>
                        <th class="py-2.5">IP Address</th>
                        <th class="py-2.5">Timestamp</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 font-medium text-slate-600">
                    <?php foreach ( $activity_logs as $log ) : ?>
                        <tr>
                            <td class="py-3 font-bold"><?php echo esc_html($log->full_name); ?> <span class="block text-[10px] text-slate-400 font-normal"><?php echo esc_html($log->email); ?></span></td>
                            <td class="py-3 text-slate-800"><?php echo esc_html($log->action); ?></td>
                            <td class="py-3 font-mono"><?php echo esc_html($log->ip_address); ?></td>
                            <td class="py-3 font-mono text-slate-400"><?php echo esc_html($log->created_at); ?></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>

</main>

<!-- Security Confirmation PIN Modal Dialog -->
<div id="pin-modal" class="hidden fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="bg-white p-6 rounded-2xl max-w-sm w-full border border-slate-200 shadow-xl space-y-4">
        <div class="text-center space-y-1">
            <h3 class="text-base font-bold text-slate-900 font-display">Authorize Security Action</h3>
            <p class="text-xs text-slate-500">Provide your 6-digit administrative confirmation PIN to proceed.</p>
        </div>
        <div class="space-y-3">
            <input type="password" id="modal-pin" maxlength="6" class="block w-full p-2.5 border border-slate-300 rounded-lg text-center font-mono text-xl tracking-widest bg-slate-50 focus:ring-emerald-500 focus:border-emerald-500" placeholder="••••••">
            <div id="pin-error" class="text-xs text-red-500 text-center font-medium hidden"></div>
            <div class="grid grid-cols-2 gap-3">
                <button onclick="closePinModal()" class="py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg">Cancel</button>
                <button onclick="confirmPinAction()" class="py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg">Authorize Action</button>
            </div>
        </div>
    </div>
</div>

<script>
var activeAction = null;
var activeTarget = null;

function triggerAction(action, id) {
    activeAction = action;
    activeTarget = id;
    $('#modal-pin').val('');
    $('#pin-error').addClass('hidden');
    $('#pin-modal').removeClass('hidden');
}

function closePinModal() {
    $('#pin-modal').addClass('hidden');
    activeAction = null;
    activeTarget = null;
}

function confirmPinAction() {
    var pin = $('#modal-pin').val();
    if(pin.length !== 6) {
        $('#pin-error').removeClass('hidden').text('Security PIN must be exactly 6 digits.');
        return;
    }

    $.ajax({
        url: mashud_ajax.ajaxurl,
        type: 'POST',
        data: {
            action: 'mashud_admin_action',
            security: mashud_ajax.nonce,
            actionType: activeAction,
            adminPin: pin,
            targetId: activeTarget
        },
        success: function(response) {
            if(response.success) {
                closePinModal();
                alert(response.data.message);
                location.reload();
            } else {
                $('#pin-error').removeClass('hidden').text(response.data.message);
            }
        },
        error: function() {
            $('#pin-error').removeClass('hidden').text('Handshake error to authorization portal.');
        }
    });
}
</script>

<?php get_footer(); ?>
