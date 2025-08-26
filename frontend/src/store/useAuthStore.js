import {create} from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";



export const useAuthStore = create((set)=>({
    authUser:null,
    isSignUp:false,
    isLoggingIn:false,
    isCheckingAuth:false,


    checkAuth : async()=>{
        set({isCheckingAuth:true});
        try {
            const res = await axiosInstance.get("/auth/check");
            console.log("checkauth response", res.data);
            set({authUser:res.data.user})
        } catch (error) {
            console.log("❌ Error checking auth:" , error);
            set({authUser : null})
        }
        finally{
            set({isCheckingAuth:false})
        }
    } ,

    signup : async (data) =>{
        set({isSignUp : true});
        try {
            const res = await axiosInstance.post("/auth/register",data)

            set({authUser : res.data.user})
            toast.success(res.data.message)
        } catch (error) {
            console.log("error signing up",error)
            toast.error("error signing up")
        }
        finally {
            set({isSignUp : false})
        }
    } ,
    
    login : async(data) => {
        set({isLoggingIn : true});

        try {
            const res =await axiosInstance.post("/auth/login", data)
            set({authUser : res.data.user})
            toast.success(res.data.message);
        } catch (error) {
            console.log("error logging in:", error)
            toast.error("error logging in")
        }
        finally {
            set({isLoggingIn : false})
        }
    } ,
    logout : async()=>{
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser:null});
            toast.success("Logout successful")
        } catch (error) {
            console.log("Error logging out",error)
            toast.error("Error logging out");
        }
    }
}))