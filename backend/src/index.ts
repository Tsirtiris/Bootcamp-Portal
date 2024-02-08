import express, { Request, Response } from "express";
import cors from "cors";
import multer, { Multer } from "multer";
import { db } from "./database/knex";
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { TokenManager } from "./TokenManager";
import dotenv from 'dotenv'
import bcrypt from 'bcrypt';

dotenv.config()

const app = express();
app.use(express.json());
app.use(cors());

app.listen(Number(process.env.PORT), () => {
    console.log(`Server running on Port ${Number(process.env.PORT)}`);
});

function generateUserId(): string {
    return 'u' + uuidv4().slice(0, 16);;
}
function generateJobId(): string {
    return 'j' + uuidv4().slice(0, 16);;
}
function generateApplicationId(): string {
    return 'a' + uuidv4().slice(0, 16);;
}

const tokenManager = new TokenManager();
const saltRounds = 10;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/uploads/');
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        callback(null, true);
    },
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/users", async (req: Request, res: Response) => {
    try {
        const results = await db("users");
        const cleanedResults = results.map((user) => {
            const { password, ...cleanedUser } = user;
            return cleanedUser;
        });

        res.status(200).send(cleanedResults);
    } catch (error: any) {
        console.error(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        res.send(error.message);
    }
});

app.get("/user", async (req: Request, res: Response) => {
    try {
        const { authorization } = req.headers;

        if (!authorization) {
            return res.status(400).send("Header 'authorization' is required");
        }

        const decodedToken = tokenManager.getPayload(authorization);

        if (!decodedToken) {
            return res.status(401).send("Invalid token");
        }

        const { id: userId } = decodedToken;

        const [user] = await db("users").where({ id: userId });

        if (!user) {
            return res.status(404).send("User not found");
        }

        const { password, ...cleanedUser } = user;
        return res.status(200).send(cleanedUser);
    } catch (error: any) {
        console.error(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        res.send(error.message);
    }
});

app.get("/user/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const [user] = await db("users").where({ id });

        if (!user) {
            return res.status(404).send("User not found");
        }

        const { password, ...cleanedUser } = user;
        return res.status(200).send(cleanedUser);
    } catch (error: any) {
        console.error(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        res.send(error.message);
    }
});

