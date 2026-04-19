<?php

declare(strict_types=1);

namespace Domains\Patient\Infrastructure\Listeners;

use Domains\Patient\Domain\Events\PatientRegistered;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;

/**
 * Listener: Reaksi terhadap PatientRegistered domain event.
 *
 * Implementasi ShouldQueue agar diproses secara async via queue.
 *
 * Daftarkan di AppServiceProvider::boot() atau EventServiceProvider:
 *
 *   Event::listen(
 *       PatientRegistered::class,
 *       SendPatientRegisteredNotification::class,
 *   );
 *
 * Keuntungan domain event:
 * - Handler tidak perlu tahu bahwa ada notifikasi/audit
 * - Listener bisa ditambah/hapus tanpa ubah business logic
 */
class SendPatientRegisteredNotification implements ShouldQueue
{
    public function handle(PatientRegistered $event): void
    {
        // Contoh: kirim notifikasi ke admin, audit log, dll.
        Log::info('Patient baru terdaftar', [
            'patient_id'           => $event->patientId,
            'tenant_id'            => $event->tenantId,
            'medical_record_number' => $event->medicalRecordNumber,
            'full_name'            => $event->fullName,
            'occurred_at'          => $event->occurredAt->format('Y-m-d H:i:s'),
        ]);

        // TODO: kirim email notifikasi ke admin tenant
        // Mail::to($adminEmail)->queue(new PatientRegisteredMail($event));
    }
}
