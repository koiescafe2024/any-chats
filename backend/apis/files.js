import express from 'express';
import path from 'path';
import multer from "multer"
import { fileURLToPath } from 'url';
import fs from "fs"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up storage for file uploads
const storage = multer.diskStorage({
    destination: './uploads', // Destination folder for uploaded files
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    },
});

const upload = multer({ storage });

const router = express.Router();

router.post('/', (req, res) => {
    // Define the folder path you want to read files from
    const profile_id = req.body.profile_id;
    if (profile_id === "0" ){
        res.send([])
    } else {
        const folderPath = path.join(__dirname, 'uploads'); 

        // Use the fs.readdir() method to read the directory contents
        fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Filter out only file names (excluding directories)
        const fileNames = files.filter(file => fs.statSync(path.join(folderPath, file)).isFile());
        // Send the file names to the frontend as JSON
        res.send(fileNames);
        });
    }
});

// File download route
router.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename);
    res.download(filePath);
});

router.get('/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename);

    res.sendFile(filePath, (err) => {
        if (err) {
            console.log(err);
            // Check if the headers were already sent
            if (!res.headersSent) {
                // Only send a 404 status if no response has been sent yet
                res.sendStatus(404);
            }
        }
    });
});

// Serve uploaded files statically
router.use('/uploads', express.static('uploads'));

// File upload route
router.post('/upload', upload.single('file'), (req, res) => {
    res.json({ message: 'File uploaded successfully!' });
});

router.post('/remove', async (req, res) => {
    const { fileName } = req.body;
    console.log(fileName);

    // Define the path to the file
    const filePath = path.join(__dirname, 'uploads', fileName);

    try {
        // Remove file asynchronously
        await fs.promises.unlink(filePath);
        console.log(`Successfully deleted ${filePath}`);
        res.sendStatus(200); // Send success response
    } catch (error) {
        console.error(`Error deleting ${filePath}: ${error.message}`);
        // Send error response
        res.status(500).send('Error deleting file');
    }
});





export default router;

