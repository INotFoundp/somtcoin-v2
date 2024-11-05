"use client"

import React, {useEffect, useState} from "react";
import useGetData from "@/hooks/useGetData";

import Loader from "@/components/themes/Loader";
import {toast} from "react-toastify";
import Retry from "@/components/Retry/Retry";


export default function ReferralPage() {
    const {data, loading, success, refetch} = useGetData("/refral/link")
    const {data: refralList, loadingList, refetchList} = useGetData<ReferralList[]>("/refral/list")
    const [isCopied, setIsCopied] = useState(false)

    useEffect(() => {
        if (isCopied) {
            setTimeout(() => setIsCopied(false), 6000)
        }
    }, [isCopied])



    if (loading || loadingList) return <Loader/>
    if (!success) <Retry refetch={[refetch, refetchList]}/>

    return (

        <>
            <div className='h-full flex flex-col items-center   text-white font-medium'>

                <div className={"z-10 w-full"}>
                    <div className='font-bold z-10 text-[2rem] text-white'>
                        Referral
                    </div>
                    <div className='text-white'>
                        countReferral
                    </div>
                </div>
                <div className='w-full z-10 flex flex-col gap-3 justify-center p-4 bg-gray-300/10 mt-6  rounded-md'>
                    <div className='text-left w-full left-12 flex items-centerr justify-between '>
                        <div className='text-[1.2rem] text-white font-bold '>
                            My Invite Link:
                        </div>


                        <button
                            disabled={isCopied}
                            onClick={(e) => {
                                navigator.clipboard.writeText(data?.link).then(() => {
                                    setIsCopied(true)
                                })
                            }}
                            className={`w-fit px-2 py-1 text-white transition font-semibold  bg-opacity-30 active:bg-opacity-50 border border-1  border-white/55 bg-white rounded-md  `}>
                            {isCopied ? "Copied" : "Copy"}
                        </button>

                    </div>
                    <div className='w-full'>
                        <div className=''>
                            <input type="text"
                                   defaultValue={data?.link}
                                   className='w-full h-[2.5rem] bg-black/15 border border-1 border-white/15 rounded-md text-center px-2 placeholder:text-white/15 text-white focus:outline-none'
                                   placeholder='Refferal Code'/>
                        </div>
                    </div>
                </div>
            </div>
            <hr className='mt-7 opacity-20'/>
            <div className={"w-full"}>
                <div className='w-full mt-3 rounded-md overflow-auto'>

                    {refralList?.map?.((ref) => {

                        const {permium, coin, name,} = ref

                        return (
                            <div
                                className='bg-gray-400/15 py-3 px-3 mt-2 tablet:w-[20rem] mobile:w-[10rem]  rounded-md'>
                                <div
                                    className='text-white flex justify-between items-center text-left mx-4 text-[20px]'>
                            <span>
                                {name}
                            </span>
                                    {/*<div>*/}
                                    {/*    <MdKeyboardArrowRight className='text-white font-bold' size={25}/>*/}
                                    {/*</div>*/}

                                </div>
                                <div className='text-white text-left mx-4 text-[20px]'>
                                    {coin} Coin | {permium ? "Premium" : "Not Premium"}
                                </div>

                            </div>
                        )
                    })}


                </div>
            </div>

        </>
    )
}
