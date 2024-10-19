"use client"

import {ReactNode, useRef, useState} from "react";
import {SDKProvider} from "@telegram-apps/sdk-react";
import win from "@/utils/window";
import {ToastContainer} from "react-toastify";

export default function Providers({children}: { children: ReactNode }) {

    const token = win.localStorage?.getItem?.("access_token");

    const [loading, setLoading] = useState(true)

    const ref = useRef(false)


    return (
        <SDKProvider acceptCustomStyles={true}>
            {children}

        </SDKProvider>
    )
}
