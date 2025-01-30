'use client';

import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import DataTable, { containsOnlyFilterOperator, equalsOnlyFilterOperator } from "../DataTable/DataTable";
import { Map } from "@mui/icons-material";
import { toast } from "react-toastify";
import DeleteButton from "../GridButton/DeleteButton";
import EditButton from "../GridButton/EditButton";
import { deleteFacility, fetchFacilities } from "@/actions/facility";
import { useRouter } from "next/navigation";

export default function FacilityTable() {

    const router = useRouter();

    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
            filterOperators: [...equalsOnlyFilterOperator, ...containsOnlyFilterOperator],
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            getActions: (params) => [
                <GridActionsCellItem
                    key={params.row.id}
                    icon={<Map />}
                    label="Radar Sectors"
                    onClick={() => router.push(`/admin/facilities/${params.row.id}/sectors`)}
                />,
                <EditButton key={params.row.id} id={params.row.id} label="Edit Facility" editUrl={`/admin/facilities/${params.row.id}`} />,
                <DeleteButton key={params.row.id} id={params.row.id} label="Delete Facility" deleteFunction={deleteFacility} onSuccess={() => toast.success(`${params.row.name} deleted successfully!`)} warningMessage="Deleting this facility will remove all the sectors associated with it.  Click again to confirm." />
            ],
        }
    ];

    return (
        <DataTable columns={columns} fetchData={async (pagination, sort, filter) => {
            const fetchedFacilities = await fetchFacilities(pagination, sort, filter);
            return {data: fetchedFacilities[1], rowCount: fetchedFacilities[0]};
        }}/>
    )

}