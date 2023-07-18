const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { convertCSVData } = require("../convertCSVData");
const { registerStudentsIntoDatabase } = require("../registerStudentsIntoDatabase");

async function getCSVDataFromBucket(name, key){
    const client = new S3Client({});
  
    const command = new GetObjectCommand({
      Bucket: name,
      Key: key
    });
  
    const response = await client.send(command);
    const csvData = await response.Body.transformToString("utf-8");
  
    return csvData;
}

module.exports.registerStudents = async (event) => {
    try {
      const s3Event = event.Records[0].s3;
    
      const bucketName = s3Event.bucket.name;
      const bucketKey = decodeURIComponent(s3Event.object.key.replace(/\+/g, " "));
    
      const fileData = await getCSVDataFromBucket(bucketName, bucketKey);
    
      const students = await convertCSVData(fileData);
  
      await registerStudentsIntoDatabase(students);
  
      console.log("Students registered successfully!");
    } catch (error) {
      console.log(error);
    }
  };
  