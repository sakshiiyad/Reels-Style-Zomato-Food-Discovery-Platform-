const ImageKit=require("imagekit");
console.log(
  process.env.IMAGEKIT_PUBLIC_KEY,
  process.env.IMAGEKIT_PRIVATE_KEY,
  process.env.IMAGEKIT_URL_ENDPOINT
);
const imagekit=new ImageKit({
    publicKey:process.env.IMAGEKIT_PUBLIC_KEYS,
    privateKey:process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint:process.env.IMAGEKIT_URL_ENDPOINT,
   
})
async function uploadFile(file, fileName) {
    console.log("upload file called");
   
    
    const result = await imagekit.upload({
        file: file, // required
        fileName: fileName, // required
    })

    return result; // Return the URL of the uploaded file
}

module.exports = {
    uploadFile
}