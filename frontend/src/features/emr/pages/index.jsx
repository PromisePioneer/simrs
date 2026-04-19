import Layout from "@features/dashboard/pages/layout.jsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@shared/components/ui/card.jsx";
import {Button} from "@shared/components/ui/button.jsx";
import {
    FileText, Plus, Search, User, Activity, Stethoscope, Filter
} from "lucide-react";
import {Input} from "@shared/components/ui/input.jsx";
import {useEffect, useState} from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@shared/components/ui/select.jsx";
import {usePatientStore} from "@features/patients";
import PatientEMRCard from "@features/emr/components/patient-emr-card.jsx";


/* ─── Vital chip ────────────────────────────────────────────── */
const VitalChip = ({icon: Icon, label, value, unit, warn}) => (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-[11px] font-medium
        ${warn ? "bg-red-50 border-red-200 text-red-700" : "bg-slate-50 border-slate-200 text-slate-600"}`}>
        <Icon className="w-3 h-3 shrink-0"/>
        <span className="text-muted-foreground font-normal">{label}</span>
        <span>{value}{unit && <span className="text-muted-foreground font-normal ml-0.5">{unit}</span>}</span>
    </div>
);

/* ─── Page ──────────────────────────────────────────────────── */
function ElectronicMedicalRecordPage() {
    const [selectedFilter, setSelectedFilter] = useState("all");
    const {fetchPatientWhereHasEmr, patientsWhereHasEmr, search, setSearch} = usePatientStore();

    useEffect(() => {
        fetchPatientWhereHasEmr({perPage: 20});
    }, [search]);

    const patients = Array.isArray(patientsWhereHasEmr?.data) ? patientsWhereHasEmr.data : [];

    const filtered = patients.filter((p) => {
        const q = search.toLowerCase();
        if (!q) return true;
        return (
            p.full_name.toLowerCase().includes(q) ||
            p.medical_record_number.toLowerCase().includes(q) ||
            p.outpatient_visits?.some((v) =>
                v.complain?.toLowerCase().includes(q) ||
                v.diagnoses?.some((d) =>
                    d.description.toLowerCase().includes(q) || d.icd10_code.toLowerCase().includes(q)
                )
            )
        );
    });

    const stats = [
        {
            title: "Total Pasien",
            value: "–",
            icon: User,
            color: "bg-teal-500",
            desc: "Pasien terdaftar"
        },
        {title: "Kunjungan Hari Ini", value: "45", icon: Activity, color: "bg-teal-500", desc: "+5% dari kemarin"},
        {title: "Rekam Medis Baru", value: "23", icon: FileText, color: "bg-teal-500", desc: "+8% bulan ini"},
        {title: "Pemeriksaan Aktif", value: "12", icon: Stethoscope, color: "bg-teal-500", desc: "Sedang berjalan"},
    ];

    return (
        <Layout>
            <div className="space-y-6">
                {/* header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div
                            className="flex items-center justify-center w-12 h-12 rounded-xl bg-teal-500 shadow-lg shadow-teal-200">
                            <FileText className="w-6 h-6 text-white"/>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-teal-600">Rekam Medis Elektronik</h1>
                            <p className="text-sm text-muted-foreground">Kelola rekam medis pasien secara digital</p>
                        </div>
                    </div>
                    <Button className="gap-2 bg-teal-500 hover:bg-teal-600 shadow-md" size="lg">
                        <Plus className="w-4 h-4"/> Tambah Rekam Medis
                    </Button>
                </div>

                {/* stats */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, i) => (
                        <Card key={i} className="border border-border/60">
                            <CardContent className="p-5 flex items-center gap-4">
                                <div className={`${stat.color} p-3 rounded-xl shrink-0`}>
                                    <stat.icon className="w-5 h-5 text-white"/>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">{stat.title}</p>
                                    <p className="text-2xl font-bold leading-tight">{stat.value}</p>
                                    <p className="text-xs text-muted-foreground">{stat.desc}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* patient list */}
                <Card className="border border-border/60">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base">Daftar Rekam Medis Pasien</CardTitle>
                        <CardDescription className="text-xs mt-0.5">
                            {filtered.length} dari {patients.length} pasien
                        </CardDescription>
                        <div className="flex flex-col sm:flex-row gap-3 mt-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground"/>
                                <Input
                                    placeholder="Cari nama, No. MR, diagnosis, keluhan…"
                                    className="pl-9 h-9 text-sm"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                                <SelectTrigger className="w-full sm:w-[180px] h-9 text-sm">
                                    <Filter className="w-3.5 h-3.5 mr-1.5 text-muted-foreground"/>
                                    <SelectValue placeholder="Filter"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="active">Aktif</SelectItem>
                                    <SelectItem value="completed">Selesai</SelectItem>
                                    <SelectItem value="followup">Follow Up</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                        {filtered.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <FileText className="w-10 h-10 mx-auto mb-3 opacity-30"/>
                                <p className="text-sm">Tidak ada rekam medis ditemukan</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filtered.map((patient) => (
                                    <PatientEMRCard key={patient.id} patient={patient}/>
                                ))}
                            </div>
                        )}
                        {patientsWhereHasEmr?.last_page > 1 && (
                            <div
                                className="flex items-center justify-between mt-4 pt-4 border-t text-xs text-muted-foreground">
                                <span>Halaman {patientsWhereHasEmr.current_page} dari {patientsWhereHasEmr.last_page}</span>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="h-7 text-xs"
                                            disabled={!patientsWhereHasEmr.prev_page_url}>Sebelumnya</Button>
                                    <Button variant="outline" size="sm" className="h-7 text-xs"
                                            disabled={!patientsWhereHasEmr.next_page_url}>Berikutnya</Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}

export default ElectronicMedicalRecordPage;