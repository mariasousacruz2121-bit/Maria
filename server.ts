import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase Configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing. Database features will not work.");
}

const supabase = createClient(supabaseUrl || "", supabaseServiceKey || "");

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/register", async (req, res) => {
    const { username, password, house } = req.body;
    try {
      const { data, error } = await supabase
        .from("users")
        .insert([{ username, password, house, role: 'user' }])
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          return res.status(400).json({ error: "Utilizador já existe" });
        }
        throw error;
      }
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: "Erro ao criar utilizador" });
    }
  });

  app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;
    try {
      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .eq("password", password)
        .single();
      
      if (user) {
        res.json({ id: user.id, username: user.username, house: user.house, role: user.role });
      } else {
        res.status(401).json({ error: "Credenciais inválidas" });
      }
    } catch (err) {
      res.status(401).json({ error: "Credenciais inválidas" });
    }
  });

  // Admin Routes
  app.get("/api/admin/users", async (req, res) => {
    try {
      const { data: users, error } = await supabase
        .from("users")
        .select("id, username, house, role, created_at")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      res.json(users);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/users", async (req, res) => {
    const { username, password, house, role } = req.body;
    try {
      const { data, error } = await supabase
        .from("users")
        .insert([{ username, password, house, role: role || 'user' }])
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.put("/api/admin/users/:id", async (req, res) => {
    const { id } = req.params;
    const { username, house, role } = req.body;
    try {
      const { error } = await supabase
        .from("users")
        .update({ username, house, role })
        .eq("id", id);

      if (error) throw error;
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete("/api/admin/users/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", id);

      if (error) throw error;
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
