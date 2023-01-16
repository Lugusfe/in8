import { Router } from "express";

import { ScrapingController } from "./controllers/ScrapingController";

const router = Router();

const scrapingController = new ScrapingController();

router.get("/get-lenovo-laptops", scrapingController.execute);

export { router };
