const S3 = require("aws-sdk/clients/s3");
const path = require("path");
const fs = require("fs");
const {promisify} = require("util");

const readFileAsync = promisify(fs.readFile);
const statAsync = promisify(fs.stat);

require("dotenv").config();
const {
    AWS_ACCESS_KEY,
    AWS_SECRET_KEY,
    AWS_REGION,
    AWS_BUCKET,
    DIRECTORY = ".",
} = process.env;

const bucket = new S3({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
    region: AWS_REGION,
});

listFilesRecursively(DIRECTORY);

function listFilesRecursively(dir){
    fs.readdir(dir, (error, dirItems) => {
        if (error){
            throw new Error("Incorrect directory provided");
        }

        dirItems.forEach(async (dirItem) => {
            let fullPath = path.join(dir, dirItem);
            
            const stats = await statAsync(fullPath);
            await upload(fullPath, stats);
            if (stats.isDirectory())
                listFilesRecursively(fullPath);
        });
    });
}

async function upload(_fullPath, stats){
    if (!stats.isDirectory())
        var content = await readFileAsync(_fullPath);
    
    let fullPath = "";
    _fullPath.split("\\").forEach((segment) => {
        if (!fullPath)
            return fullPath = segment;
        
        fullPath += `/${segment}`; // So it seems nested
    });

    let params = {
        Bucket: AWS_BUCKET,
        Key: content? fullPath: `${fullPath}/`, // add / to indicate a directory
        Body: content? content: "",
    };

    bucket.upload(params, (error, data) => {
        console.error(error);
        console.log(data);
    });
}