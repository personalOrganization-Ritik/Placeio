import express from "express";
import connectDatabase from "./db/connect.js";
import * as dotenv from "dotenv";
import employerRouter from "./routes/employer.route.js";
import candidateRouter from "./routes/candidate.route.js";
import jobRouter from "./routes/job.route.js";



const app = express();



dotenv.config();


app.use(express.json());
app.use(express.urlencoded({extended: true})); 
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("<h1> Hello Ritik! Server is Listening </h1>");
});

app.use('/api/v1/employer',employerRouter);
app.use('/api/v1/candidate',candidateRouter)
app.use('/api/v1/jobs',jobRouter)


const startServer = async () => {
  const PORT = process.env.PORT || 4000;

  try {
    await connectDatabase(process.env.MONGODB_URL);

    app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

startServer();
