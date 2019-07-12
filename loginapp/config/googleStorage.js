const { Storage } = require("@google-cloud/storage");

const GOOGLE_CLOUD_PROJECT_ID = " teloneros"; // Replace with your project ID
const GOOGLE_CLOUD_KEYFILE =
  "/Users/DiegoGM/Google Drive/ITC/IronHack/telonero-app/loginapp/public/Teloneros-bac112559ffc.json"; // Replace with the path to the downloaded private key

exports.storage = new Storage({
  projectId: GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: GOOGLE_CLOUD_KEYFILE
});

exports.getPublicUrl = (bucketName, fileName) => {
  `https://storage.googleapis.com/${bucketName}/${fileName}`;
};
