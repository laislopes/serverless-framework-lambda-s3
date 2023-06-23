const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");

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

  const uploadCommand = new PutObjectCommand({
    Bucket: "students-csv-local",
    Key: "test.csv",
    Body: Buffer.from("12345")
  })

  await client.send(uploadCommand); 
}

module.exports.simulatingCSVUpload = async (event) => {
  try {
    await uploadingToBucket();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Simulating File Upload..."
      })
    };
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify(error)
    };
  }
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

module.exports.addStudents = async (event) => {
  const s3Event = event.Records[0].s3;

  const bucketName = s3Event.bucket.name;
  const bucketKey = decodeURIComponent(s3Event.object.key.replace(/\+/g, " "));

  const fileData = await getCSVDataFromBucket(bucketName, bucketKey);

  console.log(fileData);
};
