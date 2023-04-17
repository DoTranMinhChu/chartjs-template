import React, { useEffect, useRef } from "react";

import Chart from "chart.js/auto";
import { Utils } from "@/common/utils";

export default function LineChartSatcked() {
    const canvasEl = useRef<HTMLCanvasElement>(null);

    const colors = {
        green: {
            default: "rgba(90, 181, 92, 1)",
            half: "rgba(90, 181, 92, 0.5)",
            quarter: "rgba(90, 181, 92, 0.25)",
            zero: "rgba(90, 181, 92, 0)"
        },
        yellow: {
            default: "rgba(252, 218, 80, 1)",
            half: "rgba(252, 218, 80, 0.5)",
            quarter: "rgba(252, 218, 80, 0.25)",
            zero: "rgba(252, 218, 80, 0)"
        },
        red: {
            default: "rgba(188, 58, 54, 1)",
            half: "rgba(188, 58, 54, 0.5)",
            quarter: "rgba(188, 58, 54, 0.25)",
            zero: "rgba(188, 58, 54, 0)"
        },
    };
    console.log()
    useEffect(() => {
        if (canvasEl.current == null) return
        const ctx = canvasEl.current.getContext("2d");
        if (ctx == null) return;


        const labels: string[] = Utils.getListTime();

        const declineData: number[] = [];
        const sidewaysData: number[] = [];
        const advanceData: number[] = [];
        labels.forEach(() => {
            const numbers = Utils.randomNumbersBySum(100, 3, 50, 25);
            declineData.push(numbers[0]);
            sidewaysData.push(numbers[1]);
            advanceData.push(numbers[2]);
        })

        const myLineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Decline',
                        data: declineData,
                        borderColor: colors.red.default,
                        backgroundColor: colors.red.default,
                        pointStyle: false,
                        fill: true
                    },
                    {
                        label: 'Sideways',
                        data: sidewaysData,
                        borderColor: colors.yellow.default,
                        backgroundColor: colors.yellow.default,
                        pointStyle: false,
                        fill: true
                    },
                    {
                        label: 'Advance',
                        data: advanceData,
                        borderColor: colors.green.default,
                        backgroundColor: colors.green.default,
                        pointStyle: false,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Line Chart Satcked',
                        color: "white",
                        padding: 50
                    },
                    tooltip: {
                        mode: 'index'
                    },


                    legend: {
                        position: "bottom",

                    },
                },
                interaction: {
                    mode: 'index',
                    axis: 'x',
                    intersect: false
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Month'
                        }
                    },
                    y: {
                        stacked: true,
                        title: {
                            display: true,
                            text: 'Value'
                        },
                        max: 100,
                        min: 0
                    }
                },
            },
            plugins: [
                {
                    id: "line",
                    afterDraw: (chart: any) => {
                        console.log("chart.tooltip?._active ==> ", chart.tooltip?._active)
                        if (chart.tooltip?._active.length) {
                            let x = chart.tooltip._active[0].element.x;
                            let yAxis = chart.scales.y;
                            let ctx = chart.ctx;
                            ctx.save();
                            ctx.beginPath();
                            ctx.moveTo(x, yAxis.top);
                            ctx.lineTo(x, yAxis.bottom);
                            ctx.lineWidth = 1;
                            ctx.strokeStyle = '#ff0000';
                            ctx.stroke();
                            ctx.restore();
                        }
                    }
                }
            ],
        }
        );

        return function cleanup() {
            myLineChart.destroy();
        };
    });

    return (
        <div className="App">
            <canvas ref={canvasEl} />
        </div>
    );
}
