'use client';

import { GridColDef } from "@mui/x-data-grid";
import DataTable, { containsOnlyFilterOperator, equalsOnlyFilterOperator } from "../DataTable/DataTable";
import { toast } from "react-toastify";
import DeleteButton from "../GridButton/DeleteButton";
import EditButton from "../GridButton/EditButton";
import { deleteAirport, fetchAirports } from "@/actions/airport";
import { AirportCondition } from "@prisma/client";

export default function AirportTable() {

    const columns: GridColDef[] = [
        {
            field: 'icao',
            headerName: 'ICAO',
            flex: 1,
            filterOperators: [...equalsOnlyFilterOperator, ...containsOnlyFilterOperator],
        },
        {
            field: 'conditions',
            headerName: 'Conditions',
            flex: 1,
            filterOperators: [...equalsOnlyFilterOperator, ...containsOnlyFilterOperator],
            renderCell: (params) => params.row.conditions.map((c: AirportCondition) => c.name).join(', '),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            type: 'actions',
            flex: 1,
            getActions: (params) => [
                <EditButton key={params.row.id} id={params.row.id} label="Edit Airport" editUrl={`/admin/airports/${params.row.id}`} />,
                <DeleteButton key={params.row.id} id={params.row.id} label="Delete Airport" deleteFunction={deleteAirport} onSuccess={() => toast.success(`${params.row.icao} deleted successfully!`)} warningMessage="Deleting this video map will remove all the conditions associated with it.  Click again to confirm." />
            ],
        }
    ];

    return (
        <DataTable columns={columns} fetchData={async (pagination, sort, filter) => {
            const fetchedAirports = await fetchAirports(pagination, sort, filter);
            return {data: fetchedAirports[1], rowCount: fetchedAirports[0]};
        }}/>
    );
}