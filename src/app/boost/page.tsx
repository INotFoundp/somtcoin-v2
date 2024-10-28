"use client"

import {Sheet} from "react-modal-sheet";
import request from "@/utils/request";
import win from "@/utils/window";
import useGetData from "@/hooks/useGetData";
import React, {useState} from "react";
import Loader from "@/components/themes/Loader";
import {useRouter} from "next/navigation";
import Coin from "@/components/themes/Coin";
import {toast} from "react-toastify";
import Retry from "@/components/Retry/Retry";

export default function Boost() {
    const router = useRouter()

    const {data: boostData, loading, success, refetch} = useGetData("/balance")


    const [selectedBoosterItem, setData] = useState();

    const [mainBoostSheet, setMainBoostSheet] = useState<any>({})
    const [showSheet, setShowSheet] = useState(false)


    if (loading) return <Loader/>


    if (!success) return (
        <Retry refetch={refetch}/>
    )


    const {multitap, energylimit, recharging, tapingguru, fulltank} = boostData ?? {}

    const dailyBoostersItem = [{
        boost_name: 'Taping Guru', count: 3, used: tapingguru,
        disabled: false,
        requestUrl: '/balance/tapingguru',
        objName: 'tapingguru',
        desc: 'Multiply your tap income by x3 for 20 seconds. Do not use energy while active',
        icon: 'fire.png',
        onCLick: () => {
            router.push("/")
            win.tapingGuru = true
        }

    }, {
        boost_name: 'Full Tank', count: 3, used: fulltank,
        disabled: false,
        objName: 'fulltank',
        requestUrl: '/balance/fulltank',
        icon: 'zap.png',
        desc: 'Fill Your energy to the max.',
        onCLick: () => {
            router.push("/")
        }
    }];


    const boostersItem = [
        {
            objName: 'multitap',
            requestUrl: "/balance/multitap",
            boost_name: 'Multitap',
            desc: 'Increase amount of TAP you can earn per one tap. +1 per tap for each level',
            icon: 'hand.png',
            price: multitap?.price,
            level: multitap?.level
        },
        {
            objName: 'energylimit',
            requestUrl: "/balance/energylimit",
            boost_name: 'Energy Limit',
            desc: 'Increase the limit of energy storage +500 energy limit for each level.',
            icon: 'battery.png',
            price: energylimit?.price,
            level: energylimit?.level

        },
        {
            objName: 'recharging',
            requestUrl: "/balance/rechargingspeed",
            boost_name: 'Recharging Speed',
            desc: 'Increase speed of recharge +1 per second.',
            icon: 'zap.png',
            price: recharging?.price,
            level: recharging?.level

        }
    ]

    const userBalance = boostData?.user_balance

    return (
        <div className={"h-full w-full  flex flex-col items-center  text-white font-medium"}>
            <div>
                <div>
                    <div className='relative font-bold text-[2rem] text-white'>
                        Total Share Balance
                    </div>
                    <div className=' flex flex-row mt-2 justify-center relative text-white'>
                        <div>
                            <Coin width={24} height={24}/>
                        </div>
                        <div className=' ml-2 font-bold text-[30px]'>
                            {userBalance}
                        </div>
                    </div>
                </div>
            </div>
            <hr className='mt-7 opacity-20'/>
            <div className={"flex flex-col gap-6 w-full justify-center"}>
                <div className='daily_boosters_section z-10'>
                    <div className='text-white  text-[20px] text-left mt-6 font-bold'>
                        Your daily boosters:
                    </div>
                    <div className='mt-4'>
                        <div className='flex flex-row gap-6'>
                            {

                                dailyBoostersItem.map((el) => {
                                    console.log(el.icon)
                                    return (
                                        <>

                                            <div className={`w-[11rem] bg-black/80 h-[4.5rem] rounded-md`}>
                                                <img src={`/images/${el.icon}`} height={30} className='ml-2 mt-4'
                                                     width={30}
                                                     alt="icon"/>
                                                <div className='relative'>
                                                    <div
                                                        onClick={() => {
                                                            if (!showSheet) {
                                                                setMainBoostSheet(el)
                                                                setShowSheet(true)
                                                            }
                                                        }}
                                                        className='flex flex-col justify-center text-sm text-justify relative text-white font-bold'>

                                                        <div className="absolute left-12 bottom-[-12px]">
                                                            <div>{el.boost_name}</div>
                                                            {
                                                                <div className=''>{el.used}/{el.count}</div>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className='daily_boosters_sectio  w-full'>
                    <div className='text-white relative text-[20px] text-left  font-bold'>
                        Boosters:
                    </div>
                    <div
                        className='bg-none   overflow-auto w-full iphone12:h-[24rem] iphone14:h-[29rem] flex flex-col items-center sm:-mt-2 iphone14:mt-2 rounded-md'>
                        {boostersItem.map((el) => {

                            let {boost_name, desc, icon, objName, requestUrl, price, level} = el;

                            return (
                                <>
                                    <div
                                        className='mt-3 w-full flex h-[5rem] px-4 py-1 items-center gap-3 bg-black/90 rounded-md'
                                        onClick={() => {
                                            if (!showSheet) {
                                                setMainBoostSheet(el)
                                                setShowSheet(true)
                                            }
                                        }}>


                                        {<img src={`/images/${icon}`} width={48} className='' alt="icon"/>}

                                        <div className='text-white flex w-full items-center justify-between'>
                                            <div className=' text-left text-white'>
                                                <div className=''>
                                                    {boost_name}
                                                </div>
                                                <div className='flex flex-row gap-2 mt-1 -ml-1'>
                                                    <Coin width={24} height={24}/>
                                                    <div className='-mt-[1px] text-gray-100/65'>

                                                        <div className={"text-white"}>{price} | <span
                                                            className={"text-gray-100/65"}>{level} Level</span></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className=''>
                                                <div
                                                    className='mt-2 w-[2.5rem] h-[2.5rem] p-1 flex justify-center items-center bg-white/50  rounded-full'>
                                                    <svg data-slot="icon" fill="none" stroke-width="2.5"
                                                         stroke="#000000" viewBox="0 0 24 24"
                                                         xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                              d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )
                        })}

                        <div
                            className='mt-3 w-full flex h-[5rem] px-4 py-1 items-center gap-3 bg-black/80 rounded-md'
                            onClick={() => {
                                if (!showSheet) {
                                    setMainBoostSheet({
                                        objName: 'bot',
                                        requestUrl: "/balance/bot",
                                        boost_name: 'Tap Bot',
                                        desc: 'Tap bot will tap when your energy is full. Max bot work duration is 12 hours.',
                                        icon: 'robot_face.png',
                                        status: false,
                                        price: boostData?.bot?.price
                                    })
                                    setShowSheet(true)
                                }
                            }}>
                            {<img src={'/images/robot_face.png'} width={48}
                                  alt="icon"/>}

                            <div className='text-white flex w-full items-center justify-between'>
                                <div className='text-left bottom-12'>
                                    <div className=''>
                                        Tap Bot
                                    </div>
                                    <div className='flex flex-row gap-2 mt-1 -ml-1'>
                                        <Coin width={24} height={24}/> {boostData?.bot?.price}
                                        <div className='-mt-[1px] text-gray-400/65'>
                                            <div>{boostData?.bot?.status ? "Active" : "Not Active"}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className=''>
                                    <div
                                        className='mt-2 w-[2.5rem] h-[2.5rem] p-1 flex justify-center items-center bg-white/70  rounded-full'>
                                        <svg data-slot="icon" fill="none" stroke-width="2.5"
                                             stroke="#000000" viewBox="0 0 24 24"
                                             xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                  d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {showSheet && <div onClick={() => {
                setShowSheet(false)
            }} className={"w-full h-full backdrop-blur fixed left-0 top-0 z-40"}></div>}

            <Sheet
                style={{zIndex: "50"}}
                isOpen={showSheet} snapPoints={[0.5]} onClose={() => {
                setShowSheet(false)
            }}>
                <Sheet.Container style={{background: "#000000f0"}}>
                    <Sheet.Header/>
                    <Sheet.Content>
                        <div className={"flex flex-col items-center w-full justify-center h-full gap-4 py-2"}>
                            {
                                <div className=' flex justify-center '>
                                    <div className='flex flex-col items-center justify-items-center'>
                                        <div className=''>
                                            <img src={`/images/${mainBoostSheet.icon}`} width={75} alt="icon"/>
                                        </div>
                                        <div className='text-white w-[20rem] text-center mt-12'>
                                            {mainBoostSheet?.desc}
                                        </div>

                                        <div className='flex  justify-center  gap-3  text-white'>
                                            <Coin width={24} height={24}/>

                                        </div>
                                    </div>
                                </div>
                            }

                            <div className='flex justify-center w-full px-6 '>
                                <button
                                    onClick={() => {

                                        if (!mainBoostSheet.hasOwnProperty("price")) {
                                            request(mainBoostSheet.requestUrl, "POST", null, () => {
                                                refetch()
                                                mainBoostSheet.onCLick()
                                                setShowSheet(false)
                                            })
                                        } else {
                                            if (mainBoostSheet.price < userBalance && mainBoostSheet.hasOwnProperty("price")) {

                                                if (mainBoostSheet.objName === "bot" && boostData?.bot?.status) {
                                                    toast("The bot is active", {
                                                        type: "error",
                                                        theme: "dark"
                                                    })
                                                    return;
                                                }

                                                request(mainBoostSheet.requestUrl, "POST", null, () => {
                                                    refetch()
                                                    setShowSheet(false)
                                                })


                                            } else {
                                                toast("Lack of coins", {
                                                    type: "error",
                                                    theme: "dark"
                                                })
                                            }

                                        }


                                    }}
                                    className={`brightness-150 w-full  text-center dark:brightness-100 group     p-1 rounded-xl bg-gradient-to-br from-yellow-800 via-yellow-600 to-yellow-800  `}
                                >
                                    <div
                                        className="px-6 w-full py-2 backdrop-blur-xl  rounded-xl font-bold flex justify-center h-full">
                                        <div
                                            className="flex  text-zinc-900 gap-1 ">
                                            {!mainBoostSheet.hasOwnProperty("price") ? `Boost ${mainBoostSheet.boost_name}` : mainBoostSheet.price < userBalance ? 'Get It' : 'Insufficient funds'}
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
    );
}