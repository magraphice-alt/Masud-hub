<?php
/**
 * Mashud Telecom Theme Functions and Definitions
 *
 * @package Mashud_Telecom
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

// 1. Theme Supports & Asset Enqueuing
function mashud_telecom_setup() {
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption' ) );
}
add_action( 'after_setup_theme', 'mashud_telecom_setup' );

function mashud_telecom_enqueue_assets() {
    wp_enqueue_style( 'mashud-telecom-style', get_stylesheet_uri(), array(), '1.0.0' );
    
    // Load modern Tailwind CSS via Play CDN (ideal for dynamic utility updates)
    wp_enqueue_script( 'tailwind-cdn', 'https://cdn.tailwindcss.com', array(), null, false );
    
    // Load Lucide Icons for high-end digital banking design
    wp_enqueue_script( 'lucide-icons', 'https://unpkg.com/lucide@latest', array(), null, false );
    
    // Load custom scripts containing jQuery-based AJAX systems
    wp_enqueue_script( 'mashud-telecom-scripts', get_template_directory_uri() . '/js/custom-ajax.js', array('jquery'), '1.0.0', true );
    
    // Localize ajaxurl and nonces for safe data processing
    wp_localize_script( 'mashud-telecom-scripts', 'mashud_ajax', array(
        'ajaxurl' => admin_url( 'admin-ajax.php' ),
        'nonce'   => wp_create_nonce( 'mashud_telecom_nonce' )
    ));
}
add_action( 'wp_enqueue_scripts', 'mashud_telecom_enqueue_assets' );

// 2. Custom SQL Database Schema Setup (dbDelta)
function mashud_telecom_create_database_tables() {
    global $wpdb;
    $charset_collate = $wpdb->get_charset_collate();
    require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );

    // Table 1: Custom Users Table with roles, balances, and security codes
    $table_users = $wpdb->prefix . 'mashud_users';
    $sql_users = "CREATE TABLE $table_users (
        id bigint(20) NOT NULL AUTO_INCREMENT,
        user_id bigint(20) DEFAULT NULL, /* Optional map to core WP user */
        full_name varchar(100) NOT NULL,
        email varchar(100) NOT NULL,
        mobile varchar(20) NOT NULL,
        password_hash varchar(255) NOT NULL,
        balance decimal(12,2) DEFAULT '0.00',
        role varchar(20) DEFAULT 'user', /* 'user' or 'admin' */
        admin_pin varchar(6) DEFAULT NULL, /* For secure admin confirmations */
        status varchar(20) DEFAULT 'active',
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY  (id),
        UNIQUE KEY email (email),
        UNIQUE KEY mobile (mobile)
    ) $charset_collate;";
    dbDelta( $sql_users );

    // Table 2: Deposit requests tracker
    $table_deposits = $wpdb->prefix . 'mashud_deposits';
    $sql_deposits = "CREATE TABLE $table_deposits (
        id bigint(20) NOT NULL AUTO_INCREMENT,
        user_id bigint(20) NOT NULL,
        amount decimal(12,2) NOT NULL,
        method varchar(50) NOT NULL, /* e.g. bKash, Nagad, Rocket */
        reference varchar(100) NOT NULL,
        status varchar(20) DEFAULT 'pending', /* pending, approved, rejected */
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        updated_at datetime DEFAULT NULL,
        PRIMARY KEY  (id)
    ) $charset_collate;";
    dbDelta( $sql_deposits );

    // Table 3: Money transactions ledger
    $table_transactions = $wpdb->prefix . 'mashud_transactions';
    $sql_transactions = "CREATE TABLE $table_transactions (
        id bigint(20) NOT NULL AUTO_INCREMENT,
        user_id bigint(20) NOT NULL,
        type varchar(30) NOT NULL, /* deposit, send_money, deposit_commission, send_commission */
        amount decimal(12,2) NOT NULL,
        charge decimal(12,2) DEFAULT '0.00',
        recipient_mobile varchar(20) DEFAULT NULL,
        status varchar(20) DEFAULT 'pending',
        reference_no varchar(50) NOT NULL,
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY  (id)
    ) $charset_collate;";
    dbDelta( $sql_transactions );

    // Table 4: Bullet-proof system activity log
    $table_activity = $wpdb->prefix . 'mashud_activity_logs';
    $sql_activity = "CREATE TABLE $table_activity (
        id bigint(20) NOT NULL AUTO_INCREMENT,
        user_id bigint(20) NOT NULL,
        action varchar(255) NOT NULL,
        ip_address varchar(45) NOT NULL,
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY  (id)
    ) $charset_collate;";
    dbDelta( $sql_activity );

    // Table 5: Bulletins and live alerts
    $table_notifications = $wpdb->prefix . 'mashud_notifications';
    $sql_notifications = "CREATE TABLE $table_notifications (
        id bigint(20) NOT NULL AUTO_INCREMENT,
        user_id bigint(20) NOT NULL,
        title varchar(100) NOT NULL,
        message text NOT NULL,
        is_read tinyint(1) DEFAULT '0',
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY  (id)
    ) $charset_collate;";
    dbDelta( $sql_notifications );
}
add_action( 'after_switch_theme', 'mashud_telecom_create_database_tables' );

