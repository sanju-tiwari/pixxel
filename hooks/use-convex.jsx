'use client'
import { useQuery, useMutation } from "convex/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const useConvexQuery = ( query , ...args )=>{
   
  const result = useQuery(query , ...args)
  const [ data , setdata] = useState(undefined)
  const [loading , setloading] = useState(true)
  const [error ,seterror] = useState(null)

   useEffect(()=>{
     if(result === undefined ){
      setloading(true)
      }else{
         try {
          setdata(result)
          setloading(false)
          seterror(null)    
         } catch (error) {
           seterror(error)
           toast.error(error.message)
         }finally{
          setloading(false);
         }    
      
     } 
   } ,[result ] )

   return{data , loading , error}

}

export const useConvexMutation = (mutation) => {
  const mutationFn = useMutation(mutation);
  const [data, setData] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async (...args) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await mutationFn(...args);
      setData(response);
      return response;
    } catch (err) {
      setError(err);
      toast.error(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, data, isLoading, error };
};