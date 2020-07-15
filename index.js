const S3 = require("aws-sdk/clients/s3");
const path = require("path");
const fs = require("fs");
const {promisify} = require("util");

const readFileAsync = promisify(fs.readFile);

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

        dirItems.forEach((dirItem) => {
            let fullPath = path.join(dir, dirItem);
            fs.stat(fullPath, async (error, stats) => {
                if (stats.isDirectory())
                    listFilesRecursively(fullPath);
                
                await upload(dirItem, fullPath);   
            })
        });
    });
}

async function upload(fileName, fullPath){
    const content = await readFileAsync(fullPath);
    bucket.upload({
        Bucket: process.argv[5],
        Key: fileName,
        Body: content
    }, (error, data) => {
        console.error(error);
        console.log(data);
    });
}
