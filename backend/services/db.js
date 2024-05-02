import path from 'path';
import { fileURLToPath } from 'url';
import fs from "fs"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initializes the promise chain with a resolved promise
let lastPromise = Promise.resolve();

// Function to add a new operation to the queue
const enqueueOperation = (operation) => {
    // Chain the new operation onto the last promise, ensuring they run sequentially
    lastPromise = lastPromise.then(() => new Promise(operation));
    return lastPromise;
};
  
class DatabaseService {
    readFile = (fileName) => {
        return enqueueOperation((resolve, reject) => {
            const filePath = path.resolve(__dirname, `../jsonfiles/${fileName}`);
            fs.promises.readFile(filePath, 'utf8').then(data => {
                try {
                    const objectsArray = JSON.parse(data);
                    resolve(objectsArray); // Successfully resolve with the data
                } catch (error) {
                    console.error('Error parsing JSON from file:', fileName, error);
                    reject(error); // Reject with the parsing error
                }
            }).catch(error => {
                console.error('Error reading file:', fileName, error);
                reject(error); // Reject with the file reading error
            });
        });
    };
    
    updateFile = (fileName, objectsArray) => {
        return enqueueOperation((resolve, reject) => {
            if (objectsArray.length !== 0) {
                const filePath = path.resolve(__dirname, `../jsonfiles/${fileName}`);
                const updatedJsonString = JSON.stringify(objectsArray, null, 2);
                fs.promises.writeFile(filePath, updatedJsonString, 'utf8').then(() => {
                    console.log('File updated successfully:', fileName);
                    resolve(); // Successfully resolve
                }).catch(error => {
                    console.error('Error writing to the file:', fileName, error);
                    reject(error); // Reject with the writing error
                });
            } else {
                console.log("ObjectsArray is empty!");
                // Resolve because it's not necessarily an error state
                // But consider rejecting or handling this case differently if needed
                resolve();
            }
        });
    };

    addObject = async (metric, object) => {
        try {
            const objectsArray = await this.readFile(`${metric}.json`)
            objectsArray.push(object)
            await this.updateFile(`${metric}.json`, objectsArray)
        } catch (err){
            console.log(err)
        }
    }
}

export default new DatabaseService()