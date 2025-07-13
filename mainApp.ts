import { Application, Request, Response } from "express";
import router from "./router/router";

//Default server Application
export const mainApp = async (app: Application) => {
  try {
    app.use("/api/admin/v1", router);
    app.get("/", (req: Request, res: Response) => {
      res
        .status(200)
        .json({ message: "Welcome to YTPersonalTemlates", status: 200 });
    });
  } catch (error) {
    return error;
  }
};