// 3. User & Admin Dynamic Session Handlers
function start_mashud_session() {
    if ( ! session_id() ) {
        session_start();
    }
}
add_action( 'init', 'start_mashud_session' );

// 4. Secure Helpers (Logging, Verification)
function mashud_log_activity( $user_id, $action ) {
    global $wpdb;
    $wpdb->insert(
        $wpdb->prefix . 'mashud_activity_logs',
        array(
            'user_id'    => $user_id,
            'action'     => $action,
            'ip_address' => $_SERVER['REMOTE_ADDR']
        ),
        array( '%d', '%s', '%s' )
    );
}

function mashud_create_notification( $user_id, $title, $message ) {
    global $wpdb;
    $wpdb->insert(
        $wpdb->prefix . 'mashud_notifications',
        array(
            'user_id' => $user_id,
            'title'   => $title,
            'message' => $message,
        ),
        array( '%d', '%s', '%s' )
    );
}

// 5. AJAX Endpoints for Form Processing

// Handlers for User Registration
add_action( 'wp_ajax_nopriv_mashud_register_user', 'mashud_ajax_register_user' );
add_action( 'wp_ajax_mashud_register_user', 'mashud_ajax_register_user' );

function mashud_ajax_register_user() {
    check_ajax_referer( 'mashud_telecom_nonce', 'security' );
    
    $name = sanitize_text_field( $_POST['fullName'] );
    $email = sanitize_email( $_POST['email'] );
    $mobile = sanitize_text_field( $_POST['mobile'] );
    $pass = $_POST['password'];
    $confirm = $_POST['confirmPassword'];

    if ( empty($name) || empty($email) || empty($mobile) || empty($pass) ) {
        wp_send_json_error( array( 'message' => 'Please fill in all required fields.' ) );
    }

    if ( ! is_email( $email ) ) {
        wp_send_json_error( array( 'message' => 'Invalid email address syntax.' ) );
    }

    if ( $pass !== $confirm ) {
        wp_send_json_error( array( 'message' => 'Passwords do not match.' ) );
    }

    global $wpdb;
    $table = $wpdb->prefix . 'mashud_users';
    
    // Check if account already exists
    $existing = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM $table WHERE email = %s OR mobile = %s", $email, $mobile ) );
    if ( $existing ) {
        wp_send_json_error( array( 'message' => 'Email or Mobile number is already registered.' ) );
    }

    $hashed_password = password_hash( $pass, PASSWORD_BCRYPT );
    
    $inserted = $wpdb->insert(
        $table,
        array(
            'full_name'     => $name,
            'email'         => $email,
            'mobile'        => $mobile,
            'password_hash' => $hashed_password,
            'balance'       => 100.00, // Welcome gift of 100 TK
            'role'          => 'user',
            'status'        => 'active'
        ),
        array( '%s', '%s', '%s', '%s', '%f', '%s', '%s' )
    );

    if ( $inserted ) {
        $user_db_id = $wpdb->insert_id;
        mashud_log_activity( $user_db_id, 'Registered new user account.' );
        mashud_create_notification( $user_db_id, 'Welcome to Mashud Telecom!', 'Thank you for choosing our platform. A bonus of 100 TK has been credited.' );
        wp_send_json_success( array( 'message' => 'Registration successful! You can now log in.' ) );
    } else {
        wp_send_json_error( array( 'message' => 'Database operation failed. Contact system administrator.' ) );
    }
}

// Handlers for User / Admin Login
add_action( 'wp_ajax_nopriv_mashud_login_user', 'mashud_ajax_login_user' );
add_action( 'wp_ajax_mashud_login_user', 'mashud_ajax_login_user' );

function mashud_ajax_login_user() {
    check_ajax_referer( 'mashud_telecom_nonce', 'security' );

    $login_input = sanitize_text_field( $_POST['username'] );
    $pass = $_POST['password'];

    if ( empty($login_input) || empty($pass) ) {
        wp_send_json_error( array( 'message' => 'Please fill in credentials.' ) );
    }

    global $wpdb;
    $table = $wpdb->prefix . 'mashud_users';
    
    $user = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM $table WHERE (email = %s OR mobile = %s) AND role = 'user'", $login_input, $login_input ) );

    if ( ! $user || ! password_verify( $pass, $user->password_hash ) ) {
        wp_send_json_error( array( 'message' => 'Incorrect credentials. Please verify your info.' ) );
    }

    if ( $user->status !== 'active' ) {
        wp_send_json_error( array( 'message' => 'This account has been suspended by support.' ) );
    }

    $_SESSION['mashud_user_id'] = $user->id;
    $_SESSION['mashud_role'] = 'user';
    $_SESSION['mashud_full_name'] = $user->full_name;

    mashud_log_activity( $user->id, 'Successfully logged into the telecom gateway.' );

    wp_send_json_success( array(
        'message' => 'Welcome back! Loading secure dashboard...',
        'redirect'=> home_url( '/user-dashboard/' )
    ));
}

