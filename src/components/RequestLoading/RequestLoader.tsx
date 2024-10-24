export default function RequestLoader() {
    return (
        <div>
            <div style={{filter: "drop-shadow(0 0 15px black)"}}
                 className='flex w-full bg-white/30 z-[999999999999] backdrop-blur-lg fixed left-0 top-0 flex-col space-y-6 justify-center items-center h-full  '>

                <div className={"flex z-[999999999999] space-x-2"}>
                    <div
                        className='h-8 w-8 z-[999999999999] bg-transparent border-4 border-black rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                    <div
                        className='h-8 w-8  z-[999999999999] bg-transparent border-4 border-black rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                    <div className='h-8 w-8 z-[999999999999]  bg-transparent border-4 border-black rounded-full animate-bounce'></div>
                </div>
                <span style={{filter: "drop-shadow(0 0 35px black)"}} className='text-2xl z-[999999999999] font-bold'>Loading...</span>
            </div>
        </div>
    )
}
