import React, { useEffect, useRef, useState } from "react";

import Chart, { ChartDataset } from "chart.js/auto";
import { Utils } from "@/common/utils";

export default function ChartMultiChoice() {
    const canvasEl = useRef<HTMLCanvasElement>(null);
    const [labels, setLabels] = useState<string[]>([]);
    const [volumes, setVolumes] = useState<number[]>([]);
    const [datasets, setDatasets] = useState<ChartDataset[]>([]);
    const [durationInital, setDurationInital] = useState<number>(1000);
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
    const renderChart = () => {
        if (canvasEl.current == null) return
        const ctx = canvasEl.current.getContext("2d");
        if (ctx == null) return;
        const myLineChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    ...datasets,
                    {
                        label: 'Net volume',
                        data: volumes,
                        backgroundColor: (context: any) => {
                            const index = context.dataIndex;
                            const value: any = context.dataset.data[index]?.valueOf();
                            return value < 0 ? colors.red.default : colors.green.default;
                        },
                        type: 'bar',
                        order: 100000,

                    },

                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Chart.js Combined Line/Bar Chart',
                        padding: 50
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        },
                        type: "category"
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Net Volume'
                        }
                    },

                },
                animation: {
                    duration: durationInital
                }

            },
        }
        );
        setTimeout(() => {
            setDurationInital(0)
        }, durationInital)
        return function cleanup() {
            myLineChart.destroy();
        };
    }
    const handleRandomValues = () => {
        setDurationInital(1000)
        setVolumes(Utils.randoms(labels.length, 10000, 10000, -2000))
    }
    const handleAddMA = (valueMA: number) => {
        const color = Utils.randomColor();
        const MA5: ChartDataset = {
            label: `MA ${valueMA}`,
            data: Utils.MA(volumes, valueMA),
            borderColor: color,
            backgroundColor: color,
            type: 'line',
            borderWidth: 2,
            pointStyle: "circle",
            pointBorderWidth: 0.001,
            order: 0,
        }
        const newDataSets = [...datasets, MA5];
        let length = newDataSets.length;
        setDatasets(newDataSets.map((value: ChartDataset, index: number) => {
            value.order = length--;
            return value
        }))
    }
    const handleRemoveDatasets = (indexRemove: number) => {

        const newDataSets = datasets.filter((_value: ChartDataset, index: number) => {
            if (indexRemove != index) return true;
            return false
        });
        let length = newDataSets.length;
        setDatasets(newDataSets.map((value: ChartDataset, index: number) => {
            value.order = length--;
            return value;
        }))
    }
    useEffect(() => {
        setLabels(Utils.getDaysArray(new Date("2023-01-01"), new Date()).map((v) => v.toISOString().slice(0, 10)))
    }, [])
    useEffect(() => {
        handleRandomValues()
    }, [labels])

    useEffect(() => {
        return renderChart()
    }, [volumes, datasets]);

    return (
        <div className="container mx-auto">
            <canvas ref={canvasEl} />
            <div className="flex gap-4 pb-5">
                {datasets.map((value: ChartDataset, index: number) => {
                    const color = value.backgroundColor?.toString();
                    return (
                        <button onClick={() => handleRemoveDatasets(index)} key={index} className="inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-md" style={{ backgroundColor: color }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            {value.label}
                        </button>
                    )
                })}
            </div >
            <div className="flex gap-4">
                <button onClick={() => handleRandomValues()} className="p-3 font-bold rounded-lg hover:bg-violet-900 bg-violet-950">Re-random values</button>
                <button onClick={() => handleAddMA(5)} className="p-3 font-bold rounded-lg hover:bg-violet-900 bg-violet-950">MA05</button>
                <button onClick={() => handleAddMA(15)} className="p-3 font-bold rounded-lg hover:bg-violet-900 bg-violet-950">MA15</button>
            </div>
        </div >
    );
}
