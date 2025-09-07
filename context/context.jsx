const { useContext, createContext } = require("react");

export const canvaContext = createContext()

export const useCanva = ()=>{
    const context = useContext(canvaContext)

  if(!context){
    throw new Error("Error")
  }
  
  return context

}