// Handler for Admin Register
add_action( 'wp_ajax_nopriv_mashud_register_admin', 'mashud_ajax_register_admin' );
add_action( 'wp_ajax_mashud_register_admin', 'mashud_ajax_register_admin' );

function mashud_ajax_register_admin() {
    check_ajax_referer( 'mashud_telecom_nonce', 'security' );

    $name = sanitize_text_field( $_POST['fullName'] );
    $email = sanitize_email( $_POST['email'] );
    $mobile = sanitize_text_field( $_POST['mobile'] );
    $pass = $_POST['password'];
    $pin = sanitize_text_field( $_POST['adminPin'] );

    if ( empty($name) || empty($email) || empty($mobile) || empty($pass) || empty($pin) ) {
        wp_send_json_error( array( 'message' => 'All fields are mandatory, including Admin Confirmation PIN.' ) );
    }

    if ( strlen($pin) !== 6 || !is_numeric($pin) ) {
        wp_send_json_error( array( 'message' => 'Security PIN must be exactly 6 numeric digits.' ) );
    }

    global $wpdb;
    $table = $wpdb->prefix . 'mashud_users';

    $existing = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM $table WHERE email = %s OR mobile = %s", $email, $mobile ) );
    if ( $existing ) {
        wp_send_json_error( array( 'message' => 'Email or mobile is already associated with an account.' ) );
    }

    $hashed_password = password_hash( $pass, PASSWORD_BCRYPT );

    $inserted = $wpdb->insert(
        $table,
        array(
            'full_name'     => $name,
            'email'         => $email,
            'mobile'        => $mobile,
            'password_hash' => $hashed_password,
            'balance'       => 0.00,
            'role'          => 'admin',
            'admin_pin'     => $pin,
            'status'        => 'active'
        ),
        array( '%s', '%s', '%s', '%s', '%f', '%s', '%s', '%s' )
    );

    if ( $inserted ) {
        $admin_db_id = $wpdb->insert_id;
        mashud_log_activity( $admin_db_id, 'Created new administrator security credentials.' );
        wp_send_json_success( array( 'message' => 'Administrator registration complete! Access portal.' ) );
    } else {
        wp_send_json_error( array( 'message' => 'System error database creation.' ) );
    }
}

// Handler for Admin Login
add_action( 'wp_ajax_nopriv_mashud_login_admin', 'mashud_ajax_login_admin' );
add_action( 'wp_ajax_mashud_login_admin', 'mashud_ajax_login_admin' );

function mashud_ajax_login_admin() {
    check_ajax_referer( 'mashud_telecom_nonce', 'security' );

    $email = sanitize_email( $_POST['email'] );
    $pass = $_POST['password'];

    if ( empty($email) || empty($pass) ) {
        wp_send_json_error( array( 'message' => 'Email and Password are required.' ) );
    }

    global $wpdb;
    $table = $wpdb->prefix . 'mashud_users';

    $admin = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM $table WHERE email = %s AND role = 'admin'", $email ) );

    if ( ! $admin || ! password_verify( $pass, $admin->password_hash ) ) {
        wp_send_json_error( array( 'message' => 'Invalid administrator credentials.' ) );
    }

    $_SESSION['mashud_user_id'] = $admin->id;
    $_SESSION['mashud_role'] = 'admin';
    $_SESSION['mashud_full_name'] = $admin->full_name;

    mashud_log_activity( $admin->id, 'Admin login authentication successful.' );

    wp_send_json_success( array(
        'message' => 'Authentication successful! Initiating administrator workspace...',
        'redirect'=> home_url( '/admin-dashboard/' )
    ));
}

// 6. Deposit Form Submission & Funds Handling
add_action( 'wp_ajax_mashud_submit_deposit', 'mashud_ajax_submit_deposit' );

