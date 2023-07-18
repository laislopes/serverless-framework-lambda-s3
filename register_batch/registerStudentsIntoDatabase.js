const BASE_URL = process.env.API_BASE_URL;

async function registerStudentsIntoDatabase(students) {
     const studentsPromises = students.map((student) => {
        return fetch(`${BASE_URL}/alunos`, {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(student)
        })
     })

    const responses = await Promise.all(studentsPromises);

    if(responses.some((response) => !response.ok)){
        throw new Error("Error on Registration of one or more students")
    }
};



module.exports = { registerStudentsIntoDatabase };