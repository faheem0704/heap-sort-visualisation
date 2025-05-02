import { HeapSortVisualizer } from './components/HeapSortVisualizer';

export default function Home() {
  return (
    <main className="container mx-auto p-8">
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-3xl font-bold">Heap Sort Tree Visualization</h1>
        <HeapSortVisualizer />
        <div className="text-muted-foreground text-sm space-y-2 max-w-2xl">
          <p>How to use:</p>
          <ol className="list-decimal pl-4">
            <li>Enter numbers separated by commas in the input field</li>
            <li>Click "Visualize" to initialize the heap</li>
            <li>Use the control buttons to step through the algorithm</li>
            <li>Watch the tree visualization as the heap is built and sorted</li>
          </ol>
          <p className="mt-4">The visualization shows:</p>
          <ul className="list-disc pl-4">
            <li>Heapify operations during the build phase</li>
            <li>Node comparisons and swaps</li>
            <li>Sorted elements turning purple</li>
            <li>Current active heap size</li>
          </ul>
        </div>
      </div>
    </main>
  );
}