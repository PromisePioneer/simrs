import {Trash2} from "lucide-react";


export const MedicineDeleteModalContent = ({selectedIds, medicines}) => {
    const singleItem = selectedIds.length === 1
        ? medicines?.data?.find(d => d.id === selectedIds[0])
        : null;

    return (
        <div className="space-y-4 py-2">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <div className="flex gap-3">
                    <div className="shrink-0">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-destructive/20">
                            <Trash2 className="w-5 h-5 text-destructive"/>
                        </div>
                    </div>
                    <div className="flex-1 space-y-1">
                        <p className="text-sm font-semibold text-foreground">Konfirmasi Penghapusan</p>

                        {singleItem ? (
                            <p className="text-sm text-muted-foreground">
                                Anda akan menghapus obat:{" "}
                                <span className="font-semibold text-foreground">{singleItem.name}</span>
                            </p>
                        ) : (
                            <div className="text-sm text-muted-foreground space-y-1">
                                <p>
                                    Anda akan menghapus{" "}
                                    <span className="font-semibold text-foreground">{selectedIds.length} obat</span>:
                                </p>
                                <ul className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                                    {medicines?.data
                                        ?.filter(d => selectedIds.includes(d.id))
                                        .map(d => (
                                            <li key={d.id} className="flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-destructive shrink-0"/>
                                                <span className="font-semibold text-foreground">{d.name}</span>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}