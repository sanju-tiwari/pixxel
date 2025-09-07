import { useAuth } from "@clerk/clerk-react"

export const usePlanAccess = ()=>{
   
    const {has} = useAuth()
    const isPro = has?.({plan: "pro"}) || false 
    const isFree = !isPro

    const planAccess = {
        resize:true,
        crop:true,
        adjust:true,
        text:true,
        background:isPro,
        ai_extender:isPro,
        ai_edit:isPro
    }

    const hasAccess = (toolid) => {
        return planAccess[toolid] === true 
    }

    const getRestrictedTool = ()=>{
        return Object.entries(planAccess).filter(([_, hasAccess])=> !hasAccess).map(([toolid])=> toolid)
    }

    const canCreateProject = (currentprojects)=>{
         if(isPro) return true
         return currentprojects < 3
    }
     const canexport = (currentprojects)=>{
         if(isPro) return true
         return currentprojects < 20
    }

    return { userPlan:isPro ? "pro" : "Free_user" ,  isFree , isPro , canCreateProject , canexport , getRestrictedTool , hasAccess , planAccess }
 

} 