const { uploadingToBucket, getCSVDataFromBucket } = require("./s3Server");

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

module.exports.registerStudents = async (event) => {
  const s3Event = event.Records[0].s3;

  const bucketName = s3Event.bucket.name;
  const bucketKey = decodeURIComponent(s3Event.object.key.replace(/\+/g, " "));

  const fileData = await getCSVDataFromBucket(bucketName, bucketKey);

  console.log(fileData);
};