function mashud_ajax_submit_deposit() {
    check_ajax_referer( 'mashud_telecom_nonce', 'security' );

    if ( ! isset($_SESSION['mashud_user_id']) || $_SESSION['mashud_role'] !== 'user' ) {
        wp_send_json_error( array( 'message' => 'Unauthorized operation.' ) );
    }

    $amount = floatval( $_POST['amount'] );
    $method = sanitize_text_field( $_POST['method'] );
    $ref = sanitize_text_field( $_POST['reference'] );

    if ( $amount <= 0 ) {
        wp_send_json_error( array( 'message' => 'Deposit amount must be a positive number.' ) );
    }

    if ( empty($method) || empty($ref) ) {
        wp_send_json_error( array( 'message' => 'Please select dynamic channel and provide Transaction Reference No.' ) );
    }

    global $wpdb;
    $user_id = $_SESSION['mashud_user_id'];
    
    // Record into deposits table
    $inserted_deposit = $wpdb->insert(
        $wpdb->prefix . 'mashud_deposits',
        array(
            'user_id'   => $user_id,
            'amount'    => $amount,
            'method'    => $method,
            'reference' => $ref,
            'status'    => 'pending'
        ),
        array( '%d', '%f', '%s', '%s', '%s' )
    );

    if ( $inserted_deposit ) {
        $deposit_id = $wpdb->insert_id;
        
        // Generate general transaction record ledger
        $ref_no = 'TXN-' . strtoupper( wp_generate_password(8, false) );
        $wpdb->insert(
            $wpdb->prefix . 'mashud_transactions',
            array(
                'user_id'          => $user_id,
                'type'             => 'deposit',
                'amount'           => $amount,
                'status'           => 'pending',
                'reference_no'     => $ref,
                'created_at'       => current_time( 'mysql' )
            ),
            array( '%d', '%s', '%f', '%s', '%s', '%s' )
        );

        mashud_log_activity( $user_id, "Submitted deposit request for $amount TK via $method." );
        mashud_create_notification( $user_id, 'Deposit Request Queued', "Your request of $amount TK via $method has been forwarded to admin review. Ref: $ref" );

        wp_send_json_success( array( 'message' => 'Deposit request placed successfully! Awaiting system verification.' ) );
    } else {
        wp_send_json_error( array( 'message' => 'Deposit creation failed.' ) );
    }
}

// 7. Send Money Form Handling
add_action( 'wp_ajax_mashud_submit_send_money', 'mashud_ajax_submit_send_money' );

function mashud_ajax_submit_send_money() {
    check_ajax_referer( 'mashud_telecom_nonce', 'security' );

    if ( ! isset($_SESSION['mashud_user_id']) || $_SESSION['mashud_role'] !== 'user' ) {
        wp_send_json_error( array( 'message' => 'Access denied.' ) );
    }

    $recipient = sanitize_text_field( $_POST['recipientMobile'] );
    $amount = floatval( $_POST['amount'] );

    if ( empty($recipient) || $amount <= 0 ) {
        wp_send_json_error( array( 'message' => 'Please provide full receipt phone number and amount.' ) );
    }

    global $wpdb;
    $user_id = $_SESSION['mashud_user_id'];
    $users_table = $wpdb->prefix . 'mashud_users';
    
    // Check if user has sufficient funds
    $sender = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM $users_table WHERE id = %d", $user_id ) );
    
    if ( $sender->balance < $amount ) {
        wp_send_json_error( array( 'message' => 'Insufficient funds. Please top-up your wallet.' ) );
    }

    // Process immediately or queue for safety approval (as requested, and then show transaction history status)
    $ref_no = 'SEND-' . strtoupper( wp_generate_password(8, false) );

    // Insert pending transaction record
    $wpdb->insert(
        $wpdb->prefix . 'mashud_transactions',
        array(
            'user_id'          => $user_id,
            'type'             => 'send_money',
            'amount'           => $amount,
            'recipient_mobile' => $recipient,
            'status'           => 'pending',
            'reference_no'     => $ref_no
        ),
        array( '%d', '%s', '%f', '%s', '%s', '%s' )
    );

    // Lock funds (deduct from sender balance to prevent double spending during pending status)
    $new_balance = $sender->balance - $amount;
    $wpdb->update(
        $users_table,
        array( 'balance' => $new_balance ),
        array( 'id' => $user_id ),
        array( '%f' ),
        array( '%d' )
    );

    mashud_log_activity( $user_id, "Created Send Money request of $amount TK to $recipient." );
    mashud_create_notification( $user_id, 'Send Money Pending', "Your request to transfer $amount TK to $recipient is under process." );

    wp_send_json_success( array( 'message' => 'Send Money request submitted! Balances adjusted temporarily.' ) );
}

// 8. Forgot Password / OTP Security System
add_action( 'wp_ajax_nopriv_mashud_forgot_password', 'mashud_ajax_forgot_password' );
add_action( 'wp_ajax_mashud_forgot_password', 'mashud_ajax_forgot_password' );

function mashud_ajax_forgot_password() {
    check_ajax_referer( 'mashud_telecom_nonce', 'security' );

    $email = sanitize_email( $_POST['email'] );
    if ( empty($email) ) {
        wp_send_json_error( array( 'message' => 'Please provide registered email.' ) );
    }

    global $wpdb;
    $table = $wpdb->prefix . 'mashud_users';
    $user = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM $table WHERE email = %s", $email ) );

    if ( !$user ) {
        wp_send_json_error( array( 'message' => 'No active records found under that email.' ) );
    }

    // Generate random 6-digit OTP
    $otp = rand(100000, 999999);
    $_SESSION['mashud_reset_otp'] = $otp;
    $_SESSION['mashud_reset_user_id'] = $user->id;

    // Simulate sending OTP (in real WordPress, wp_mail is called)
    $mail_content = "Mashud Telecom Reset Code: " . $otp;
    
    mashud_log_activity( $user->id, "Requested password OTP code: $otp" );

    wp_send_json_success( array(
        'message' => 'Security OTP verification code has been dispatched. (Simulated Code: ' . $otp . ')',
        'otp_sent'=> true
    ));
}

