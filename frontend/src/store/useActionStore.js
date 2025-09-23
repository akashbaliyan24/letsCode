import {create} from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"



export const useActions = create((set)=> ({
    isDeletingProblem : false,
    isUpdatingProblem : false,

    onDeleteProblem:async(id)=> {
        try {
            set({isDeletingProblem:true});
            const res = await axiosInstance.delete(`/problems/delete-problem/${id}`);
            toast.success(res.data.message);
        } catch (error) {
            toast.error("Error deelting Problem");
        }
        finally{
            set({isDeletingProblem:false})
        }
    } , 

    onUpdateProblem : async(id,updatedData)=> {
        try {
            set({isUpdatingProblem:true});
            const res = await axiosInstance.put(`/problems/update-problem/${id}`,updatedData)
            toast.success(res.data.message || "Problem updated successfully");
            return res.data ;
        } catch (error) {
         toast.error("failed to update problem")   
        }
        finally {
            set({isUpdatingProblem:false})
        }
    }
}))