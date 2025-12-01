import Layout from "@/pages/dashboard/layout.jsx"
import {useAuthStore} from "@/store/authStore.js"
import {useState} from "react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import apiCall from "@/services/apiCall.js"
import {toast} from "sonner"
import ContentHeader from "@/components/ui/content-header.jsx";

function DashboardPage() {
    const {userData, isLoading, isEmailUnverified} = useAuthStore();
    const [sending, setSending] = useState(false);

    const handleResendEmail = async () => {
        setSending(true);

        try {
            await apiCall.post('/api/email/verification-notification', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Accept': 'application/json'
                }
            });
            toast.success("Verification email sent! Please check your inbox.");

        } catch (error) {
            console.error('Error resending email:', error);
            toast.error("Something went wrong while sending email.");
        }

        setSending(false);
    };

    if (isLoading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500">Loading...</p>
                </div>
            </Layout>
        );
    }

    if (isEmailUnverified) {
        return (
            <Layout>
                <AlertDialog open={true}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Email Not Verified</AlertDialogTitle>
                            <AlertDialogDescription>
                                Your email address is not verified. Please check your inbox and verify your email
                                to access the dashboard.
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                            <AlertDialogAction
                                disabled={sending}
                                onClick={handleResendEmail}
                                className={sending ? "opacity-70 cursor-not-allowed" : ""}
                            >
                                {sending ? "Sending..." : "Resend Verification Email"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <div className="flex flex-col items-center justify-center h-64">
                    <h2 className="text-xl font-bold mb-2">Email Verification Required</h2>
                    <p className="text-gray-600">Please verify your email to continue.</p>
                </div>
            </Layout>
        );
    }

    if (!userData) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-64">
                    <p className="text-red-500">Failed to load user data</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <ContentHeader
                title="Dashboard"
                description="Dashboard"
            />
            <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
                <p className="text-lg font-bold uppercase">
                    👋hai {userData.name}
                </p>
            </div>
        </Layout>
    )
}

export default DashboardPage;