<?php

declare(strict_types=1);

namespace Tests\Feature\Pharmacy;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacySupplier;
use Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacyPurchaseOrder;
use Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacyPrescription;
use Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacySale;

class PharmacyWorkflowTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $supplier;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create test user
        $this->user = User::factory()->create();
        $this->actingAs($this->user);

        // Create test supplier
        $this->supplier = PharmacySupplier::create([
            'tenant_id' => $this->user->current_tenant_id,
            'name' => 'Test Supplier',
            'code' => 'SUP-001',
            'contact_person' => 'John Doe',
            'phone' => '08123456789',
            'email' => 'test@supplier.com',
            'address' => 'Test Address',
            'discount_percentage' => 5,
            'tax_percentage' => 10,
            'status' => 'active',
        ]);
    }

    /**
     * Test complete procurement workflow
     */
    public function test_complete_procurement_workflow()
    {
        // Step 1: Create Purchase Order
        $response = $this->postJson('/api/pharmacy/purchase-orders', [
            'supplier_id' => $this->supplier->id,
            'warehouse_id' => 'test-warehouse-uuid',
            'expected_delivery_date' => now()->addDays(7)->format('Y-m-d'),
            'notes' => 'Test PO',
            'items' => [
                [
                    'medicine_id' => 'med-uuid-1',
                    'quantity' => 100,
                    'unit_price' => 5000,
                ]
            ]
        ]);

        $this->assertDatabaseHas('pharmacy_purchase_orders', [
            'status' => 'draft',
            'supplier_id' => $this->supplier->id,
        ]);
    }

    /**
     * Test prescription review workflow
     */
    public function test_prescription_review_workflow()
    {
        $prescription = PharmacyPrescription::create([
            'tenant_id' => $this->user->current_tenant_id,
            'prescription_number' => 'RX-2026-06-0001',
            'patient_id' => 'patient-uuid',
            'doctor_id' => $this->user->id,
            'prescription_date' => now(),
            'prescription_type' => 'outpatient',
            'status' => 'pending',
        ]);

        // Review prescription
        $response = $this->postJson("/api/pharmacy/prescriptions/{$prescription->id}/review", [
            'review_type' => 'administrative',
            'review_notes' => 'All data complete',
        ]);

        $this->assertDatabaseHas('pharmacy_prescription_reviews', [
            'prescription_id' => $prescription->id,
            'admin_checked' => true,
        ]);
    }

    /**
     * Test safety alert generation
     */
    public function test_safety_alerts_are_generated()
    {
        $response = $this->getJson('/api/pharmacy/safety-alerts');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => []
            ]);
    }
}
