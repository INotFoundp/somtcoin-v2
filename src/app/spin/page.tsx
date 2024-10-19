"use client"

import React, {useEffect, useState} from "react";
import useGetData from "@/hooks/useGetData";
import Loader from "@/components/themes/Loader";
import {Sheet} from "react-modal-sheet";
import request from "@/utils/request";
import {toast} from "react-toastify";

export default function SpinPage() {

    const {data, loading} = useGetData("/spin/concept/structure")
    const [isOpen, setOpen] = useState(false);


    const [list, setList] = useState<({ name: string, id: string })[]>([]);
    const [radius] = useState<number>(75);
    const [rotate, setRotate] = useState<number>(0);
    const [easeOut, setEaseOut] = useState<number>(0);
    const [angle, setAngle] = useState<number>(0);
    const [top, setTop] = useState<number | null>(null);
    const [offset, setOffset] = useState<number | null>(null);
    const [net, setNet] = useState<number | null>(null);
    const [result, setResult] = useState<number | null>(null);
    const [spinning, setSpinning] = useState<boolean>(false);

    useEffect(() => {
        renderWheel();
    }, [data, loading]);

    useEffect(() => {
        if (!loading) setList(data)
    }, [loading, data]);

    const renderWheel = () => {
        const numOptions = list.length;
        const arcSize = (2 * Math.PI) / numOptions;
        setAngle(arcSize);

        topPosition(numOptions, arcSize); // Calculate the top position

        let currentAngle = 0;
        for (let i = 0; i < numOptions; i++) {
            const text = list[i].name;
            renderSector(i + 1, text, currentAngle, arcSize, i % 2 === 0 ? "#a67c00" : "#FFBF00");
            currentAngle += arcSize;
        }
    };

    const topPosition = (num: number, arcSize: number) => {
        let topSpot = 0;
        let degreesOff: number | null = null;
        if (num === 9) {
            topSpot = 7;
            degreesOff = Math.PI / 2 - arcSize * 2;
        } else if (num === 8) {
            topSpot = 6;
            degreesOff = 0;
        } else if (num <= 7 && num > 4) {
            topSpot = num - 1;
            degreesOff = Math.PI / 2 - arcSize;
        } else if (num === 4) {
            topSpot = num - 1;
            degreesOff = 0;
        } else if (num <= 3) {
            topSpot = num;
            degreesOff = Math.PI / 2;
        }

        setTop(topSpot - 1);
        setOffset(degreesOff);
    };

    const renderSector = (
        index: number,
        text: string,
        start: number,
        arc: number,
        color: string
    ) => {
        const canvas = document.getElementById("wheel") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d");

        if (!ctx) return

        ctx.shadowColor = "rgba(0, 0, 0 , 0.7)"; // رنگ سایه به رنگ مشکی با شفافیت 50%
        ctx.shadowBlur = 10; // میزان تاری سایه
        ctx.shadowOffsetX = 0; // جابجایی سایه در جهت محور X
        ctx.shadowOffsetY = 0; // جابجایی سایه در جهت محور Y


        const x = canvas.width / 2;
        const y = canvas.height / 2;
        const baseSize = radius * 3.33;
        const textRadius = baseSize - 100;


        ctx.beginPath();
        ctx.arc(x, y, radius, start, start + arc, false);

        ctx.lineWidth = radius * 4;
        ctx.strokeStyle = color;
        ctx.stroke();


        const angle = index * arc;


        ctx.save();


        ctx.translate(
            baseSize + Math.cos(angle - arc / 2) * textRadius,
            baseSize + Math.sin(angle - arc / 2) * textRadius
        );

        ctx.rotate(angle - arc / 2 + Math.PI / 2);
        ctx.font = "20px serif"
        ctx.fillText(text, -ctx.measureText(text).width / 2, 0);

        ctx.restore();
    };

    const spin = () => {
        const randomSpin = Math.floor(Math.random() * 900) + 500;
        const audio = new Audio("/sounds/spin.mp3")

        audio.play()
        setRotate(randomSpin);
        setEaseOut(2);
        setSpinning(true);

        setTimeout(() => {
            getResult(randomSpin);
        }, 4000);
    };

    const getResult = (spin: number) => {
        const netRotation = ((spin % 360) * Math.PI) / 180; // RADIANS
        let travel = netRotation + (offset || 0);
        let count = (top || 0) + 1;
        while (travel > 0) {
            travel -= angle;
            count--;
        }
        const finalResult = count >= 0 ? count : list.length + count;

        console.log(finalResult)

        setNet(netRotation);
        setResult(finalResult);
        setOpen(true)
    };

    const reset = () => {
        setRotate(0);
        setEaseOut(0);
        setResult(null);
        setSpinning(false);
    };

    if (loading) return <Loader/>


    return (
        <div className="w-full  flex justify-center gap-32 flex-col items-center overflow-hidden h-full">
            <div className={"z-10 "}>
                <h4 className={"text-3xl font-bold text-center"}>Spin And Try your Chance !</h4>
            </div>
            <div className={"relative w-[330px] flex  justify-center left-0 h-[330px]"}>
                <span className="w-full text-center top-0  text-4xl z-10 absolute">&#9660;</span>
                <canvas
                    className="w-full"
                    id="wheel"
                    width="500"
                    height="500"
                    style={{
                        fontSize: 20,
                        WebkitTransform: `rotate(${rotate}deg)`,
                        WebkitTransition: `-webkit-transform ${3.7}s ease-in-out`
                    }}
                />

                <button type="button" id="spin"
                        className="border-zinc-900/90 text-2xl  font-bold border-4 w-24 h-24 shadow-xl rounded-full bg-white text-black/80 absolute top-[35%] right-[36%]"
                        onClick={spin}>
                    SPIN
                </button>
            </div>

            {isOpen && <div onClick={() => {
                setOpen(false)
            }} className={"w-full h-full backdrop-blur fixed left-0 top-0 z-40"}></div>}
            <Sheet detent={"content-height"} isOpen={isOpen} onClose={() => setOpen(false)}>
                <Sheet.Container style={{background: "#000000f9", color: "#fff"}}>
                    <Sheet.Header/>
                    <Sheet.Content>
                        <div className={"flex py-4  px-4 w-full h-[250px] justify-between items-center flex-col gap-6"}>
                            <div className={"text-2xl font-bold"}>
                                {/*// @ts-ignore*/}
                                You won {list[result as keyof typeof list]?.name}
                            </div>

                            <button
                                onClick={() => {
                                    // @ts-ignore
                                    request(`/spin/concept/structure?dataID=${list[result as keyof typeof list]?.id}`, "POST", {} , (res) => {
                                        toast("Success" , {
                                            type : "success" ,
                                            theme : "Dark"
                                        })
                                    })
                                }}
                                className={`brightness-150 w-full  text-center dark:brightness-100 group     p-1 rounded-xl bg-gradient-to-br from-yellow-800 via-yellow-600 to-yellow-800  `}
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
                    </Sheet.Content>
                </Sheet.Container>
                <Sheet.Backdrop/>
            </Sheet>
        </div>

    );
}
