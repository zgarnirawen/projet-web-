import { Router } from "express";
import { CommandeController } from "../controllers/commande.controller";

const router = Router();
const c = new CommandeController();

router.post("/", c.create.bind(c));
router.get("/", c.getAll.bind(c));
router.get("/:id", c.getById.bind(c));
router.put("/:id", c.update.bind(c));
router.delete("/:id", c.delete.bind(c));

export default router;