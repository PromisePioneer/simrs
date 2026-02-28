import {useStockMovementStore} from "@/store/stockMovementStore.js";
import {useEffect} from "react";


function StockMovementPage() {
    const {fetchMedicineMovementStock, medicineMovementStocks} = useStockMovementStore();

    useEffect(() => {
        fetchMedicineMovementStock({perPage: 20});
    }, []);

    return "";
}

export default StockMovementPage;