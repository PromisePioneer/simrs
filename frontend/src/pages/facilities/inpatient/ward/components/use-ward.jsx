import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {useWardStore} from "@/store/wardStore.js";
import {useRoomStore} from "@/store/roomStore.js";
import {useBuildingStore} from "@/store/buildingStore.js";
import {useDepartmentStore} from "@/store/departmentStore.js";
import {useRoomTypeStore} from "@/store/roomTypeStore.js";

export function useWardPage() {
    const [expandedRows, setExpandedRows] = useState(new Set());
    const [activeWardId, setActiveWardId] = useState(null);

    // ── Stores ──────────────────────────────────────────────────────────────
    const ward = useWardStore();
    const room = useRoomStore();
    const {fetchBuildingOptions}    = useBuildingStore();
    const {fetchDepartmentOptions}  = useDepartmentStore();
    const {fetchRoomTypeOptions}    = useRoomTypeStore();

    // ── Ward form ────────────────────────────────────────────────────────────
    const {
        register: registerWard,
        handleSubmit: handleSubmitWard,
        reset: resetWard,
        control: controlWard,
        formState: {errors: wardErrors, isSubmitting: wardSubmitting},
    } = useForm({
        mode: "all",
        defaultValues: {name: "", floor: "", building_id: "", department_id: ""},
    });

    // ── Room form ────────────────────────────────────────────────────────────
    const {
        register: registerRoom,
        handleSubmit: handleSubmitRoom,
        reset: resetRoom,
        control: controlRoom,
        formState: {errors: roomErrors, isSubmitting: roomSubmitting},
    } = useForm({
        mode: "all",
        defaultValues: {ward_id: "", room_number: "", name: "", capacity: "", room_type_id: ""},
    });

    // ── Effects ──────────────────────────────────────────────────────────────
    useEffect(() => {
        ward.fetchWards({perPage: 20});
    }, [ward.fetchWards, ward.search, ward.currentPage]);

    useEffect(() => {
        if (ward.wardValue && !ward.openDeleteModal) {
            resetWard({
                name:          ward.wardValue.name          || "",
                floor:         ward.wardValue.floor         || "",
                building_id:   ward.wardValue.building_id   || "",
                department_id: ward.wardValue.department_id || "",
            });
        } else {
            resetWard({name: "", floor: "", building_id: "", department_id: ""});
        }
    }, [ward.wardValue, ward.openDeleteModal]);

    useEffect(() => {
        if (!ward.setOpenModal) {
            resetWard({name: "", floor: "", building_id: "", department_id: ""});
            if (ward.setWardValue) ward.setWardValue(null);
        }
    }, [ward.setOpenModal]);

    useEffect(() => {
        if (room.roomValue) {
            resetRoom({
                room_number:  room.roomValue.room_number  || "",
                name:         room.roomValue.name         || "",
                capacity:     room.roomValue.capacity     || "",
                room_type_id: room.roomValue.room_type_id || "",
            });
        } else {
            resetRoom({room_number: "", name: "", capacity: ""});
        }
    }, [room.openModal]);

    // ── Submit handlers ──────────────────────────────────────────────────────
    const onWardSubmit = async (data) => {
        if (ward.wardValue) await ward.updateWard(data, ward.wardValue.id);
        else await ward.createWard(data);
    };

    const onRoomSubmit = async (data) => {
        const wardId  = room.roomValue?.ward_id ?? activeWardId;
        const payload = {...data, ward_id: wardId};
        if (room.roomValue?.id) await room.updateRoom(room.roomValue.id, payload);
        else await room.createRoom(payload);
        await ward.fetchWards({perPage: 20});
    };

    // ── Row expand toggle ────────────────────────────────────────────────────
    const toggleExpand = (id) => {
        setExpandedRows(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const openAddRoom = (wardId) => {
        setActiveWardId(wardId);
        room.setOpenModal();
    };

    return {
        // ward store
        ward,
        // room store
        room,
        // options fetchers
        fetchBuildingOptions,
        fetchDepartmentOptions,
        fetchRoomTypeOptions,
        // expanded rows
        expandedRows,
        toggleExpand,
        // ward form
        registerWard, handleSubmitWard, controlWard, wardErrors, wardSubmitting,
        onWardSubmit,
        // room form
        registerRoom, handleSubmitRoom, controlRoom, roomErrors, roomSubmitting,
        onRoomSubmit,
        // helpers
        openAddRoom,
    };
}