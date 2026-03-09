import Layout from "@/pages/dashboard/layout.jsx";
import {useAuthStore} from "@/store/authStore.js"
import {useState} from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Separator} from "@/components/ui/separator"
import ContentHeader from "@/components/ui/content-header.jsx"
import {
    Users, CalendarDays, BedDouble, AlertTriangle,
    FlaskConical, FileText, Pill, Plus, TrendingUp
} from "lucide-react"
import apiCall from "@/services/apiCall.js";
import {toast} from "sonner";

// ── Dummy Data ────────────────────────────────────────────────────────────────
const STATS = [
    {
        label: "Total Pasien",
        value: "1,284",
        delta: "+12 minggu ini",
        icon: Users,
        color: "text-teal-600",
        bg: "bg-teal-50"
    },
    {
        label: "Jadwal Hari Ini",
        value: "24",
        delta: "3 menunggu",
        icon: CalendarDays,
        color: "text-indigo-600",
        bg: "bg-indigo-50"
    },
    {
        label: "Bed Occupancy",
        value: "78%",
        delta: "↑ 4% vs kemarin",
        icon: BedDouble,
        color: "text-amber-600",
        bg: "bg-amber-50"
    },
    {
        label: "Kasus Kritis",
        value: "6",
        delta: "2 dipulangkan",
        icon: AlertTriangle,
        color: "text-rose-600",
        bg: "bg-rose-50"
    },
]

const PATIENTS = [
    {name: "Siti Rahayu", age: 42, condition: "Hipertensi", status: "Stabil", initials: "SR", color: "bg-teal-500"},
    {
        name: "Budi Santoso",
        age: 67,
        condition: "Diabetes Melitus",
        status: "Perhatian",
        initials: "BS",
        color: "bg-indigo-500"
    },
    {name: "Dewi Lestari", age: 29, condition: "Post-operasi", status: "Kritis", initials: "DL", color: "bg-rose-500"},
    {name: "Ahmad Fauzi", age: 55, condition: "Pneumonia", status: "Stabil", initials: "AF", color: "bg-amber-500"},
    {name: "Rina Wijaya", age: 38, condition: "Anemia", status: "Perhatian", initials: "RW", color: "bg-purple-500"},
]

const APPOINTMENTS = [
    {time: "08.00", name: "Pak Hendra", type: "Pemeriksaan Umum", dot: "bg-teal-500"},
    {time: "09.00", name: "Ibu Marlina", type: "Review Hasil Lab", dot: "bg-indigo-500"},
    {time: "11.00", name: "Pak Yusuf", type: "Kardiologi", dot: "bg-rose-500"},
    {time: "13.00", name: "Ibu Kartika", type: "Konsultasi Gizi", dot: "bg-amber-500"},
    {time: "15.00", name: "Pak Ridwan", type: "Follow-up", dot: "bg-purple-500"},
]

const statusVariant = (s) => {
    if (s === "Stabil") return "default"
    if (s === "Perhatian") return "secondary"
    return "destructive"
}

