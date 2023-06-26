const { parse } = require("fast-csv");

async function convertCSVData(data){
    const result = await new Promise((resolve, reject) => {
        const students = [];

        const stream = parse({ headers: ["nome", "email"], renameHeaders: true })
            .on("data", (student) => students.push(student))
            .on("error", (error) => reject(new Error("There was an error processing the CSV file.")))
            .on("end", () => resolve(students));
    
        stream.write(data);
        stream.end();
    });

    if(result instanceof Error) throw result;

    return result;
}

module.exports = { convertCSVData };