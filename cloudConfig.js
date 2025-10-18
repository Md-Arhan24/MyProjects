// const cloudinary = require('cloudinary').v2;//version 2 of cloudinary
// const multer = require('multer');
// const {CloudinaryStorage} = require('multer-storage-cloudinary');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;



//this must be in order as in documentaion and their name must be same like cloud_name, api_key,api_secret
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_APIKEY,
    api_secret:process.env.CLOUD_APISECRET,
});

/*// Create CloudinaryStorage instance
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // optional folder name
    allowed_formats: ['jpg', 'png'],
  },
});
 */
//define schema of cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    //assign parameters
    params:{
        //destination of the folder name where our file are stored
        folder:"wonderlust_DEV",
        //formats to be allowed
        allowerdFormats : ["jpg","jpeg","png"],
    },
});

module.exports = {
    storage,
    cloudinary
}



