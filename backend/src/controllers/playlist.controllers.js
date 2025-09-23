import { db } from "../libs/db.js";

export const createPlayList = async (req, res) => {
    try {
        const { name, description } = req.body;

        const userId = req.user.id;

        const playlist = await db.playlist.create({
            data: {
                name,
                description,
                userId
            }
        });

        res.status(200).json({
            success: true,
            message: "Playlist created successfully",
            playlist
        })
    } catch (error) {
        console.error("Error while creating playlist", error)
        res.status(500).json({
            error: "error while creating playlist"
        })
    }
}

export const getAllPlaylistDetails = async (req, res) => {
    try {
        const playlists = await db.playlist.findMany({
            where: {
                userId: req.user.id,
            },
            include: {
                problems: {
                    include: {
                        problem: true
                    }

                }
            }
        })
        res.status(200).json({
            success: true,
            message: "all playlist details fetched successfully",
            playlists
        })
    } catch (error) {
        console.error("error while fetching playlist", error),
            res.status(500).json({
                error: "failed to fetched playlist"
            })
    }
}

export const getPlayListDetails = async (req, res) => {
    const { playlistId } = req.params
    try {
        const playlist = await db.playlist.findFirst({
            where: {
                id: playlistId,
                userId: req.user.id,
            },
            include: {
                problems: {
                    include: {
                        problem: true
                    }
                }
            }
        });
        if (!playlist) {
            return res.status(404).json({ error: "Playlist not found" })
        }
        res.status(200).json({
            success: true,
            message: 'Playlist fetched sucessfully',
            playlist,
        });
    } catch (error) {
        console.error("error while fetching playlist details", error)
        res.status(500).json({
            error: "error while fetching details"
        })
    }

}

export const addProblemToPlaylist = async (req, res) => {
    const { playlistId } = req.params;
    const { problemIds } = req.body;
    try {
        if (!Array.isArray(problemIds) || problemIds.length === 0) {
            return res.status(400).json({ error: "Invalid or missing problemsId" })
        }
        // Create record for each prolem in the playlist
        const problemsInPlaylist = await db.problemInPlaylist.createMany({
            data: problemIds.map((problemId) => ({
                playListId: playlistId,
                problemId,
            })),
            skipDuplicates: true,
        });

        // fetch updated playlist with problem

        const updatedPlaylist = await db.playlist.findUnique({
            where: { id: playlistId },
            include: {
                problems: {
                    include: {
                        problem: true
                    },
                }
            }
        })
        res.status(201).json({
            success: true,
            message: 'Problems added to playlist successfully',
            problemsInPlaylist
        })
    } catch (error) {
        console.error("error while adding problem in playlist", error);
        res.status(500).json({
            error: "error while assing problems"
        })
    }
}


export const removeProblemFromPlaylist = async (req, res) => {
    const { playlistId } = req.params;
    const { problemIds } = req.body;
    try {
        if (!Array.isArray(problemIds) || problemIds.length === 0) {
            return res.status(400).json({ error: "Invalid or missing problemsId" })
        }

        const deletedProblem = await db.problemsInPlaylist.deleteMany({
            where: {
                playListId:playlistId,
                problemId: {
                    in: problemIds
                }
            }
        })
        res.status(200).json({
            success: true,
            message: 'Problem removed from successfully',
            deletedProblem
        })
    } catch (error) {
        console.error("error removing problem from playlist:", error.message);
        res.status(500).json({ error: 'Failed to remove problem from playlist' })
    }
}

export const deletePlayList = async (req, res) => {
    const { playlistId } = req.params;
    try {
        const deletedPlaylist = await db.playlist.delete({
            where: {
                id: playlistId
            }
        });

        res.status(200).json({
            sucess: true,
            message: 'Playlist deleted successfully',
            deletedPlaylist,
        })
    } catch (error) {
        console.error('Error deleting playlist', error)
        res.status(500).json({
            error: 'Failed to delete playlist'
        })
    }
}