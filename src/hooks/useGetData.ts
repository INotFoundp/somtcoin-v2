"use client";

import {useEffect, useState} from "react";
import HOST from "@/server/host";
import win from "@/utils/window";


interface data {
    data: object | [] | any,
    loading: boolean,
    success: boolean
}

export default function useGetData<T = any>(path: string) {


    const [data, setData] = useState<data>(
        {data: {}, loading: true, success: false,}
    )

    const token = win?.localStorage?.getItem?.("token") ?? win?.token


    useEffect(() => {
        refetch()
    }, []);

    function refetch() {

        setData({
            loading: true,
            data: {},
            success: false,
        })


        const promise: Promise<Response> = fetch(HOST + path, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                // @ts-ignore
                "authorization": `Bearer ${token}`,
            },


        })

        promise.catch(() => {
            setData({
                ...data,
                loading: false,
                success: false
            })
        })

        promise.then((respone: Response) => respone.json())
            .then((data: any) => {
                setData({
                    data: data?.data,
                    loading: false,
                    success: true
                })
            })
    }


    return {...data, refetch} as {
        [k: string | symbol | number]: any,
        data: T,

    }
}