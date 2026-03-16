<?php

declare(strict_types=1);

namespace Tests\Feature\Domains\Patient;

use App\Models\PaymentMethodType;
use App\Models\Tenant;
use App\Models\User;
use Domains\Patient\Infrastructure\Persistence\Models\PatientModel;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

/**
 * Feature Test: Patient API Endpoints
 *
 * ✅ Test HTTP request → response end-to-end
 * ✅ Butuh database (pakai RefreshDatabase — fresh tiap test)
 * ✅ Verifikasi data benar-benar tersimpan di DB
 *
 * Jalankan:
 *   php artisan test tests/Feature/Domains/Patient/PatientControllerTest.php
 */
class PatientControllerTest extends TestCase
{
    use RefreshDatabase;

    private User   $user;
    private Tenant $tenant;
    private PaymentMethodType $paymentMethodType;

    protected function setUp(): void
    {
        parent::setUp();

        // Buat tenant dan user untuk setiap test
        $this->tenant = Tenant::factory()->create([
            'code' => 'RSU',
            'name' => 'RS Uji Coba',
            'type' => 'rs',
        ]);

        $this->user = User::factory()->create([
            'tenant_id' => $this->tenant->id,
        ]);

        $this->paymentMethodType = PaymentMethodType::factory()->create([
            'name' => 'Umum',
        ]);
    }

    // =========================================================================
    // Helpers
    // =========================================================================

    private function validPatientPayload(array $override = []): array
    {
        return array_merge([
            'full_name'      => 'Budi Santoso',
            'city_of_birth'  => 'Jakarta',
            'date_of_birth'  => '1990-05-15',
            'id_card_number' => '3171000000000001',
            'gender'         => 'pria',
            'religion'       => 'islam',
            'blood_type'     => 'o+',
            'job'            => 'Engineer',
            'phone'          => '08123456789',
            'email'          => 'budi@example.com',
            'addresses'      => [[
                'address'     => 'Jl. Sudirman No. 1',
                'province'    => 'DKI Jakarta',
                'city'        => 'Jakarta Pusat',
                'subdistrict' => 'Tanah Abang',
                'ward'        => 'Kebon Melati',
                'postal_code' => '10230',
            ]],
            'payment_methods' => [[
                'payment_method_type_id' => $this->paymentMethodType->id,
                'bpjs_number'            => null,
            ]],
        ], $override);
    }

    // =========================================================================
    // GET /patients
    // =========================================================================

