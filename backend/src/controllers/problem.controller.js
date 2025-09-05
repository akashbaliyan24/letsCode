import { db } from "../libs/db.js"
import { getJudge0LanguageId, pollBatchResults, submitBatch } from "../libs/judge0.lib.js";

export const createProblem = async (req, res) => {
    const { title, description, difficulty, tags, examples, constraints, testcases, codeSnippets, referenceSolutions } = req.body;

    if (req.user.role !== "ADMIN") {
        return res.status(403).json({ error: "You are not allowed to create the problem" })
    }
    try {
        for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
            const languageId = getJudge0LanguageId(language);

            if (!languageId) {
                return res.status(400).json({ error: `language ${language} is not supported` })
            }

            const submissions = testcases.map(({ input, output }) => ({
                source_code: solutionCode,
                language_id: languageId,
                stdin: input,
                expected_output: output,
            }))
            const submissionResults = await submitBatch(submissions)

            const tokens = submissionResults.map((res) => res.token);

            const results = await pollBatchResults(tokens)

            for (let i = 0; i < results.length; i++) {
                console.log("results:", results);
                const result = results[i];
                if (result.status.id !== 3) {
                    return res.status(400).json({ error: `Testcase ${i + 1} failed for language ${language}` })
                }
            }
            // save the problem to the database

            const newProblem = await db.problem.create({
                data: {
                    title, description, difficulty, tags, examples, constraints, testcases, codeSnippets, referenceSolutions, user: {
                        connect: { id: req.user.id }
                    }
                }
            });

            return res.status(201).json({
                success: true,
                message: "Problem created successfully",
                problem: newProblem
            });
        }
    } catch (error) {
        console.error("Error creating problem:", error);
        return res.status(500).json({ error: "Internal server error" });
    }

}

export const getAllProblems = async (req, res) => {
    try {
        const problems = await db.problem.findMany(
            {
                include : {
                    solvedBy : {
                        where:{
                            userId:req.user.id
                        }
                    }
                }
            }
        );
        if (!problems) {
            return res.status(404).json({
                message: "No problem found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Message fetched sucessfully",
            problems
        })
    } catch (error) {
        res.status(500).json({
            message: "Error fetching problems",
        })
    }
}

export const getProblemById = async (req, res) => {
    const { id } = req.params;
    try {
        const problem = await db.problem.findUnique({
            where: {
                id: id,
            }
        })
        if (!problem) {
            return res.status(404).json({
                message: "Problem not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "problem fetched sucessfully",
            problem,
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error while fetching problem id",
        })
    }
}

export const updateProblem = async (req, res) => {
    const { id, title, description, difficulty, tags, examples, constraints, testcases, codeSnippets, referenceSolutions } = req.body;
    try {
        for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
            const languageId = getJudge0LanguageId(language);
            if (!languageId) {
                return res.status(400).json({ error: `Language ${language} is not supported` })
            }

            const submissions = testcases.map(({ input, output }) => ({
                source_code: solutionCode,
                language_id: languageId,
                stdin: input,
                expected_output: output,
            }));
            const submissionResults = await submitBatch(submissions);
            const tokens = submissionResults.map((res) => res.token);
            const results = await pollBatchResults(tokens);
            for (let i = 0; i < results.length; i++) {
                const result = results[i];
                if (result.status.id !== 3) {
                    return res.status(400).json({ error: `Testcase ${i + 1} failed for language ${language}` });
                }
            }
        }
        const updatedProblem = await db.problem.update({
            where: {
                id: id,
            },
            data: {
                title, description, difficulty, tags, examples, constraints, testcases, codeSnippets, referenceSolutions, user: {
                    connect: { id: req.user.id },
                }
            }
        });
        return res.status(200).json({
            success: true,
            message: "Problem updated successfully",
            problem: updatedProblem,
        })
    } catch (error) {
        console.error("Error updating problem:", error);
        return res.status(500).json({
            error: "Error While updating problem",
        })
    }
}

export const deleteProblem = async (req, res) => {
    const { id } = req.params;
    try {
        const problem = await db.problem.findUnique({where:{id}})
        if(!problem){
            return res.status(404).json({
                message: "Problem not found"
            })
        }
        await db.problem.delete({where:{id}});
        return res.status(200).json({
            success:true,
            message : "Problem deleted successfully"
        })
    } catch (error) {
        console.error("Error deleting problem:", error);
        return res.status(500).json({
            error: "Error while deleting problem",
        })
    }
}


export const getAllProblemsSolvedByUser = async (req, res) => { 
    try {
        const problems = await db.problem.findMany({
            where : {
                solvedBy : {
                    some : {
                        userId : req.user.id
                    }

                }
            },
            include : {
                solvedBy : {
                    where : {
                        userId : req.user.id
                    }
                }
            }
        })

        res.status(200).json({
            success : true,
            message : "problems fetched successfully",
            problems
        })
    } catch (error) {
        console.error("error fetching problems" , error);
        res.status(500).json({error : "failed to fetched problem"})
    }
}
