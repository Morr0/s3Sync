const S3 = require("aws-sdk/clients/s3");
const path = require("path");
const fs = require("fs");
const {promisify} = require("util");

const readFileAsync = promisify(fs.readFile);
const statAsync = promisify(fs.stat);

if (process.argv.length < 7)
    throw new Error("You must provide all the needed arguments");

const bucket = new S3({
    accessKeyId: process.argv[2],
    secretAccessKey: process.argv[3],
    region: process.argv[4],
});

listFilesRecursively(process.argv[6]);

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
        Bucket: process.argv[5],
        Key: content? fullPath: `${fullPath}/`, // add / to indicate a directory
        Body: content? content: "",
    };

    bucket.upload(params, (error, data) => {
        console.error(error);
        console.log(data);
    });
}

function swapBackslashesWithForwardOnes(_fullpath){
    let fullPath = "";
    _fullPath.split("\\").forEach((segment) => {
        if (!fullPath)
            return fullPath = segment;
        
        fullPath += `/${segment}`; // So it seems nested
    });
    return fullPath;
}
