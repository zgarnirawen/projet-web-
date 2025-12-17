import app from "./app";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || 5201;

app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📍 API disponible sur http://localhost:${PORT}/api/articles`);
});