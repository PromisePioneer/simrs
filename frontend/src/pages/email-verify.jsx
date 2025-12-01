import {useEffect, useState} from "react";
import {useSearchParams} from "@tanstack/react-router";
import apiCall from "@/services/apiCall.js";

function EmailVerify() {
    const [params] = useSearchParams();
    const [status, setStatus] = useState("checking");

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                setStatus("loading");

                const res = await apiCall.get(
                    `/api/email/verify`,
                    {
                        params: {
                            id: params.get("id"),
                            hash: params.get("hash"),
                            expires: params.get("expires"),
                            signature: params.get("signature")
                        }
                    }
                );

                if (res.data.success) {
                    setStatus("success");
                } else {
                    setStatus("failed");
                }
            } catch (error) {
                setStatus("failed");
            }
        };

        verifyEmail();
    }, []);

    return (
        <div className="h-screen flex justify-center items-center text-lg font-medium">
            {status === "loading" && <div>Verifying your email...</div>}
            {status === "success" && (
                <div>Email verified successfully! You can now login.</div>
            )}
            {status === "failed" && (
                <div>Verification link is invalid or expired.</div>
            )}
        </div>
    );
}

export default EmailVerify;
