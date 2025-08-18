import axios from "axios"
export const getJudge0LanguageId = (Language) =>{

    if(typeof Language !== "string") return undefined;
    const aliasMap ={
        "PY" : "PYTHON",
        "PYTHON":"PYTHON",
        "JS" : "JAVASCRIPT",
        "JAVASCRIPT" : "JAVASCRIPT",
        "TS" : "TYPESCRIPT",
        "TYPESCRIPT" : "TYPESCRIPT",
        "CPP" : "C++",
        "C++" : "C++",
        "CS": "C#",
        "C#" : "C#",
        "C" : "C",
        "JAVA" : "JAVA",
        "KOTLIN" : "KOTLIN",
        "KT" : "KOTLIN",
        "PHP" : "PHP",
        "RB" : "RUBY",
        "RUBY" : "RUBY",
        "R" : "R",
        "RUST" : "RUST",
    }
    const languageMap = {
        "C" : 75,
        "C++" : 76,
        "PYTHON" : 71,
        "JAVA" : 62,
        "JAVASCRIPT" : 63,
        "C#" : 51,
        "KOTLIN" : 78,
        "PHP" : 68,
        "R" : 80,
        "RUBY" : 72,
        "RUST":73,
        "TYPESCRIPT":74
    }

    const key = aliasMap[Language.trim().toUpperCase()]
    return languageMap[key] 
}
const sleep = (ms) => new Promise((resolve)=> setTimeout(resolve,ms))
export const pollBatchResults = async (tokens)=>{
    while(true){
        const {data} = await axios.get(`${process.env.JUDGE0_API_URL}/submissions/batch`,{
            params :{
                tokens : tokens.join(","),
                base64_encoded:false,
            }
        })

        const results = data.submissions

        const isAllDone = results.every((r)=> r.status.id !== 1 && r.status.id !==2)

        if(isAllDone) return results

        await sleep(1000)
    }
}

export const submitBatch = async (submissions)=>{
    const {data} = await axios.post(`${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,{
        submissions
    })

    console.log("Submission Result:" ,data);

    return data //[{token}]
}