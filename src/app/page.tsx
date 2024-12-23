"use client"

import React, {useEffect, useRef, useState} from "react";
import request from "@/utils/request";
import win from "@/utils/window";
import Coin from "@/components/themes/Coin";
import Link from "next/link";
import Image from "next/image";
import getTelegramParams from "@/utils/getTelegramParams";
import HOST from "@/server/host";
import Retry from "@/components/Retry/Retry";
import {Sheet} from "react-modal-sheet";
import {toast} from "react-toastify";


export default function Home() {


    const [points, setPoints] = useState(win?.userBalance);
    const [clicks, setClicks] = useState<number[]>([])
    const [balance, setBalance] = useState<Partial<Tap>>({})
    const [showSheet, setShowSheet] = useState(false)
    const [tapingGuru, setTapingGuru] = useState(false)
    const [botReceived, setBotReceived] = useState<Partial<{ time: string, filled_volume: number }>>({})
    const energyThread = useRef<any>(false);
    const botReceivingRef = useRef(true)
    const [energy, setEnergy] = useState(0)
    const [error, setError] = useState(false)
    const [vClicks, setVClicks] = useState<{ id: number, x: number, y: number }[]>([]);
    const [loading, setLoading] = useState(true)


    function sendCoins(clicks: number[]) {

        const isTppingGuru = win.tapingGuru

        request(`/tap${tapingGuru ? "/click_taping_guru" : "/click"}`, "POST", {click: clicks}, (res) => {
            setClicks([])
            win.clicks = []
        }, () => {
            toast("Please Check Your Connection", {
                type: "error", theme: "dark"
            })
            sendCoins(win.clicks)
        })
    }

    function handleClick(e: any) {

        if (!Number(energy)) return;

        if (Number(balance?.clicker) > Number(energy)) return;
        if (navigator.vibrate) navigator?.vibrate(55)


        const x = e.touches[0].clientX;

        const y = e.touches[0].clientY - 280;


        const copyClicks = [...clicks, new Date().getTime()]
        setClicks(copyClicks)
        win.clicks = copyClicks
        setPoints(points + balance?.clicker);
        setVClicks([...vClicks, {id: Date.now(), x, y}]);
    }

    const handleAnimationEnd = (id: number) => {
        setVClicks((prevClicks) => prevClicks.filter(click => click.id !== id));
    };


    function authentication() {

        const token = win?.localStorage?.getItem?.("token");

        if (!token) {
            const {
                user,
                chat_instance,
                chat_type,
                auth_date,
                hash,
                ref: refral
            } = getTelegramParams(win.location.href);

            const dataCheckString = `auth_date=${auth_date}&chat_instance=${chat_instance}&chat_type=${chat_type}${!!refral ? `&start_param=${refral}` : ""}&user=${encodeURIComponent(JSON.stringify(user))}`;

            fetch(HOST + "/login", {
                method: "POST",
                body: JSON.stringify({"password": dataCheckString, "username": hash}),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json()).then(res => {
                win?.localStorage?.setItem?.("token", res.access_token);
                win.token = res.access_token
                request("/tap", "GET", null, (res) => {
                    setBalance(res.data)
                    setLoading(false)
                    setError(false)
                })
            }).catch((err) => {
                setError(true)
            })
        } else {
            request("/tap", "GET", null, (res) => {
                setBalance(res.data)
                setLoading(false)
                setError(false)
            })
        }
    }

    useEffect(() => {
        authentication()
    }, [])
    useEffect(() => {
        if (win.tapingGuru) {
            setTapingGuru(true)
            setTimeout(() => {
                sendCoins(win.clicks)
                setTapingGuru(false)
                win.tapingGuru = false
            }, 29_000)
        }
    }, [])
    useEffect(() => {
        if (!isNaN(Number(balance?.energy))) setEnergy(Number(balance?.energy))
    }, [balance]);
    useEffect(() => {
        if (balance?.user_balance) {
            setPoints(balance?.user_balance)
            win.userBalance = balance?.user_balance
        }
    }, [balance]);
    useEffect(() => {
        let interval = null as any

        if (!balance.clicker) return

        if (clicks.length && energy >= balance?.clicker) {
            interval = setTimeout(() => sendCoins(clicks), 750)
        }
        return () => {
            clearTimeout(interval)

        }
    }, [clicks]);
    useEffect(() => {
        if (!loading) win.firstLoad = true
    }, [loading]);
    useEffect(() => {
        if (win.botReceivingRef === undefined) {
            win.botReceivingRef = true
        }
        return () => {
            if (win?.clicks?.length) {
                sendCoins(win.clicks)
                win.userBalance = points
            }
        }
    }, [])

    useEffect(() => {
        if (win.botReceivingRef) {
            request("/bot/receiving", "GET", null, ({data}) => {
                setBotReceived(data)
                win.botReceivingRef = false
            }, () => {
                return null
            })
        }
    }, []);


    useEffect(() => {
        // @ts-ignore
        if (botReceived?.time && botReceived?.filled_volume > 10) setShowSheet(true)
    }, [botReceived])
    //
    useEffect(() => {
        if (!balance.clicker) return
        if (energy >= balance?.clicker && !tapingGuru) setEnergy(prev => prev - Number(balance?.clicker))
    }, [clicks]);

    useEffect(() => {

        if (balance.energy) {

            const perSec = balance?.filling_time?.filled_volume;


            console.log(energyThread.current)

            if (!Number(perSec)) return;


            energyThread.current = setInterval(() => {
                setEnergy(prev => Math.min(prev + Number(balance?.filling_time?.filled_volume), Number(balance?.max_energy)))
            }, 1000)

        }

        return () => clearInterval(energyThread.current)
    }, [balance])

    useEffect(() => {
        if (points) win.userBalance = points
    }, [points]);


    const coin = "/images/coin.png";

    if (error) return <Retry refetch={authentication}/>

    return (loading && !win.firstLoad) ? (
        <div className={"w-full h-full fixed flex justify-center left-0 top-0 z-50"}>
            <img className={"w-full h-full max-w-[500px]"} src={"/images/loading.jpg"} alt={""}/>

            <div className='flex absolute space-x-2 justify-center items-center    bottom-1/2 '>
                <span className='sr-only'>Loading...</span>
                <div className='h-8 opacity-40  w-8 bg-black rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                <div
                    className='h-8  opacity-40 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                <div className='h-8  opacity-40 w-8 bg-black rounded-full animate-bounce'></div>
            </div>
        </div>
    ) : (
        (

            <div className="h-full px-4 flex flex-col items-center   text-white font-medium">
                <div className="fixed inset-0 h-1/2 bg-gradient-overlay z-0"></div>
                <div className="absolute inset-0 flex items-center justify-center z-0">
                    <div className="radial-gradient-overlay"></div>
                </div>


                <div className="w-full z-10 gap-10  flex flex-col items-center text-white">
                    <div className={"flex w-full flex-col gap-12"}>
                        <div className={"flex justify-between"}>
                            <div
                                className={"flex border border-[#ffffff33] items-center gap-1 bg-[#222] w-fit pl-1  pr-4 py-1 rounded-full bg-opacity-55  "}>
                                <Link className={"flex  items-center gap-1"} href={"/spin"}>
                                    <Image width={40} height={40} className={"drop-shadow-xl "} src="/images/spin.png"
                                           alt=""/>
                                    <span className={"text-[14px] font-semibold"}>Spin</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth={2}
                                         stroke="currentColor" className="size-4">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="m8.25 4.5 7.5 7.5-7.5 7.5"/>
                                    </svg>
                                </Link>

                            </div>
                            <div className={"text-end"}>
                                <Link href={"daily"}>
                                    <span className={"font-semibold"}>Claim</span>
                                    <p className={"text-yellow-400 font-semibold"}>Daily Rewards</p>
                                </Link>
                            </div>
                        </div>
                        <div className={"text-4xl flex animate-scale items-center gap-4 flex-col font-bold w-full "}>
                            <div className={"flex items-center"}>
                                <Link className={"flex items-center"} href={"/stats"}>
                                    <Image width={35} height={35} src={"/images/bar_chart.png"} alt={"cup"}/>
                                    <span className={"text-lg"}>Stats</span>
                                </Link>
                            </div>

                            <div className={"flex  gap-2 justify-center text-center items-center"}>
                                <Coin width={60} height={60}/>
                                <span>
                        {(points)?.toLocaleString?.()}
                    </span>
                            </div>

                        </div>

                    </div>
                    <div className="flex-grow flex relative  justify-center">
                        <div className="relative  mt-4 h-fit">
                            <Image onTouchStartCapture={handleClick} className={"active:scale-[0.99] animate-scale"}
                                   src={coin}
                                   width={280} height={280}
                                   draggable={false} alt="somtcoin"/>
                            {vClicks.map((click) => (
                                <div
                                    key={click.id}
                                    className="absolute text-5xl font-bold opacity-0"
                                    style={{
                                        top: `${click.y - 50}px`,
                                        left: `${click.x - 70}px`,
                                        animation: `float 1s ease-out`
                                    }}
                                    onAnimationEnd={() => handleAnimationEnd(click.id)}
                                >

                                    {tapingGuru ? Number(balance.clicker) * 3 : balance?.clicker}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className='flex flex-col mt-12 text-white w-full'>
                    <div>
                        <div className='flex flex-row-reverse items-center place-items-center justify-center'>
                            <div className='text-[15px]'>
                                <strong>{Math.round(+energy)}/</strong><small>{balance?.max_energy}</small>
                            </div>
                            <div>

                            </div>
                        </div>
                    </div>
                </div>

                <Sheet  detent={"content-height"} isOpen={showSheet} onClose={() => setShowSheet(false)}>
                    <Sheet.Container style={{background: "#000000f9", color: "#fff"}}>
                        <Sheet.Header/>
                        <Sheet.Content>
                            <div
                                className={"flex py-4 w-full  justify-between items-center flex-col gap-6"}>

                                <div className={"flex flex-col gap-2 items-center"}>
                                    <div className={"flex justify-center"}>
                                        <Image src={"/images/robot_face.png"} alt={"BOT"} width={150} height={150}/>
                                    </div>

                                    <div className='text-white text-2xl text-center '>
                                        Receive Bot Coin !
                                    </div>
                                    <div className={"flex pt-6 items-center gap-2"}>
                                        <Coin width={20} height={20}/>
                                        <span className={"text-lg"}>{botReceived?.filled_volume}</span>
                                    </div>
                                </div>
                                <div className={"w-full flex-col flex gap-2 px-4"}>


                                    <button
                                        onClick={() => {
                                            request("/bot/confirm", "POST", {time: botReceived.time}, ({data}) => {
                                                setShowSheet(false)
                                                setPoints(data.user_balance)
                                            })
                                        }}
                                        className={`brightness-150 w-full active:scale-[0.99] text-center dark:brightness-100 group     p-1 rounded-xl bg-gradient-to-br from-yellow-800 via-yellow-600 to-yellow-800  `}
                                    >
                                        <div
                                            className="px-6 w-full py-2 backdrop-blur-xl  rounded-xl font-bold flex justify-center h-full">
                                            <div
                                                className="flex  text-zinc-900 gap-1 ">
                                                Claim
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
        )
    )
}
