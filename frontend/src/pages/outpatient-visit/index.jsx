import Layout from "@/pages/dashboard/layout.jsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Button} from "@/components/ui/button.jsx";
import {
    Users,
    Search,
    Clock,
    UserPlus,
    Activity,
    ClipboardList,
    Stethoscope,
    AlertCircle,
    CheckCircle,
    Filter,
    Eye,
    Edit,
    FileText,
    Phone,
    MapPin
} from "lucide-react";
import {Input} from "@/components/ui/input.jsx";
import {useEffect, useState} from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select.jsx";
import {Badge} from "@/components/ui/badge.jsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.jsx";
import {Link} from "@tanstack/react-router";
import {useOutpatientVisitStore} from "@/store/outpatientVisitStore.js";

function OutpatientPage() {

    const {fetchOutPatientVisit, waitingPatients} = useOutpatientVisitStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [activeTab, setActiveTab] = useState("waiting");


    useEffect(() => {
        fetchOutPatientVisit({perPage: 20});
    }, []);

    const stats = [
        {
            title: "Total Pasien Hari Ini",
            value: "48",
            icon: Users,
            color: "bg-blue-500",
            change: "+8 dari kemarin"
        },
        {
            title: "Sedang Menunggu",
            value: "12",
            icon: Clock,
            color: "bg-yellow-500",
            change: "Antrian aktif"
        },
        {
            title: "Sedang Diperiksa",
            value: "5",
            icon: Stethoscope,
            color: "bg-green-500",
            change: "Di ruang dokter"
        },
        {
            title: "Selesai",
            value: "31",
            icon: CheckCircle,
            color: "bg-purple-500",
            change: "Hari ini"
        },
    ];

    const inProgressPatients = [
        {
            id: 4,
            queueNumber: "A004",
            name: "Dewi Lestari",
            patientId: "P001237",
            age: 38,
            gender: "Perempuan",
            phone: "081234567893",
            registrationTime: "08:15",
            complaint: "Nyeri dada",
            doctor: "Dr. Ahmad Rizki, Sp.PD",
            priority: "urgent",
            status: "in-progress",
            roomNumber: "Ruang 1"
        },
        {
            id: 5,
            queueNumber: "A005",
            name: "Rudi Hartono",
            patientId: "P001238",
            age: 55,
            gender: "Laki-laki",
            phone: "081234567894",
            registrationTime: "08:20",
            complaint: "Kontrol hipertensi",
            doctor: "Dr. Sarah Wijaya, Sp.PD",
            priority: "normal",
            status: "in-progress",
            roomNumber: "Ruang 2"
        },
    ];

    const completedPatients = [
        {
            id: 6,
            queueNumber: "A006",
            name: "Linda Permata",
            patientId: "P001239",
            age: 29,
            gender: "Perempuan",
            phone: "081234567895",
            registrationTime: "07:30",
            complaint: "ISPA",
            doctor: "Dr. Ahmad Rizki, Sp.PD",
            priority: "normal",
            status: "completed",
            completionTime: "08:15",
            diagnosis: "ISPA (Infeksi Saluran Pernapasan Akut)"
        },
    ];

    const getPriorityBadge = (priority) => {
        switch (priority) {
            case "urgent":
                return <Badge variant="destructive" className="gap-1">
                    <AlertCircle className="w-3 h-3"/>
                    Urgent
                </Badge>;
            case "normal":
                return <Badge variant="secondary">Normal</Badge>;
            default:
                return <Badge>Normal</Badge>;
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "waiting":
                return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    <Clock className="w-3 h-3 mr-1"/>
                    Menunggu
                </Badge>;
            case "in-progress":
                return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <Activity className="w-3 h-3 mr-1"/>
                    Sedang Diperiksa
                </Badge>;
            case "completed":
                return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <CheckCircle className="w-3 h-3 mr-1"/>
                    Selesai
                </Badge>;
            default:
                return null;
        }
    };

    const PatientCard = ({patient, showActions = true}) => {
        console.log(patient);


        return (
            <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row justify-between gap-4">
                        <div className="flex gap-4 flex-1">
                            <div className="flex items-start justify-center min-w-20">
                                <div className="text-center">
                                    {/*<div className="text-3xl font-bold text-primary">{patient.queueNumber}</div>*/}
                                    <div className="text-xs text-muted-foreground">No. Antrian</div>
                                </div>
                            </div>

                            <div className="flex-1 space-y-3">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="font-semibold text-lg">{patient.patient?.full_name}</h3>
                                    {/*{getPriorityBadge(patient.priority)}*/}
                                    {getStatusBadge(patient.status)}
                                </div>

                                {/*<div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">*/}
                                {/*        <span className="flex items-center gap-1">*/}
                                {/*            <FileText className="w-4 h-4"/>*/}
                                {/*            ID: {patient.patientId}*/}
                                {/*        </span>*/}
                                {/*    <span className="flex items-center gap-1">*/}
                                {/*            <Users className="w-4 h-4"/>*/}
                                {/*        {patient.age} tahun • {patient.gender}*/}
                                {/*        </span>*/}
                                {/*    <span className="flex items-center gap-1">*/}
                                {/*            <Phone className="w-4 h-4"/>*/}
                                {/*        {patient.phone}*/}
                                {/*        </span>*/}
                                {/*    <span className="flex items-center gap-1">*/}
                                {/*            <Clock className="w-4 h-4"/>*/}
                                {/*            Daftar: {patient.registrationTime}*/}
                                {/*        </span>*/}
                                {/*</div>*/}

                                {/*<div className="space-y-1">*/}
                                {/*    <div className="flex items-start gap-1 text-sm">*/}
                                {/*        <ClipboardList className="w-4 h-4 text-orange-500 mt-0.5"/>*/}
                                {/*        <span className="font-medium">Keluhan: <span*/}
                                {/*            className="font-normal text-muted-foreground">{patient.complaint}</span></span>*/}
                                {/*    </div>*/}
                                {/*    <div className="flex items-start gap-1 text-sm">*/}
                                {/*        <Stethoscope className="w-4 h-4 text-blue-500 mt-0.5"/>*/}
                                {/*        <span className="font-medium">Dokter: <span*/}
                                {/*            className="font-normal text-muted-foreground">{patient.doctor}</span></span>*/}
                                {/*    </div>*/}
                                {/*    {patient.roomNumber && (*/}
                                {/*        <div className="flex items-start gap-1 text-sm">*/}
                                {/*            <MapPin className="w-4 h-4 text-green-500 mt-0.5"/>*/}
                                {/*            <span className="font-medium">Lokasi: <span*/}
                                {/*                className="font-normal text-muted-foreground">{patient.roomNumber}</span></span>*/}
                                {/*        </div>*/}
                                {/*    )}*/}
                                {/*    {patient.diagnosis && (*/}
                                {/*        <div className="flex items-start gap-1 text-sm">*/}
                                {/*            <FileText className="w-4 h-4 text-purple-500 mt-0.5"/>*/}
                                {/*            <span className="font-medium">Diagnosis: <span*/}
                                {/*                className="font-normal text-muted-foreground">{patient.diagnosis}</span></span>*/}
                                {/*        </div>*/}
                                {/*    )}*/}
                                {/*    {patient.completionTime && (*/}
                                {/*        <div className="flex items-start gap-1 text-sm">*/}
                                {/*            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5"/>*/}
                                {/*            <span className="font-medium">Selesai: <span*/}
                                {/*                className="font-normal text-muted-foreground">{patient.completionTime}</span></span>*/}
                                {/*        </div>*/}
                                {/*    )}*/}
                                {/*</div>*/}
                            </div>
                        </div>

                        {showActions && (
                            <div className="flex lg:flex-col gap-2 lg:min-w-[140px]">
                                {patient.status === "waiting" && (
                                    <>
                                        <Button size="sm" className="gap-2 flex-1 lg:flex-none">
                                            <Stethoscope className="w-4 h-4"/>
                                            Mulai Periksa
                                        </Button>
                                        <Button variant="outline" size="sm" className="gap-2 flex-1 lg:flex-none">
                                            <Edit className="w-4 h-4"/>
                                            Edit
                                        </Button>
                                    </>
                                )}
                                {patient.status === "in-progress" && (
                                    <>
                                        <Button size="sm" className="gap-2 flex-1 lg:flex-none">
                                            <CheckCircle className="w-4 h-4"/>
                                            Selesai
                                        </Button>
                                        <Button variant="outline" size="sm" className="gap-2 flex-1 lg:flex-none">
                                            <Eye className="w-4 h-4"/>
                                            Lihat Detail
                                        </Button>
                                    </>
                                )}
                                {patient.status === "completed" && (
                                    <>
                                        <Button variant="outline" size="sm" className="gap-2 flex-1 lg:flex-none">
                                            <Eye className="w-4 h-4"/>
                                            Lihat Detail
                                        </Button>
                                        <Button variant="outline" size="sm" className="gap-2 flex-1 lg:flex-none">
                                            <FileText className="w-4 h-4"/>
                                            Rekam Medis
                                        </Button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-teal-500">
                                <Users className="w-6 h-6 text-white"/>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-teal-500">
                                    Rawat Jalan
                                </h1>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Kelola pasien rawat jalan dan antrian
                                </p>
                            </div>
                        </div>
                    </div>
                    <Button asChild
                            className="flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
                            size="lg"
                    >
                        <Link to="/outpatient-visit/create">

                            <UserPlus className="w-4 h-4"/> Daftar Pasien Baru
                        </Link>
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
                                <p className="text-xs text-muted-foreground mt-1">
                                    {stat.change}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Main Content - Tabs */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <CardTitle>Daftar Pasien Rawat Jalan</CardTitle>
                                <CardDescription>
                                    Kelola antrian dan pemeriksaan pasien
                                </CardDescription>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <div className="relative flex-1 sm:flex-none sm:w-[300px]">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                                    <Input
                                        placeholder="Cari pasien..."
                                        className="pl-9"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                                    <SelectTrigger className="w-[140px]">
                                        <Filter className="w-4 h-4 mr-2"/>
                                        <SelectValue placeholder="Filter"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua</SelectItem>
                                        <SelectItem value="urgent">Urgent</SelectItem>
                                        <SelectItem value="normal">Normal</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="waiting" className="gap-2">
                                    <Clock className="w-4 h-4"/>
                                    {/*Menunggu ({waitingPatients.data.length})*/}
                                </TabsTrigger>
                                <TabsTrigger value="in-progress" className="gap-2">
                                    <Activity className="w-4 h-4"/>
                                    Sedang Diperiksa ({inProgressPatients.length})
                                </TabsTrigger>
                                <TabsTrigger value="completed" className="gap-2">
                                    <CheckCircle className="w-4 h-4"/>
                                    Selesai ({completedPatients.length})
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="waiting" className="space-y-4 mt-6">
                                {waitingPatients ? (
                                    waitingPatients.data?.map((patient) => (
                                        <PatientCard key={patient.id} patient={patient}/>
                                    ))
                                ) : (
                                    <div className="text-center py-12">
                                        <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4"/>
                                        <h3 className="text-lg font-semibold mb-2">Tidak ada pasien menunggu</h3>
                                        <p className="text-muted-foreground">Semua pasien sudah dipanggil</p>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="in-progress" className="space-y-4 mt-6">
                                {inProgressPatients.length > 0 ? (
                                    inProgressPatients.map((patient) => (
                                        <PatientCard key={patient.id} patient={patient}/>
                                    ))
                                ) : (
                                    <div className="text-center py-12">
                                        <Stethoscope className="w-12 h-12 mx-auto text-muted-foreground mb-4"/>
                                        <h3 className="text-lg font-semibold mb-2">Tidak ada pasien sedang
                                            diperiksa</h3>
                                        <p className="text-muted-foreground">Belum ada pemeriksaan yang berlangsung</p>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="completed" className="space-y-4 mt-6">
                                {completedPatients.length > 0 ? (
                                    completedPatients.map((patient) => (
                                        <PatientCard key={patient.id} patient={patient}/>
                                    ))
                                ) : (
                                    <div className="text-center py-12">
                                        <CheckCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4"/>
                                        <h3 className="text-lg font-semibold mb-2">Belum ada pasien selesai</h3>
                                        <p className="text-muted-foreground">Pasien yang sudah selesai akan muncul di
                                            sini</p>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}

export default OutpatientPage;