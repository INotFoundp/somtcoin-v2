"use client"

import useGetData from "@/hooks/useGetData";
import {useState} from "react";
import Loader from "@/components/themes/Loader";
import {MdOutlineTouchApp} from "react-icons/md";
import {FaUserClock, FaUsers} from "react-icons/fa6";
import {FaRegDotCircle} from "react-icons/fa";
import Coin from "@/components/themes/Coin";
import Retry from "@/components/Retry/Retry";


export default function StatsBox(props: any) {

    const {data: statsData, loading, refetch, success} = useGetData("/alluser")
    const [loadingStateMenu, setLoadingStateMenu] = useState(true);


    const [menuData, setMenuData] = useState({
        name: '',
        value: '',
        icon: <></>
    })


    if (loading) return <Loader/>

    if (!success) return <Retry refetch={refetch}/>

    const {
        online,
        players,
        newuser,
        touch
    } = statsData ?? {}

    const
        statItems = [
            {icon: <MdOutlineTouchApp/>, name: 'Touches', object_name: 'touch', value: touch},
            {icon: <FaUsers/>, name: 'Players', object_name: 'players', value: players},
            {icon: <FaUserClock/>, name: 'Users', object_name: 'newuser', value: newuser},
            {icon: <FaRegDotCircle/>, name: 'Online', object_name: 'onlineUser', value: online},
        ]


    const handleOnClickStatMenu = (index: any) => {

        statItems.map((el, idex) => {
            if (index === idex) {
                setMenuData({
                    name: el.name,
                    value: el.value,
                    icon: el.icon
                });
            }
        });

        setLoadingStateMenu(false)
    }

    return (
        <>
            <div className=''>
                <div>
                    <div className='relative font-bold text-[2rem] text-white'>
                        Total Share Balance
                    </div>
                    <div className=' flex flex-row mt-2 justify-center items-center relative text-white'>
                        <div>
                            <Coin width={32} height={32}/>
                        </div>
                        <div className='text-xl  ml-2'>
                            {(statsData?.total_mined) ?? 0}
                        </div>
                    </div>
                </div>
            </div>
            <hr className='mt-7 opacity-20'/>
            {<>
                <div className='container mt-12'>
                    <div className='flex flex-row gap-2'>
                        {statItems.map((el, index) => (
                            <>
                                <div className='w-[7rem] h-[6rem] bg-black/55 border border-1  border-white/55 rounded-md
                            hover:bg-putty-400  ' onClick={() => handleOnClickStatMenu(index)}>
                                    <div className="flex flex-col items-center mt-2">
                                        <div className='text-white relative text-[3rem]'>
                                            {el.icon}
                                        </div>
                                        <div className='text-white relative mt-2'>
                                            {el.name}
                                        </div>
                                    </div>
                                </div>
                            </>
                        ))}
                    </div>
                </div>
                <div className='text-white relative text-center mt-12'>
                    {loadingStateMenu ? <>
                        <div className='text-[20px]'>
                            Select Menu Item for Show Details
                        </div>
                    </> : <>
                        <div className='text-[25px] text-center'>
                            {menuData.name} : {menuData.value}
                        </div>
                    </>}
                </div>
            </>}
        </>
    );
}