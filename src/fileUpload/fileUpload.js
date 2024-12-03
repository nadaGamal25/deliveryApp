import axios from 'axios';
import FormData from 'form-data';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../utils/appError.js';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { config, uploader } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const fileUpload = (folderName) => {
    // Use memory storage for serverless environments
    const storage = multer.memoryStorage();

    function fileFilter(req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new AppError('Images only', 401), false);
        }
    }

    const upload = multer({
        storage,
        // fileFilter,
        limits: {
            fileSize: 1024 * 1024 * 5, // 5 MB limit
        }
    });
    return upload;
};

export const uploadMixFiles = (arrayOfFields, folderName) => fileUpload(folderName).fields(arrayOfFields);
export const uploadSingleFile = (fieldname, folderName) => fileUpload(folderName).single(fieldname);

// Helper function to upload file buffer to Cloudinary
export const uploadToCloudinary = async (fileBuffer, folderName, originalname) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder: folderName, public_id: uuidv4() + '-' + originalname, format: 'png' },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary upload failed:', error);
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        ).end(fileBuffer);
    });
};



// const fileUpload = (folderName) => {
//     // console.log(process.env.CLOUDINARY_CLOUD_NAME); // Should print your cloud name

//     // Cloudinary storage setup
//     const storage = new CloudinaryStorage({
//         cloudinary: cloudinary,
//         params: {
//             folder: folderName,
//             format: async (req, file) => 'png', // You can set this dynamically if needed
//             public_id: (req, file) => uuidv4() + '-' + file.originalname
//         }
//     });

//     function fileFilter(req, file, cb) {
//         if (file.mimetype.startsWith('image/')) {
//             cb(null, true);
//         } else {
//             cb(new AppError('Images only', 401), false);
//         }
//     }

//     const upload = multer({
//         storage,
//         fileFilter,
//         limits: {
//             fileSize: 1024 * 1024 * 5, // 5 MB limit
//         }
//     });
//     return upload;
// };

// export const uploadSingleFile = (fieldname, folderName) => fileUpload(folderName).single(fieldname);
// export const uploadMixFiles = (arrayOfFields, folderName) => fileUpload(folderName).fields(arrayOfFields);



// const fileUpload=(folderName)=>{
//     // const storage = multer.memoryStorage(); // Store in memory, not on disk

//     const storage = multer.diskStorage({
//         destination: (req, file, cb) => {
//             cb(null, `uploads/${folderName}`)
//         },
//         filename: (req, file, cb) => {
//             cb(null , uuidv4() +"-"+ file.originalname)
//         }
//     })

//     function fileFilter(req,file,cb){
//         if(file.mimetype.startsWith('image/')){
//             cb(null,true)
//         }else{
//             cb(new AppError('images only',401),false)
//         }
 
//     }

//     const upload=multer({
//         storage,fileFilter,limits:{
//             fileSize: 1024*1024*5,
//         }
//     })
//     return upload
// }


// export const uploadSingleFile= (fieldname,folderName)=> fileUpload(folderName).single(fieldname)
// export const uploadMixFiles= (arrayOfFields,folderName)=> fileUpload(folderName).fields(arrayOfFields)













// let sirvToken = null;
// let tokenExpirationTime = null;

// // Function to get a new token from Sirv
// const getSirvToken = async () => {
//   try {
//     const response = await axios.post('https://api.sirv.com/v2/token', {
//       clientId: process.env.SIRV_CLIENT_ID,
//       clientSecret: process.env.SIRV_CLIENT_SECRET
//     });
    
//     sirvToken = response.data.token;
//     tokenExpirationTime = Date.now() + response.data.expires_in * 1000; // Calculate expiration time

//     return sirvToken;
//   } catch (error) {
//     console.error('Error obtaining Sirv token:', error);
//     throw new Error('Failed to get Sirv token');
//   }
// };

// // Function to check if the token is still valid or needs refresh
// const getValidToken = async () => {
//   if (!sirvToken || Date.now() >= tokenExpirationTime) {
//     return await getSirvToken(); // Get a new token if expired or missing
//   }
//   return sirvToken; // Return the cached token if still valid
// };

// // Function to upload multiple files to Sirv


// export const uploadMultipleToSirv = async (files) => {
//     const uploadedFiles = []; // To store URLs of uploaded files
//     files.forEach(file => {
//         const formData = new FormData();
      
//         // Explicitly append the file, with filename and content type (mimetype)
//         formData.append('file', file.buffer, {
//           filename: file.originalname,  // Explicitly provide the filename
//           contentType: file.mimetype    // Set the content type/mimetype
//         });
      
//         // Send the request to Sirv API
//         axios.post('https://api.sirv.com/v2/files/upload', formData, {
//           headers: {
//             ...formData.getHeaders(), // Ensure the correct headers are sent
//             'Authorization': `Bearer ${token}`
//           }
//         }).then(response => {
//           console.log(`Successfully uploaded: ${file.originalname}`);
//         }).catch(error => {
//           console.error(`Error uploading file ${file.originalname} to Sirv:`, error.response ? error.response.data : error.message);
//         });
//       });
  
//     return uploadedFiles; // Return an array of uploaded image URLs
//   };
  
//  export const uploadToSirv = async (file) => {
//     const token = await getValidToken(); // Ensure valid token before request
//     try {
//         const sirvToken = process.env.SIRV_API_TOKEN;
    
//         const formData = new FormData();
//         formData.append('file', file.buffer, {
//           filename: `/vehicles/${file.originalname}`,
//           contentType: file.mimetype,
//         });
    
//         const response = await axios.post('https://api.sirv.com/v2/files/upload', formData, {
//           headers: {
//             ...formData.getHeaders(),
//             'Authorization': `Bearer ${token}`,
//           },
//           params: {
//             filename: `/vehicles/${file.originalname}`,
//           },
//         });
    
//         console.log('Upload response:', response.data); // Log full response for debugging
      
        
//         if (response.data && response.data.url) {
//           return response.data.url; // Return uploaded image URL
//         } else {
//           console.error(`Error: No URL returned for ${file.originalname}`);
//           throw new Error(`Error: No URL returned for ${file.originalname}`);
//         }
    
//       } catch (error) {
//         console.error(`Error uploading file ${file.originalname} to Sirv:`, error.response?.data || error.message);
//         throw new Error(`Error uploading file ${file.originalname}`);
//       }
//   };
//   // Example usage for each fil

