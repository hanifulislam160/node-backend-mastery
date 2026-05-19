import express, {
  Router,
  type Application,
  type Request,
  type Response,
} from "express";
import { userRoute } from "./modules/user/user.route";
import { profileRoute } from "./modules/profile/profile.route";
import logger from "./middleware/logger";
import { authRoute } from "./modules/auth/auth.route";


const app: Application = express();

app.use(express.json());
app.use(express.text()), 
app.use(express.urlencoded({ extended: true }));

app.use(logger);



app.get("/", (req: Request, res: Response) => {
  //   res.send("Hello World!");
  res.status(200).json({
    message: "Now I have started new journey with express",
    author: "Haniful Islam",
  });
});

app.use("/users", userRoute);
app.use("/profiles", profileRoute);
app.use("/auth", authRoute);

export default app;
