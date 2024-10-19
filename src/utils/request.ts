import HOST from "@/server/host";
import win from "@/utils/window";


export default function request(
    path: string,
    method: "POST" | "PUT" | "DELETE" | "GET",
    body: object | any,
    success = (res: any) => {

    },
    error = (res: any) => {

        console.log(res)

        alert(res?.error ?? "Error")
    }) {

    const promise = fetch(HOST + path, {
        method,
        headers: {
            "Content-Type": "application/json",
            // @ts-ignore
            "authorization": `Bearer ${win.token}`,
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

