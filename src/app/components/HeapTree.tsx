'use client';

import { useEffect, useRef } from 'react';

type Node = {
    value: number;
    index: number;
    x: number;
    y: number;
    children: Node[];
};

type HeapTreeProps = {
    array: number[];
    highlighted: number[];
    swapped: number[];
    heapSize: number;
};

const NODE_RADIUS = 25;
const LEVEL_HEIGHT = 100;

const HeapTree = ({ array, highlighted, swapped, heapSize }: HeapTreeProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Calculate tree dimensions
        const height = Math.ceil(Math.log2(array.length + 1)) * LEVEL_HEIGHT;
        const width = array.length * 70;
        canvas.width = width;
        canvas.height = height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw tree recursively
        const drawNode = (index: number, x: number, y: number, levelWidth: number) => {
            if (index >= array.length) return;

            // Draw connections to children
            const leftIndex = 2 * index + 1;
            const rightIndex = 2 * index + 2;

            if (leftIndex < array.length) {
                const childX = x - levelWidth / 4;
                const childY = y + LEVEL_HEIGHT;
                ctx.beginPath();
                ctx.moveTo(x, y + NODE_RADIUS);
                ctx.lineTo(childX, childY - NODE_RADIUS);
                ctx.stroke();
                drawNode(leftIndex, childX, childY, levelWidth / 2);
            }

            if (rightIndex < array.length) {
                const childX = x + levelWidth / 4;
                const childY = y + LEVEL_HEIGHT;
                ctx.beginPath();
                ctx.moveTo(x, y + NODE_RADIUS);
                ctx.lineTo(childX, childY - NODE_RADIUS);
                ctx.stroke();
                drawNode(rightIndex, childX, childY, levelWidth / 2);
            }

            // Draw node
            ctx.beginPath();
            ctx.arc(x, y, NODE_RADIUS, 0, Math.PI * 2);
            ctx.fillStyle =
                highlighted.includes(index) ? 'yellow' :
                    swapped?.includes(index) ? '#4CAF50' :
                        index >= heapSize ? '#9C27B0' : '#2196F3';
            ctx.fill();
            ctx.stroke();

            // Draw value
            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = '14px Arial';
            ctx.fillText(array[index].toString(), x, y);
        };

        if (array.length > 0) {
            drawNode(0, width / 2, 50, width / 2);
        }
    }, [array, highlighted, swapped, heapSize]);

    return <canvas ref={canvasRef} className="w-full h-96" />;
};

export default HeapTree;