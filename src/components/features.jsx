'use client'

import React, { useState } from 'react'
import {Intersectionobserver} from '../../hooks/use-intersection-observer';

const Featurescard = ({icon , title , description , delay = 0 } )=>{
  const [ref , isvisible] = Intersectionobserver();
   const [isHovered, setIsHovered] = useState(false);

  return(
    <div
     ref={ref}
    className={`  backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-8 transition-all duration-700 cursor-pointer ${isvisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}  ${isHovered ? "transform scale-105 rotate-1 shadow-2xl " : " " } `}  
     style={{transitionDelay: `${delay}ms`}}
     onMouseEnter={()=> setIsHovered(true)}
     onMouseLeave={()=> setIsHovered(false)}
    >
        <div className='text-4xl mb-4 '>{icon}</div>
        <h3 className='text-xl font-bold text-white mb-3 ' >{title} </h3>
        <p className='text-gray-300 leading-relaxed '> {description} </p>
    </div>
  )    
}

function FeaturesSection() {
     const features = [
    {
      icon: "✂️",
      title: "Smart Crop & Resize",
      description:
        "Interactive cropping with aspect ratio constraints and intelligent resizing that preserves image quality across any dimension.",
    },
    {
      icon: "🎨",
      title: "Color & Light Adjustment",
      description:
        "Professional-grade brightness, contrast, saturation controls with real-time preview and auto-enhance capabilities.",
    },
    {
      icon: "🤖",
      title: "AI Background Removal",
      description:
        "Remove or replace backgrounds instantly using advanced AI that detects complex edges and fine details with precision.",
    },
    {
      icon: "🔧",
      title: "AI Content Editor",
      description:
        "Edit images with natural language prompts. Remove objects, change elements, or add new content using generative AI.",
    },
    {
      icon: "📏",
      title: "Image Extender",
      description:
        "Expand your canvas in any direction with AI-powered generative fill that seamlessly blends new content with existing images.",
    },
    {
      icon: "⬆️",
      title: "AI Upscaler",
      description:
        "Enhance image resolution up to 4x using AI upscaling technology that preserves details and reduces artifacts.",
    },
  ];
  return (
  <section className="py-20" id="features">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-6">
            Powerful AI Features
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need to create, edit, and enhance images with
            professional-grade tools powered by cutting-edge AI technology.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Featurescard key={index} {...feature} delay={index * 100} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
