import { Router, type IRouter } from "express";
import healthRouter from "./health";
import productsRouter from "./products";
import settingsRouter from "./settings";
import adminRouter from "./admin";
import uploadRouter from "./upload";

const router: IRouter = Router();

router.use(healthRouter);
router.use(productsRouter);
router.use(settingsRouter);
router.use(adminRouter);
router.use(uploadRouter);

export default router;
