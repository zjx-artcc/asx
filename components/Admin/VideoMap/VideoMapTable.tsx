'use client';
import { GridColDef } from "@mui/x-data-grid";
import DataTable, { containsOnlyFilterOperator, equalsOnlyFilterOperator } from "../DataTable/DataTable";
import EditButton from "../GridButton/EditButton";
import DeleteButton from "../GridButton/DeleteButton";
import { deleteVideoMap, fetchVideoMaps } from "@/actions/videoMap";
import { toast } from "react-toastify";

export default function VideoMapTable() {

    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
            filterOperators: [...equalsOnlyFilterOperator, ...containsOnlyFilterOperator],
        },
        {
            field: 'actions',
            headerName: 'Actions',
            type: 'actions',
            flex: 1,
            getActions: (params) => [
                <EditButton key={params.row.id} id={params.row.id} label="Edit Video Map" editUrl={`/admin/video-maps/${params.row.id}`} />,
                <DeleteButton key={params.row.id} id={params.row.id} label="Delete Video Map" deleteFunction={deleteVideoMap} onSuccess={() => toast.success(`Video map ${params.row.name} deleted successfully!`)} warningMessage="Deleting this video map will remove all the JSON files associated with it.  Click again to confirm." />
            ],
        },
    ];

    return (
        <DataTable columns={columns} fetchData={async (pagination, sort, filter) => {
            const fetchedVideoMaps = await fetchVideoMaps(pagination, sort, filter);
            return {data: fetchedVideoMaps[1], rowCount: fetchedVideoMaps[0]};
        }}/>
    );
}