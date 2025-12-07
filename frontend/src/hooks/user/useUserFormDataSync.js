// hooks/useFormDataSync.js
import {useEffect} from "react";
import {formatUserDataForForm} from "@/utils/user/formUtils";

export const useUserFormDataSync = (userValue, reset, setPreviewImage, setPreviewSignature) => {
    useEffect(() => {
        if (userValue) {
            reset(formatUserDataForForm(userValue));

            if (userValue.profile_picture) {
                setPreviewImage(userValue.profile_picture);
            }
            if (userValue.signature) {
                setPreviewSignature(userValue.signature);
            }
        }
    }, [userValue, reset, setPreviewImage, setPreviewSignature]);
};