<!doctype html>
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
