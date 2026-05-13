import express, { type Application, type Request, type Response } from "express";
const app:Application = express();
const port = 5000;

app.use(express.json())

app.get("/", (req: Request, res: Response) => {
//   res.send("Hello World!");
res.status(200).json({message : 'Now I have started new journey with express', author: 'Haniful Islam'})
});

app.post("/",(req: Request, res: Response) => {
    // res.status(200).json({"message" : 'I am posting data'})
    console.log(req.body);
})  

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
