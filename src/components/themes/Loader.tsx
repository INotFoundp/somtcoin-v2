export default function Loader() {
    return (
        <div style={{filter : "drop-shadow(0 0 15px black)"}} className='flex w-full fixed left-0 top-0 flex-col space-y-6 justify-center items-center h-full  '>

            <div className={"flex space-x-2"}>
                <div
                    className='h-8 w-8  bg-transparent border-4 border-black rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                <div
                    className='h-8 w-8  bg-transparent border-4 border-black rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                <div className='h-8 w-8  bg-transparent border-4 border-black rounded-full animate-bounce'></div>
            </div>
            <span style={{filter : "drop-shadow(0 0 35px black)"}} className='text-2xl font-bold'>Loading...</span>
        </div>
    )
}
