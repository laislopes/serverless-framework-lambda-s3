const { convertCSVData } = require("../convertCSVData");
const { registerStudentsIntoDatabase } = require("../registerStudentsIntoDatabase");
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

module.exports.registerStudentsFromLocalBucket = async (event) => {
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
