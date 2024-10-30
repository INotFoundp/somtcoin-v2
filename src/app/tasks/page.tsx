"use client"

import Coin from "@/components/themes/Coin";
import React, {useState} from "react";
import useGetData from "@/hooks/useGetData";
import win from "@/utils/window";
import {Sheet} from "react-modal-sheet";
import Image from "next/image";
import Loader from "@/components/themes/Loader";
import request from "@/utils/request";
import RequestLoader from "@/components/RequestLoading/RequestLoader";
import {toast} from "react-toastify";


export default function TasksPage() {
    const {data, loading, refetch} = useGetData("/task/user")
    const [isOpen, setOpen] = useState(false);
    const [mainTask, setMainTask] = useState<any>({})
    const [requestLoader, setRequestLoader] = useState(false)


    if (loading) return <Loader/>


    const taskStats = {
        youtube: {title: "Youtube", verifyTitle: "Subs"},
        channel: {title: "Telegram", verifyTitle: "Subscribe"},
        instagram: {title: "Instagram", verifyTitle: "Follow"},
        x: {title: "Twitter ", verifyTitle: "Follow"},

    }

    return (
        <>
            {requestLoader && (
                <RequestLoader/>
            )}
            <div className={"h-full w-full  flex flex-col items-center gap-12   text-white font-medium"}>
                <div className="fixed inset-0 h-1/2 bg-gradient-overlay z-0"></div>
                <div className={"flex items-center gap-2"}>
                    <Coin width={40} className={"z-10"} height={40}/>
                    <span
                        className={"z-10 text-4xl font-bold text-zinc-200"}>{win?.userBalance?.toLocaleString?.()}</span>
                </div>

                <div className={" w-full"}>

                    <div className={"flex  flex-col gap-4"}>
                        <div className={"flex flex-col gap-5"}>
                            <div className={"flex justify-between items-center"}>
                                <h2 className={"text-3xl z-10 text-zinc-200 font-bold"}>Tasks</h2>
                                <span className={"font-semibold z-10"}>({Object.keys(data)?.length})</span>
                            </div>
                            <hr className={"z-10"}/>
                        </div>
                        <div className={"flex z-10 flex-col gap-3"}>
                            {Object.entries(data)?.map(([key, val]) => {

                                    const {
                                        link,
                                        status,
                                        refral,
                                        refraluser,
                                        coin,
                                        username,
                                        time,
                                        activate,
                                        gotolink
                                    } = val as any

                                    return (
                                        <div
                                            onClick={() => {
                                                setOpen(true)
                                                // @ts-ignore
                                                setMainTask({...val, key} as object)
                                            }}
                                            className={"w-full flex gap-3 z-10 items-center justify-between p-2 px-3 border border-zinc-500 rounded-3xl bg-zinc-900 bg-opacity-25 "}>
                                            <div className={"flex gap-3 items-center "}>
                                                <img src={`/images/${status?.toLowerCase?.()}.png`} alt={""}
                                                     width={40} height={40}/>
                                                <div>
                                                    <h5 className={"text-sm font-semibold"}> {taskStats[status as keyof typeof taskStats]?.verifyTitle} {username}</h5>
                                                    <div className={"flex font-semibold items-center gap-1"}>
                                                        <Coin width={20} height={20}/>
                                                        {(+coin).toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                            {activate && (
                                                <img src={"/images/tick.png"} alt={""} width={25} height={25}/>
                                            )}

                                        </div>
                                    )
                                }
                            )}

                        </div>
                    </div>
                    {isOpen && <div onClick={() => {
                        setOpen(false)
                    }} className={"w-full h-full backdrop-blur fixed left-0 top-0 z-40"}></div>}


                    <Sheet detent={"content-height"} isOpen={isOpen} onClose={() => setOpen(false)}>
                        <Sheet.Container style={{background: "#000000f9", color: "#fff"}}>
                            <Sheet.Header/>
                            <Sheet.Content>
                                <div
                                    className={"flex py-4 w-full h-[450px] justify-between items-center flex-col gap-6"}>
                                    <div className={"pt-6 flex flex-col gap-2 items-center"}>
                                        <div className={"flex flex-col gap-6 items-center"}>
                                            <Image src={`/images/${mainTask?.status}.png`} width={140} height={140}
                                                   alt={"telegram"}/>
                                            <span
                                                className={"text-xl font-semibold"}> {taskStats[mainTask?.status as keyof typeof taskStats]?.verifyTitle} {mainTask?.username}</span>
                                        </div>
                                        <div className={"flex items-center gap-2"}>
                                            <Coin width={20} height={20}/>
                                            <span className={"text-lg"}>1000</span>
                                        </div>
                                    </div>
                                    <div className={"w-full flex-col flex gap-2 px-4"}>
                                        {mainTask?.refral && (
                                            <span
                                                className={"text-center text-xs text-yellow-400"}>You most Invite {mainTask?.refraluser} To Do This Task !</span>)}
                                        <a
                                            target={"_blank"}
                                            onClick={(event) => {
                                                if (mainTask.gotolink) {
                                                    event.preventDefault()
                                                    event.stopPropagation()

                                                    request("/task/go_to_link", "POST", {key: mainTask.key}, (res) => {
                                                        win?.open?.(mainTask.link, '_blank')?.focus?.();
                                                    })
                                                }
                                            }}
                                            href={mainTask?.link}
                                            className="brightness-150 w-full active:scale-[0.99]  text-center dark:brightness-100 group     p-1 rounded-xl bg-gradient-to-br from-yellow-800 via-yellow-600 to-yellow-800  "
                                        >
                                            <div
                                                className="px-6 w-full py-2 backdrop-blur-xl  rounded-xl font-bold flex justify-center h-full">
                                                <div
                                                    className="flex  text-zinc-900 gap-1 ">
                                                    {taskStats[mainTask?.status?.toLowerCase?.() as keyof typeof taskStats]?.verifyTitle}

                                                </div>
                                            </div>
                                        </a>
                                        <button
                                            disabled={mainTask?.refral}
                                            onClick={() => {
                                                setRequestLoader(true)
                                                request("/task/check", "POST", {key: mainTask.key}, (res) => {
                                                    refetch()
                                                    setRequestLoader(false)
                                                    setOpen(false)
                                                }, (res) => {
                                                    toast(res?.error ?? "Error", {
                                                        type: "error",
                                                        theme: "dark"
                                                    })
                                                    setRequestLoader(false)
                                                    setOpen(false)

                                                })
                                            }}
                                            className={`brightness-150 w-full ${mainTask?.refral ? "opacity-70" : " active:scale-[0.99] "} text-center dark:brightness-100 group     p-1 rounded-xl bg-gradient-to-br from-yellow-800 via-yellow-600 to-yellow-800  `}
                                        >
                                            <div
                                                className="px-6 w-full py-2 backdrop-blur-xl  rounded-xl font-bold flex justify-center h-full">
                                                <div
                                                    className="flex  text-zinc-900 gap-1 ">
                                                    Check
                                                </div>
                                            </div>
                                        </button>

                                    </div>
                                </div>
                            </Sheet.Content>
                        </Sheet.Container>
                        <Sheet.Backdrop/>
                    </Sheet>
                </div>


            </div>
        </>
    )
}

