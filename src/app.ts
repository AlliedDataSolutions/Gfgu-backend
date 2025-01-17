import express, { Application, Request, Response } from 'express';

const app: Application = express();


app.listen(5001, () => {
    console.log("server started")
})