// ── Component ─────────────────────────────────────────────────────────────────
function DashboardPage() {
    const {userData, isLoading, isEmailUnverified} = useAuthStore()
    const [sending, setSending] = useState(false)

    const handleResendEmail = async () => {
        setSending(true)
        try {
            await apiCall.post('/api/email/verification-notification', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Accept': 'application/json'
                }
            })
            toast.success("Email verifikasi terkirim! Cek inbox kamu.")
        } catch {
            toast.error("Gagal mengirim email verifikasi.")
        }
        setSending(false)
    }

    if (isLoading) return (
        <Layout>
            <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Memuat...</p>
            </div>
        </Layout>
    )

    if (isEmailUnverified) return (
        <Layout>
            <AlertDialog open={true}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Email Belum Diverifikasi</AlertDialogTitle>
                        <AlertDialogDescription>
                            Email kamu belum diverifikasi. Cek inbox dan verifikasi email untuk mengakses dashboard.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction disabled={sending} onClick={handleResendEmail}>
                            {sending ? "Mengirim..." : "Kirim Ulang Email Verifikasi"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Layout>
    )

    if (!userData) return (
        <Layout>
            <div className="flex items-center justify-center h-64">
                <p className="text-destructive">Gagal memuat data pengguna</p>
            </div>
        </Layout>
    )

    const today = new Date().toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    })

    return (
        <Layout>
            <ContentHeader title="Dashboard" description="Ringkasan aktivitas klinik hari ini"/>

            <div className="p-6 space-y-6">

                {/* Welcome */}
                <div>
                    <h2 className="text-2xl font-semibold">Selamat datang, {userData.name} 👋</h2>
                    <p className="text-muted-foreground text-sm mt-0.5">{today}</p>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2">
                    <Button size="sm" className="gap-2">
                        <Plus className="w-4 h-4"/> Tambah Pasien
                    </Button>
                    <Button size="sm" variant="outline" className="gap-2">
                        <FileText className="w-4 h-4"/> Buat Resep
                    </Button>
                    <Button size="sm" variant="outline" className="gap-2">
                        <FlaskConical className="w-4 h-4"/> Order Lab
                    </Button>
                    <Button size="sm" variant="outline" className="gap-2">
                        <TrendingUp className="w-4 h-4"/> Laporan
                    </Button>
                    <Button size="sm" variant="outline" className="gap-2">
                        <Pill className="w-4 h-4"/> Stok Obat
                    </Button>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {STATS.map(({label, value, delta, icon: Icon, color, bg}) => (
                        <Card key={label}>
                            <CardContent className="pt-5 pb-4">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-sm text-muted-foreground">{label}</p>
                                    <div className={`p-2 rounded-lg ${bg}`}>
                                        <Icon className={`w-4 h-4 ${color}`}/>
                                    </div>
                                </div>
                                <p className="text-2xl font-bold">{value}</p>
                                <p className="text-xs text-muted-foreground mt-1">{delta}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                    {/* Patient Table */}
                    <Card className="lg:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-base">Pasien Aktif</CardTitle>
                            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                                Lihat semua
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                    <tr className="border-b bg-muted/40">
                                        <th className="text-left px-6 py-2.5 text-xs font-medium text-muted-foreground">Pasien</th>
                                        <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Usia</th>
                                        <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Kondisi</th>
                                        <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Status</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {PATIENTS.map((p, i) => (
                                        <tr
                                            key={p.name}
                                            className={`hover:bg-muted/30 transition-colors ${i !== PATIENTS.length - 1 ? 'border-b' : ''}`}
                                        >
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`w-8 h-8 rounded-full ${p.color} flex items-center justify-center text-white text-xs font-semibold shrink-0`}>
                                                        {p.initials}
                                                    </div>
                                                    <span className="font-medium">{p.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">{p.age} th</td>
                                            <td className="px-4 py-3">{p.condition}</td>
                                            <td className="px-4 py-3">
                                                <Badge variant={statusVariant(p.status)}>{p.status}</Badge>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Appointments */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-base">Jadwal Hari Ini</CardTitle>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                <Plus className="w-3.5 h-3.5"/>
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            {APPOINTMENTS.map((a, i) => (
                                <div key={a.name}>
                                    <div
                                        className="flex items-center gap-3 px-5 py-3 hover:bg-muted/30 transition-colors">
                                        <span
                                            className="text-sm font-mono text-muted-foreground w-12 shrink-0">{a.time}</span>
                                        <div className={`w-2 h-2 rounded-full shrink-0 ${a.dot}`}/>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium truncate">{a.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">{a.type}</p>
                                        </div>
                                    </div>
                                    {i !== APPOINTMENTS.length - 1 && <Separator/>}
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                </div>

                {/* Vitals */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Rata-rata Vital Pasien</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 divide-x text-center">
                            <div className="px-4 py-2">
                                <p className="text-2xl font-bold">
                                    118<span className="text-sm font-normal text-muted-foreground">/76</span>
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">Tekanan Darah</p>
                            </div>
                            <div className="px-4 py-2">
                                <p className="text-2xl font-bold">
                                    98<span className="text-sm font-normal text-muted-foreground">%</span>
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">SpO₂</p>
                            </div>
                            <div className="px-4 py-2">
                                <p className="text-2xl font-bold">
                                    72<span className="text-sm font-normal text-muted-foreground"> bpm</span>
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">Denyut Nadi</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </Layout>
    )
}

export default DashboardPage