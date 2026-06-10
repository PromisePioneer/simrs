<?php

declare(strict_types=1);

return [
    /*
    |--------------------------------------------------------------------------
    | Pharmacy Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for the Pharmacy Management System
    |
    */

    'procurement' => [
        // Stock alert thresholds
        'stock_low_threshold' => env('PHARMACY_STOCK_LOW_THRESHOLD', 10),
        'stock_critical_threshold' => env('PHARMACY_STOCK_CRITICAL_THRESHOLD', 5),

        // Expired date alert (days before expiry)
        'expired_soon_threshold' => env('PHARMACY_EXPIRED_SOON_THRESHOLD', 30),

        // Default discount percentage for suppliers
        'default_discount_percentage' => env('PHARMACY_DEFAULT_DISCOUNT', 0),

        // Default tax percentage
        'default_tax_percentage' => env('PHARMACY_DEFAULT_TAX', 10),
    ],

    'prescriptions' => [
        // Maximum prescription validity (days)
        'validity_days' => env('PHARMACY_PRESCRIPTION_VALIDITY_DAYS', 30),

        // Enable LASA checking
        'enable_lasa_checking' => env('PHARMACY_ENABLE_LASA_CHECKING', true),

        // Enable drug interaction checking
        'enable_interaction_checking' => env('PHARMACY_ENABLE_INTERACTION_CHECKING', true),

        // Enable high-alert medicine tracking
        'enable_high_alert_tracking' => env('PHARMACY_ENABLE_HIGH_ALERT_TRACKING', true),

        // Require 3-stage review (admin, pharma, clinical)
        'require_three_stage_review' => env('PHARMACY_REQUIRE_THREE_STAGE_REVIEW', true),

        // Auto-generate etiket on dispensing
        'auto_generate_etiket' => env('PHARMACY_AUTO_GENERATE_ETIKET', true),
    ],

    'sales' => [
        // Default discount percentage per item
        'default_item_discount' => env('PHARMACY_DEFAULT_ITEM_DISCOUNT', 10),

        // Tax percentage on sales
        'sales_tax_percentage' => env('PHARMACY_SALES_TAX_PERCENTAGE', 10),

        // Allow OTC (over-the-counter) sales without prescription
        'allow_otc_sales' => env('PHARMACY_ALLOW_OTC_SALES', true),

        // Require payment status before completing sale
        'require_payment_on_complete' => env('PHARMACY_REQUIRE_PAYMENT_ON_COMPLETE', false),

        // Batch depletion strategy: 'fifo' or 'lifo'
        'batch_depletion_strategy' => env('PHARMACY_BATCH_DEPLETION_STRATEGY', 'fifo'),
    ],

    'safety' => [
        // Enable automatic safety alerts
        'enable_auto_alerts' => env('PHARMACY_ENABLE_AUTO_ALERTS', true),

        // Alert generation frequency (minutes)
        'alert_check_frequency' => env('PHARMACY_ALERT_CHECK_FREQUENCY', 60),

        // High alert medicines requiring extra approval
        'high_alert_medicines' => [
            'narcotic' => true,
            'psychotropic' => true,
            'anticoagulant' => true,
            'insulin' => true,
        ],

        // LASA (Look Alike Sound Alike) detection
        'enable_lasa_detection' => env('PHARMACY_ENABLE_LASA_DETECTION', true),
    ],

    'warehouses' => [
        // Default warehouse codes
        'main_warehouse' => env('PHARMACY_MAIN_WAREHOUSE', 'GDG-UTAMA'),
        'outpatient_warehouse' => env('PHARMACY_OUTPATIENT_WAREHOUSE', 'APT-RAWAT-JALAN'),
        'inpatient_warehouse' => env('PHARMACY_INPATIENT_WAREHOUSE', 'APT-RAWAT-INAP'),
        'emergency_warehouse' => env('PHARMACY_EMERGENCY_WAREHOUSE', 'DEPO-IGD'),
    ],

    'permissions' => [
        // Permission names for role-based access
        'po_create' => 'pharmacy.po.create',
        'po_approve' => 'pharmacy.po.approve',
        'po_view' => 'pharmacy.po.view',
        'grn_create' => 'pharmacy.grn.create',
        'grn_complete' => 'pharmacy.grn.complete',
        'prescription_create' => 'pharmacy.prescription.create',
        'prescription_review' => 'pharmacy.prescription.review',
        'prescription_dispense' => 'pharmacy.prescription.dispense',
        'prescription_approve' => 'pharmacy.prescription.approve',
        'sales_create' => 'pharmacy.sales.create',
        'sales_complete' => 'pharmacy.sales.complete',
        'safety_alert_acknowledge' => 'pharmacy.safety_alert.acknowledge',
    ],

    'numbering' => [
        // Purchase Order prefix
        'po_prefix' => env('PHARMACY_PO_PREFIX', 'PO'),

        // Goods Receipt Note prefix
        'grn_prefix' => env('PHARMACY_GRN_PREFIX', 'GRN'),

        // Purchase Return prefix
        'return_prefix' => env('PHARMACY_RETURN_PREFIX', 'RET'),

        // Prescription prefix
        'prescription_prefix' => env('PHARMACY_PRESCRIPTION_PREFIX', 'RX'),

        // Sales prefix
        'sales_prefix' => env('PHARMACY_SALES_PREFIX', 'SAL'),

        // Patient Return prefix
        'patient_return_prefix' => env('PHARMACY_PATIENT_RETURN_PREFIX', 'PRR'),

        // Compounded Medicine prefix
        'compound_prefix' => env('PHARMACY_COMPOUND_PREFIX', 'CMP'),
    ],

    'notifications' => [
        // Send alert notifications
        'send_alerts' => env('PHARMACY_SEND_ALERTS', true),

        // Alert notification channels: 'mail', 'sms', 'push', 'database'
        'alert_channels' => explode(',', env('PHARMACY_ALERT_CHANNELS', 'database,mail')),

        // Alert recipients (roles)
        'alert_recipients' => explode(',', env('PHARMACY_ALERT_RECIPIENTS', 'pharmacist,pharmacy-manager,warehouse-manager')),

        // Send prescription review notifications
        'send_review_notifications' => env('PHARMACY_SEND_REVIEW_NOTIFICATIONS', true),

        // Send sales completion notifications
        'send_sales_notifications' => env('PHARMACY_SEND_SALES_NOTIFICATIONS', false),
    ],

    'audit' => [
        // Enable audit logging
        'enable_audit_logging' => env('PHARMACY_ENABLE_AUDIT_LOGGING', true),

        // Log sensitive operations
        'log_sensitive_operations' => env('PHARMACY_LOG_SENSITIVE_OPERATIONS', true),

        // Retention period for audit logs (days)
        'audit_retention_days' => env('PHARMACY_AUDIT_RETENTION_DAYS', 365),
    ],

    'integration' => [
        // Billing domain integration
        'integrate_with_billing' => env('PHARMACY_INTEGRATE_WITH_BILLING', true),

        // Inventory/Stock domain integration
        'integrate_with_inventory' => env('PHARMACY_INTEGRATE_WITH_INVENTORY', true),

        // Clinical domain integration
        'integrate_with_clinical' => env('PHARMACY_INTEGRATE_WITH_CLINICAL', true),
    ],
];
