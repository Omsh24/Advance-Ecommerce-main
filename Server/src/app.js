import express from "express"
import cors from 'cors'
import cookieParser from "cookie-parser";
import { fileURLToPath } from 'url'; 
import path from 'path';
import { exec } from 'child_process';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());


// const mlModel = (req, res) => {
//     const { imagePath } = req.body;

//     if (!imagePath) {
//         return res.status(400).send('No image path provided');
//     }

//     const pythonScriptPath = path.join(__dirname, 'models', 'virtualTryOn.py');
//     const virtualEnvPython = path.join(__dirname, '..', 'env', 'Scripts', 'python.exe');

//     const pythonCommand = process.platform === 'win32' ? 'python' : 'python3';

//     exec(`"${virtualEnvPython}" "${pythonScriptPath}" --image_path ${imagePath}`, (err, stdout, stderr) => {
//         if (err) {
//             console.error(`exec error: ${err}`);
//             return res.status(500).send('Error processing the image');
//         }

//         res.send({ overlayedImage: stdout.trim() });
//     });
// };
const mlModel = (req, res) => {
    const { imagePath } = req.body;

    if (!imagePath) {
        return res.status(400).send({ error: "No image path provided" });
    }

    const pythonScriptPath = path.resolve(__dirname, "..", "src", "models", "virtualTryOn.py");
    const fullImagePath = path.resolve(__dirname, "..", imagePath);

    console.log(`Running script: ${pythonScriptPath}`);
    console.log(`Using image: ${fullImagePath}`);

    exec(
        `"C:\\Users\\Vivek\\Desktop\\Advanced-E-commerce-main\\Server\\env\\Scripts\\python.exe" "${pythonScriptPath}" --image_path "${fullImagePath}"`,
        (err, stdout, stderr) => {
            if (err) {
                console.error(`Exec error: ${err}`);
                console.error(`Stderr: ${stderr}`);
                return res.status(500).send({ error: "Error processing the image", details: stderr });
            }

            console.log(`Stdout: ${stdout}`);
            const outputImagePath = stdout.trim();

            if (!outputImagePath || !outputImagePath.endsWith(".png")) {
                return res.status(500).send({ error: "No valid output generated by the model" });
            }

            res.send({ overlayedImage: outputImagePath });
        }
    );
};

app.post('/mlmodel', mlModel);


export default app;