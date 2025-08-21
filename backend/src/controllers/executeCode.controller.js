import { getLanguageName, pollBatchResults, submitBatch } from "../libs/judge0.lib.js";

import { db } from "../libs/db.js";

export const executeCode = async (req, res) => {
    try {
        const { source_code, language_id, stdin, expected_outputs, problemId } = req.body;
        const userId = req.user.id;

        //validate test case
        if (
            !Array.isArray(stdin) ||
            stdin.length === 0 ||
            !Array.isArray(expected_outputs) ||
            expected_outputs.length !== stdin.length
        ) {
            return res.status(400).json({
                error: "Invalid or Missing test cases"
            });
        }

        // prepare each cases for judge0 batch submission
        const submissions = stdin.map((input) => ({
            source_code,
            language_id,
            stdin: input,
        }));

        // send batch submission to judge0
        const submitResponse = await submitBatch(submissions);

        const tokens = submitResponse.map((res) => res.token);

        // poll judge0 for results of all submitted testcases
        const results = await pollBatchResults(tokens)
        console.log('Result........')
        console.log(results);
        // Analyze test case result
        let allPassed = true;
        const detailedResults = results.map((result, i) => {
            const stdout = result.stdout?.trim();
            const expected_output = expected_outputs[i]?.trim();
            const passed = stdout === expected_output;

            if (!passed) allPassed = false;

            return {
                testCase: i + 1,
                passed,
                stdout,
                expected: expected_output,
                stderr: result.stderr || null,
                compileOutput: result.compile_output || null,
                status: result.status.description,
                memory: result.memory ? `${result.memory}KB` : undefined,
                time: result.time ? `${result.time}s` : undefined,
            }

            // console.log(`test case #${i+1}`)
            // console.log(`Input ${stdin[i]}`);
            // console.log(`Expected Output: ${expected_output}`);
            // console.log(`Actual Output: ${stdout}`);

            // console.log(`Passed: ${passed}`);

        })
        // console.log('Detailed Results:', detailedResults);

        // store submission result in database

        const submission = await db.Submission.create({
            data: {
                userId,
                problemId,
                sourceCode: source_code,
                language: getLanguageName(language_id),
                stdin: stdin.join("\n"),
                stdout: JSON.stringify(detailedResults.map((r) => r.stdout)),
                stderr: detailedResults.some((r) => r.stderr) ? JSON.stringify(detailedResults.map((r) => r.stderr)) : null,
                compileOutput: detailedResults.some((r) => r.compile_output) ? JSON.stringify(detailedResults.map((r) => r.compile_output)) : null,
                status: allPassed ? "ACCEPTED" : "WRONG_ANSWER",
                memory: detailedResults.some((r) => r.memory) ? JSON.stringify(detailedResults.map((r) => r.memory)) : null,
                time: detailedResults.some((r) => r.time) ? JSON.stringify(detailedResults.map((r) => r.time)) : null,
            }
        });

        // if all passed = true marked problem as solved for the current user 
        if (allPassed) {
            await db.problemSolved.upsert({
                where: {
                    userId_problemId: {
                        userId, problemId
                    }
                },
                update: {},
                create: {
                    userId, problemId
                },
            })
        }
        // save inidividual test case result 

        const testCaseResults = detailedResults.map((result)=>({
            submissionId : submission.id,
            testCase : result.testCase,
            passed : result.passed,
            stdout : result.stdout,
            expected : result.expected,
            stderr : result.stderr,
            compileOutput:result.compile_output,
            status : result.status,
            memory: result.memory,
            time: result.time,
        }));

        await db.testCaseResult.createMany({
            data : testCaseResults
        })
        
        const submissionWithTestCase = await db.submission.findUnique({
            where : {
                id : submission.id,
            },
            include : {
                testCases : true,
            }
        })
        res.status(200).json({
            success : true,
            message: "Code executed successfully",
            submission : submissionWithTestCase
        })
    } catch (error) {
        console.error ( "Error executing code :",error.message);
        res.status(500).json({error : "Failed to execute code"});
    }
}