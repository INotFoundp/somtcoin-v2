import Image from "next/image";

export default function Coin({width, height, hasShadow, className = ""}: {
    hasShadow?: boolean,
    className?: string,
    width: number,
    height: number
}) {
    return (
        <Image style={hasShadow ? {filter: "drop-shadow(0 0 12px #333333a1)"} : {}} width={width} height={height}
               className={className} src={"/images/coin.png"} alt={"coin logo"}/>
    )
}
