import {useState} from "react";

export const useImagePreview = (setValue) => {
    const [previewImage, setPreviewImage] = useState(null);
    const [previewSignature, setPreviewSignature] = useState(null);

    const handleFileChange = (e, type) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            if (type === "profile_picture") {
                setPreviewImage(reader.result);
            } else if (type === "signature") {
                setPreviewSignature(reader.result);
            }
        };
        reader.readAsDataURL(file);

        setValue(type, file);
    };

    const removeImage = (type) => {
        setValue(type, null);
        if (type === "profile_picture") setPreviewImage(null);
        if (type === "signature") setPreviewSignature(null);
    };

    return {
        previewImage,
        previewSignature,
        handleFileChange,
        removeImage,
        setPreviewImage,
        setPreviewSignature
    };
};
