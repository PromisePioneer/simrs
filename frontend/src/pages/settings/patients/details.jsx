// 1. Patient Detail Page
import {useParams} from "@tanstack/react-router";
import {useEffect, useState} from "react";
import SettingPage from "@/pages/settings/index.jsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.jsx";
import {Badge} from "@/components/ui/badge.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.jsx";
import {
    User,
    Calendar,
    Phone,
    MapPin,
    FileText,
    Pill,
    ArrowLeft,
    Plus
} from "lucide-react";
import {format} from "date-fns";
import {id} from "date-fns/locale";
import {asset} from "@/services/apiCall.js";
import {getInitials} from "@/hooks/use-helpers.js";
import {Link} from "@tanstack/react-router";
import {usePatientStore} from "@/store/usePatientStore.js";

// Medical Records Component
function MedicalRecords({patientId}) {

    const [records, setRecords] = useState([
        {
            id: 1,
            date: new Date(2024, 0, 15),
            diagnosis: "Hipertensi Grade 1",
            complaint: "Sakit kepala, pusing",
            treatment: "Pemberian obat antihipertensi",
            doctor: "Dr. Ahmad Suryanto, Sp.PD",
            blood_pressure: "150/95 mmHg",
            notes: "Kontrol tekanan darah rutin setiap 2 minggu"
        },
        {
            id: 2,
            date: new Date(2024, 0, 1),
            diagnosis: "Gastritis Akut",
            complaint: "Nyeri ulu hati, mual",
            treatment: "Pemberian PPI dan antasida",
            doctor: "Dr. Siti Nurhaliza, Sp.PD",
            blood_pressure: "140/90 mmHg",
            notes: "Anjuran diet rendah asam"
        }
    ]);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">Rekam Medis</h3>
                    <p className="text-sm text-muted-foreground">Riwayat kunjungan dan diagnosis pasien</p>
                </div>
                <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4"/>
                    Tambah Rekam Medis
                </Button>
            </div>

            <div className="space-y-3">
                {records.map((record) => (
                    <Card key={record.id} className="border-l-4 border-l-teal-500">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-base font-semibold text-teal-600">
                                        {record.diagnosis}
                                    </CardTitle>
                                    <CardDescription className="flex items-center gap-2 mt-1">
                                        <Calendar className="h-3 w-3"/>
                                        {format(record.date, 'PPP', {locale: id})}
                                    </CardDescription>
                                </div>
                                <Badge variant="outline">{record.blood_pressure}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">Keluhan</p>
                                    <p className="text-sm mt-1">{record.complaint}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">Tindakan</p>
                                    <p className="text-sm mt-1">{record.treatment}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Dokter Pemeriksa</p>
                                <p className="text-sm mt-1">{record.doctor}</p>
                            </div>
                            {record.notes && (
                                <div className="bg-muted/50 p-3 rounded-md">
                                    <p className="text-xs font-medium text-muted-foreground mb-1">Catatan</p>
                                    <p className="text-sm">{record.notes}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

// Medication Usage Component
function MedicationUsage({patientId}) {
    const [medications, setMedications] = useState([
        {
            id: 1,
            name: "Amlodipine 5mg",
            dosage: "1 x 1 tablet",
            frequency: "Setiap hari",
            duration: "30 hari",
            start_date: new Date(2024, 0, 15),
            end_date: new Date(2024, 1, 14),
            status: "active",
            notes: "Diminum setelah makan pagi",
            prescribed_by: "Dr. Ahmad Suryanto, Sp.PD"
        },
        {
            id: 2,
            name: "Omeprazole 20mg",
            dosage: "1 x 1 kapsul",
            frequency: "Setiap hari",
            duration: "14 hari",
            start_date: new Date(2024, 0, 1),
            end_date: new Date(2024, 0, 14),
            status: "completed",
            notes: "Diminum 30 menit sebelum makan",
            prescribed_by: "Dr. Siti Nurhaliza, Sp.PD"
        },
        {
            id: 3,
            name: "Antasida Tablet",
            dosage: "3 x 1 tablet",
            frequency: "Setelah makan",
            duration: "7 hari",
            start_date: new Date(2024, 0, 1),
            end_date: new Date(2024, 0, 7),
            status: "completed",
            notes: "Dikunyah sebelum ditelan",
            prescribed_by: "Dr. Siti Nurhaliza, Sp.PD"
        }
    ]);

    const getStatusBadge = (status) => {
        const statusConfig = {
            active: {label: "Aktif", variant: "default"},
            completed: {label: "Selesai", variant: "secondary"}
        };

        const config = statusConfig[status] || statusConfig.active;
        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">Penggunaan Obat</h3>
                    <p className="text-sm text-muted-foreground">Riwayat dan obat yang sedang dikonsumsi</p>
                </div>
                <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4"/>
                    Tambah Obat
                </Button>
            </div>

            <div className="space-y-3">
                {medications.map((med) => (
                    <Card key={med.id}>
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-teal-50 rounded-lg">
                                        <Pill className="h-5 w-5 text-teal-600"/>
                                    </div>
                                    <div>
                                        <CardTitle className="text-base font-semibold">
                                            {med.name}
                                        </CardTitle>
                                        <CardDescription className="mt-1">
                                            {med.dosage} • {med.frequency}
                                        </CardDescription>
                                    </div>
                                </div>
                                {getStatusBadge(med.status)}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">Periode Penggunaan</p>
                                    <p className="text-sm mt-1">
                                        {format(med.start_date, 'dd MMM yyyy', {locale: id})} - {format(med.end_date, 'dd MMM yyyy', {locale: id})}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">Durasi: {med.duration}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">Diresepkan Oleh</p>
                                    <p className="text-sm mt-1">{med.prescribed_by}</p>
                                </div>
                            </div>
                            {med.notes && (
                                <div className="bg-muted/50 p-3 rounded-md">
                                    <p className="text-xs font-medium text-muted-foreground mb-1">Catatan Penggunaan</p>
                                    <p className="text-sm">{med.notes}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

// Main Patient Detail Page
function PatientDetailPage() {
    const params = useParams({strict: false});


    const {showPatient, patientValue} = usePatientStore();
    useEffect(() => {
        showPatient(params.id);
    }, [])

    const calculateAge = (dob) => {

        const birthDate = new Date(dob);
        if (isNaN(birthDate)) return "-";

        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
            age--;
        }

        return age;
    };


    return (
        <SettingPage>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link to="/settings/patients">
                            <ArrowLeft className="h-5 w-5"/>
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-teal-500">
                            Detail Pasien
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Informasi lengkap pasien dan riwayat medis
                        </p>
                    </div>
                </div>

                {/* Patient Info Card */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex flex-col items-center md:items-start gap-3">
                                <Avatar className="h-24 w-24 ring-2 ring-background shadow-md">
                                    {patientValue.profile_picture ? (
                                        <AvatarImage
                                            src={asset(patientValue.profile_picture)}
                                            alt={patientValue.full_name}
                                            className="object-cover"
                                        />
                                    ) : (
                                        <AvatarFallback className="bg-teal-600 text-white text-2xl font-semibold">
                                            {getInitials(patientValue.full_name)}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                                <Badge variant="secondary" className="text-xs">
                                    {patientValue.medical_record_number}
                                </Badge>
                            </div>

                            <div className="flex-1 space-y-4">
                                <div>
                                    <h2 className="text-2xl font-bold">{patientValue.full_name}</h2>
                                    <p className="text-muted-foreground">
                                        {patientValue?.date_of_birth && (
                                            <>
                                                {patientValue.gender} • {calculateAge(patientValue.date_of_birth)} tahun
                                                • Gol. Darah {patientValue.blood_type ?? "Tidak Diketahui"}
                                            </>
                                        )}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-muted rounded-lg">
                                            <Calendar className="h-4 w-4 text-muted-foreground"/>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground">Tanggal Lahir</p>
                                            <p className="text-sm font-medium">
                                                {patientValue.date_of_birth && (
                                                    <>
                                                        {format(patientValue.date_of_birth, 'dd MMMM yyyy', {locale: id})}
                                                    </>
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-muted rounded-lg">
                                            <Phone className="h-4 w-4 text-muted-foreground"/>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground">Nomor Telepon</p>
                                            <p className="text-sm font-medium">{patientValue.phone}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 md:col-span-2">
                                        <div className="p-2 bg-muted rounded-lg">
                                            <MapPin className="h-4 w-4 text-muted-foreground"/>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground">Alamat</p>
                                            <p className="text-sm font-medium">{patientValue.address ?? '-'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 md:col-span-2">
                                        <div className="p-2 bg-muted rounded-lg">
                                            <Calendar className="h-4 w-4 text-muted-foreground"/>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground">Kunjungan
                                                Terakhir</p>
                                            <p className="text-sm font-medium">
                                                {
                                                    patientValue.date_of_consultation && (
                                                        <>
                                                            {format(patientValue.date_of_consultation, 'PPP', {locale: id})}
                                                        </>
                                                    )
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs for Medical Records and Medications */}
                <Tabs defaultValue="records" className="space-y-4">
                    <TabsList className="grid w-full md:w-auto grid-cols-2">
                        <TabsTrigger value="records" className="gap-2">
                            <FileText className="h-4 w-4"/>
                            Rekam Medis
                        </TabsTrigger>
                        <TabsTrigger value="medications" className="gap-2">
                            <Pill className="h-4 w-4"/>
                            Penggunaan Obat
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="records" className="space-y-4">
                        <MedicalRecords patientId={params.id}/>
                    </TabsContent>

                    <TabsContent value="medications" className="space-y-4">
                        <MedicationUsage patientId={params.id}/>
                    </TabsContent>
                </Tabs>
            </div>
        </SettingPage>
    );
}

export default PatientDetailPage;
