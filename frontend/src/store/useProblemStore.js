import { create } from "zustand"
import { axiosInstance } from "../lib/axios.js"

import { toast } from "react-hot-toast"

export const useProblemStore = create((set) => ({
    problems: [],
    problem: null,
    solvedProblems: [],
    isProblemsLoading: false,
    isProblemLoading: false,


    getAllProblems: async () => {
        try {
            set({ isProblemsLoading: true })
            const res = await axiosInstance.get("/problems/get-all-problems");

            set({ problems: res.data.problems })

        } catch (error) {
            console.log("error getting all problems", error);
            toast.error("Error in gee=tting Problems")
        }
        finally {
            set({ isProblemsLoading: false })
        }
    },

    getProblemById: async (id) => {
        try {
            set({ isProblemLoading: true })

            const res = await axiosInstance.get(`/problems/get-problem/${id}`)

            set({ problem: res.data.problem })
            toast.success(res.data.problem)
        } catch (error) {
            console.log("Error in getting problems")
            toast.error("Error in getting problem")
        }

        finally {
            set({ isProblemLoading: false })
        }
    },

    getSolvedProblemByUser: async () => {
        try {
            const res = await axiosInstance.get("/problems/get-solved-probelem")
            set({ solvedProblems: res.data.problems })
        } catch (error) {
            console.log("Error in getting solved problems", Error)
            toast.error("Error in getting solved problems")
        }
    }
}))

