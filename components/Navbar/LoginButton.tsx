'use client';
import React from 'react';
import {Button} from "@mui/material";
import {signIn, signOut} from "next-auth/react";
import {Session} from "next-auth";
import {usePathname, useSearchParams} from "next/navigation";

function LoginButton({session}: { session: Session | null }) {

    const pathname = usePathname();
    const searchParams = useSearchParams();

    if (session) {
        return (
            <Button sx={{ml: 1,}} variant="outlined" color="inherit" onClick={() => signOut({
                callbackUrl: `${pathname}?${searchParams.toString()}`,
            })}>
                Logout
            </Button>
        )
    } else {
        return (
            <Button color="inherit" sx={{ml: 1,}} variant="outlined" onClick={() => signIn('vatsim', {
                callbackUrl: `${pathname}?${searchParams.toString()}`,
            })}>
                Login
            </Button>
        );
    }
}

export default LoginButton;