import VisitRow from "@/components/emr/visit-row.jsx";
import {Card, CardContent} from "@/components/ui/card.jsx";
import {Button} from "@/components/ui/button.jsx";
import {useState} from "react";
import {
    Plus, User,
    ClipboardList, Pill,
    ChevronDown, BadgeCheck,
    Eye, CalendarDays,
} from "lucide-react";
import {calculateAge} from "@/utils/calculateAge.js";
import {Badge} from "@/components/ui/badge.jsx";
import {Link} from "@tanstack/react-router";




const genderLabel = (g) => (g === "wanita" ? "Perempuan" : "Laki-laki");
const genderAccent = (g) =>
    g === "wanita"
        ? {
            bar: "from-pink-400 to-rose-400",
            avatar: "bg-pink-100 text-pink-600",
            badge: "bg-pink-50 text-pink-700 border-pink-200"
        }
        : {
            bar: "from-sky-400 to-blue-500",
            avatar: "bg-sky-100 text-sky-600",
            badge: "bg-sky-50 text-sky-700 border-sky-200"
        };


function PatientEMRCard({patient}) {
    const [visitsOpen, setVisitsOpen] = useState(false);
    const accent = genderAccent(patient.gender);
    const visits = patient.outpatient_visits ?? [];
    const age = calculateAge(patient.date_of_birth);
    const totalDx = visits.reduce((s, v) => s + (v.diagnoses?.length ?? 0), 0);
    const totalRx = visits.reduce((s, v) => s + (v.prescriptions?.length ?? 0), 0);
    const totalTx = visits.reduce((s, v) => s + (v.procedures?.length ?? 0), 0);

    return (
        <Card
            className="overflow-hidden border border-border/60 hover:border-teal-300 hover:shadow-md transition-all duration-200">
            <CardContent className="p-5">
                {/* identity */}
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex gap-4 min-w-0">
                        <div
                            className={`flex items-center justify-center w-11 h-11 rounded-xl shrink-0 font-bold text-lg ${accent.avatar}`}>
                            {patient.full_name.charAt(0)}
                        </div>
                        <div className="space-y-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-semibold text-base">{patient.full_name}</h3>
                                <Badge variant="outline"
                                       className={`text-[10px] px-1.5 py-0 ${accent.badge}`}>{genderLabel(patient.gender)}</Badge>
                                {patient.blood_type && (
                                    <Badge variant="outline"
                                           className="text-[10px] px-1.5 py-0">{patient.blood_type.toUpperCase()}</Badge>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1"><User
                                    className="w-3 h-3"/>{age} tahun • {patient.city_of_birth}</span>
                                <span
                                    className="font-mono bg-muted px-1.5 py-0.5 rounded text-[10px]">{patient.medical_record_number}</span>
                                {patient.job && <span>{patient.job}</span>}
                            </div>
                        </div>
                    </div>

                    <div className="flex sm:flex-col gap-2 shrink-0">
                        <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8" asChild>
                            <Link to={`/emr/${patient.id}`}><Eye className="w-3.5 h-3.5"/> Detail</Link>
                        </Button>
                        <Button size="sm" className="gap-1.5 text-xs h-8 bg-teal-500 hover:bg-teal-600">
                            <Plus className="w-3.5 h-3.5"/> Catatan
                        </Button>
                    </div>
                </div>

                {/* aggregate summary */}
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5 text-teal-500"/>
                        <strong className="text-foreground">{visits.length}</strong> kunjungan
                    </span>
                    {totalDx > 0 && (
                        <span className="flex items-center gap-1.5">
                            <BadgeCheck className="w-3.5 h-3.5 text-teal-500"/>
                            <strong className="text-foreground">{totalDx}</strong> diagnosis
                        </span>
                    )}
                    {totalTx > 0 && (
                        <span className="flex items-center gap-1.5">
                            <ClipboardList className="w-3.5 h-3.5 text-sky-500"/>
                            <strong className="text-foreground">{totalTx}</strong> tindakan
                        </span>
                    )}
                    {totalRx > 0 && (
                        <span className="flex items-center gap-1.5">
                            <Pill className="w-3.5 h-3.5 text-violet-500"/>
                            <strong className="text-foreground">{totalRx}</strong> resep
                        </span>
                    )}
                </div>

                {/* toggle visits */}
                {visits.length > 0 && (
                    <div className="mt-3">
                        <button
                            type="button"
                            onClick={() => setVisitsOpen((p) => !p)}
                            className="flex items-center gap-1.5 text-xs text-teal-600 hover:text-teal-700 font-medium transition-colors"
                        >
                            <ChevronDown className={`w-4 h-4 transition-transform ${visitsOpen ? "rotate-180" : ""}`}/>
                            {visitsOpen ? "Sembunyikan" : "Lihat"} riwayat kunjungan ({visits.length})
                        </button>

                        {visitsOpen && (
                            <div className="mt-4 pl-1">
                                {visits.map((visit, idx) => (
                                    <VisitRow key={visit.id} visit={visit} isLast={idx === visits.length - 1}/>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}


export default PatientEMRCard;