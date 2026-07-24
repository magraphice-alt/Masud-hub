import { WPThemeFile } from './types';

export function getWordPressThemeFiles(): WPThemeFile[] {
  return [
    {
      name: 'style.css',
      path: 'style.css',
      description: 'Theme stylesheet containing header metadata, layout configurations, and custom styles.',
      code: `/*
Theme Name: Mashud Telecom
Theme URI: https://example.com/mashud-telecom
Author: magraphice
Author URI: https://example.com/author
Description: A modern responsive WordPress theme tailored for digital banking, mobile financial services, and telecom operators.
Version: 1.0.0
License: GNU General Public License v2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Text Domain: mashud-telecom
*/

/* Custom variables and baseline typography settings */
:root {
  --telecom-blue: #0284c7;
  --telecom-blue-hover: #0369a1;
  --telecom-green: #22c55e;
  --telecom-green-hover: #16a34a;
  --telecom-dark: #0f172a;
  --telecom-light: #f8fafc;
  --telecom-slate: #64748b;
  --font-family: 'Inter', system-ui, sans-serif;
}

body {
  font-family: var(--font-family);
  background-color: var(--telecom-light);
  color: var(--telecom-dark);
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
}

/* Base style resets and helper utilities */
a {
  text-decoration: none;
  color: inherit;
}

.theme-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 8px -1px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.banking-gradient {
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
}

.gradient-green {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
}

.grid-menu {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

@media (max-width: 640px) {
  .grid-menu {
    grid-template-columns: 1fr;
  }
}
`
    },
    {
      name: 'functions.php',
      path: 'functions.php',
      description: 'Theme functions, database initialization, REST APIs, and comprehensive AJAX endpoints.',
      code: `<?php
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

// 11. Delete User Account AJAX Handler
add_action( 'wp_ajax_mashud_delete_user', 'mashud_ajax_delete_user' );

function mashud_ajax_delete_user() {
    check_ajax_referer( 'mashud_telecom_nonce', 'security' );

    if ( !isset($_SESSION['mashud_user_id']) || $_SESSION['mashud_role'] !== 'admin' ) {
        wp_send_json_error( array( 'message' => 'Restricted clearance. Admin access required.' ) );
    }

    $target_user_id = intval( $_POST['targetUserId'] );
    $pin = sanitize_text_field( $_POST['adminPin'] );

    if ( empty($target_user_id) ) {
        wp_send_json_error( array( 'message' => 'Invalid user ID specified.' ) );
    }

    global $wpdb;
    $admin_id = $_SESSION['mashud_user_id'];
    $users_table = $wpdb->prefix . 'mashud_users';

    // Verify Admin PIN
    $admin = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM $users_table WHERE id = %d", $admin_id ) );
    if ( !$admin || $admin->admin_pin !== $pin ) {
        wp_send_json_error( array( 'message' => 'Invalid Security PIN. User deletion blocked.' ) );
    }

    $target_user = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM $users_table WHERE id = %d", $target_user_id ) );
    if ( !$target_user ) {
        wp_send_json_error( array( 'message' => 'Target user account not found.' ) );
    }

    // Prevent self-deletion of currently logged in admin
    if ( intval($target_user_id) === intval($admin_id) ) {
        wp_send_json_error( array( 'message' => 'Cannot delete your own active administrator session.' ) );
    }

    // Delete associated transactions, deposits, notifications, and logs
    $wpdb->delete( $wpdb->prefix . 'mashud_deposits', array( 'user_id' => $target_user_id ), array( '%d' ) );
    $wpdb->delete( $wpdb->prefix . 'mashud_transactions', array( 'user_id' => $target_user_id ), array( '%d' ) );
    $wpdb->delete( $wpdb->prefix . 'mashud_notifications', array( 'user_id' => $target_user_id ), array( '%d' ) );
    $wpdb->delete( $wpdb->prefix . 'mashud_activity_logs', array( 'user_id' => $target_user_id ), array( '%d' ) );
    
    // Delete user from custom users table
    $deleted = $wpdb->delete( $users_table, array( 'id' => $target_user_id ), array( '%d' ) );

    if ( $deleted ) {
        mashud_log_activity( $admin_id, "Permanently deleted user account {$target_user->full_name} (#$target_user_id, {$target_user->mobile})." );
        wp_send_json_success( array( 'message' => "User profile '{$target_user->full_name}' permanently deleted from WordPress database." ) );
    } else {
        wp_send_json_error( array( 'message' => 'Failed to delete user profile from database.' ) );
    }
}

// 12. Toggle User Role AJAX Handler
add_action( 'wp_ajax_mashud_change_user_role', 'mashud_ajax_change_user_role' );

function mashud_ajax_change_user_role() {
    check_ajax_referer( 'mashud_telecom_nonce', 'security' );

    if ( !isset($_SESSION['mashud_user_id']) || $_SESSION['mashud_role'] !== 'admin' ) {
        wp_send_json_error( array( 'message' => 'Restricted clearance. Admin access required.' ) );
    }

    $target_user_id = intval( $_POST['targetUserId'] );
    $new_role = sanitize_text_field( $_POST['newRole'] );

    if ( !in_array($new_role, array('user', 'admin')) ) {
        wp_send_json_error( array( 'message' => 'Invalid role specified.' ) );
    }

    global $wpdb;
    $admin_id = $_SESSION['mashud_user_id'];
    $users_table = $wpdb->prefix . 'mashud_users';

    $updated = $wpdb->update(
        $users_table,
        array( 'role' => $new_role ),
        array( 'id' => $target_user_id ),
        array( '%s' ),
        array( '%d' )
    );

    if ( $updated !== false ) {
        mashud_log_activity( $admin_id, "Updated role of user #$target_user_id to $new_role." );
        mashud_create_notification( $target_user_id, 'Role Updated', "Your system role has been changed to " . strtoupper($new_role) . "." );
        wp_send_json_success( array( 'message' => "Account role updated to " . strtoupper($new_role) . " successfully." ) );
    } else {
        wp_send_json_error( array( 'message' => 'Failed to update account role.' ) );
    }
}

// 13. Admin Create Account AJAX Handler
add_action( 'wp_ajax_mashud_admin_create_user', 'mashud_ajax_admin_create_user' );

function mashud_ajax_admin_create_user() {
    check_ajax_referer( 'mashud_telecom_nonce', 'security' );

    if ( !isset($_SESSION['mashud_user_id']) || $_SESSION['mashud_role'] !== 'admin' ) {
        wp_send_json_error( array( 'message' => 'Restricted clearance.' ) );
    }

    $name = sanitize_text_field( $_POST['fullName'] );
    $email = sanitize_email( $_POST['email'] );
    $mobile = sanitize_text_field( $_POST['mobile'] );
    $pass = $_POST['password'];
    $role = sanitize_text_field( $_POST['role'] );
    $pin = sanitize_text_field( $_POST['adminPin'] );

    if ( empty($name) || empty($email) || empty($mobile) || empty($pass) ) {
        wp_send_json_error( array( 'message' => 'All account fields are required.' ) );
    }

    if ( !in_array($role, array('user', 'admin')) ) {
        $role = 'user';
    }

    global $wpdb;
    $table = $wpdb->prefix . 'mashud_users';

    $existing = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM $table WHERE email = %s OR mobile = %s", $email, $mobile ) );
    if ( $existing ) {
        wp_send_json_error( array( 'message' => 'Email or mobile is already registered.' ) );
    }

    $hashed_password = password_hash( $pass, PASSWORD_BCRYPT );

    $data = array(
        'full_name'     => $name,
        'email'         => $email,
        'mobile'        => $mobile,
        'password_hash' => $hashed_password,
        'balance'       => 100.00,
        'role'          => $role,
        'status'        => 'active'
    );
    $formats = array( '%s', '%s', '%s', '%s', '%f', '%s', '%s' );

    if ( $role === 'admin' ) {
        $data['admin_pin'] = !empty($pin) ? $pin : '123456';
        $formats[] = '%s';
    }

    $inserted = $wpdb->insert( $table, $data, $formats );

    if ( $inserted ) {
        mashud_log_activity( $_SESSION['mashud_user_id'], "Administrator created new $role account: $name ($mobile)." );
        wp_send_json_success( array( 'message' => "Successfully created new " . strtoupper($role) . " account for $name!" ) );
    } else {
        wp_send_json_error( array( 'message' => 'Database error creating new account.' ) );
    }
}

// 14. Real-time Live Stats Auto-update AJAX Handler
add_action( 'wp_ajax_mashud_get_live_stats', 'mashud_ajax_get_live_stats' );

function mashud_ajax_get_live_stats() {
    check_ajax_referer( 'mashud_telecom_nonce', 'security' );

    if ( !isset($_SESSION['mashud_user_id']) ) {
        wp_send_json_error( array( 'message' => 'Session expired.' ) );
    }

    global $wpdb;
    $user_id = $_SESSION['mashud_user_id'];
    $user_role = $_SESSION['mashud_role'];

    $users_table = $wpdb->prefix . 'mashud_users';
    $deposits_table = $wpdb->prefix . 'mashud_deposits';
    $txns_table = $wpdb->prefix . 'mashud_transactions';

    if ( $user_role === 'admin' ) {
        $pending_deposits = $wpdb->get_var( "SELECT COUNT(*) FROM $deposits_table WHERE status = 'pending'" );
        $pending_sends = $wpdb->get_var( "SELECT COUNT(*) FROM $txns_table WHERE type = 'send_money' AND status = 'pending'" );
        $total_users = $wpdb->get_var( "SELECT COUNT(*) FROM $users_table" );

        wp_send_json_success( array(
            'pending_deposits' => intval($pending_deposits),
            'pending_sends'    => intval($pending_sends),
            'total_users'      => intval($total_users)
        ));
    } else {
        $user = $wpdb->get_row( $wpdb->prepare( "SELECT balance FROM $users_table WHERE id = %d", $user_id ) );
        $unread_notifications = $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM {$wpdb->prefix}mashud_notifications WHERE user_id = %d AND read_status = 0", $user_id ) );

        wp_send_json_success( array(
            'balance'              => floatval($user->balance),
            'unread_notifications' => intval($unread_notifications)
        ));
    }
}

// 15. Adjust User Balance AJAX Handler
add_action( 'wp_ajax_mashud_adjust_user_balance', 'mashud_ajax_adjust_user_balance' );

function mashud_ajax_adjust_user_balance() {
    check_ajax_referer( 'mashud_telecom_nonce', 'security' );

    if ( !isset($_SESSION['mashud_user_id']) || $_SESSION['mashud_role'] !== 'admin' ) {
        wp_send_json_error( array( 'message' => 'Restricted clearance. Admin access required.' ) );
    }

    $target_user_id = intval( $_POST['targetUserId'] );
    $type = sanitize_text_field( $_POST['type'] );
    $amount = floatval( $_POST['amount'] );
    $note = sanitize_text_field( $_POST['note'] );

    if ( $amount <= 0 ) {
        wp_send_json_error( array( 'message' => 'Please enter a valid positive amount.' ) );
    }

    global $wpdb;
    $users_table = $wpdb->prefix . 'mashud_users';
    $user = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM $users_table WHERE id = %d", $target_user_id ) );

    if ( !$user ) {
        wp_send_json_error( array( 'message' => 'Target user account not found.' ) );
    }

    if ( $type === 'add' ) {
        $new_balance = $user->balance + $amount;
        $reason = !empty($note) ? $note : 'Admin Manual Credit';
        $notif_title = "Wallet Credited";
        $notif_msg = "Your wallet has been credited with {$amount} TK by Administrator. New Balance: " . number_format($new_balance, 2) . " TK.";
    } else {
        if ( $user->balance < $amount ) {
            wp_send_json_error( array( 'message' => 'Insufficient user balance for deduction.' ) );
        }
        $new_balance = $user->balance - $amount;
        $reason = !empty($note) ? $note : 'Admin Manual Debit';
        $notif_title = "Wallet Debited";
        $notif_msg = "Your wallet balance was debited by {$amount} TK by Administrator. New Balance: " . number_format($new_balance, 2) . " TK.";
    }

    $updated = $wpdb->update( $users_table, array( 'balance' => $new_balance ), array( 'id' => $target_user_id ), array( '%f' ), array( '%d' ) );

    if ( $updated !== false ) {
        mashud_log_activity( $_SESSION['mashud_user_id'], "Admin adjusted balance for {$user->full_name} (#$target_user_id) [{$type} {$amount} TK]. Note: $reason" );
        mashud_create_notification( $target_user_id, $notif_title, $notif_msg );
        wp_send_json_success( array( 
            'message' => "Successfully " . ($type === 'add' ? 'added' : 'deducted') . " {$amount} TK. New Balance: " . number_format($new_balance, 2) . " TK",
            'newBalance' => number_format($new_balance, 2)
        ) );
    } else {
        wp_send_json_error( array( 'message' => 'Failed to update user balance in database.' ) );
    }
}

// 16. Update Base Commission Rate AJAX Handler
add_action( 'wp_ajax_mashud_update_commission_rate', 'mashud_ajax_update_commission_rate' );

function mashud_ajax_update_commission_rate() {
    check_ajax_referer( 'mashud_telecom_nonce', 'security' );

    if ( !isset($_SESSION['mashud_user_id']) || $_SESSION['mashud_role'] !== 'admin' ) {
        wp_send_json_error( array( 'message' => 'Restricted clearance.' ) );
    }

    $rate = floatval( $_POST['rate'] );
    if ( $rate < 0 ) {
        wp_send_json_error( array( 'message' => 'Commission rate cannot be negative.' ) );
    }

    update_option( 'mashud_commission_rate', $rate );
    mashud_log_activity( $_SESSION['mashud_user_id'], "Updated system base commission rate to {$rate}%." );
    wp_send_json_success( array( 'message' => "Base commission rate updated to {$rate}% successfully!" ) );
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
`
    },
    {
      name: 'index.php',
      path: 'index.php',
      description: 'Standard fallback file for the WordPress post loops.',
      code: `<?php
/**
 * Main index template fallback.
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
`
    },
    {
      name: 'header.php',
      path: 'header.php',
      description: 'Site header loading metadata, typography, and primary navigation layouts.',
      code: `<!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
    <?php wp_head(); ?>
    <style>
        body {
            font-family: 'Inter', sans-serif;
        }
        h1, h2, h3, .font-display {
            font-family: 'Space Grotesk', sans-serif;
        }
    </style>
</head>
<body <?php body_class('bg-slate-50 min-h-screen flex flex-col'); ?>>
<?php wp_body_open(); ?>

<header class="bg-slate-950 text-white shadow-md sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div class="flex items-center space-x-3">
            <div class="bg-gradient-to-tr from-sky-500 to-emerald-500 p-2 rounded-lg text-black">
                <i data-lucide="pocket" class="w-6 h-6"></i>
            </div>
            <div>
                <a href="<?php echo esc_url( home_url() ); ?>" class="text-xl font-bold tracking-tight text-white font-display">
                    Mashud Telecom
                </a>
                <span class="block text-xs text-emerald-400">Digital Banking & Core API</span>
            </div>
        </div>
        
        <nav class="hidden md:flex space-x-6 items-center">
            <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="text-sm font-medium text-slate-300 hover:text-white">Home Portal</a>
            <a href="<?php echo esc_url( home_url( '/user-login/' ) ); ?>" class="text-sm font-medium text-slate-300 hover:text-white">Client Portal</a>
            <a href="<?php echo esc_url( home_url( '/admin-login/' ) ); ?>" class="text-sm font-medium text-slate-300 hover:text-white">Admin Control</a>
        </nav>

        <div class="flex space-x-2">
            <?php if ( isset($_SESSION['mashud_user_id']) ) : ?>
                <span class="text-xs bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-full inline-flex items-center text-slate-200">
                    <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
                    <?php echo esc_html( $_SESSION['mashud_full_name'] ); ?>
                </span>
                <a href="<?php echo esc_url( wp_nonce_url( home_url( '/logout/?action=mashud_logout' ), 'mashud_logout' ) ); ?>" class="text-xs text-red-400 hover:text-red-300 transition duration-150 py-1.5 px-3">
                    Disconnect
                </a>
            <?php else : ?>
                <a href="<?php echo esc_url( home_url( '/user-login/' ) ); ?>" class="bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition duration-150">
                    Get Started
                </a>
            <?php endif; ?>
        </div>
    </div>
</header>
`
    },
    {
      name: 'footer.php',
      path: 'footer.php',
      description: 'Standard WordPress footer script, copyright labels, and Lucide icons triggers.',
      code: `<footer class="bg-slate-900 border-t border-slate-800 text-slate-400 py-12 mt-auto">
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
`
    },
    {
      name: 'front-page.php',
      path: 'front-page.php',
      description: 'The master Landing Page showcasing the modern 2x2 grid menus linking register/login portals.',
      code: `<?php
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
`
    },
    {
      name: 'page-user-register.php',
      path: 'page-user-register.php',
      description: 'AJAX-integrated User Registration template containing 5 essential validation parameters.',
      code: `<?php
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
`
    },
    {
      name: 'page-user-login.php',
      path: 'page-user-login.php',
      description: 'AJAX login template with dynamic selector toggles (Email / Phone) and Forgot Password links.',
      code: `<?php
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
`
    },
    {
      name: 'page-admin-register.php',
      path: 'page-admin-register.php',
      description: 'AJAX Admin Registration template with secure PIN input configurations.',
      code: `<?php
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
`
    },
    {
      name: 'page-admin-login.php',
      path: 'page-admin-login.php',
      description: 'AJAX Admin authentication interface featuring high contrast secure controls.',
      code: `<?php
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
`
    },
    {
      name: 'page-user-dashboard.php',
      path: 'page-user-dashboard.php',
      description: 'Fintech client dashboard displaying profile variables, fund requests, transactions, and Excel/PDF download commands.',
      code: `<?php
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

global $wpdb;
$user_id = $_SESSION['mashud_user_id'];
$user_data = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM {$wpdb->prefix}mashud_users WHERE id = %d", $user_id ) );

// PDF e-Statement Export Handler (executed before get_header)
if ( isset($_GET['export']) && ($_GET['export'] === 'pdf' || $_GET['export'] === 'pdf_statement') ) {
    $txns = $wpdb->get_results( $wpdb->prepare( "SELECT * FROM {$wpdb->prefix}mashud_transactions WHERE user_id = %d ORDER BY created_at ASC", $user_id ) );
    
    $sum_app_deposit = 0;
    $sum_app_withdraw = 0;
    if (!empty($txns)) {
        foreach ($txns as $t) {
            if ($t->status === 'approved') {
                if ($t->type === 'deposit') {
                    $sum_app_deposit += floatval($t->amount);
                } else {
                    $sum_app_withdraw += floatval($t->amount);
                }
            }
        }
    }
    $opening_balance = floatval($user_data->balance) - $sum_app_deposit + $sum_app_withdraw;
    if ($opening_balance < 0) { $opening_balance = 0; }
    $running_balance = $opening_balance;
    $total_withdraw = 0;
    $total_deposit = 0;
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>BRAC Bank e-Statement - <?php echo esc_html($user_data->full_name); ?></title>
        <style>
            @page { size: A4 portrait; margin: 12mm 12mm; }
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 11px; color: #0f172a; margin: 0; padding: 24px; background: #fff; line-height: 1.35; }
            .watermark {
                position: fixed;
                top: 38%;
                left: 5%;
                width: 90%;
                transform: rotate(-35deg);
                font-size: 110px;
                font-weight: 900;
                color: rgba(200,205,215,0.18);
                text-align: center;
                pointer-events: none;
                z-index: -1;
            }
            .header-table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
            .mono { font-family: 'Courier New', Courier, monospace; }
            table.statement-table { width: 100%; border-collapse: collapse; font-family: 'Courier New', Courier, monospace; font-size: 10px; margin-top: 6px; }
            table.statement-table th { font-weight: bold; text-align: left; padding: 5px 0; border-top: 1px dashed #475569; border-bottom: 1px dashed #475569; }
            table.statement-table td { padding: 4px 0; vertical-align: top; }
            @media print {
                body { padding: 0; background: none; }
                .no-print { display: none !important; }
            }
        </style>
    </head>
    <body>
        <div class="watermark">e-Statement</div>
        
        <div class="no-print" style="text-align: right; margin-bottom: 15px;">
            <button onclick="window.print()" style="background: #0f172a; color: #fff; border: none; padding: 8px 18px; border-radius: 6px; font-weight: bold; cursor: pointer;">🖨️ Print / Save as PDF</button>
        </div>

        <table class="header-table">
            <tr>
                <td style="vertical-align: top; width: 50%;">
                    <div style="font-size: 16px; font-weight: bold; color: #0f172a; margin-bottom: 4px;">
                        <?php echo strtoupper(esc_html($user_data->full_name)); ?>
                    </div>
                    <div class="mono" style="font-size: 11px; color: #475569;">
                        Mobile: <?php echo esc_html($user_data->mobile); ?><br>
                        Account Statement
                    </div>
                </td>
                <td style="vertical-align: top; width: 50%; text-align: right;" class="mono">
                    <table style="margin-left: auto; font-size: 10px; text-align: left; border-spacing: 0 3px;">
                        <tr><td style="padding-right: 10px; font-weight: bold;">Currency</td><td>: BDT</td></tr>
                        <tr><td style="padding-right: 10px; font-weight: bold;">Issue Date</td><td>: <?php echo date('M d, Y'); ?></td></tr>
                        <tr><td style="padding-right: 10px; font-weight: bold;">Current Balance</td><td>: ৳ <?php echo number_format($user_data->balance, 2); ?></td></tr>
                    </table>
                </td>
            </tr>
        </table>

        <div class="mono" style="font-size: 10px; font-weight: bold; margin-top: 6px;">
            REF: MB 07431976072344390539
        </div>

        <div class="mono" style="font-size: 10px; font-weight: bold; margin: 10px 0 6px 0;">
            STATEMENT OF ACCOUNT FOR THE PERIOD  24-Jun-2026 TO <?php echo date('d-M-Y'); ?>
        </div>

        <table class="statement-table">
            <thead>
                <tr>
                    <th style="width: 15%;">DATE</th>
                    <th style="width: 40%;">PARTICULARS</th>
                    <th style="width: 10%;">CHQ.NO</th>
                    <th style="width: 11%; text-align: right;">WITHDRAW</th>
                    <th style="width: 11%; text-align: right;">DEPOSIT</th>
                    <th style="width: 13%; text-align: right;">BALANCE</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>24-Jun-2026</td>
                    <td>Balance Forward</td>
                    <td></td>
                    <td style="text-align: right;">0.00</td>
                    <td style="text-align: right;">0.00</td>
                    <td style="text-align: right;"><?php echo number_format($opening_balance, 2); ?></td>
                </tr>
                <?php
                if (!empty($txns)) {
                    foreach ($txns as $t) {
                        $is_approved = ($t->status === 'approved');
                        $is_deposit = ($t->type === 'deposit');
                        $amt = floatval($t->amount);
                        
                        $w_str = '';
                        $d_str = '';
                        
                        if ($is_approved) {
                            if ($is_deposit) {
                                $running_balance += $amt;
                                $total_deposit += $amt;
                                $d_str = number_format($amt, 2);
                            } else {
                                $running_balance -= $amt;
                                $total_withdraw += $amt;
                                $w_str = number_format($amt, 2);
                            }
                        } else {
                            if ($is_deposit) {
                                $d_str = '(' . number_format($amt, 2) . ' PND)';
                            } else {
                                $w_str = '(' . number_format($amt, 2) . ' PND)';
                            }
                        }
                        
                        $date_fmt = date('d-M-Y', strtotime($t->created_at));
                        if (!empty($t->recipient) && $t->recipient === 'System Commission Charge') {
                            $particulars = 'Commission Charge / Fee';
                        } else if ($is_deposit) {
                            $particulars = 'Deposit: ' . (!empty($t->way) ? $t->way : 'bKash') . ' (Ref: ' . (!empty($t->reference_no) ? $t->reference_no : '260625122202O8') . ')';
                        } else if ($t->type === 'send_money') {
                            $particulars = 'Send Money: ' . (!empty($t->recipient) ? $t->recipient : $user_data->mobile) . ' (' . (!empty($t->way) ? $t->way : 'bKash') . ')';
                        } else {
                            $particulars = 'Commission Credit (' . (!empty($t->way) ? $t->way : 'System') . ')';
                        }

                        $confirm_pin = !empty($t->auth_pin) ? ('PIN: ' . $t->auth_pin) : (!empty($t->supervisor_pin) ? ('PIN: ' . $t->supervisor_pin) : ($is_approved ? 'PIN: 123456' : 'PND'));
                        ?>
                        <tr>
                            <td><?php echo esc_html($date_fmt); ?></td>
                            <td><?php echo esc_html($particulars); ?></td>
                            <td><?php echo esc_html($confirm_pin); ?></td>
                            <td style="text-align: right;"><?php echo esc_html($w_str); ?></td>
                            <td style="text-align: right;"><?php echo esc_html($d_str); ?></td>
                            <td style="text-align: right; font-weight: bold;"><?php echo number_format($running_balance, 2); ?></td>
                        </tr>
                        <?php
                    }
                }
                ?>
            </tbody>
        </table>

        <div style="border-top: 1px dashed #475569; margin-top: 6px; padding-top: 4px;">
            <table class="statement-table" style="font-weight: bold;">
                <tr>
                    <td style="width: 65%;">TOTALS / CLOSING BALANCE:</td>
                    <td style="width: 11%; text-align: right; border-bottom: 3px double #475569;"><?php echo number_format($total_withdraw, 2); ?></td>
                    <td style="width: 11%; text-align: right; border-bottom: 3px double #475569;"><?php echo number_format($total_deposit, 2); ?></td>
                    <td style="width: 13%; text-align: right; border-bottom: 3px double #475569; font-weight: bold; font-size: 11px;"><?php echo number_format($running_balance, 2); ?></td>
                </tr>
            </table>
        </div>

        <div style="margin-top: 36px; font-size: 10px; color: #334155; line-height: 1.5;">
            This Electronic Statement is valid without signature.<br><br>
            Please advice the bank of any discrepancies within 14 days from the date of receipt of this statement.<br>
            Otherwise this statement will be considered correct.<br><br>
            <div style="text-align: center; font-weight: bold; margin-top: 10px;">***END OF THE STATEMENT***</div>
        </div>

        <div style="margin-top: 50px; border-top: 1px solid #1e293b; padding-top: 8px; display: flex; justify-content: space-between; align-items: center;">
            <div style="font-weight: bold; font-size: 11px;"><?php echo strtoupper(esc_html($user_data->full_name)); ?></div>
            <div style="font-size: 9px; color: #64748b;">proud member <strong>global alliance for banking on values</strong></div>
        </div>

        <script>
            window.onload = function() {
                setTimeout(function() { window.print(); }, 500);
            };
        </script>
    </body>
    </html>
    <?php
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
`
    },
    {
      name: 'page-admin-dashboard.php',
      path: 'page-admin-dashboard.php',
      description: 'The executive command dashboard containing system calculations, search algorithms, and authorization structures.',
      code: `<?php
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

global $wpdb;
$admin_id = $_SESSION['mashud_user_id'];
$users_table = $wpdb->prefix . 'mashud_users';
$deposits_table = $wpdb->prefix . 'mashud_deposits';
$txns_table = $wpdb->prefix . 'mashud_transactions';
$logs_table = $wpdb->prefix . 'mashud_activity_logs';

// CSV Export Download Handler - executed before get_header()
if ( isset($_GET['export']) && $_GET['export'] === 'all_clients' ) {
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename=mashud_telecom_clients_' . date('Y-m-d') . '.csv');
    $output = fopen('php://output', 'w');
    fputcsv($output, array('User ID', 'Full Name', 'Email', 'Mobile', 'Role', 'Balance (TK)', 'Status', 'Registration Date'));
    $clients = $wpdb->get_results("SELECT id, full_name, email, mobile, role, balance, status, created_at FROM $users_table ORDER BY id ASC");
    foreach ($clients as $c) {
        fputcsv($output, array($c->id, $c->full_name, $c->email, $c->mobile, $c->role, $c->balance, $c->status, $c->created_at));
    }
    fclose($output);
    exit;
}

// PDF e-Statement Handler for Admin
if ( isset($_GET['export']) && ($_GET['export'] === 'pdf' || $_GET['export'] === 'pdf_statement') ) {
    $target_uid = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;
    if ($target_uid > 0) {
        $target_user = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM {$users_table} WHERE id = %d", $target_uid ) );
    }
    if (empty($target_user)) {
        $target_user = $wpdb->get_row( "SELECT * FROM {$users_table} WHERE role = 'user' LIMIT 1" );
    }
    if (empty($target_user)) {
        $target_user = (object) array('id' => 1, 'full_name' => 'MASUD TELECOM CLIENT', 'email' => 'client@mashud-telecom.com', 'mobile' => '01700000000');
    }

    $txns = $wpdb->get_results( $wpdb->prepare( "SELECT * FROM {$txns_table} WHERE user_id = %d ORDER BY created_at ASC", $target_user->id ) );

    $sum_app_deposit = 0;
    $sum_app_withdraw = 0;
    if (!empty($txns)) {
        foreach ($txns as $t) {
            if ($t->status === 'approved') {
                if ($t->type === 'deposit') {
                    $sum_app_deposit += floatval($t->amount);
                } else {
                    $sum_app_withdraw += floatval($t->amount);
                }
            }
        }
    }
    $opening_balance = floatval($target_user->balance) - $sum_app_deposit + $sum_app_withdraw;
    if ($opening_balance < 0) { $opening_balance = 0; }
    $running_balance = $opening_balance;
    $total_withdraw = 0;
    $total_deposit = 0;
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>BRAC Bank e-Statement - <?php echo esc_html($target_user->full_name); ?></title>
        <style>
            @page { size: A4 portrait; margin: 12mm 12mm; }
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 11px; color: #0f172a; margin: 0; padding: 24px; background: #fff; line-height: 1.35; }
            .watermark {
                position: fixed;
                top: 38%;
                left: 5%;
                width: 90%;
                transform: rotate(-35deg);
                font-size: 110px;
                font-weight: 900;
                color: rgba(200,205,215,0.18);
                text-align: center;
                pointer-events: none;
                z-index: -1;
            }
            .header-table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
            .mono { font-family: 'Courier New', Courier, monospace; }
            table.statement-table { width: 100%; border-collapse: collapse; font-family: 'Courier New', Courier, monospace; font-size: 10px; margin-top: 6px; }
            table.statement-table th { font-weight: bold; text-align: left; padding: 5px 0; border-top: 1px dashed #475569; border-bottom: 1px dashed #475569; }
            table.statement-table td { padding: 4px 0; vertical-align: top; }
            @media print {
                body { padding: 0; background: none; }
                .no-print { display: none !important; }
            }
        </style>
    </head>
    <body>
        <div class="watermark">e-Statement</div>
        
        <div class="no-print" style="text-align: right; margin-bottom: 15px;">
            <button onclick="window.print()" style="background: #0f172a; color: #fff; border: none; padding: 8px 18px; border-radius: 6px; font-weight: bold; cursor: pointer;">🖨️ Print / Save as PDF</button>
        </div>

        <table class="header-table">
            <tr>
                <td style="vertical-align: top; width: 50%;">
                    <div style="font-size: 16px; font-weight: bold; color: #0f172a; margin-bottom: 4px;">
                        <?php echo strtoupper(esc_html($target_user->full_name)); ?>
                    </div>
                    <div class="mono" style="font-size: 11px; color: #475569;">
                        Mobile: <?php echo esc_html($target_user->mobile); ?><br>
                        Account Statement
                    </div>
                </td>
                <td style="vertical-align: top; width: 50%; text-align: right;" class="mono">
                    <table style="margin-left: auto; font-size: 10px; text-align: left; border-spacing: 0 3px;">
                        <tr><td style="padding-right: 10px; font-weight: bold;">Currency</td><td>: BDT</td></tr>
                        <tr><td style="padding-right: 10px; font-weight: bold;">Issue Date</td><td>: <?php echo date('M d, Y'); ?></td></tr>
                        <tr><td style="padding-right: 10px; font-weight: bold;">Current Balance</td><td>: ৳ <?php echo number_format($target_user->balance, 2); ?></td></tr>
                    </table>
                </td>
            </tr>
        </table>

        <div class="mono" style="font-size: 10px; font-weight: bold; margin-top: 6px;">
            REF: MB 07431976072344390539
        </div>

        <div class="mono" style="font-size: 10px; font-weight: bold; margin: 10px 0 6px 0;">
            STATEMENT OF ACCOUNT FOR THE PERIOD  24-Jun-2026 TO <?php echo date('d-M-Y'); ?>
        </div>

        <table class="statement-table">
            <thead>
                <tr>
                    <th style="width: 15%;">DATE</th>
                    <th style="width: 40%;">PARTICULARS</th>
                    <th style="width: 10%;">CHQ.NO</th>
                    <th style="width: 11%; text-align: right;">WITHDRAW</th>
                    <th style="width: 11%; text-align: right;">DEPOSIT</th>
                    <th style="width: 13%; text-align: right;">BALANCE</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>24-Jun-2026</td>
                    <td>Balance Forward</td>
                    <td></td>
                    <td style="text-align: right;">0.00</td>
                    <td style="text-align: right;">0.00</td>
                    <td style="text-align: right;"><?php echo number_format($opening_balance, 2); ?></td>
                </tr>
                <?php
                if (!empty($txns)) {
                    foreach ($txns as $t) {
                        $is_approved = ($t->status === 'approved');
                        $is_deposit = ($t->type === 'deposit');
                        $amt = floatval($t->amount);
                        
                        $w_str = '';
                        $d_str = '';
                        
                        if ($is_approved) {
                            if ($is_deposit) {
                                $running_balance += $amt;
                                $total_deposit += $amt;
                                $d_str = number_format($amt, 2);
                            } else {
                                $running_balance -= $amt;
                                $total_withdraw += $amt;
                                $w_str = number_format($amt, 2);
                            }
                        } else {
                            if ($is_deposit) {
                                $d_str = '(' . number_format($amt, 2) . ' PND)';
                            } else {
                                $w_str = '(' . number_format($amt, 2) . ' PND)';
                            }
                        }
                        
                        $date_fmt = date('d-M-Y', strtotime($t->created_at));
                        if (!empty($t->recipient) && $t->recipient === 'System Commission Charge') {
                            $particulars = 'Commission Charge / Fee';
                        } else if ($is_deposit) {
                            $particulars = 'Deposit: ' . (!empty($t->way) ? $t->way : 'bKash') . ' (Ref: ' . (!empty($t->reference_no) ? $t->reference_no : '260625122202O8') . ')';
                        } else if ($t->type === 'send_money') {
                            $particulars = 'Send Money: ' . (!empty($t->recipient) ? $t->recipient : $target_user->mobile) . ' (' . (!empty($t->way) ? $t->way : 'bKash') . ')';
                        } else {
                            $particulars = 'Commission Credit (' . (!empty($t->way) ? $t->way : 'System') . ')';
                        }

                        $confirm_pin = !empty($t->auth_pin) ? ('PIN: ' . $t->auth_pin) : (!empty($t->supervisor_pin) ? ('PIN: ' . $t->supervisor_pin) : ($is_approved ? 'PIN: 123456' : 'PND'));
                        ?>
                        <tr>
                            <td><?php echo esc_html($date_fmt); ?></td>
                            <td><?php echo esc_html($particulars); ?></td>
                            <td><?php echo esc_html($confirm_pin); ?></td>
                            <td style="text-align: right;"><?php echo esc_html($w_str); ?></td>
                            <td style="text-align: right;"><?php echo esc_html($d_str); ?></td>
                            <td style="text-align: right; font-weight: bold;"><?php echo number_format($running_balance, 2); ?></td>
                        </tr>
                        <?php
                    }
                }
                ?>
            </tbody>
        </table>

        <div style="border-top: 1px dashed #475569; margin-top: 6px; padding-top: 4px;">
            <table class="statement-table" style="font-weight: bold;">
                <tr>
                    <td style="width: 65%;">TOTALS / CLOSING BALANCE:</td>
                    <td style="width: 11%; text-align: right; border-bottom: 3px double #475569;"><?php echo number_format($total_withdraw, 2); ?></td>
                    <td style="width: 11%; text-align: right; border-bottom: 3px double #475569;"><?php echo number_format($total_deposit, 2); ?></td>
                    <td style="width: 13%; text-align: right; border-bottom: 3px double #475569; font-weight: bold; font-size: 11px;"><?php echo number_format($running_balance, 2); ?></td>
                </tr>
            </table>
        </div>

        <div style="margin-top: 36px; font-size: 10px; color: #334155; line-height: 1.5;">
            This Electronic Statement is valid without signature.<br><br>
            Please advice the bank of any discrepancies within 14 days from the date of receipt of this statement.<br>
            Otherwise this statement will be considered correct.<br><br>
            <div style="text-align: center; font-weight: bold; margin-top: 10px;">***END OF THE STATEMENT***</div>
        </div>

        <div style="margin-top: 50px; border-top: 1px solid #1e293b; padding-top: 8px; display: flex; justify-content: space-between; align-items: center;">
            <div style="font-weight: bold; font-size: 11px;"><?php echo strtoupper(esc_html($target_user->full_name)); ?></div>
            <div style="font-size: 9px; color: #64748b;">proud member <strong>global alliance for banking on values</strong></div>
        </div>

        <script>
            window.onload = function() {
                setTimeout(function() { window.print(); }, 500);
            };
        </script>
    </body>
    </html>
    <?php
    exit;
}

get_header();

// 1. Calculations: Dynamic Stat Summaries
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
    $client_directory = $wpdb->get_results( $wpdb->prepare("SELECT * FROM $users_table WHERE full_name LIKE %s OR mobile LIKE %s OR email LIKE %s ORDER BY created_at DESC", '%'.$search_query.'%', '%'.$search_query.'%', '%'.$search_query.'%') );
} else {
    $client_directory = $wpdb->get_results( "SELECT * FROM $users_table ORDER BY created_at DESC LIMIT 30" );
}
$comm_rate = get_option('mashud_commission_rate', '1.85');
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
                <span>Download Client Ledger (CSV)</span>
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
                                    <button onclick="triggerAction('approve_deposit', <?php echo $dep->id; ?>)" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-1.5 px-3 rounded-lg cursor-pointer transition">Approve</button>
                                    <button onclick="triggerAction('reject_deposit', <?php echo $dep->id; ?>)" class="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold py-1.5 px-3 rounded-lg border border-red-200 cursor-pointer transition">Decline</button>
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
                                    <button onclick="triggerAction('approve_send', <?php echo $txn->id; ?>)" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-1.5 px-3 rounded-lg cursor-pointer transition">Approve</button>
                                    <button onclick="triggerAction('reject_send', <?php echo $txn->id; ?>)" class="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold py-1.5 px-3 rounded-lg border border-red-200 cursor-pointer transition">Decline</button>
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
            
            <!-- User Directory Search & Management Layout -->
            <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div class="flex justify-between items-center">
                    <h2 class="text-base font-bold text-slate-900 font-display">Client & Admin Directory</h2>
                    <button onclick="openCreateAccountModal()" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-1.5 px-3 rounded-lg flex items-center space-x-1 shadow cursor-pointer transition">
                        <i data-lucide="user-plus" class="w-3.5 h-3.5"></i>
                        <span>Create Account</span>
                    </button>
                </div>

                <form method="POST" class="flex space-x-2">
                    <input type="text" name="client_search" value="<?php echo esc_attr($search_query); ?>" class="block w-full p-2 border border-slate-300 rounded-lg text-xs bg-slate-50" placeholder="Search name, phone or email...">
                    <button type="submit" class="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer">Search</button>
                </form>
                
                <div class="space-y-3 max-h-80 overflow-y-auto divide-y divide-slate-100 pr-1">
                    <?php foreach ( $client_directory as $client ) : ?>
                        <div class="pt-2 flex justify-between items-center text-xs">
                            <div class="space-y-0.5">
                                <div class="flex items-center space-x-1.5">
                                    <h4 class="font-bold text-slate-900"><?php echo esc_html($client->full_name); ?></h4>
                                    <span class="text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded <?php echo $client->role === 'admin' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-slate-100 text-slate-600'; ?>">
                                        <?php echo esc_html($client->role); ?>
                                    </span>
                                </div>
                                <p class="text-slate-400 font-mono text-[10px]"><?php echo esc_html($client->mobile); ?></p>
                            </div>
                            <div class="flex items-center space-x-1.5">
                                <button onclick="openUserControlModal(<?php echo $client->id; ?>, '<?php echo esc_js($client->full_name); ?>', '<?php echo esc_js($client->mobile); ?>', '<?php echo esc_js($client->email); ?>', <?php echo $client->balance; ?>, '<?php echo esc_js($client->role); ?>')" class="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition" title="Adjust Wallet Balance">
                                    <i data-lucide="wallet" class="w-3.5 h-3.5"></i>
                                </button>
                                <button onclick="toggleUserRole(<?php echo $client->id; ?>, '<?php echo $client->role === 'admin' ? 'user' : 'admin'; ?>', '<?php echo esc_js($client->full_name); ?>')" class="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition" title="Toggle role to <?php echo $client->role === 'admin' ? 'User' : 'Admin'; ?>">
                                    <i data-lucide="shield" class="w-3.5 h-3.5"></i>
                                </button>
                                <button onclick="triggerDeleteUser(<?php echo $client->id; ?>, '<?php echo esc_js($client->full_name); ?>', '<?php echo esc_js($client->mobile); ?>')" class="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete account profile">
                                    <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                                </button>
                                <div class="text-right pl-1">
                                    <span class="font-bold text-emerald-600 block"><?php echo number_format($client->balance, 2); ?> TK</span>
                                    <span class="block text-[8px] text-slate-400 uppercase"><?php echo esc_html($client->status); ?></span>
                                </div>
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
                        <span id="display-comm-rate" class="text-sky-600"><?php echo esc_html($comm_rate); ?>% Per Transaction</span>
                    </div>
                    <div class="flex justify-between font-semibold">
                        <span>System Reserves:</span>
                        <span class="text-emerald-600"><?php echo number_format($total_dep_sum * ($comm_rate / 100), 2); ?> TK</span>
                    </div>
                </div>
                <div class="space-y-3">
                    <label class="block text-[10px] font-bold text-slate-500 uppercase">Adjust Base Rate (%)</label>
                    <div class="flex space-x-2">
                        <input type="number" id="commission-rate" value="<?php echo esc_attr($comm_rate); ?>" step="0.01" class="block w-24 p-2 border border-slate-300 rounded-lg text-xs bg-slate-50 font-bold">
                        <button onclick="updateCommissionRate()" class="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold py-2 px-3 rounded-lg flex-grow transition shadow cursor-pointer">Apply Rates</button>
                    </div>
                    <div id="commission-rate-msg" class="text-xs text-center font-bold hidden"></div>
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
                <button onclick="closePinModal()" class="py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer">Cancel</button>
                <button onclick="confirmPinAction()" class="py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow cursor-pointer">Authorize Action</button>
            </div>
        </div>
    </div>
</div>

<!-- Delete User Modal Dialog -->
<div id="delete-user-modal" class="hidden fixed inset-0 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="bg-white p-6 rounded-2xl max-w-sm w-full border border-slate-200 shadow-xl space-y-4 text-left">
        <div class="flex items-center space-x-3 text-red-600 border-b border-slate-100 pb-3">
            <div class="p-2 bg-red-100 rounded-xl">
                <i data-lucide="trash-2" class="w-5 h-5"></i>
            </div>
            <div>
                <h3 class="text-sm font-bold text-slate-900">Delete Account Profile</h3>
                <p class="text-[10px] text-slate-500">WordPress Database Permanent Deletion</p>
            </div>
        </div>
        <p class="text-xs text-slate-600 leading-relaxed">
            Are you sure you want to permanently delete account <strong id="delete-user-name" class="text-slate-900 font-bold"></strong> (<span id="delete-user-mobile" class="font-mono"></span>)?
        </p>
        <div class="space-y-2">
            <label class="block text-[10px] font-bold text-slate-500 uppercase">Admin Confirmation PIN</label>
            <input type="password" id="delete-user-pin" maxlength="6" class="block w-full p-2 border border-slate-300 rounded-lg text-center font-mono text-lg tracking-widest bg-slate-50" placeholder="123456">
            <div id="delete-user-error" class="text-xs text-red-500 hidden font-medium"></div>
        </div>
        <div class="p-2 bg-amber-50 border border-amber-200 rounded-lg text-[10px] text-amber-800 font-medium">
            ⚠️ Warning: This will delete the user account, transactions, and logs permanently from WordPress.
        </div>
        <div class="grid grid-cols-2 gap-3 pt-1">
            <button onclick="closeDeleteUserModal()" class="py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer">Cancel</button>
            <button onclick="confirmDeleteUser()" class="py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow cursor-pointer">Confirm Delete</button>
        </div>
    </div>
</div>

<!-- Admin Create Account Modal Dialog -->
<div id="create-account-modal" class="hidden fixed inset-0 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="bg-white p-6 rounded-2xl max-w-md w-full border border-slate-200 shadow-xl space-y-4 text-left">
        <div class="flex justify-between items-center pb-3 border-b border-slate-100">
            <div class="flex items-center space-x-2">
                <i data-lucide="user-plus" class="w-5 h-5 text-emerald-600"></i>
                <h3 class="text-sm font-bold text-slate-900">Create New Account (User or Admin)</h3>
            </div>
            <button onclick="closeCreateAccountModal()" class="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <i data-lucide="x" class="w-4 h-4"></i>
            </button>
        </div>
        <form id="create-account-form" onsubmit="submitCreateAccount(event)" class="space-y-3 text-xs">
            <div>
                <label class="block text-[10px] font-bold uppercase text-slate-500 mb-1">Account Role</label>
                <select id="new-account-role" class="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 font-bold">
                    <option value="user">Client User</option>
                    <option value="admin">Administrator</option>
                </select>
            </div>
            <div>
                <label class="block text-[10px] font-bold uppercase text-slate-500 mb-1">Full Name</label>
                <input type="text" id="new-account-name" required class="w-full p-2 border border-slate-300 rounded-lg bg-slate-50" placeholder="e.g. Rahul Mashud">
            </div>
            <div>
                <label class="block text-[10px] font-bold uppercase text-slate-500 mb-1">Email Address</label>
                <input type="email" id="new-account-email" required class="w-full p-2 border border-slate-300 rounded-lg bg-slate-50" placeholder="user@example.com">
            </div>
            <div>
                <label class="block text-[10px] font-bold uppercase text-slate-500 mb-1">Mobile Number</label>
                <input type="tel" id="new-account-mobile" required class="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 font-mono" placeholder="+8801700000000">
            </div>
            <div>
                <label class="block text-[10px] font-bold uppercase text-slate-500 mb-1">Password</label>
                <input type="password" id="new-account-password" required class="w-full p-2 border border-slate-300 rounded-lg bg-slate-50" placeholder="••••••••">
            </div>
            <div id="new-account-pin-container" class="hidden">
                <label class="block text-[10px] font-bold uppercase text-slate-500 mb-1">6-Digit Admin Confirmation PIN</label>
                <input type="text" id="new-account-pin" maxlength="6" class="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 font-mono text-center tracking-widest" value="123456">
            </div>
            <div id="create-account-error" class="text-xs text-red-500 hidden font-medium"></div>
            <div class="grid grid-cols-2 gap-3 pt-2">
                <button type="button" onclick="closeCreateAccountModal()" class="py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer">Cancel</button>
                <button type="submit" class="py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow cursor-pointer">Create Account</button>
            </div>
        </form>
    </div>
</div>

<!-- User Control & Wallet Adjustment Modal Dialog -->
<div id="user-control-modal" class="hidden fixed inset-0 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="bg-white p-6 rounded-2xl max-w-md w-full border border-slate-200 shadow-xl space-y-4 text-left">
        <div class="flex justify-between items-center pb-3 border-b border-slate-100">
            <div class="flex items-center space-x-2">
                <div class="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                    <i data-lucide="wallet" class="w-5 h-5"></i>
                </div>
                <div>
                    <h3 id="ctrl-user-name" class="text-sm font-bold text-slate-900"></h3>
                    <p class="text-[10px] text-slate-500"><span id="ctrl-user-mobile" class="font-mono"></span> | <span id="ctrl-user-email"></span></p>
                </div>
            </div>
            <button onclick="closeUserControlModal()" class="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <i data-lucide="x" class="w-4 h-4"></i>
            </button>
        </div>
        <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center">
            <span class="text-xs text-slate-500 font-semibold">Current Wallet Balance:</span>
            <span id="ctrl-user-balance" class="text-base font-bold text-emerald-600 font-display">0.00 TK</span>
        </div>
        <form id="ctrl-balance-form" onsubmit="event.preventDefault();" class="space-y-3 text-xs">
            <div>
                <label class="block text-[10px] font-bold uppercase text-slate-500 mb-1">Adjustment Amount (TK)</label>
                <input type="number" id="ctrl-amount" min="1" step="0.01" required class="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 font-bold" placeholder="e.g. 500">
            </div>
            <div>
                <label class="block text-[10px] font-bold uppercase text-slate-500 mb-1">Adjustment Reason / Note</label>
                <input type="text" id="ctrl-note" class="w-full p-2 border border-slate-300 rounded-lg bg-slate-50" placeholder="e.g. Deposit Credit / Cash Adjustment">
            </div>
            <div id="ctrl-error" class="text-xs text-center font-semibold hidden"></div>
            <div class="grid grid-cols-2 gap-3 pt-1">
                <button type="button" onclick="submitBalanceAdjust('add')" class="py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow cursor-pointer transition">
                    + Add Funds
                </button>
                <button type="button" onclick="submitBalanceAdjust('deduct')" class="py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow cursor-pointer transition">
                    - Deduct Funds
                </button>
            </div>
        </form>
    </div>
</div>

<script>
jQuery(document).ready(function($) {
    var activeAction = null;
    var activeTarget = null;
    var targetDeleteUserId = null;
    var ctrlTargetUserId = null;
    var lastPendingDepositsCount = <?php echo count($pending_deposits); ?>;
    var lastPendingSendsCount = <?php echo count($pending_transfers); ?>;

    if (typeof lucide !== 'undefined') { lucide.createIcons(); }

    window.triggerAction = function(action, id) {
        activeAction = action;
        activeTarget = id;
        $('#modal-pin').val('');
        $('#pin-error').addClass('hidden');
        $('#pin-modal').removeClass('hidden');
    };

    window.closePinModal = function() {
        $('#pin-modal').addClass('hidden');
        activeAction = null;
        activeTarget = null;
    };

    window.confirmPinAction = function() {
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
                    window.closePinModal();
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
    };

    window.triggerDeleteUser = function(userId, userName, userMobile) {
        targetDeleteUserId = userId;
        $('#delete-user-name').text(userName);
        $('#delete-user-mobile').text(userMobile);
        $('#delete-user-pin').val('');
        $('#delete-user-error').addClass('hidden');
        $('#delete-user-modal').removeClass('hidden');
    };

    window.closeDeleteUserModal = function() {
        $('#delete-user-modal').addClass('hidden');
        targetDeleteUserId = null;
    };

    window.confirmDeleteUser = function() {
        var pin = $('#delete-user-pin').val();
        if (pin.length !== 6) {
            $('#delete-user-error').removeClass('hidden').text('Security PIN must be 6 digits.');
            return;
        }

        $.ajax({
            url: mashud_ajax.ajaxurl,
            type: 'POST',
            data: {
                action: 'mashud_delete_user',
                security: mashud_ajax.nonce,
                targetUserId: targetDeleteUserId,
                adminPin: pin
            },
            success: function(response) {
                if (response.success) {
                    window.closeDeleteUserModal();
                    alert(response.data.message);
                    location.reload();
                } else {
                    $('#delete-user-error').removeClass('hidden').text(response.data.message);
                }
            },
            error: function() {
                $('#delete-user-error').removeClass('hidden').text('Failed to send delete request to WordPress server.');
            }
        });
    };

    window.toggleUserRole = function(userId, newRole, name) {
        if (!confirm('Are you sure you want to change role of ' + name + ' to ' + newRole.toUpperCase() + '?')) {
            return;
        }

        $.ajax({
            url: mashud_ajax.ajaxurl,
            type: 'POST',
            data: {
                action: 'mashud_change_user_role',
                security: mashud_ajax.nonce,
                targetUserId: userId,
                newRole: newRole
            },
            success: function(response) {
                if (response.success) {
                    alert(response.data.message);
                    location.reload();
                } else {
                    alert('Error: ' + response.data.message);
                }
            }
        });
    };

    window.openCreateAccountModal = function() {
        $('#create-account-form')[0].reset();
        $('#create-account-error').addClass('hidden');
        $('#create-account-modal').removeClass('hidden');
    };

    window.closeCreateAccountModal = function() {
        $('#create-account-modal').addClass('hidden');
    };

    $('#new-account-role').on('change', function() {
        if ($(this).val() === 'admin') {
            $('#new-account-pin-container').removeClass('hidden');
        } else {
            $('#new-account-pin-container').addClass('hidden');
        }
    });

    window.submitCreateAccount = function(e) {
        if (e) e.preventDefault();
        $('#create-account-error').addClass('hidden');

        $.ajax({
            url: mashud_ajax.ajaxurl,
            type: 'POST',
            data: {
                action: 'mashud_admin_create_user',
                security: mashud_ajax.nonce,
                fullName: $('#new-account-name').val(),
                email: $('#new-account-email').val(),
                mobile: $('#new-account-mobile').val(),
                password: $('#new-account-password').val(),
                role: $('#new-account-role').val(),
                adminPin: $('#new-account-pin').val()
            },
            success: function(response) {
                if (response.success) {
                    window.closeCreateAccountModal();
                    alert(response.data.message);
                    location.reload();
                } else {
                    $('#create-account-error').removeClass('hidden').text(response.data.message);
                }
            }
        });
    };

    window.openUserControlModal = function(id, name, mobile, email, balance, role) {
        ctrlTargetUserId = id;
        $('#ctrl-user-name').text(name + ' (' + role.toUpperCase() + ')');
        $('#ctrl-user-mobile').text(mobile);
        $('#ctrl-user-email').text(email);
        $('#ctrl-user-balance').text(parseFloat(balance).toFixed(2) + ' TK');
        $('#ctrl-amount').val('');
        $('#ctrl-note').val('');
        $('#ctrl-error').addClass('hidden');
        $('#user-control-modal').removeClass('hidden');
    };

    window.closeUserControlModal = function() {
        $('#user-control-modal').addClass('hidden');
        ctrlTargetUserId = null;
    };

    window.submitBalanceAdjust = function(type) {
        var amt = parseFloat($('#ctrl-amount').val());
        if (!amt || amt <= 0) {
            $('#ctrl-error').removeClass('hidden text-emerald-600').addClass('text-red-500').text('Please enter a valid amount.');
            return;
        }

        $('#ctrl-error').removeClass('hidden text-red-500').addClass('text-slate-500').text('Processing balance adjustment...');

        $.ajax({
            url: mashud_ajax.ajaxurl,
            type: 'POST',
            data: {
                action: 'mashud_adjust_user_balance',
                security: mashud_ajax.nonce,
                targetUserId: ctrlTargetUserId,
                type: type,
                amount: amt,
                note: $('#ctrl-note').val()
            },
            success: function(response) {
                if (response.success) {
                    $('#ctrl-error').removeClass('text-slate-500 text-red-500').addClass('text-emerald-600').text(response.data.message);
                    if (response.data.newBalance) {
                        $('#ctrl-user-balance').text(response.data.newBalance + ' TK');
                    }
                    setTimeout(function() {
                        window.closeUserControlModal();
                        location.reload();
                    }, 1200);
                } else {
                    $('#ctrl-error').removeClass('text-slate-500 text-emerald-600').addClass('text-red-500').text(response.data.message);
                }
            },
            error: function() {
                $('#ctrl-error').removeClass('text-slate-500 text-emerald-600').addClass('text-red-500').text('AJAX request failed.');
            }
        });
    };

    window.updateCommissionRate = function() {
        var rate = $('#commission-rate').val();
        var msg = $('#commission-rate-msg');
        msg.removeClass('hidden text-red-500 text-emerald-600').addClass('text-slate-500').text('Updating rate...');

        $.ajax({
            url: mashud_ajax.ajaxurl,
            type: 'POST',
            data: {
                action: 'mashud_update_commission_rate',
                security: mashud_ajax.nonce,
                rate: rate
            },
            success: function(response) {
                if (response.success) {
                    msg.removeClass('text-slate-500').addClass('text-emerald-600').text(response.data.message);
                    $('#display-comm-rate').text(rate + '% Per Transaction');
                } else {
                    msg.removeClass('text-slate-500').addClass('text-red-500').text(response.data.message);
                }
            }
        });
    };

    // Real-Time Polling for Admin Dashboard Auto-Update
    setInterval(function() {
        $.ajax({
            url: mashud_ajax.ajaxurl,
            type: 'POST',
            data: {
                action: 'mashud_get_live_stats',
                security: mashud_ajax.nonce
            },
            success: function(response) {
                if (response.success && response.data) {
                    var d = response.data;
                    if (d.pending_deposits !== lastPendingDepositsCount || d.pending_sends !== lastPendingSendsCount) {
                        location.reload();
                    }
                }
            }
        });
    }, 4000);
});
</script>

<?php get_footer(); ?>
`
    }
  ];
}
