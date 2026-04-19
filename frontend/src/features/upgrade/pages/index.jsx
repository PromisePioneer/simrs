// src/pages/upgrade/index.jsx
import {useEffect, useState} from 'react';
import {useNavigate} from '@tanstack/react-router';
import {Check, X, Loader2, Crown, Zap, Shield, ArrowLeft} from 'lucide-react';
import {Button} from '@shared/components/ui/button';
import {Badge} from '@shared/components/ui/badge';
import {useAuthStore} from '@features/auth';
import {toast} from 'sonner';
import apiCall from '@shared/services/apiCall.js';
import {plans as localPlans} from '@shared/lib/billingsdk-config';
import {cn} from "@shared/lib/utils.js";
import {usePricingStore} from "@shared/store/index.js";

const PLAN_ICONS = {free: Shield, basic: Zap, pro: Crown};
const PLAN_COLORS = {
    free: 'border-border',
    basic: 'border-primary/40',
    pro: 'border-yellow-400 shadow-lg shadow-yellow-100 dark:shadow-yellow-900/20',
};

function FeatureItem({name, icon}) {
    const isCheck = icon === 'check';
    return (
        <li className="flex items-center gap-2.5 text-sm">
            <span className={cn(
                'flex items-center justify-center w-4 h-4 rounded-full shrink-0',
                isCheck ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
            )}>
                {isCheck
                    ? <Check className="w-2.5 h-2.5 text-green-600"/>
                    : <X className="w-2.5 h-2.5 text-red-500"/>
                }
            </span>
            <span className={isCheck ? 'text-foreground' : 'text-muted-foreground line-through'}>
                {name}
            </span>
        </li>
    );
}

function PlanCard({plan, isCurrentPlan, isLoading, onSelect}) {
    const Icon = PLAN_ICONS[plan.id] ?? Shield;
    return (
        <div className={cn(
            'relative flex flex-col rounded-2xl border-2 bg-card p-6 transition-all duration-200',
            PLAN_COLORS[plan.id] ?? 'border-border',
            plan.highlight && 'shadow-xl scale-[1.02]',
            !isCurrentPlan && !isLoading && 'hover:shadow-lg hover:-translate-y-0.5',
        )}>
            {plan.badge && (
                <Badge
                    className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 font-bold px-3 whitespace-nowrap">
                    {plan.badge}
                </Badge>
            )}
            {isCurrentPlan && (
                <Badge variant="outline" className="absolute -top-3 right-4 border-primary text-primary">
                    Plan Aktif
                </Badge>
            )}

            <div className="mb-4 flex items-center gap-3">
                <div className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-xl',
                    plan.id === 'pro' ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-primary/10'
                )}>
                    <Icon className={cn('w-5 h-5', plan.id === 'pro' ? 'text-yellow-600' : 'text-primary')}/>
                </div>
                <div>
                    <h3 className="font-bold text-lg">{plan.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{plan.description}</p>
                </div>
            </div>

            <div className="mb-6">
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">
                        {plan.id === 'free' ? 'Gratis' : `Rp ${plan.monthlyPrice}`}
                    </span>
                    {plan.id !== 'free' && (
                        <span className="text-sm text-muted-foreground">/bulan</span>
                    )}
                </div>
            </div>

            <ul className="space-y-2 mb-6 flex-1">
                {(plan.features ?? []).map((f, i) => (
                    <FeatureItem key={i} {...f}/>
                ))}
            </ul>

            <Button
                className={cn(
                    'w-full',
                    plan.id === 'pro' && 'bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold',
                )}
                variant={isCurrentPlan ? 'outline' : plan.id === 'free' ? 'outline' : 'default'}
                disabled={isCurrentPlan || isLoading}
                onClick={() => !isCurrentPlan && onSelect(plan.id)}
            >
                {isLoading
                    ? <Loader2 className="w-4 h-4 animate-spin"/>
                    : isCurrentPlan ? 'Plan Aktif' : plan.buttonText
                }
            </Button>
        </div>
    );
}