add_action( 'wp_ajax_nopriv_mashud_verify_otp', 'mashud_ajax_verify_otp' );
add_action( 'wp_ajax_mashud_verify_otp', 'mashud_ajax_verify_otp' );

function mashud_ajax_verify_otp() {
    check_ajax_referer( 'mashud_telecom_nonce', 'security' );

    $input_otp = sanitize_text_field( $_POST['otp'] );
    $new_pass = $_POST['newPassword'];

    if ( empty($input_otp) || empty($new_pass) ) {
        wp_send_json_error( array( 'message' => 'Please key in security OTP and new password.' ) );
    }

    if ( !isset($_SESSION['mashud_reset_otp']) || intval($input_otp) !== intval($_SESSION['mashud_reset_otp']) ) {
        wp_send_json_error( array( 'message' => 'Security OTP code is incorrect or expired.' ) );
    }

    global $wpdb;
    $user_id = $_SESSION['mashud_reset_user_id'];
    $table = $wpdb->prefix . 'mashud_users';

    $new_hash = password_hash($new_pass, PASSWORD_BCRYPT);
    $wpdb->update(
        $table,
        array( 'password_hash' => $new_hash ),
        array( 'id' => $user_id ),
        array( '%s' ),
        array( '%d' )
    );

    mashud_log_activity( $user_id, 'Successfully reset account password via OTP authentication.' );
    unset($_SESSION['mashud_reset_otp']);
    unset($_SESSION['mashud_reset_user_id']);

    wp_send_json_success( array( 'message' => 'Password reset completed! You can log in now.' ) );
}

// 9. Profile Settings Update
add_action( 'wp_ajax_mashud_update_settings', 'mashud_ajax_update_settings' );

function mashud_ajax_update_settings() {
    check_ajax_referer( 'mashud_telecom_nonce', 'security' );

    if ( !isset($_SESSION['mashud_user_id']) ) {
         wp_send_json_error( array( 'message' => 'Session expired. Log in.' ) );
    }

    $name = sanitize_text_field( $_POST['fullName'] );
    $pass = $_POST['password'];

    global $wpdb;
    $user_id = $_SESSION['mashud_user_id'];
    $table = $wpdb->prefix . 'mashud_users';

    $update_data = array( 'full_name' => $name );
    $formats = array( '%s' );

    if ( !empty($pass) ) {
        $update_data['password_hash'] = password_hash( $pass, PASSWORD_BCRYPT );
        $formats[] = '%s';
    }

    $updated = $wpdb->update( $table, $update_data, array( 'id' => $user_id ), $formats, array( '%d' ) );

    if ( $updated !== false ) {
        $_SESSION['mashud_full_name'] = $name;
        mashud_log_activity( $user_id, 'Updated dynamic profile configuration and settings.' );
        wp_send_json_success( array( 'message' => 'Profile configurations updated successfully!' ) );
    } else {
        wp_send_json_error( array( 'message' => 'Error writing user database parameters.' ) );
    }
}

// 10. Admin Control Panels: Approve/Reject Systems with PIN Checking
add_action( 'wp_ajax_mashud_admin_action', 'mashud_ajax_admin_action' );

