import React from "react";

export default function Retry({refetch}: { refetch: (() => void)[] | (() => void) }) {
    return (
        <div className={"w-full h-full fixed flex  gap-8 items-center flex-col justify-center left-0 top-0 z-50"}>

            <p className={"text-3xl font-bold"}>Failed To Load Data</p>
            <div className={"px-6 w-full"}>
                <button
                    onClick={() => {
                        if (typeof refetch === "object") {
                            refetch.forEach((cb) => {
                                cb()
                            })
                        } else {
                            refetch()
                        }
                    }}
                    className={`brightness-150 active:scale-[0.98] transition w-full text-center dark:brightness-100 group   h-fit  p-1 rounded-xl bg-gradient-to-br from-yellow-800 via-yellow-600 to-yellow-800  `}
                >
                    <div
                        className="px-6 w-full py-2 h-fit backdrop-blur-xl  rounded-xl font-bold flex justify-center ">
                        <div
                            className="flex  text-zinc-900 gap-1 ">
                            Retry
                        </div>
                    </div>
                </button>
            </div>

        </div>
    )
}