    /** @test */
    public function it_returns_paginated_patient_list(): void
    {
        PatientModel::factory()->count(5)->create([
            'tenant_id' => $this->tenant->id,
        ]);

        $response = $this->actingAs($this->user)
            ->getJson('/api/patients');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [['id', 'full_name', 'medical_record_number']],
                'meta' => ['current_page', 'last_page', 'total', 'per_page'],
                'links' => ['first', 'last'],
            ]);
    }

    /** @test */
    public function it_filters_patients_by_search(): void
    {
        PatientModel::factory()->create([
            'tenant_id' => $this->tenant->id,
            'full_name' => 'Budi Santoso',
        ]);
        PatientModel::factory()->create([
            'tenant_id' => $this->tenant->id,
            'full_name' => 'Siti Rahayu',
        ]);

        $response = $this->actingAs($this->user)
            ->getJson('/api/patients?search=Budi');

        $response->assertOk();
        $data = $response->json('data');
        $this->assertCount(1, $data);
        $this->assertEquals('Budi Santoso', $data[0]['full_name']);
    }

    /** @test */
    public function it_only_returns_patients_of_current_tenant(): void
    {
        $otherTenant = Tenant::factory()->create(['code' => 'KLN', 'type' => 'klinik']);

        PatientModel::factory()->count(3)->create(['tenant_id' => $this->tenant->id]);
        PatientModel::factory()->count(2)->create(['tenant_id' => $otherTenant->id]);

        $response = $this->actingAs($this->user)
            ->getJson('/api/patients');

        $response->assertOk();
        $this->assertEquals(3, $response->json('meta.total'));
    }

    /** @test */
    public function unauthenticated_user_cannot_access_patients(): void
    {
        $this->getJson('/api/patients')->assertUnauthorized();
    }

    // =========================================================================
    // POST /patients
    // =========================================================================

    /** @test */
    public function it_creates_a_new_patient(): void
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/patients', $this->validPatientPayload());

        $response->assertCreated()
            ->assertJsonPath('data.full_name', 'Budi Santoso')
            ->assertJsonPath('data.gender', 'pria');

        // Verifikasi tersimpan di database
        $this->assertDatabaseHas('patients', [
            'full_name'  => 'Budi Santoso',
            'tenant_id'  => $this->tenant->id,
            'id_card_number' => '3171000000000001',
        ]);
    }

    /** @test */
    public function it_generates_medical_record_number_on_create(): void
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/patients', $this->validPatientPayload());

        $response->assertCreated();
        $mrn = $response->json('data.medical_record_number');

        $this->assertNotNull($mrn);
        $this->assertStringStartsWith('EMR-', $mrn);
    }

    /** @test */
    public function it_saves_patient_address(): void
    {
        $this->actingAs($this->user)
            ->postJson('/api/patients', $this->validPatientPayload());

        $this->assertDatabaseHas('patient_address', [
            'province' => 'DKI Jakarta',
            'city'     => 'Jakarta Pusat',
        ]);
    }

    /** @test */
    public function it_rejects_duplicate_nik_in_same_tenant(): void
    {
        $payload = $this->validPatientPayload(['id_card_number' => '3171000000000001']);

        // Daftarkan pertama kali — sukses
        $this->actingAs($this->user)->postJson('/api/patients', $payload)->assertCreated();

        // Daftarkan kedua kali dengan NIK sama — harus ditolak
        $response = $this->actingAs($this->user)
            ->postJson('/api/patients', $payload);

        $response->assertStatus(422)
            ->assertJsonFragment(['NIK']);
    }

    /** @test */
    public function it_rejects_duplicate_email_in_same_tenant(): void
    {
        $payload = $this->validPatientPayload(['email' => 'sama@example.com']);

        $this->actingAs($this->user)->postJson('/api/patients', $payload)->assertCreated();

        $second = $this->actingAs($this->user)->postJson('/api/patients', array_merge(
            $payload,
            ['id_card_number' => '3171000000000999'] // NIK berbeda
        ));

        $second->assertStatus(422)
            ->assertJsonFragment(['email']);
    }

    /** @test */
    public function it_validates_required_fields(): void
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/patients', []); // payload kosong

        $response->assertUnprocessable()
            ->assertJsonValidationErrors([
                'full_name',
                'city_of_birth',
                'date_of_birth',
                'id_card_number',
                'gender',
            ]);
    }

    /** @test */
    public function it_validates_gender_value(): void
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/patients', $this->validPatientPayload([
                'gender' => 'laki-laki', // bukan 'pria' atau 'wanita'
            ]));

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['gender']);
    }

    /** @test */
    public function it_uploads_profile_picture(): void
    {
        Storage::fake('public');

        $response = $this->actingAs($this->user)
            ->postJson('/api/patients', array_merge(
                $this->validPatientPayload(),
                ['profile_picture' => UploadedFile::fake()->image('foto.jpg')]
            ));

        $response->assertCreated();
        $path = $response->json('data.profile_picture');
        $this->assertNotNull($path);
    }

    // =========================================================================
    // GET /patients/{id}
    // =========================================================================

    /** @test */
    public function it_returns_single_patient_with_relations(): void
    {
        $patient = PatientModel::factory()->create([
            'tenant_id' => $this->tenant->id,
        ]);

        $response = $this->actingAs($this->user)
            ->getJson("/api/patients/{$patient->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $patient->id)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'full_name',
                    'medical_record_number',
                    'addresses',
                    'payment_methods',
                ],
            ]);
    }

    /** @test */
    public function it_returns_404_for_nonexistent_patient(): void
    {
        $this->actingAs($this->user)
            ->getJson('/api/patients/nonexistent-uuid')
            ->assertNotFound();
    }

    // =========================================================================
    // PUT /patients/{id}
    // =========================================================================

    /** @test */
    public function it_updates_patient_data(): void
    {
        // Buat dulu via POST
        $create = $this->actingAs($this->user)
            ->postJson('/api/patients', $this->validPatientPayload());

        $patientId = $create->json('data.id');

        // Update
        $response = $this->actingAs($this->user)
            ->putJson("/api/patients/{$patientId}", $this->validPatientPayload([
                'full_name'  => 'Budi Diupdate',
                'blood_type' => 'a+',
            ]));

        $response->assertOk()
            ->assertJsonPath('data.full_name', 'Budi Diupdate')
            ->assertJsonPath('data.blood_type', 'a+');

        $this->assertDatabaseHas('patients', [
            'id'         => $patientId,
            'full_name'  => 'Budi Diupdate',
            'blood_type' => 'a+',
        ]);
    }

    // =========================================================================
    // DELETE /patients/{id}
    // =========================================================================

    /** @test */
    public function it_deletes_a_patient(): void
    {
        $create    = $this->actingAs($this->user)
            ->postJson('/api/patients', $this->validPatientPayload());
        $patientId = $create->json('data.id');

        $response = $this->actingAs($this->user)
            ->deleteJson("/api/patients/{$patientId}");

        $response->assertOk();
        $this->assertDatabaseMissing('patients', ['id' => $patientId]);
    }

    /** @test */
    public function it_returns_404_when_deleting_nonexistent_patient(): void
    {
        $this->actingAs($this->user)
            ->deleteJson('/api/patients/nonexistent-uuid')
            ->assertNotFound();
    }
}