function mashud_ajax_admin_action() {
    check_ajax_referer( 'mashud_telecom_nonce', 'security' );

    if ( !isset($_SESSION['mashud_user_id']) || $_SESSION['mashud_role'] !== 'admin' ) {
         wp_send_json_error( array( 'message' => 'Restricted clearance.' ) );
    }

    $action_type = sanitize_text_field( $_POST['actionType'] ); // approve_deposit, reject_deposit, approve_send, reject_send, change_commission
    $pin = sanitize_text_field( $_POST['adminPin'] );
    $target_id = intval( $_POST['targetId'] );

    global $wpdb;
    $admin_id = $_SESSION['mashud_user_id'];
    $users_table = $wpdb->prefix . 'mashud_users';

    // Verify Admin PIN
    $admin = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM $users_table WHERE id = %d", $admin_id ) );
    if ( $admin->admin_pin !== $pin ) {
        wp_send_json_error( array( 'message' => 'Invalid Security PIN. Transaction blocked.' ) );
    }

    $deposits_table = $wpdb->prefix . 'mashud_deposits';
    $txns_table = $wpdb->prefix . 'mashud_transactions';

    switch ( $action_type ) {
        case 'approve_deposit':
            $deposit = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM $deposits_table WHERE id = %d", $target_id ) );
            if ( $deposit->status !== 'pending' ) {
                wp_send_json_error( array( 'message' => 'Transaction has already been finalized.' ) );
            }

            // Update status of deposit
            $wpdb->update( $deposits_table, array('status' => 'approved', 'updated_at' => current_time('mysql')), array('id' => $target_id) );
            
            // Sync status of transaction
            $wpdb->update( $txns_table, array('status' => 'approved'), array('user_id' => $deposit->user_id, 'reference_no' => $deposit->reference) );

            // Credit User Wallet
            $user = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM $users_table WHERE id = %d", $deposit->user_id ) );
            $new_balance = $user->balance + $deposit->amount;
            $wpdb->update( $users_table, array('balance' => $new_balance), array('id' => $deposit->user_id) );

            mashud_log_activity( $admin_id, "Approved deposit request #$target_id of {$deposit->amount} TK for User #{$deposit->user_id}." );
            mashud_create_notification( $deposit->user_id, 'Deposit Approved!', "Your deposit of {$deposit->amount} TK has been processed. New wallet balance is $new_balance TK." );
            break;

        case 'reject_deposit':
            $deposit = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM $deposits_table WHERE id = %d", $target_id ) );
            if ( $deposit->status !== 'pending' ) {
                wp_send_json_error( array( 'message' => 'Transaction has already been finalized.' ) );
            }

            $wpdb->update( $deposits_table, array('status' => 'rejected', 'updated_at' => current_time('mysql')), array('id' => $target_id) );
            $wpdb->update( $txns_table, array('status' => 'rejected'), array('user_id' => $deposit->user_id, 'reference_no' => $deposit->reference) );

            mashud_log_activity( $admin_id, "Rejected deposit request #$target_id for User #{$deposit->user_id}." );
            mashud_create_notification( $deposit->user_id, 'Deposit Rejected', "Your deposit request has been declined. Please contact administration." );
            break;

        case 'approve_send':
            $txn = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM $txns_table WHERE id = %d", $target_id ) );
            if ( $txn->status !== 'pending' ) {
                wp_send_json_error( array( 'message' => 'Transaction already processed.' ) );
            }

            // Confirm recipient exists in the custom users database
            $recipient = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM $users_table WHERE mobile = %s", $txn->recipient_mobile ) );
            if ( $recipient ) {
                // Deposit funds to recipient
                $new_rec_bal = $recipient->balance + $txn->amount;
                $wpdb->update( $users_table, array('balance' => $new_rec_bal), array('id' => $recipient->id) );
                mashud_create_notification( $recipient->id, 'Funds Received', "Received {$txn->amount} TK from mobile sender. Current Balance: $new_rec_bal TK." );
            } else {
                // If recipient doesn't exist, we send it out as generic telecom transfer
                mashud_log_activity( $admin_id, "External transfer processed for non-registered mobile: {$txn->recipient_mobile}" );
            }

            $wpdb->update( $txns_table, array('status' => 'approved'), array('id' => $target_id) );

            mashud_log_activity( $admin_id, "Approved Send Money transaction #$target_id of {$txn->amount} TK to recipient mobile." );
            mashud_create_notification( $txn->user_id, 'Transfer Successful!', "Your send money request of {$txn->amount} TK to {$txn->recipient_mobile} has been successfully credited." );
            break;

        case 'reject_send':
            $txn = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM $txns_table WHERE id = %d", $target_id ) );
            if ( $txn->status !== 'pending' ) {
                wp_send_json_error( array( 'message' => 'Transaction already processed.' ) );
            }

            $wpdb->update( $txns_table, array('status' => 'rejected'), array('id' => $target_id) );

            // Return locked funds to sender
            $sender = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM $users_table WHERE id = %d", $txn->user_id ) );
            $refund_bal = $sender->balance + $txn->amount;
            $wpdb->update( $users_table, array('balance' => $refund_bal), array('id' => $txn->user_id) );

            mashud_log_activity( $admin_id, "Rejected Send Money #$target_id. Refunding {$txn->amount} TK to User #{$txn->user_id}." );
            mashud_create_notification( $txn->user_id, 'Transfer Declined', "Your transfer request was rejected. Wallet balance of {$txn->amount} TK has been fully refunded." );
            break;

        default:
            wp_send_json_error( array( 'message' => 'Unsupported action request.' ) );
    }

    wp_send_json_success( array( 'message' => 'Operation security PIN authorized. Dashboard logs updated.' ) );
}

// 10. WordPress Dashboard Admin Operations Page
function mashud_telecom_register_admin_menu() {
    add_menu_page(
        'Mashud Telecom',
        'Mashud Telecom',
        'manage_options',
        'mashud-telecom-core',
        'mashud_telecom_core_page_html',
        'dashicons-bank',
        25
    );
}
add_action( 'admin_menu', 'mashud_telecom_register_admin_menu' );

