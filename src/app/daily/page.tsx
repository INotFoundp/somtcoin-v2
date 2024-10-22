"use client"

import useGetData from "@/hooks/useGetData";
import Coin from "@/components/themes/Coin";
import formatNumber from "@/utils/formatNumber";
import Loader from "@/components/themes/Loader";
import Retry from "@/components/Retry/Retry";
import request from "@/utils/request";

export default function Page() {

    const {data, loading, success, refetch} = useGetData<Rewards[]>("/daily/concept/structure")

    if (loading) return <Loader/>
    if (!success) return <Retry refetch={refetch}/>

    return (
        <div className={"h-full px-4 flex flex-col gap-8 text-white font-medium"}>
            <div className={"z-10 flex-col gap-6 flex w-full"}>
                <h2 className={"text-xl font-bold"}>Claim Daily Rewards</h2>
                <hr/>
            </div>

            <div className={"z-10 place-items-center gap-y-5 grid grid-cols-4"}>
                {data?.map((item) => {
                    let {activate, coin, id, name} = item;
                    return (
                        <div
                            onClick={() => {
                                if (activate) {
                                    request(`/daily/concept/structure?dataID=${id}`, "POST", {}, (res) => {
                                        refetch()
                                    })
                                }
                            }}
                            className={`w-16 ${!activate && "opacity-70"} flex items-center justify-around flex-col h-16 border text-center bg-black/70  rounded-xl`}>
                            <span className={"text-xs font-bold w-full text-center"}>{name}</span>

                            <div className={"flex gap-1 items-center font-bold "}>
                                {formatNumber(coin)} <Coin width={15} height={15}/>
                            </div>
                        </div>
                    )
                })}

            </div>
        </div>
    )
}
