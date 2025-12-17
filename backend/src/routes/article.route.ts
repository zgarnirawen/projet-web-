import { Router } from "express";
import { ArticleController } from "../controllers/article.controller";

const router = Router();
const c = new ArticleController();

router.post("/", c.create.bind(c));
router.get("/", c.getAll.bind(c));
router.get("/:id", c.getById.bind(c));
router.put("/:id", c.update.bind(c));
router.delete("/:id", c.delete.bind(c));

export default router;