app.put('/users/', async (req: Request, res: Response) => {
    try {
        const { authorization } = req.headers;
        const { name, bio, email, lastName, city, workExperience, education, profilePhoto } = req.body;

        if (!authorization) {
            return res.status(400).send("Header 'authorization' is required");
        }

        const decodedToken = tokenManager.getPayload(authorization);

        if (!decodedToken) {
            res.status(401).send("Invalid token");
            return;
        }

        const { id: userId } = decodedToken;

        const [existingUser] = await db("users").where({ id: userId });

        if (!existingUser) {
            res.status(404).send("User not found");
            return;
        }

        await db("users")
            .where({ id: userId })
            .update({
                name,
                bio,
                email,
                last_name: lastName,
                city,
                work_experience: workExperience,
                education,
                profile_photo: profilePhoto
            });

        res.status(200).send("User updated!");

    } catch (error: any) {
        console.error(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        res.send(error.message);
    }
});

app.delete('/user', async (req: Request, res: Response) => {
    try {
        const { authorization } = req.headers;

        if (!authorization) {
            res.status(400).send("Header 'authorization' is required");
            return;
        }

        const decodedToken = tokenManager.getPayload(authorization);

        if (!decodedToken) {
            res.status(401).send("Invalid token");
            return;
        }

        const { id: currentUserId } = decodedToken;
        if (currentUserId === "admin") {
            res.status(403).send("Access denied. Cannot delete admin user.");
            return;
        }

        await db('users').where('id', '=', currentUserId).del();

        res.status(200).send("User deleted!");
    } catch (error: any) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

app.get("/jobs", async (req: Request, res: Response) => {
    try {
        const results = await db("jobs").select("id", "company", "bootcamp", "created_at");

        res.status(200).send(results);
    } catch (error: any) {
        console.error(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        res.send(error.message);
    }
});


app.get('/jobs/:jobId', async (req: Request, res: Response) => {
    try {
        const { jobId } = req.params;

        if (!jobId) {
            res.status(400).send("Parameter 'jobId' is required");
            return;
        }

        const job = await db('jobs').where('id', '=', jobId).first();

        if (!job) {
            res.status(404).send(`Job with ID ${jobId} not found`);
            return;
        }

        res.status(200).send(job);
    } catch (error: any) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

app.post('/jobs', async (req, res) => {
    try {
        const { authorization } = req.headers;
        const { company, bootcamp, companyDescription, bootcampDescription } = req.body;

        if (!company || !bootcamp) {
            res.status(400).send("Fields: 'company' and 'bootcamp' are required");
            return;
        }

        if (!authorization) {
            res.status(401).send("Authorization header is missing");
            return;
        }

        const decodedToken = tokenManager.getPayload(authorization);

        if (!decodedToken || decodedToken.id !== "admin") {
            res.status(403).send("Access denied. Only admin can post jobs");
            return;
        }

        await db("jobs").insert({
            id: generateJobId(),
            company,
            bootcamp,
            company_description: companyDescription,
            bootcamp_description: bootcampDescription,
            created_at: new Date().toISOString()
        });

        res.status(201).send("Job created!");
    } catch (error: any) {
        console.log(error);
        res.status(500).send(error.message);
    }
});

app.get("/applications", async (req: Request, res: Response) => {
    try {
        const { authorization } = req.headers;
        const { userId } = req.query;

        if (!authorization) {
            return res.status(400).send("Header 'authorization' is required");
        }

        const decodedToken = tokenManager.getPayload(authorization);

        if (!decodedToken || (decodedToken.id !== "admin" && userId && userId !== decodedToken.id)) {
            return res.status(403).send("Access denied");
        }

        let query = db("applications")
            .select(
                "applications.id",
                "applications.job_id",
                "jobs.company",
                "jobs.bootcamp",
                "applications.user_id",
                "users.name as username",
                "applications.cv",
                "applications.status",
                "applications.applied_at"
            )
            .join("jobs", "applications.job_id", "=", "jobs.id")
            .join("users", "applications.user_id", "=", "users.id");

        if (userId) {
            query = query.where("applications.user_id", "=", userId);
        }

        const results = await query;

        const groupedApplications = results.reduce((acc, result) => {
            const existingJob = acc.find((item: any) => item.job_id === result.job_id);

            if (!existingJob) {
                acc.push({
                    application_id: result.id,
                    job_id: result.job_id,
                    company: result.company,
                    bootcamp: result.bootcamp,
                    applications: [{
                        user_id: result.user_id,
                        username: result.username,
                        cv: result.cv,
                        applied_at: result.applied_at,
                        status: result.status
                    }],
                });
            } else {
                existingJob.applications.push({
                    user_id: result.user_id,
                    username: result.username,
                    cv: result.cv,
                    applied_at: result.applied_at
                });
            }

            return acc;
        }, []);

        res.status(200).send(groupedApplications);
    } catch (error: any) {
        console.error(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        res.send(error.message);
    }
});

app.get("/applications/job/:jobId", async (req: Request, res: Response) => {
    try {
        const { authorization } = req.headers;
        const { jobId } = req.params;

        if (!authorization) {
            res.status(400).send("Header 'authorization' is required");
            return;
        }

        const decodedToken = tokenManager.getPayload(authorization);

        if (!decodedToken) {
            res.status(401).send("Invalid token");
            return;
        }

        const { id: userId } = decodedToken;

        if (userId !== "admin") {
            res.status(403).send("Access denied. Only admin can view applications by job_id");
            return;
        }

        if (!jobId) {
            res.status(400).send("Parameter 'jobId' is required");
            return;
        }

        const applications = await db("applications")
            .where("job_id", "=", jobId);

        res.status(200).send(applications);
    } catch (error: any) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

app.get("/applications/user", async (req: Request, res: Response) => {
    try {
        const { authorization } = req.headers;

        if (!authorization) {
            res.status(400).send("Header 'authorization' is required");
            return;
        }

        const decodedToken = tokenManager.getPayload(authorization);

        if (!decodedToken) {
            res.status(401).send("Invalid token");
            return;
        }

        const { id: userId } = decodedToken;

        const applications = await db("applications")
            .where("user_id", "=", userId);

        res.status(200).send(applications);
    } catch (error: any) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

// Update the route handling the application creation
app.post('/applications', upload.single('cv'), async (req, res) => {
    try {
        const { authorization } = req.headers;
        const { jobId } = req.body;

        if (!authorization || !jobId) {
            res.status(400).send("Fields: 'authorization' and 'jobId' are required");
            return;
        }

        const decodedToken = tokenManager.getPayload(authorization);

        if (!decodedToken) {
            res.status(401).send("Invalid token");
            return;
        }

        const { id: userId } = decodedToken;

        // Check if there is already an application with the same jobId and userId
        const existingApplication = await db("applications")
            .where({ job_id: jobId, user_id: userId })
            .first();

        if (existingApplication) {
            res.status(409).send("Application already submitted");
            return;
        }

        // Check if a file was provided
        if (!req.file) {
            res.status(400).send("File 'cv' is required");
            return;
        }

        // Save the filename to the database
        const cvFilename = req.file.filename;

        await db("applications").insert({
            id: generateApplicationId(),
            user_id: userId,
            job_id: jobId,
            cv: cvFilename,
            status: 'waiting',
            applied_at: new Date().toISOString()
        });

        res.status(201).send("Application created!");
    } catch (error) {
        console.log(error);
        // res.status(500).send(error.message);
    }
});



app.put('/applications/:applicationId', async (req, res) => {
    try {
        const { authorization } = req.headers;
        const { applicationId } = req.params;
        const { status } = req.body;

        // Check if applicationId is defined
        if (!applicationId) {
            res.status(400).send("Parameter 'applicationId' is required");
            return;
        }

        // Check if status is a valid string
        if (status === undefined || typeof status !== 'string') {
            res.status(400).send("Field 'status' is required and must be a string");
            return;
        }

        // Check if authorization header is present
        if (!authorization) {
            res.status(400).send("Header 'authorization' is required");
            return;
        }

        const decodedToken = tokenManager.getPayload(authorization);

        if (!decodedToken || decodedToken.id !== "admin") {
            res.status(403).send("Access denied. Only admin can accept or reject applications");
            return;
        }

        // Check if the application with the specified ID exists
        const applicationExists = await db("applications")
            .where({ id: applicationId })
            .first();

        if (!applicationExists) {
            res.status(404).send("Application not found");
            return;
        }

        // Update the application status
        const updateResult = await db("applications")
            .where({ id: applicationId })
            .update({ status });

        if (updateResult === 0) {
            res.status(500).send("Failed to update application status");
            return;
        }

        res.status(200).send("Application status updated!");
    } catch (error: any) {
        console.log(error);
        res.status(500).send(error.message);
    }
});

app.post('/signup', async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
            return res.status(400).send("Fields 'name', 'email' and 'password' are required and must be strings");
        }
        const [existingUser] = await db("users").where({ email });
        if (existingUser) {
            return res.status(409).send("E-mail aready used");
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = {
            id: generateUserId(),
            name,
            email,
            password: hashedPassword,
            created_at: new Date().toISOString()
        };

        await db("users").insert(newUser);

        const token = tokenManager.createToken({ id: newUser.id, name: newUser.name });

        res.status(201).json({ message: "User created!", token });
    } catch (error: any) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

app.post("/login", async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (typeof email !== "string" || typeof password !== "string") {
            return res.status(400).send("Campos 'email' and 'password' are required");
        }

        const [user] = await db("users").where({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send("Invalid email and/or password");
        }

        const token = tokenManager.createToken({ id: user.id, name: user.name });

        res.status(200).json({ message: "Login succesfully!", token });
    } catch (error: any) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

app.put('/jobs/:jobId', async (req: Request, res: Response) => {
    try {
        const { authorization } = req.headers;
        const { jobId } = req.params;
        const { company, bootcamp, companyDescription, bootcampDescription } = req.body;

        // Check if jobId is defined
        if (!jobId) {
            res.status(400).send("Parameter 'jobId' is required");
            return;
        }

        // Check if authorization header is present
        if (!authorization) {
            res.status(400).send("Header 'authorization' is required");
            return;
        }

        const decodedToken = tokenManager.getPayload(authorization);

        if (!decodedToken || decodedToken.id !== "admin") {
            res.status(403).send("Access denied. Only admin can edit jobs");
            return;
        }

        // Check if the job with the specified ID exists
        const jobExists = await db("jobs")
            .where({ id: jobId })
            .first();

        if (!jobExists) {
            res.status(404).send("Job not found");
            return;
        }

        // Update the job details
        await db("jobs")
            .where({ id: jobId })
            .update({
                company,
                bootcamp,
                company_description: companyDescription,
                bootcamp_description: bootcampDescription,
            });

        res.status(200).send("Job updated!");
    } catch (error: any) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

app.delete('/jobs/:jobId', async (req: Request, res: Response) => {
    try {
        const { authorization } = req.headers;
        const { jobId } = req.params;

        if (!authorization) {
            res.status(400).send("Header 'authorization' is required");
            return;
        }

        const decodedToken = tokenManager.getPayload(authorization);

        if (!decodedToken || decodedToken.id !== "admin") {
            res.status(403).send("Access denied. Only admin can delete jobs");
            return;
        }

        if (!jobId) {
            res.status(400).send("Parameter 'jobId' is required");
            return;
        }

        const job = await db('jobs').where('id', '=', jobId).first();

        if (!job) {
            res.status(404).send(`Job with ID ${jobId} not found`);
            return;
        }

        await db('jobs').where('id', '=', jobId).del();

        res.status(200).send("Job deleted!");
    } catch (error: any) {
        console.error(error);
        res.status(500).send(error.message);
    }
});