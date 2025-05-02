'use client';

import { useCallback, useEffect, useState } from 'react';

export type HeapSortStep = {
    array: number[];
    highlighted: number[];
    swapped?: number[];
    description: string;
    heapSize: number;
};

type HeapType = 'max' | 'min';

function* heapSortGenerator(input: number[], heapType: HeapType): Generator<HeapSortStep> {
    const arr = [...input];
    const n = arr.length;

    // Heapify-down for max/min heap
    function* heapify(heapSize: number, root: number): Generator<HeapSortStep> {
        let target = root;
        const left = 2 * root + 1;
        const right = 2 * root + 2;

        // 1) Highlight root & children
        yield {
            array: [...arr],
            highlighted: [root, left, right].filter((i) => i < heapSize),
            description: `Compare node ${root} with its children`,
            heapSize,
        };

        // 2) Find the target (largest/smallest) among root, left, right
        const compare = heapType === 'max' 
            ? (a: number, b: number) => a > b
            : (a: number, b: number) => a < b;

        if (left < heapSize && compare(arr[left], arr[target])) {
            target = left;
        }
        if (right < heapSize && compare(arr[right], arr[target])) {
            target = right;
        }

        // 3) If a child is target, swap and recurse
        if (target !== root) {
            [arr[root], arr[target]] = [arr[target], arr[root]];
            yield {
                array: [...arr],
                highlighted: [root, target],
                swapped: [root, target],
                description: `Swap ${arr[target]} and ${arr[root]} → heapify at ${target}`,
                heapSize,
            };
            yield* heapify(heapSize, target);
        }
    }

    // 1) Build initial heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        yield {
            array: [...arr],
            highlighted: [i],
            description: `Heapify subtree at ${i} to build ${heapType}-heap`,
            heapSize: n,
        };
        yield* heapify(n, i);
    }

    // 2) Repeatedly extract target (at 0), swap it to the end, and rebuild
    for (let end = n - 1; end > 0; end--) {
        // Move current target to its final position
        [arr[0], arr[end]] = [arr[end], arr[0]];
        yield {
            array: [...arr],
            highlighted: [0, end],
            swapped: [0, end],
            description: `Place ${heapType === 'max' ? 'max' : 'min'} (${arr[end]}) at position ${end}`,
            heapSize: end,
        };

        // Rebuild heap on the reduced array [0..end-1]
        yield* heapify(end, 0);
    }

    // 3) Done
    yield {
        array: [...arr],
        highlighted: [],
        description: 'Sorting complete!',
        heapSize: 0,
    };
}

export function useHeapSort(initialArray: number[], heapType: HeapType = 'max') {
    const [steps, setSteps] = useState<HeapSortStep[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const initialize = useCallback(() => {
        const generator = heapSortGenerator(initialArray, heapType);
        const all: HeapSortStep[] = [];
        for (let s = generator.next(); !s.done; s = generator.next()) {
            all.push(s.value);
        }
        setSteps(all);
        setCurrentStep(0);
    }, [initialArray, heapType]);

    useEffect(() => {
        initialize();
    }, [initialize]);

    const next = () =>
        setCurrentStep((i) => Math.min(i + 1, steps.length - 1));
    const prev = () => setCurrentStep((i) => Math.max(i - 1, 0));

    const play = () => {
        setIsPlaying(true);
        let idx = currentStep;
        const iv = setInterval(() => {
            if (idx >= steps.length - 1) {
                clearInterval(iv);
                setIsPlaying(false);
            } else {
                idx += 1;
                setCurrentStep(idx);
            }
        }, 700);
    };

    const reset = () => {
        initialize();
        setIsPlaying(false);
    };

    return {
        steps,
        currentStep,
        currentState: steps[currentStep] ?? {
            array: initialArray,
            highlighted: [],
            description: '',
            heapSize: initialArray.length,
        },
        isPlaying,
        nextStep: next,
        prevStep: prev,
        play,
        reset,
    };
}