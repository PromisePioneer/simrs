import {useEffect, useState} from "react";
import {usePatientQueueStore} from "@/store/patientQueueStore.js";
import {Link, useNavigate} from "@tanstack/react-router";
import {
    Activity,
    AlertCircle,
    CheckCircle,
    Clock,
    Edit,
    Filter,
    Search,
    Stethoscope,
    UserPlus,
    Users,
    X,
    FileText,
    Phone,
    ClipboardList, Eye
} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.jsx";
import {calculateAge} from "@/utils/calculateAge.js";
import {Badge} from "@/components/ui/badge.jsx";
import {formatDate} from "@/utils/formatDate.js";


function OutpatientVisitPage() {

    const [selectedFilter, setSelectedFilter] = useState("all");
    const [outpatientActiveTab, setOutpatientActiveTab] = useState("waiting");


    const {fetchPatientQueues, patientQueues, search, setSearch} = usePatientQueueStore();
    const {startDiagnose} = usePatientQueueStore();


    useEffect(() => {
        fetchPatientQueues({
            perPage: 20,
        });
    }, [search]);


    const navigate = useNavigate();

    const waitingPatients =
        patientQueues?.data?.filter(p => p.status === "waiting") || [];

    const inProgressPatients =
        patientQueues?.data?.filter(p => p.status === "in-progress") || [];

    const completedPatients =
        patientQueues?.data?.filter(p => p.status === "completed") || [];


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


    const handleStartExamination = async (patient) => {
        try {
            // panggil API update status
            await startDiagnose(patient.id);
            await navigate({
                to: `/outpatient/diagnose/${patient.outpatient_visit.id}`
            });

        } catch (error) {
            console.error("Gagal memulai pemeriksaan:", error);
        }
    };


    const PatientCard = ({patient, showActions = true}) => {
        return (
            <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row justify-between gap-4">
                        <div className="flex gap-4 flex-1">
                            <div className="flex items-start justify-center min-w-20">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-primary">{patient.queue_number}</div>
                                    <div className="text-xs text-muted-foreground">No. Antrian</div>
                                </div>
                            </div>

                            <div className="flex-1 space-y-3">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="font-semibold text-lg">{patient?.outpatient_visit?.patient?.full_name}</h3>
                                    {getPriorityBadge(patient.priority)}
                                    {getStatusBadge(patient.status)}
                                </div>

                                <div
                                    className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <FileText className="w-4 h-4"/>
                                            ID: {patient.queue_number}
                                        </span>
                                    <span className="flex items-center gap-1">
                                            <Users className="w-4 h-4"/>
                                        {calculateAge(patient?.outpatient_visit?.patient?.date_of_birth)} tahun • {patient?.outpatient_visit?.patient?.gender.toUpperCase()}
                                        </span>
                                    <span className="flex items-center gap-1">
                                            <Phone className="w-4 h-4"/>
                                        {patient?.outpatient_visit?.patient.phone}
                                        </span>
                                    <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4"/>
                                            Daftar: {formatDate(patient.queue_date)}
                                        </span>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-start gap-1 text-sm">
                                        <ClipboardList className="w-4 h-4 text-orange-500 mt-0.5"/>
                                        <span className="font-medium">Keluhan: <span
                                            className="font-normal text-muted-foreground">{patient.outpatient_visit?.complain}</span></span>
                                    </div>
                                    <div className="flex items-start gap-1 text-sm">
                                        <Stethoscope className="w-4 h-4 text-blue-500 mt-0.5"/>
                                        <span className="font-medium">Dokter: <span
                                            className="font-normal text-muted-foreground">{patient.outpatient_visit?.doctor?.name}</span></span>
                                    </div>
                                    {patient.roomNumber && (
                                        <div className="flex items-start gap-1 text-sm">
                                            <MapPin className="w-4 h-4 text-green-500 mt-0.5"/>
                                            <span className="font-medium">Lokasi: <span
                                                className="font-normal text-muted-foreground">{patient.roomNumber}</span></span>
                                        </div>
                                    )}
                                    {patient.diagnosis && (
                                        <div className="flex items-start gap-1 text-sm">
                                            <FileText className="w-4 h-4 text-purple-500 mt-0.5"/>
                                            <span className="font-medium">Diagnosis: <span
                                                className="font-normal text-muted-foreground">{patient.diagnosis}</span></span>
                                        </div>
                                    )}
                                    {patient.completionTime && (
                                        <div className="flex items-start gap-1 text-sm">
                                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5"/>
                                            <span className="font-medium">Selesai: <span
                                                className="font-normal text-muted-foreground">{patient.completionTime}</span></span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {showActions && (
                            <div className="flex lg:flex-col gap-2 lg:min-w-[140px]">
                                {patient.status === "waiting" && (
                                    <>
                                        <Button onClick={() => handleStartExamination(patient)} size="sm"
                                                className="gap-2 flex-1 lg:flex-none">
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
                                        <Link to={`/outpatient/diagnose/${patient.outpatient_visit.id}`}>
                                            <Button variant="outline" size="sm"
                                                className="gap-2 flex-1 lg:flex-none">
                                                <Eye className="w-4 h-4"/>
                                                Lihat Detail
                                            </Button>
                                        </Link>
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


    return <div className="space-y-6">
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
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch('')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-teal-600 transition-colors"
                                >
                                    <X className="h-4 w-4"/>
                                </button>
                            )}
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
                        <Button asChild className="flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow">
                            <Link to="/outpatient/visit/create">
                                <UserPlus className="w-4 h-4"/>
                                Daftar Pasien Baru
                            </Link>
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Tabs value={outpatientActiveTab} onValueChange={setOutpatientActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="waiting" className="gap-2">
                            <Clock className="w-4 h-4"/>
                            Menunggu ({waitingPatients.length})
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
                        {waitingPatients.length > 0 ? (
                            waitingPatients.map((patient) => (
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


}

export default OutpatientVisitPage;