import fs from 'fs';
import os from 'os';
import path from 'path';

const dbPath = path.join(os.homedir(), '.n8n', 'database.sqlite');
if (!fs.existsSync(dbPath)) {
  console.log("No DB found");
  process.exit(1);
}

const data = fs.readFileSync(dbPath, 'utf8');

// The workflow ID we are looking for is DvM3wlo6S3BQR5nF
const idx = data.indexOf('DvM3wlo6S3BQR5nF');
if (idx !== -1) {
  const snippet = data.substring(idx > 1000 ? idx - 1000 : 0, idx + 3000);
  
  // Look for the webhook node id
  const regex = /"parameters":\{.*?\},"id":"([^"]+)","name":"Webhook","type":"n8n-nodes-base\.webhook"/g;
  let match;
  while ((match = regex.exec(snippet)) !== null) {
    console.log("Webhook ID FOUND:", match[1]);
  }
  
  const regex2 = /"name":"Webhook","type":"n8n-nodes-base\.webhook"[^}]*"id":"([^"]+)"/g;
  while ((match = regex2.exec(snippet)) !== null) {
    console.log("Webhook ID FOUND (alt):", match[1]);
  }
  
  // Also look for "path" parameter in case they set a custom path
  const regex3 = /"parameters":\{[^}]*"path":"([^"]+)"[^}]*\}[^}]*"type":"n8n-nodes-base\.webhook"/g;
  while ((match = regex3.exec(snippet)) !== null) {
    console.log("Webhook PATH FOUND:", match[1]);
  }
} else {
  console.log("Workflow ID not found in database.");
}
