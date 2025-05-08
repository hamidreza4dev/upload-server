import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { serve } from "@hono/node-server";
import fs from "node:fs";
import path from "node:path";
import { cors } from "hono/cors";

const __dirname = new URL(".", import.meta.url).pathname;

const app = new Hono();
const uploadsDir = path.join(__dirname, "..", "uploads");

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Serve static files from uploads directory
app.use(cors());

// Serve static files from uploads directory
app.use(
  "/uploads/*",
  serveStatic({
    root: "./uploads",
    rewriteRequestPath: (path) => path.replace(/^\/uploads/, ""),
  })
);

// Simple HTML form for file upload
app.get("/", (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html>
      <body>
        <h1>File Upload</h1>
        <form action="/upload" method="post" enctype="multipart/form-data">
          <input type="file" name="file" required>
          <button type="submit">Upload</button>
        </form>
      </body>
    </html>
  `);
});

// Handle file upload
app.post("/upload", async (c) => {
  const body = await c.req.parseBody();
  const file = body.file;

  if (!file) {
    return c.json({ success: false, message: "No file uploaded" }, 400);
  }

  if (file instanceof File) {
    const buffer = await file.arrayBuffer();
    const filename = file.name;
    const filepath = path.join(uploadsDir, filename);

    try {
      await fs.promises.writeFile(filepath, Buffer.from(buffer));
      return c.json({
        success: true,
        message: "file uploaded successfully",
        data: { filename },
      });
    } catch (error) {
      console.error("Error saving file:", error);
      return c.json({ success: false, message: "Error saving file" }, 500);
    }
  }

  return c.text("Invalid file format", 400);
});

app.delete("/upload", async (c) => {
  const body = await c.req.json();
  const filename = body.filename;

  if (!filename) {
    return c.json({ success: false, message: "Filename is required" }, 400);
  }

  if (typeof filename !== "string") {
    return c.json(
      { success: false, message: "Filename must be a string" },
      400
    );
  }

  const filepath = path.join(uploadsDir, filename);
  if (fs.existsSync(filepath)) {
    await fs.promises.unlink(filepath);
    return c.json({ success: true, message: "File deleted successfully" });
  }

  return c.json({ success: false, message: "File not found" }, 404);
});

// Start the server
const port = process.env.PORT ? +process.env.PORT : 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
