import React, { useEffect } from 'react'
import { useProblemStore } from "../store/useProblemStore"
import { Link } from 'react-router-dom'
import { Tag, ExternalLink, AlertTriangle, CheckCircle, Circle } from 'lucide-react'

const ProblemSolvedByUser = () => {
  const { getSolvedProblemByUser, solvedProblems } = useProblemStore()

  useEffect(() => {
    getSolvedProblemByUser();
  }, [getSolvedProblemByUser]);

  // Function to get difficulty badge styling 

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case 'EASY':
        return (
          <div className="badge badge-success gap-1">
            <CheckCircle size={11} />
            Easy
          </div>
        );
      case 'MEDIUM':
        return (
          <div className="badge badge-warning gap-1">
            <Circle size={12} />
            Medium
          </div>
        )
      case 'HARD':
        return (
          <div className="badge badge-error gap-1">
            <AlertTriangle size={12} />
            Hard
          </div>
        );
      default:
        <div className="badge badge-ghost">
          Unknown
        </div>
    }
  }
  return (
    <div className='p-4 bg-base-200'>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-primary mb-6">Problems Solved</h2>
        {solvedProblems.length === 0 ? (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="text-lg font-medium">No problem solved yet</h3>
              <p className="text-base-content/70">Start solving problem to see them listed here!</p>
              <div className="card-actions justify-end">
                <Link to="/" className='btn btn-primary'>
                  View Problem
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="card bg-base-100 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className='table table-zebra w-full'>
                <thead>
                  <tr>
                    <th className="bg-base-300">problem</th>
                    <th className="bg-base-300">Difficulty</th>
                    <th className="bg-base-300">Tags</th>
                    <th className="bg-base-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {solvedProblems.map((problem) => (
                    <tr className="hover" key={problem.id}>
                      <td className="font-medium">{problem.title}</td>
                      <td>{getDifficultyBadge(problem.difficulty)}</td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {problem.tags && problem.tags.map((tag, index) => (
                            <div className="badge badge-outline badge-primary" key={index}>
                              <Tag size={10} className='mr-1' />
                              {tag}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="flex justify-center">
                          <Link
                            to={`/problem/${problem.id}`}
                            className='btn btn-sm btn-outline btn-primary'
                          >
                            <ExternalLink size={14} className='mr-1' />
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card-footer bg-base-200 p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">
                  Total Problem Solved : <span className='font-bold'>{solvedProblems.length}</span>
                </span>
                <Link to={"/"} className='btn btn-sm btn-primary'>
                  Solve more Problem
                </Link>
              </div>
            </div>
          </div>
        )}
        {/* Stats Cards  */}
        {solvedProblems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="stat bg-base-100 shadow rounded-box">
              <div className="stat-title">Easy</div>
              <div className="stat-value text-success">
                {solvedProblems.filter(p => p.difficulty === 'EASY').length}
              </div>
            </div>
            <div className="stat bg-base-100 shadow rounded-box">
              <div className="stat-title">Medium</div>
              <div className="stat-value text-warning">
                {solvedProblems.filter(p=>p.difficulty === 'MEDIUM').length}
              </div>
            </div>
            <div className="stat bg-base-100 shadow rounded-box">
              <div className="stat-title">Hard</div>
              <div className="stat-value text-error">
                {solvedProblems.filter(p=> p.difficulty === 'HARD').length}
              </div>
            </div>
          </div>

        )}
      </div>
    </div>
  )
}

export default ProblemSolvedByUser