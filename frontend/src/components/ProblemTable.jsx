import React from 'react'
import { useMemo, useState } from 'react'
import { useAuthStore } from "../store/useAuthStore"
import { data, Link } from 'react-router-dom'
import { Bookmark, PencilIcon, Trash, TrashIcon, Plus, User, Loader2 } from 'lucide-react'
import { useActions } from '../store/useActionStore'
import CreatePlaylistModel from './CreatePlaylistModel'
import AddToPlaylistModel from './AddToPlaylist'
import { usePlaylistStore  } from '../store/usePlaylistStore'
// import {useActionStore} from "../store/useActionStore"
const ProblemTable = ({ problems }) => {
    const { authUser } = useAuthStore();
    const [search, setSearch] = useState("")
    const [difficulty, setDifficulty] = useState("ALL")
    const [selectedTag, setSelectedTag] = useState("ALL")
    const [currentPage, setCurrentPage] = useState(1);
    const [isCeateModelOpen, setIsCreateModelOpen] = useState(false)
    const [isAddToPlaylistModeOpen, setIsAddToPlaylistModelOpen] = useState(null);
    const [selectedProblemId, setSelectedProblemId] = useState(null)

    const { isDeletingProblem, onDeleteProblem, isUpdatingProblem, onUpdateProblem } = useActions()
    const { createPlaylist } = usePlaylistStore()
    // Extract all unique tags from problems
    const allTags = useMemo(() => {
        if (!Array.isArray(problems)) return [];
        const tagsSet = new Set();
        problems.forEach((p) => p.tags.forEach((t) => tagsSet.add(t)));
        return Array.from(tagsSet)
    }, [problems])

    // define allowed difficulties
    const difficulties = ["EASY", "MEDIUM", "HARD"]

    // filter problem based on search , difficulty,and tags 

    const filterdProblems = useMemo(() => {
        return (problems || []).filter((problem) =>
            problem.title.toLowerCase().includes(search.toLowerCase())
        )
            .filter((problem) =>
                difficulty === "ALL" ? true : problem.difficulty?.toUpperCase() === difficulty.toUpperCase()
            )
            .filter((problem) =>
                selectedTag === "ALL" ? true : problem.tags?.includes(selectedTag)
            );
    }, [problems, search, difficulty, selectedTag]);

    // pagination logic

    const itemsPerPage = 5;
    const totalPages = Math.ceil(filterdProblems.length / itemsPerPage);
    const paginatedProblems = useMemo(() => {
        return filterdProblems.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );
    }, [filterdProblems, currentPage])

    const handleDelete = (id) => {
        onDeleteProblem(id)
    }

    const handleUpdate = async (id, updatedData) => {
        try {
            const result = await onUpdateProblem(id, updatedData);

        } catch (error) {
            console.log("Update failed :", error)
        }
    }
    const handleCreatePlaylist = async (data) => {
        await createPlaylist(data)
    }
    const handleAddToPlaylist = (problemId) => {
        setSelectedProblemId(problemId)
        setIsAddToPlaylistModelOpen(true)
    };
    return (
        <div className="w-full max-w-w-6xl mx-auto mt-10">
            {/* Header with Create playlist Button  */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Problems</h2>
                <button className="btn btn-primary gap-2" onClick={()=>setIsCreateModelOpen(true)}><Plus className='w-4 h-4' />
                    Create Playlist
                </button>
            </div>
            {/* Filters  */}
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <input className='input input-bordered w-full md:w-1/3 bg-base-200'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    type='text'
                    placeholder='Search by title' />
                <select className="select select-bordered bg-base-200"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}>
                    <option value="ALL">All Difficulties</option>
                    {difficulties.map((diff) => (
                        <option value={diff} key={diff}>{diff.charAt(0).toUpperCase() + diff.slice(1).toLowerCase()}</option>
                    ))}
                </select>
                <select className="select select-bordered bg-base-200" value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}>
                    <option value="ALL">All Tags</option>
                    {allTags.map((tag) => (
                        <option value={tag} key={tag}>{tag}</option>
                    ))}
                </select>
            </div>
            {/* Table  */}
            <div className="overflow-x-auto rounded-xl shadow-md">
                <table className="table table-zebra table-lg bg-base-200 text-base-content">
                    <thead className="bg-base-300">
                        <tr>
                            <th>Solved</th>
                            <th>Title</th>
                            <th>Tags</th>
                            <th>Difficulty</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedProblems.length > 0 ? (
                            paginatedProblems.map((problem) => {
                                const isSolved = problem.solvedBy.some(
                                    (user) => user.userId === authUser?.id
                                );
                                return (
                                    <tr key={problem.id}>
                                        <td>
                                            <input type="checkbox" className="checkbox checkbox-sm" readOnly checked={isSolved} />
                                        </td>
                                        <td>
                                            <Link to={`/problem/${problem.id}`} className='font-semibold hover:underline'>
                                                {problem.title}
                                            </Link>
                                        </td>
                                        <td>
                                            <div className="flex flex-wrap gap-1">
                                                {(problem.tags || []).map((tag, idx) => (
                                                    <span className="badge badge-outline badge-warning text-xs font-bold" key={idx}>
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge font-semibold text-xs text-white ${problem.difficulty === "EASY"
                                                ? "badge-success"
                                                : problem.difficulty === "MEDIUM" ? "badge-warning"
                                                    : "badge-error"
                                                }`}>
                                                {problem.difficulty}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="flex 
                                            flex-col md:flex-row gap-2 items-start md:items-center">
                                                {authUser?.role === "ADMIN" && (
                                                    <div className="flex gap-2">
                                                        <button className="btn btn-sm btn-error" onClick={() => handleDelete(problem.id)}>
                                                            {
                                                                isDeletingProblem ? <Loader2 className='animate-spin h-4 w-4' /> : <TrashIcon className='w-4 h-4 text-white' />
                                                            }

                                                        </button>
                                                        <button disabled className='btn btn-sm btn-warning' onClick={() => handleUpdate(problem.id, updatedData)}>
                                                            {
                                                                isUpdatingProblem ? <Loader2 className='animate-spin h-4 w-4' /> : <PencilIcon className='w-4 h-4 text-white' />
                                                            }

                                                        </button>
                                                    </div>
                                                )}

                                                <button className="btn btn-sm btn-outline flex gap-2 items-center whitespace-nowrap" onClick={() => handleAddToPlaylist(problem.id)}>
                                                    <Bookmark className='w-4 h-4' />
                                                    <span className="hidden sm:inline ">Save to Playlist</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        ) : (
                            <tr>
                                <td colSpan={5} className='text-center py-6 text-gray-500'>
                                    No Problem found
                                </td>

                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* pagination  */}
            <div className="flex justify-center mt-6 gap-2">
                <button className="btn btn-sm "
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                    Prev
                </button>
                <span className="btn btn-ghost btn-sm">
                    {currentPage} / {totalPages}
                </span>
                <button className="btn btn-sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                    Next
                </button>
            </div>
            {/* Models  */}

            <CreatePlaylistModel 
            isOpen={isCeateModelOpen}
            onClose={()=> setIsCreateModelOpen(false)}
            onSubmit={handleCreatePlaylist}
            />
            <AddToPlaylistModel 
            isOpen={isAddToPlaylistModeOpen}
            onClose={() => setIsAddToPlaylistModelOpen(false)}
            problemId={selectedProblemId}
            />
        </div>
    )
}

export default ProblemTable