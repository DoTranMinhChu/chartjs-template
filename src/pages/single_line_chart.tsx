import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function SingleLineChart() {
    const canvasEl = useRef<HTMLCanvasElement>(null);

    const colors = {
        purple: {
            default: "rgba(149, 76, 233, 1)",
            half: "rgba(149, 76, 233, 0.5)",
            quarter: "rgba(149, 76, 233, 0.25)",
            zero: "rgba(149, 76, 233, 0)"
        },
        indigo: {
            default: "rgba(80, 102, 120, 1)",
            quarter: "rgba(80, 102, 120, 0.25)"
        }
    };

    useEffect(() => {
        if (canvasEl.current == null) return
        const ctx = canvasEl.current.getContext("2d");
        if (ctx == null) return;
        const gradient = ctx.createLinearGradient(0, 16, 0, 600);
        gradient.addColorStop(0, colors.purple.half);
        gradient.addColorStop(0.65, colors.purple.quarter);
        gradient.addColorStop(1, colors.purple.zero);

        const weight = [60.0, 60.2, 59.1, 61.4, 59.9, 60.2, 59.8, 58.6, 59.6, 59.2];

        const labels = [
            "Week 1",
            "Week 2",
            "Week 3",
            "Week 4",
            "Week 5",
            "Week 6",
            "Week 7",
            "Week 8",
            "Week 9",
            "Week 10"
        ];
        const data = {
            labels: labels,
            datasets: [
                {
                    backgroundColor: gradient,
                    label: "My First Dataset",
                    data: weight,
                    fill: true,
                    borderWidth: 2,
                    borderColor: colors.purple.default,
                    lineTension: 0.2,
                    pointBackgroundColor: colors.purple.default,
                    pointRadius: 3
                }
            ]
        };

        const myLineChart = new Chart(ctx,
            {
                type: "line",
                data: data,
                options: {

                    hover: {
                        mode: 'index',
                        intersect: true
                    },
                    plugins: {
                        tooltip: {
                            mode: 'nearest',
                            intersect: false
                        }
                    }
                }
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