'use client';
import { TextField } from "@mui/material";
import { RadarFacility } from "@prisma/client";
import Form from "next/form";
import FormSaveButton from "../Form/FormSaveButton";
import { createOrUpdateFacility } from "@/actions/facility";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function FacilityForm({ facility }: { facility?: RadarFacility, }) {

    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        const { errors, facility: newFacility } = await createOrUpdateFacility(formData);

        if (errors) {
            toast.error(errors.map(e => e.message).join('. '));
            return;
        }

        toast.success(`Facility ${facility ? 'updated' : 'created'}.`);
        if (!facility) {
            router.push(`/admin/facilities/${newFacility.id}/sectors`);
        }

    }

    return (
        <Form action={handleSubmit}>
            <input type="hidden" value={facility?.id} name="id" />
            <TextField name="name" label="Name *" variant="filled" defaultValue={facility?.name} fullWidth sx={{ mb: 2, }} />
            <FormSaveButton />
        </Form>
    )

}