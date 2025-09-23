import { create } from "zustand";
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"
import { isAxiosError } from "axios";


export const useSubmissionStore = create((set) => ({
    isLoading: false,
    submissions: [],
    submission: null,
    submissionCount: null,

    getAllSubmissions: async () => {
        try {
            set({ isLoading: true })
            const res = await axiosInstance.get("/submission/get-all-submission")
            set({ submissions: res.data.submissions })
            toast.success(res.data.message)
        } catch (error) {
            // console.log("Error getting all problem", error);
            toast.error("Error getting all submissions");
        }

        finally {
            set({ isLoading: false })
        }
    },
    getSubmissionForProblem: async (problemId) => {
        try {
            const res = await axiosInstance.get(`/submission/get-submission/${problemId}`)
            set({ submissions: res.data.submissions || [] , isLoading : false });
        } catch (error) {
            // console.log("Error getting submission for problem", error);
            toast.error("error getting submission for problem")
        }
    },
    getSubmissionCountForProblem: async (problemId) => {
        try {
            const res = await axiosInstance.get(`/submission/get-submission-count/${problemId}`);
            set({ submissionCount: res.data.count })
        } catch (error) {
            // console.log("Error getting submission count ",error);
            toast.error("Error getting submission count ");
        }

    } ,
}));