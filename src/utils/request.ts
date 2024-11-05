import HOST from "@/server/host";
import win from "@/utils/window";
import {toast} from "react-toastify";


export default function request(
    path: string,
    method: "POST" | "PUT" | "DELETE" | "GET",
    body: object | any,
    success = (res: any) => {

    },
    error = (res: any) => {
        toast(res?.error ?? "Error", {
            type: "error",
            theme: "dark"
        })
    }) {

    const token = win?.localStorage?.getItem?.("token") ?? win?.token

    const promise = fetch(HOST + path, {
        method,
        headers: {
            "Content-Type": "application/json",
            "authorization": `Bearer ${token}`,
        },
        ...(!!body && ({body: body instanceof FormData ? body : JSON.stringify(body)})),
    })

    if (method !== "GET") {
        // @ts-ignore

    }


    promise.finally(() => {
        // @ts-ignore

    })

    promise.catch(() => {
        return false
    })

    promise.then(res => {
        return res.json()
    }).then(respone => {
        const func = respone.ok ? success : error
        func(respone)
    })

}

