// src/routes/403.jsx
import {createFileRoute, useNavigate, useRouter} from '@tanstack/react-router';
import {Button} from '@/components/ui/button';
import {ShieldAlert} from 'lucide-react';

function Forbidden() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <ShieldAlert className="w-24 h-24 mx-auto text-red-500 mb-4"/>
                <h1 className="text-6xl font-bold text-gray-900 mb-2">403</h1>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Akses Ditolak
                </h2>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Anda tidak memiliki izin untuk mengakses halaman ini.
                    Silakan hubungi administrator jika Anda memerlukan akses.
                </p>
                <div className="flex gap-3 justify-center">
                    <Button
                        onClick={() => router.history.back()}
                        variant="outline"
                    >
                        Kembali
                    </Button>
                    <Button onClick={() => router.navigate({to: '/dashboard'})}>
                        Ke Dashboard
                    </Button>
                </div>
            </div>
        </div>
    );
}

export const Route = createFileRoute('/403')({
    component: Forbidden,
});