# File Upload Server

A simple Node.js server for uploading, serving, and deleting files using [Hono](https://hono.dev/).

## Features
- Upload files via a web form or API
- Serve uploaded files at `/uploads/<filename>`
- Delete uploaded files via API
- CORS enabled

## Setup

```sh
pnpm install
pnpm run dev
```

The server will start at [http://localhost:3000](http://localhost:3000)

## Usage

### Upload a File (API)

**JavaScript Example:**
```js
const formData = new FormData();
formData.append('file', new File(['Hello, world!'], 'example.txt'));

fetch('http://localhost:3000/upload', {
  method: 'POST',
  body: formData,
})
  .then(res => res.json())
  .then(console.log)
  .catch(console.error);
```

### Delete a File (API)

**JavaScript Example:**
```js
fetch('http://localhost:3000/upload', {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ filename: 'example.txt' }),
})
  .then(res => res.json())
  .then(console.log)
  .catch(console.error);
```

### Access Uploaded Files

Uploaded files are available at:
```
http://localhost:3000/uploads/<filename>
```

---

- The default upload form is available at the root URL.
- Uploaded files are stored in the `uploads` directory.

## Sample HTML Client

A simple HTML client is available in `sample-client/index.html` for testing uploads and CORS.

**How to use:**
1. Start the server (`pnpm run dev`).
2. Open `sample-client/index.html` in your browser. 
3. Use the form to upload or delete files. Responses will be shown on the page.

```
open http://localhost:3000
```
