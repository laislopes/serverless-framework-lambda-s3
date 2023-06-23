const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { readFile } = require("fs/promises");
const { join } = require("path");

function createLocalS3Client(){
    return new S3Client({
      forcePathStyle: true,
      credentials: {
        accessKeyId: "S3RVER",
        secretAccessKey: "S3RVER"
      },
      endpoint: "http://localhost:4569"
    });
  }
  
  async function uploadingToBucket() {
    const client = createLocalS3Client();
  
    const fileName = "register_students.csv";
    const filePath = join(__dirname, fileName);
    const csvData = await readFile(filePath, "utf-8");

    const uploadCommand = new PutObjectCommand({
      Bucket: "students-csv-local",
      Key: fileName,
      Body: csvData
    })
  
    await client.send(uploadCommand); 
  }

  async function getCSVDataFromBucket(name, key){
    const client = createLocalS3Client();
  
    const command = new GetObjectCommand({
      Bucket: name,
      Key: key
    });
  
    const response = await client.send(command);
    const csvData = await response.Body.transformToString("utf-8");
  
    return csvData;
  }

  module.exports = { uploadingToBucket, getCSVDataFromBucket };