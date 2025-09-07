import { Button } from '@/components/ui/button'
import { filters } from 'fabric'
import { Loader2, RotateCcw, Sliders } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useCanva } from '../../../../../../../context/context'
import { Slider } from '@/components/ui/slider'
import { extendTailwindMerge } from 'tailwind-merge'

const FILTER_CONFIGS = [
  {
    key: "brightness",
    label: "Brightness",
    min: -100,
    max: 100,
    step: 1,
    defaultValue: 0,
    filterClass: filters.Brightness,
    valueKey: "brightness",
    transform: (value) => value / 100,
  },
  {
    key: "contrast",
    label: "Contrast",
    min: -100,
    max: 100,
    step: 1,
    defaultValue: 0,
    filterClass: filters.Contrast,
    valueKey: "contrast",
    transform: (value) => value / 100,
  },
  {
    key: "saturation",
    label: "Saturation",
    min: -100,
    max: 100,
    step: 1,
    defaultValue: 0,
    filterClass: filters.Saturation,
    valueKey: "saturation",
    transform: (value) => value / 100,
  },
  {
    key: "vibrance",
    label: "Vibrance",
    min: -100,
    max: 100,
    step: 1,
    defaultValue: 0,
    filterClass: filters.Vibrance,
    valueKey: "vibrance",
    transform: (value) => value / 100,
  },
  {
    key: "blur",
    label: "Blur",
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 0,
    filterClass: filters.Blur,
    valueKey: "blur",
    transform: (value) => value / 100,
  },
  {
    key: "hue",
    label: "Hue",
    min: -180,
    max: 180,
    step: 1,
    defaultValue: 0,
    filterClass: filters.HueRotation,
    valueKey: "rotation",
    transform: (value) => value * (Math.PI / 180),
    suffix: "°",
  },
]

const DEFAULT_VALUE = FILTER_CONFIGS.reduce((acc , config)=>{
  acc[config.key] = config.defaultValue
  return acc
} ,{} )


function Adjustment(){
const [isApplying , setApplying] = useState(false)   
const [filterValue , setfilterValue] = useState(DEFAULT_VALUE)
const {canvasEditor} = useCanva()

const getActiveImage = ()=>{
     if(!canvasEditor) return null
     const activeObject = canvasEditor.getActiveObject()
     if(activeObject && activeObject.type === "image") return activeObject 
     
     const objects = canvasEditor.getObjects()
     return objects.find((obj) => obj.type === "image") || null 
}
const applyFilters = async(newValue)=>{
 const imageObject = getActiveImage()
 if(!imageObject || isApplying) return

 setApplying(true)
 try {
    const filterToApply = []
    FILTER_CONFIGS.forEach((config)=>{
      const value = newValue[config.key]   
        if(value !== config.defaultValue){
            const transformedvalue = config.transform(value)
            filterToApply.push(
                new config.filterClass({
                    [config.valueKey] : transformedvalue
                })
            )
        }})

    imageObject.filters = filterToApply
    
    await new Promise((resolve) =>{
               imageObject.applyFilters()
               canvasEditor.requestRenderAll()
               setTimeout(resolve , 50)
    })

 }catch (error){
    console.error("Error applying filters : " , error)
 }finally{
    setApplying(false)
 }
}

const handlevalueChange = (filterkey , value )=>{
    const newValue = {
        ...filterValue, [filterkey]:Array.isArray(value)? value[0]: value
    }
    setfilterValue(newValue)
    applyFilters(newValue)
}

const resetFilter = ()=>{
    setfilterValue(DEFAULT_VALUE) 
    applyFilters(DEFAULT_VALUE) 
}

const extractFilterValues = (imageobject)=>{
             if(imageobject?.filter?.lenght) return DEFAULT_VALUE
             const existingvalue = {...DEFAULT_VALUE}
             imageobject.filter.forEach((filter)=>{
                const config = FILTER_CONFIGS.find((f)=> f.filterClass.name === filter.contructor.name) 
             if(config){
                const filtervalue = filter[config.valueKey]
                if(config.key === "hue"){
                    extractFilterValues[config.key]= Math.round(filterValue *(180/Math.PI) )

                }else{
                       extractFilterValues[config.key] = Math.round(filterValue * 100 )
                }
                
             }
             })
             return existingvalue
             
}


useEffect(()=>{
    const imageobject = getActiveImage()
    if(!imageobject?.filters){
        const existingvalue = extractFilterValues(imageobject)
        setfilterValue(existingvalue)
    }

} ,[] )

  if(!canvasEditor){
    return (
        <div className='p-4' >
            <p className=' text-white/70  ' >
                Load an image to start adjusting 
            </p>
        </div>
    )
}
  

return (
    <div className='space-y-6'>
       <div className=' flex items-center justify-between ' >
        <h3 className=' text-sm font-medium text-white ' >Image Adjustments </h3>{" "}
        <Button variant="ghost" size="sm" onClick={resetFilter} className={` text-white/70 hover:text-white`}>
              <RotateCcw className='h-4 w-4 mr-2 ' />
              Reset
        </Button>
       </div>
      {FILTER_CONFIGS.map((config)=>{
        return(
              <div key={config.key} className=' space-y-2 ' >
                 <div className=' flex items-center justify-between'>
                      <label className=' text-sm text-white'>{config.label}</label>
                      <span className=' text-xs text-white/70'>
                            {filterValue[config.key]}
                            {config.suffix || ""}
                      </span>
                 </div>
                  <Slider value={[filterValue[config.key]]} onValueChange={(value)=> handlevalueChange(config.key, value)} 
                  min={config.min}
                  max={config.max}
                  step={config.step}
                  className={`w-full`}
                  />
              </div>
      )})}
      <div className=' mt-6 p-3 bg-slate-700/50 rounded-lg'>
            <p className='text-xs text-white/70 ' >
            Adjustments are applied in real-time. Use the Reset button to restore original values  
            </p>
      </div>
      {isApplying && (
        <div className='flex items-center justify-center py-2'>
            <Loader2 className=' h-4 w-4 animate-spin'/>
            <span className=' ml-2 text-xs text-white/70'>
              Applying filter...
            </span>  
        </div>
      )}
    </div>
  )
}

export default Adjustment