function mashud_telecom_core_page_html() {
    global $wpdb;
    
    // Process Actions
    if ( isset( $_GET['action'] ) && check_admin_referer( 'mashud_core_admin_action', 'mashud_nonce' ) ) {
        $action = sanitize_text_field( $_GET['action'] );
        if ( $action === 'init_db' ) {
            mashud_telecom_create_database_tables();
            echo '<div class="notice notice-success is-dismissible"><p>Mashud Telecom database tables initialized successfully!</p></div>';
        } elseif ( $action === 'create_pages' ) {
            $required_pages = array(
                'user-register' => array(
                    'title'     => 'User Register',
                    'template'  => 'page-user-register.php'
                ),
                'user-login' => array(
                    'title'     => 'User Login',
                    'template'  => 'page-user-login.php'
                ),
                'admin-register' => array(
                    'title'     => 'Admin Register',
                    'template'  => 'page-admin-register.php'
                ),
                'admin-login' => array(
                    'title'     => 'Admin Login',
                    'template'  => 'page-admin-login.php'
                ),
                'user-dashboard' => array(
                    'title'     => 'Client Dashboard',
                    'template'  => 'page-user-dashboard.php'
                ),
                'admin-dashboard' => array(
                    'title'     => 'Admin Dashboard',
                    'template'  => 'page-admin-dashboard.php'
                )
            );
            
            $created_count = 0;
            foreach ( $required_pages as $slug => $page_info ) {
                $existing_page = get_page_by_path( $slug );
                if ( !$existing_page ) {
                    $page_id = wp_insert_post( array(
                        'post_title'    => $page_info['title'],
                        'post_content'  => '<!-- Mashud Telecom Core Application Page template. Please do not delete. -->',
                        'post_status'   => 'publish',
                        'post_type'     => 'page',
                        'post_name'     => $slug
                    ) );
                    if ( $page_id && !is_wp_error( $page_id ) ) {
                        update_post_meta( $page_id, '_wp_page_template', $page_info['template'] );
                        $created_count++;
                    }
                } else {
                    update_post_meta( $existing_page->ID, '_wp_page_template', $page_info['template'] );
                }
            }
            echo '<div class="notice notice-success is-dismissible"><p>Successfully created/verified all required pages & assigned their templates! (' . $created_count . ' new pages created)</p></div>';
        }
    }
    
    // Fetch Current DB status
    $tables = array(
        'mashud_users'          => $wpdb->prefix . 'mashud_users',
        'mashud_deposits'       => $wpdb->prefix . 'mashud_deposits',
        'mashud_transactions'   => $wpdb->prefix . 'mashud_transactions',
        'mashud_activity_logs'  => $wpdb->prefix . 'mashud_activity_logs',
        'mashud_notifications'  => $wpdb->prefix . 'mashud_notifications',
    );
    
    $table_status = array();
    foreach ( $tables as $key => $table_name ) {
        $table_exists = $wpdb->get_var( $wpdb->prepare( "SHOW TABLES LIKE %s", $table_name ) ) === $table_name;
        $table_status[$key] = array(
            'name'   => $table_name,
            'exists' => $table_exists
        );
    }
    
    // Fetch Current Pages status
    $required_pages = array(
        'user-register'   => 'User Register',
        'user-login'      => 'User Login',
        'admin-register'  => 'Admin Register',
        'admin-login'     => 'Admin Login',
        'user-dashboard'  => 'Client Dashboard',
        'admin-dashboard' => 'Admin Dashboard'
    );
    
    $page_status = array();
    foreach ( $required_pages as $slug => $title ) {
        $page = get_page_by_path( $slug );
        $page_status[$slug] = array(
            'title'  => $title,
            'exists' => ($page !== null),
            'url'    => $page ? get_permalink( $page->ID ) : '#'
        );
    }
    
    // Render Beautiful Control Panel inside WordPress
    ?>
    <div class="wrap" style="font-family: 'Inter', sans-serif; max-width: 960px; margin-top: 20px;">
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #fff; padding: 30px; border-radius: 12px; margin-bottom: 25px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px;">
                <div>
                    <h1 style="color: #fff; font-size: 28px; font-weight: 700; margin: 0 0 8px 0; font-family: 'Space Grotesk', sans-serif;">Mashud Telecom Core Control Panel</h1>
                    <p style="color: #cbd5e1; margin: 0; font-size: 14px;">Deploy digital banking pages and verify database schemas with a single click.</p>
                </div>
                <div>
                    <span style="background: rgba(34, 197, 94, 0.2); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.3); padding: 6px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; display: inline-flex; align-items: center;">
                        <span style="width: 8px; height: 8px; background: #22c55e; border-radius: 50%; display: inline-block; margin-right: 6px;"></span>
                        System Online
                    </span>
                </div>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr; gap: 25px; margin-bottom: 30px;">
            
            <!-- STEP 1: Core Database System Status -->
            <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid #f1f5f9; padding-bottom: 15px; flex-wrap: wrap; gap: 10px;">
                    <div>
                        <h2 style="font-size: 18px; font-weight: 700; margin: 0; color: #0f172a;">1. Core System Database Tables</h2>
                        <p style="margin: 4px 0 0 0; font-size: 13px; color: #64748b;">Required tables in your WordPress database to store user transactions and secure ledgers.</p>
                    </div>
                    <a href="<?php echo esc_url( wp_nonce_url( admin_url('admin.php?page=mashud-telecom-core&action=init_db'), 'mashud_core_admin_action', 'mashud_nonce' ) ); ?>" class="button button-primary" style="background: #0284c7; border-color: #0284c7; font-weight: 600; padding: 4px 14px; height: auto; font-size: 13px; border-radius: 6px; text-shadow: none; box-shadow: none;">
                        Initialize / Repair Schema
                    </a>
                </div>

                <table class="wp-list-table widefat fixed striped table-view-list" style="border: none; box-shadow: none;">
                    <thead>
                        <tr>
                            <th style="font-weight: 600; color: #475569; padding: 10px 12px;">System Table Key</th>
                            <th style="font-weight: 600; color: #475569; padding: 10px 12px;">Active Name inside MySQL</th>
                            <th style="font-weight: 600; color: #475569; padding: 10px 12px; text-align: right;">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ( $table_status as $key => $status ) : ?>
                            <tr>
                                <td style="font-weight: 600; color: #0f172a; padding: 12px; border: none;"><?php echo esc_html( $key ); ?></td>
                                <td style="font-family: monospace; font-size: 12px; color: #334155; padding: 12px; border: none;"><?php echo esc_html( $status['name'] ); ?></td>
                                <td style="text-align: right; padding: 12px; border: none;">
                                    <?php if ( $status['exists'] ) : ?>
                                        <span style="background: #dcfce7; color: #15803d; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 6px; display: inline-block;">ACTIVE</span>
                                    <?php else : ?>
                                        <span style="background: #fee2e2; color: #b91c1c; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 6px; display: inline-block;">MISSING</span>
                                    <?php endif; ?>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>

            <!-- STEP 2: Required Page Templates Auto-Creator -->
            <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid #f1f5f9; padding-bottom: 15px; flex-wrap: wrap; gap: 10px;">
                    <div>
                        <h2 style="font-size: 18px; font-weight: 700; margin: 0; color: #0f172a;">2. System Core Pages Configuration</h2>
                        <p style="margin: 4px 0 0 0; font-size: 13px; color: #64748b;">The following slug paths must exist with their custom template assignments to ensure user portal redirects operate correctly.</p>
                    </div>
                    <a href="<?php echo esc_url( wp_nonce_url( admin_url('admin.php?page=mashud-telecom-core&action=create_pages'), 'mashud_core_admin_action', 'mashud_nonce' ) ); ?>" class="button button-primary" style="background: #10b981; border-color: #10b981; font-weight: 600; padding: 4px 14px; height: auto; font-size: 13px; border-radius: 6px; text-shadow: none; box-shadow: none;">
                        Auto-Create All Missing Pages & Assign Templates
                    </a>
                </div>

                <table class="wp-list-table widefat fixed striped table-view-list" style="border: none; box-shadow: none;">
                    <thead>
                        <tr>
                            <th style="font-weight: 600; color: #475569; padding: 10px 12px;">Standard Title</th>
                            <th style="font-weight: 600; color: #475569; padding: 10px 12px;">Required Path / Slug</th>
                            <th style="font-weight: 600; color: #475569; padding: 10px 12px;">Assigned PHP Template</th>
                            <th style="font-weight: 600; color: #475569; padding: 10px 12px; text-align: right;">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ( $page_status as $slug => $info ) : ?>
                            <tr>
                                <td style="font-weight: 600; color: #0f172a; padding: 12px; border: none;"><?php echo esc_html( $info['title'] ); ?></td>
                                <td style="font-family: monospace; font-size: 12px; color: #334155; padding: 12px; border: none;">
                                    <a href="<?php echo esc_url( home_url('/' . $slug . '/') ); ?>" target="_blank" style="color: #0284c7; text-decoration: none;"><?php echo '/' . esc_html($slug) . '/'; ?></a>
                                </td>
                                <td style="font-family: monospace; font-size: 12px; color: #64748b; padding: 12px; border: none;">page-<?php echo esc_html( $slug ); ?>.php</td>
                                <td style="text-align: right; padding: 12px; border: none;">
                                    <?php if ( $info['exists'] ) : ?>
                                        <span style="background: #dcfce7; color: #15803d; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 6px; display: inline-block;">CREATED</span>
                                    <?php else : ?>
                                        <span style="background: #fee2e2; color: #b91c1c; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 6px; display: inline-block;">MISSING</span>
                                    <?php endif; ?>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>

            <!-- STEP 3: Recommended Configuration Details -->
            <div style="background: #fafafa; border: 1px dashed #cbd5e1; border-radius: 12px; padding: 20px; text-align: left;">
                <h3 style="font-size: 14px; font-weight: 700; color: #334155; margin: 0 0 8px 0; display: flex; align-items: center; gap: 6px;">
                    <span style="background: #f59e0b; width: 6px; height: 6px; border-radius: 50%; display: inline-block;"></span>
                    Quick Integration Guide:
                </h3>
                <p style="margin: 0; font-size: 12px; color: #475569; line-height: 1.6;">
                    1. Click the <strong style="color: #1e293b;">"Auto-Create All Missing Pages & Assign Templates"</strong> button above. WordPress will programmatically generate the register, login, and dashboard pages and bind their specialized files.<br>
                    2. If database queries fail, click <strong style="color: #1e293b;">"Initialize / Repair Schema"</strong> to ensure MySQL has all core transaction and log tables.<br>
                    3. No extra plugins are required! All financial processing, commissions, PDF statements, and security triggers are natively powered by this modern theme's core engine.
                </p>
            </div>
        </div>
    </div>
    <?php
}
