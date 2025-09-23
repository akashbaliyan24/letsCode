import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";



export const usePlaylistStore = create((set,get)=>({
    playlists : [],
    currentPlaylist : null,
    isLoading : false,
    error : null,

    createPlaylist : async (playlistData) => {
        try {
            set({isLoading:true});
            const res = await axiosInstance.post(
                "/playlist/create-playlist",
                playlistData
            );

            set((state)=> ({
                playlists : [...state.playlists,res.data.playList]
            }));

            toast.success("Playlist created successfully");
            return res.data.playList;

        } catch (error) {
            console.error("Error creating playlist:",error);
            toast.error(error.res?.data?.error || "Failed to create playlist");
            throw error
        }
        finally{
            set({isLoading:false})
        }
    },

    getAllPlaylists : async () => {
        try {
            set({isLoading:true});
            const res = await axiosInstance.get("/playlist");
            set({playlists : res.data.playlists});
        } catch (error) {
            console.error("Error fetching playlists",error);
            toast.error("Failed to fetch playlists");
        }
        finally{
            set({isLoading:false});
        }
    },

    getPlayListDetails : async (playlistId) => {
        try {
            set({isLoading:true});
            const res = await axiosInstance.get(`/playlist/${playlistId}`);
            set({currentPlaylist : res.data.playList});
        } catch (error) {
            console.error("Error fetching playlist deatils:",error);
            toast.error("Failed to fetch playlist details ");
        }
        finally{
            set({isLoading:false});
        }
    },

    addProblemToPlaylist : async (playlistId,problemIds) => {
        try {
            set({isLoading:true});
            await axiosInstance.post(`/playlist/${playlistId}/add-problem`,{
                problemIds
            });
            toast.success("Problem added to playlist");

            // Refresh the playlist details
            if(get().currentPlaylist?.id === playlistId){
                await get().getPlayListDetails(playlistId);
            }
        } catch (error) {
            console.error("Error adding problem to playlist : " , error);
            toast.error("Failed to add problem to playlist");
        }
        finally{
            set({isLoading:false})
        }
    },

    removeProblemFromPlaylist : async (playlistId,problemIds) => {
        try {
            set({isLoading:true});
            await axiosInstance.post(`/playlist/${playlistId}/remove-problems`,{
                problemIds
            });
            toast.success("problem removed from playlist");

            // Refresh the playlist details
            if(get().currentPlaylist?.id === playlistId){
                await get().getPlayListDetails(playlistId);
            }
        } catch (error) {
            console.error("Error removing problem from playlist", error);
            toast.error("Failed to remove problem from playlist");
        }
        finally{
            set({isLoading:false});
        }
    },

    deletePlaylist : async (playlistId) => {
        try {
            set ({isLoading:true});
            await axiosInstance.delete(`/playlist/${playlistId}`);

            set((state)=> ({
                playlists : state.playlists.filter((p)=> p.id !== playlistId),
            }));
            toast.success("Playlist deleted successfully ");
        } catch (error) {
            console.error("Error deleting problem ", error);
            toast.error("Error in deleting playlist");
        }
        finally{
            set({isLoading:false})
        }
    },
}))