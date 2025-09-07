'use client'
import { useEffect, useState } from 'react'
import { Scissors, Maximize2, Palette, Bot, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link'
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

function Herosection() {
 const [textvisible, setTextVisible] = useState(false);
  const [demoHovered, setDemoHovered] = useState(false);
    const [activeTools, setActiveTools] = useState([]);
    const [particles, setParticles] = useState([]); 
  const [canvasEffect, setCanvasEffect] = useState('gradient');
      const router = useRouter()
 
  const handleclick = ()=>{
    router.push("/dashboard")
  }

useEffect(() => {
  const newParticles = Array.from({ length: 20 }).map(() => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 3}s`,
    animationDuration: `${2 + Math.random() * 2}s`,
  }));
  setParticles(newParticles);
  setTextVisible(true);
  const timer = setTimeout(() => {
    setActiveTools([0, 1, 2, 3]);
  }, 800);
  return () => clearTimeout(timer);
}, []);

  const tools = [
    { icon: Scissors, label: "Crop", color: "from-rose-400 to-pink-600" },
    { icon: Maximize2, label: "Resize", color: "from-amber-400 to-orange-600" },
    { icon: Palette, label: "Adjust", color: "from-emerald-400 to-teal-600" },
    { icon: Bot, label: "AI Tools", color: "from-violet-400 to-purple-600" },
  ];

  const canvasEffects = ['gradient', 'mesh', 'glow'];

 useEffect(()=>{
    const timer = setTimeout(() => setTextVisible(true) , 500);
    return ()=>clearTimeout(timer)
 } ,[] )

  return (
    <section className='min-h-screen flex items-center justify-center relative overflow-x-hidden'>
      <div className='text-center z-10 px-6' >
       <div className={` transition-all duration-1000 ${textvisible ? " opacity-100 translate-y-0 " : " opacity-0 translate-y-10  " } `} >
       <h1 className=' text-6xl md:text-9xl  font-black mb-6 tracking-tight'>
        <span className=' bg-gradient-to-r from-blue-400 via-purple-600 to-cyan-400 bg-clip-text text-transparent animate-pulse'>
            Create
        </span>
        <br />
        <span className=' text-white  ' >
            Without Limits
        </span>
       </h1>
         <p className=' text-xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed '>
            Professional image editing powered by AI. Crop, Resized , Adjust , Color , Remove background and more with just a few clicks.          
         </p>
          <div className=' flex items-center sm:flex-row gap-6 justify-center mb-12 flex-col'>
                 <Link href='/dashboard' >
                    <Button variant="primary" className='cursor-pointer' size='xl' onClick={handleclick} >
                  Start Creating
                </Button>
                   </Link>
                  <Button variant="outline" size='xl' >
                  watch demo
                </Button>
          </div>
        </div>
           <div className=" flex items-center justify-center p-4 sm:p-8 overflow-hidden">
     <div className="absolute inset-0 overflow-hidden">
    {particles.map((style, i) => (
    <div
      key={i}
      className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
      style={style}
    />
  ))}
</div>
      <div
        className={`relative max-w-5xl w-full transition-all duration-1000 ease-out
        ${textvisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-16 scale-95"}
        ${demoHovered ? "scale-[1.02] rotate-x-2" : ""}`}
        onMouseEnter={() => setDemoHovered(true)}
        onMouseLeave={() => setDemoHovered(false)}
        style={{ perspective: "2000px", transformStyle: "preserve-3d" }}
      >
        {/* Outer glow ring */}
        <div className={`absolute inset-0 rounded-3xl transition-all duration-700`} />

        {/* Main container */}
        <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/[0.08] via-white/[0.05] to-white/[0.02] border border-white/[0.15] rounded-3xl p-1 shadow-2xl">
          <div className="bg-gradient-to-br from-zinc-900/95 via-slate-900/90 to-black/95 rounded-[22px] p-4 sm:p-8 min-h-[500px] relative overflow-hidden">

            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.03]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
              <div className="absolute inset-0 bg-[conic-gradient(from_90deg_at_50%_50%,transparent,rgba(120,119,198,0.05),transparent)]" />
            </div>

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 relative z-10">
              <div className="flex flex-wrap items-center space-x-3">
                <div className="flex space-x-2.5">
                  <div className="w-3.5 h-3.5 bg-gradient-to-br from-red-400 to-red-600 rounded-full shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-shadow cursor-pointer" />
                  <div className="w-3.5 h-3.5 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 transition-shadow cursor-pointer" />
                  <div className="w-3.5 h-3.5 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-shadow cursor-pointer" />
                </div>
                <div className="ml-3 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="text-transparent bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text font-semibold text-sm">
                    Pixxel Pro
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30">
                  <div className="flex items-center space-x-1.5">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-xs text-emerald-300 font-medium">Live</span>
                  </div>
                </div>
                <Zap className="w-4 h-4 text-yellow-400" />
              </div>
            </div>

            {/* Tools grid - responsive */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8 relative z-10">
              {tools.map((tool, index) => {
                const Icon = tool.icon;
                const isActive = activeTools.includes(index);
                return (
                  <div
                    key={index}
                    className={`group relative overflow-hidden backdrop-blur-xl rounded-2xl p-4 sm:p-6 text-center cursor-pointer transition-all duration-500 transform-gpu
                      ${isActive
                        ? 'bg-white/[0.08] border border-white/20 scale-100 translate-y-0'
                        : 'bg-white/[0.02] border border-white/[0.05] scale-95 translate-y-2'
                      }
                      hover:bg-white/[0.12] hover:border-white/30 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                    title={tool.label}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-[0.08] transition-opacity duration-500`} />
                    <div className="relative z-10 mb-3">
                      <div className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${tool.color} p-0.5 group-hover:scale-110 transition-transform duration-300`}>
                        <div className="w-full h-full bg-zinc-900 rounded-[10px] flex items-center justify-center">
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-300 group-hover:text-white font-medium transition-colors duration-300">
                      {tool.label}
                    </div>
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10`} />
                  </div>
                );
              })}
            </div>

            {/* Canvas area */}
            <div className="flex items-center justify-center relative z-10">
              <div className="relative group w-full">
                <div
                  className={`w-full h-48 sm:h-64 rounded-3xl overflow-hidden shadow-2xl cursor-pointer transition-all duration-700
                    ${canvasEffect === 'gradient'
                      ? 'bg-gradient-to-br from-cyan-400 via-violet-500 via-fuchsia-500 to-orange-400'
                      : canvasEffect === 'mesh'
                        ? 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500'
                        : 'bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-500'
                    } ${demoHovered ? ' shadow-cyan-500/25' : 'shadow-violet-500/20'}`}
                  onClick={() => {
                    const next = canvasEffects[(canvasEffects.indexOf(canvasEffect) + 1) % canvasEffects.length];
                    setCanvasEffect(next);
                  }}
                >
                  <div className="h-full flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-30">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.1),transparent_50%)]" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(255,255,255,0.05),transparent_50%)]" />
                    </div>
                    <div className="relative z-10 text-center">
                      <div className="text-white/90 font-bold text-lg sm:text-xl mb-1 sm:mb-2">Your Canvas</div>
                      <div className="text-white/60 text-xs sm:text-sm">Click to cycle effects</div>
                    </div>
                  </div>
                </div>
                <div className={`absolute inset-0 rounded-3xl transition-opacity duration-700 blur-2xl -z-10
                  ${canvasEffect === 'gradient'
                    ? 'bg-gradient-to-br from-cyan-400/30 via-violet-500/30 to-fuchsia-500/30'
                    : canvasEffect === 'mesh'
                      ? 'bg-gradient-to-br from-indigo-500/30 via-purple-500/30 to-pink-500/30'
                      : 'bg-gradient-to-br from-emerald-400/30 via-cyan-500/30 to-blue-500/30'
                  } ${demoHovered ? 'opacity-60 scale-110' : 'opacity-30 scale-105'}`} />
              </div>
            </div>

            {/* Status bar */}
            <div className="absolute bottom-3  left-4 sm:left-8 right-4 sm:right-8 flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-xs text-gray-500">
              <div className="flex flex-wrap items-center space-x-2 sm:space-x-4">
                <span>4K Resolution</span>
                <span>•</span>
                <span>GPU Accelerated</span>
                <span>•</span>
                <span>Real-time Preview</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-12 sm:w-16 h-1 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full" />
                <span>Ready</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
       </div>
    </section>
  )
}

export default Herosection
