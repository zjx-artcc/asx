import React from 'react';
import logo from '@/public/img/logo.png';
import Image from "next/image";
import Link from "next/link";

export default function Logo() {
    return (
        (<Link href="/">
            <Image
                src={logo}
                alt={"ZJX ARTCC Logo"}
                width={215}
                style={{
                    maxWidth: "100%",
                    height: "auto"
                }}/>
        </Link>)
    );
}