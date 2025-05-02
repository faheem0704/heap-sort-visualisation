'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Toggle } from '@/components/ui/toggle';
import { useState } from 'react';
import { useHeapSort } from '../hooks/useHeapSort';
import HeapTree from './HeapTree';

export const HeapSortVisualizer = () => {
    const [inputArray, setInputArray] = useState('12,11,13,5,6,7');
    const [initialArray, setInitialArray] = useState([12, 11, 13, 5, 6, 7]);
    const [heapType, setHeapType] = useState<'max' | 'min'>('max');

    const { currentState, nextStep, prevStep, play, reset, currentStep, steps } =
        useHeapSort(initialArray, heapType);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputArray(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newArray = inputArray.split(',').map(Number).filter(n => !isNaN(n));
        setInitialArray(newArray);
    };

    return (
        <Card className="w-full max-w-4xl">
            <CardHeader>
                <CardTitle>Heap Sort Tree Visualization</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
                    <Input
                        value={inputArray}
                        onChange={handleInputChange}
                        placeholder="Enter numbers separated by commas"
                    />
                    <Button type="submit">Visualize</Button>
                </form>

                <div className="flex flex-col gap-4">
                    {/* Heap Type Toggle */}
                    <div className="flex gap-2 items-center">
                        <span className="text-sm font-medium">Heap Type:</span>
                        <Toggle
                            pressed={heapType === 'max'}
                            onPressedChange={(pressed: boolean) => setHeapType(pressed ? 'max' : 'min')}
                            className="data-[state=on]:bg-blue-500 data-[state=on]:text-white"
                        >
                            Max Heap
                        </Toggle>
                        <Toggle
                            pressed={heapType === 'min'}
                            onPressedChange={(pressed: boolean) => setHeapType(pressed ? 'min' : 'max')}
                            className="data-[state=on]:bg-blue-500 data-[state=on]:text-white"
                        >
                            Min Heap
                        </Toggle>
                    </div>

                    {/* Tree Visualization */}
                    <div className="border rounded-lg p-4 bg-gray-50">
                        <HeapTree
                            array={currentState.array}
                            highlighted={currentState.highlighted}
                            swapped={currentState.swapped || []}
                            heapSize={currentState.heapSize}
                        />
                    </div>

                    {/* Description */}
                    <div className="min-h-16">
                        <p className="text-sm text-muted-foreground">
                            Step {currentStep + 1} of {steps.length}: {currentState.description}
                        </p>
                    </div>

                    {/* Controls */}
                    <div className="flex gap-2 flex-wrap">
                        <Button onClick={prevStep} disabled={currentStep === 0}>
                            Previous Step
                        </Button>
                        <Button onClick={nextStep} disabled={currentStep === steps.length - 1}>
                            Next Step
                        </Button>
                        <Button onClick={play} disabled={currentStep === steps.length - 1}>
                            Play
                        </Button>
                        <Button onClick={reset} variant="outline">
                            Reset
                        </Button>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <div className="text-sm text-muted-foreground">
                    Heap Sort Legend:
                    <ul className="list-disc pl-4 mt-2">
                        <li className="text-blue-500">Blue: Active heap nodes</li>
                        <li className="text-yellow-500">Yellow: Nodes being compared</li>
                        <li className="text-green-500">Green: Recently swapped nodes</li>
                        <li className="text-purple-500">Purple: Sorted nodes</li>
                    </ul>
                </div>
            </CardFooter>
        </Card>
    );
};