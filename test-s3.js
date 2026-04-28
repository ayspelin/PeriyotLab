const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');
require('dotenv').config({ path: '.env' });

async function checkS3() {
  try {
    if (!process.env.AWS_REGION || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_BUCKET_NAME) {
      console.log("Eksik AWS değişkenleri var. Lütfen .env dosyanızı kontrol edin.");
      return;
    }
    const s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }
    });
    
    console.log("AWS_REGION:", process.env.AWS_REGION);
    console.log("AWS_BUCKET_NAME:", process.env.AWS_BUCKET_NAME);
    
    const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_BUCKET_NAME,
      MaxKeys: 1
    });
    
    await s3Client.send(command);
    console.log("SUCCESS");
  } catch (error) {
    console.log("FAILED: " + error.message);
  }
}
checkS3();
