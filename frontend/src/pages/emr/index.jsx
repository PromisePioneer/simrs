import Layout from "@/pages/dashboard/layout.jsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Button} from "@/components/ui/button.jsx";
import {
    FileText,
    Plus,
    Search,
    Calendar,
    User,
    Activity,
    Stethoscope,
    ClipboardList,
    Pill,
    TestTube,
    Heart,
    Filter
} from "lucide-react";
import {Input} from "@/components/ui/input.jsx";
import {useState} from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select.jsx";
import {Badge} from "@/components/ui/badge.jsx";

function ElectronicMedicalRecordPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("all");

    // Dummy data - ganti dengan data dari API/store
    const patients = [
        {
            id: 1,
            name: "Budi Santoso",
            patientId: "P001234",
            age: 45,
            gender: "Laki-laki",
            lastVisit: "2024-02-15",
            diagnosis: "Hipertensi",
            status: "active"
        },
        {
            id: 2,
            name: "Siti Nurhaliza",
            patientId: "P001235",
            age: 32,
            gender: "Perempuan",
            lastVisit: "2024-02-14",
            diagnosis: "Diabetes Tipe 2",
            status: "active"
        },
        {
            id: 3,
            name: "Ahmad Dahlan",
            patientId: "P001236",
            age: 28,
            gender: "Laki-laki",
            lastVisit: "2024-02-13",
            diagnosis: "ISPA",
            status: "completed"
        },
    ];

    const stats = [
        {
            title: "Total Pasien",
            value: "1,234",
            icon: User,
            color: "bg-blue-500",
            change: "+12%"
        },
        {
            title: "Kunjungan Hari Ini",
            value: "45",
            icon: Activity,
            color: "bg-green-500",
            change: "+5%"
        },
        {
            title: "Rekam Medis Baru",
            value: "23",
            icon: FileText,
            color: "bg-purple-500",
            change: "+8%"
        },
        {
            title: "Pemeriksaan Aktif",
            value: "12",
            icon: Stethoscope,
            color: "bg-orange-500",
            change: "-3%"
        },
    ];

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-teal-500">
                                <FileText className="w-6 h-6 text-white"/>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-teal-500">
                                    Rekam Medis Elektronik
                                </h1>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Kelola rekam medis pasien secara digital
                                </p>
                            </div>
                        </div>
                    </div>
                    <Button
                        className="flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
                        size="lg"
                    >
                        <Plus className="w-4 h-4"/> Tambah Rekam Medis Baru
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => (
                        <Card key={index}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                <div className={`${stat.color} p-2 rounded-lg`}>
                                    <stat.icon className="h-4 w-4 text-white"/>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">
                                    <span className={stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                                        {stat.change}
                                    </span>
                                    {' '}dari bulan lalu
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Search and Filter */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Rekam Medis Pasien</CardTitle>
                        <CardDescription>
                            Cari dan kelola rekam medis pasien
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                                <Input
                                    placeholder="Cari nama pasien, ID pasien, atau diagnosis..."
                                    className="pl-9"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                                <SelectTrigger className="w-full sm:w-[200px]">
                                    <Filter className="w-4 h-4 mr-2"/>
                                    <SelectValue placeholder="Filter Status"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="active">Aktif</SelectItem>
                                    <SelectItem value="completed">Selesai</SelectItem>
                                    <SelectItem value="followup">Follow Up</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Patient List */}
                        <div className="space-y-4">
                            {patients.map((patient) => (
                                <Card key={patient.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                                            <div className="flex gap-4">
                                                <div
                                                    className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                                                    <User className="w-6 h-6 text-primary"/>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-semibold text-lg">{patient.name}</h3>
                                                        <Badge
                                                            variant={patient.status === 'active' ? 'default' : 'secondary'}>
                                                            {patient.status === 'active' ? 'Aktif' : 'Selesai'}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <FileText className="w-4 h-4"/>
                                                            {patient.patientId}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <User className="w-4 h-4"/>
                                                            {patient.age} tahun • {patient.gender}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-4 h-4"/>
                                                            Terakhir: {patient.lastVisit}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <Stethoscope className="w-4 h-4 text-blue-500"/>
                                                        <span
                                                            className="font-medium">Diagnosis: {patient.diagnosis}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex sm:flex-col gap-2">
                                                <Button variant="outline" size="sm" className="gap-2">
                                                    <FileText className="w-4 h-4"/>
                                                    Lihat Detail
                                                </Button>
                                                <Button size="sm" className="gap-2">
                                                    <Plus className="w-4 h-4"/>
                                                    Tambah Catatan
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardContent className="p-6 text-center space-y-2">
                            <div className="flex justify-center">
                                <div className="bg-blue-100 p-4 rounded-full">
                                    <ClipboardList className="w-8 h-8 text-blue-600"/>
                                </div>
                            </div>
                            <h3 className="font-semibold">Riwayat Pemeriksaan</h3>
                            <p className="text-sm text-muted-foreground">Lihat riwayat pemeriksaan pasien</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardContent className="p-6 text-center space-y-2">
                            <div className="flex justify-center">
                                <div className="bg-green-100 p-4 rounded-full">
                                    <Pill className="w-8 h-8 text-green-600"/>
                                </div>
                            </div>
                            <h3 className="font-semibold">Resep Obat</h3>
                            <p className="text-sm text-muted-foreground">Kelola resep dan obat pasien</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardContent className="p-6 text-center space-y-2">
                            <div className="flex justify-center">
                                <div className="bg-purple-100 p-4 rounded-full">
                                    <TestTube className="w-8 h-8 text-purple-600"/>
                                </div>
                            </div>
                            <h3 className="font-semibold">Hasil Lab</h3>
                            <p className="text-sm text-muted-foreground">Lihat hasil laboratorium</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardContent className="p-6 text-center space-y-2">
                            <div className="flex justify-center">
                                <div className="bg-red-100 p-4 rounded-full">
                                    <Heart className="w-8 h-8 text-red-600"/>
                                </div>
                            </div>
                            <h3 className="font-semibold">Vital Signs</h3>
                            <p className="text-sm text-muted-foreground">Monitor tanda vital pasien</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}

export default ElectronicMedicalRecordPage;