
import express, {
    Router,
  type Application,
  type Request,
  type Response,
} from "express";
import { userRoute } from "./modules/user.route";

const app: Application = express();


app.use(express.json());
app.use(express.text()), 
app.use(express.urlencoded({ extended: true }));



app.get("/", (req: Request, res: Response) => {
  //   res.send("Hello World!");
  res.status(200).json({
    message: "Now I have started new journey with express",
    author: "Haniful Islam",
  });
});



app.use("/users", userRoute);





export default app;