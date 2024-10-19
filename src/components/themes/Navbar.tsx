"use client"

import Link from "next/link";
import {usePathname} from "next/navigation";

export default function Navbar() {

    const path = usePathname()

    const list = {
        ref: {
            label: "Ref",
            img: "ref.png",
            href: "referral"
        },
        tasks: {
            label: "Task",
            img: "clipboard.png",
            href: "tasks"
        },
        tap: {
            label: "Tap",
            img: "coin.png",
            href: ""
        },
        boost: {
            label: "Boost",
            img: "zap.png",
            href: "boost"
        },

    }

    return (
        <nav
            className={"w-full backdrop-blur  fixed  z-20  bottom-0 left-0  "}>
            <div className={"w-full relative flex justify-between px-2 pb-4  h-full"}>
                {Object.entries(list).map(([key, value]) => {
                    let {img, label, href} = value;

                    const isActive = path.split("/")[1] === href

                    return (
                        <Link onClick={()=> {
                            navigator.vibrate(30)
                        }} key={key} href={"/" + href} style={{boxShadow: "0 0 40px #000000a1"}}
                              className={`w-16  h-16 border flex bg-zinc-900 ${isActive ? "bg-opacity-75" : "bg-opacity-60"} backdrop-blur-lg  border-zinc-500 flex-col justify-evenly items-center rounded-lg`}>
                            <img src={`/images/${img}`} className={"w-[26px]"} alt="ref"/>
                            <span className={"text-amber-50"}>{label}</span>
                        </Link>
                    )
                })}

            </div>

        </nav>
    )
}