// inModal = true  → dipakai di dalam Dialog (nav-user)
// inModal = false → full page di /upgrade
export default function UpgradePage({inModal = false, onClose}) {
    const navigate = useNavigate();
    const {userData, checkAuth} = useAuthStore();
    const {pricingData, fetchPlans} = usePricingStore();

    const [loadingPlanId, setLoadingPlanId] = useState(null);
    const [activeOrder, setActiveOrder] = useState(null);

    const currentPlanSlug = userData?.subscription?.plan?.slug ?? 'free';
    const hasActiveSub = userData?.subscription?.status === 'active';

    useEffect(() => {
        fetchPlans();
        checkActiveOrder();
    }, []);

    const checkActiveOrder = async () => {
        try {
            const res = await apiCall.get('/api/v1/orders/active');
            if (res.data?.data?.order) setActiveOrder(res.data.data);
        } catch {
        }
    };

    const handleSelectPlan = async (planSlug) => {
        const backendPlans = pricingData?.data ?? [];
        const plan = backendPlans.find(p => p.slug === planSlug || p.id === planSlug);

        if (!plan) {
            if (!pricingData) {
                toast.loading('Memuat data plan...');
                await fetchPlans();
                toast.dismiss();
                const retry = usePricingStore.getState().pricingData?.data ?? [];
                const retryPlan = retry.find(p => p.slug === planSlug || p.id === planSlug);
                if (!retryPlan) {
                    toast.error('Data plan tidak ditemukan. Coba refresh halaman.');
                    return;
                }
                return handleSelectPlan(planSlug); // rekursi sekali
            }
            toast.error('Data plan tidak ditemukan. Coba refresh halaman.');
            return;
        }

        setLoadingPlanId(planSlug);

        try {
            if (planSlug === 'free') {
                await apiCall.post(`/api/v1/subscriptions/assign/${plan.id}`);
                toast.success('Berhasil beralih ke paket Free.');
                await checkAuth();
                inModal ? onClose?.() : navigate({to: '/dashboard'});
                return;
            }

            // Basic / Pro → buat order Xendit
            const res = await apiCall.post('/api/v1/orders/generate', {plan_id: plan.id});
            const paymentUrl = res.data?.data?.payment_url;

            if (paymentUrl) {
                toast.success('Order berhasil. Mengarahkan ke halaman pembayaran...');
                window.open(paymentUrl, '_blank');
                await checkActiveOrder();
            }
        } catch (e) {
            const msg = e.response?.data?.message ?? 'Gagal memproses permintaan.';
            toast.error(msg);
            if (e.response?.data?.errors?.order) await checkActiveOrder();
        } finally {
            setLoadingPlanId(null);
        }
    };

    // Merge data backend + fitur dari config lokal
    const plans = (pricingData?.data?.length ? pricingData.data : localPlans).map(p => {
        const slug = p.slug ?? p.id ?? '';
        const local = localPlans.find(c => c.id === slug) ?? {};
        return {
            ...local,
            id: slug,
            title: p.name ?? local.title ?? slug,
            description: p.description ?? local.description ?? '',
            monthlyPrice: p.price
                ? Number(p.price).toLocaleString('id-ID')
                : (local.monthlyPrice ?? '0'),
        };
    }).filter(p => p.id); // buang entry tanpa id

    return (
        <div className={cn('bg-background', inModal ? 'p-6' : 'min-h-screen py-16 px-4')}>
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="text-center mb-10">
                    <Badge variant="outline" className="mb-3 border-primary/30 text-primary">
                        Upgrade Paket
                    </Badge>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">
                        Pilih paket yang sesuai
                    </h1>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        Mulai gratis, upgrade kapan saja. Pembayaran aman melalui Xendit.
                    </p>
                </div>

                {/* Pending order banner */}
                {activeOrder && (
                    <div
                        className="mb-6 rounded-xl border border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 p-4 flex items-center justify-between gap-4">
                        <div>
                            <p className="font-semibold text-yellow-800 dark:text-yellow-200 text-sm">
                                Ada order yang belum dibayar
                            </p>
                            <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-0.5">
                                Order #{activeOrder.order?.order_number} — {activeOrder.order?.plan?.name}
                            </p>
                        </div>
                        <Button
                            size="sm"
                            className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold shrink-0"
                            onClick={() => window.open(activeOrder.payment_url, '_blank')}
                        >
                            Lanjut Bayar
                        </Button>
                    </div>
                )}

                {/* Plan cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map(plan => (
                        <PlanCard
                            key={plan.id}
                            plan={plan}
                            isCurrentPlan={currentPlanSlug === plan.id}
                            isLoading={loadingPlanId === plan.id}
                            onSelect={handleSelectPlan}
                        />
                    ))}
                </div>

                {/* Footer actions */}
                <div className="text-center mt-8">
                    {inModal ? (
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            Tutup
                        </Button>
                    ) : hasActiveSub ? (
                        <Button variant="ghost" onClick={() => navigate({to: '/dashboard'})}>
                            <ArrowLeft className="w-4 h-4 mr-2"/> Kembali ke Dashboard
                        </Button>
                    ) : null}
                </div>
            </div>
        </div>
    );
}