async function registerStudentsIntoDatabase(students) {
     const studentsPromises = students.map((student) => {
        return fetch("http://curso-serverless2-api-279557079.us-east-1.elb.amazonaws.com/alunos", {
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