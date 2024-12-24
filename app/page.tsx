import Scene from './components/Scene';
import Legend from './components/Legend';

export default function Home() {
  return (
    <main className="relative w-full h-screen bg-black">
      <Scene />
      <Legend />
      <div className="absolute top-8 left-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Global Infrastructure Networks</h1>
        <p className="text-lg opacity-80">
          Interactive 3D visualization of worldwide energy grids, cloud computing platforms,
          and internet infrastructure
        </p>
      </div>
    </main>
  );
}