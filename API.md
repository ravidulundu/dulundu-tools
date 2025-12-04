# Dulundu Tools API Documentation

Backend API documentation for Dulundu Tools. The server runs on Express.js and provides AI-powered code generation, text paraphrasing, and content sharing features.

## Base URL

- **Production**: `https://dulundu.tools`
- **Development**: `http://localhost:3001`

---

## Health Check

### `GET /health`

Check if the server is running and healthy.

**Response**

```json
{
  "status": "healthy"
}
```

**Status Codes**

| Code | Description |
| ---- | ----------- |
| 200  | Server is healthy |

---

## AI Endpoints

All AI endpoints are rate-limited to **100 requests per 15 minutes** per IP address.

### `POST /api/ai/generate`

Generate code or explanations using Google Gemini AI.

**Headers**

| Header       | Value            | Required |
| ------------ | ---------------- | -------- |
| Content-Type | application/json | Yes      |

**Request Body**

| Field    | Type   | Required | Description                          |
| -------- | ------ | -------- | ------------------------------------ |
| prompt   | string | Yes      | The task or question for the AI      |
| language | string | No       | Programming language context (e.g., "javascript", "python") |

**Example Request**

```json
{
  "prompt": "Write a function that reverses a string",
  "language": "typescript"
}
```

**Response**

```json
{
  "text": "Here's a TypeScript function to reverse a string:\n\n```typescript\nfunction reverseString(str: string): string {\n  return str.split('').reverse().join('');\n}\n```"
}
```

**Status Codes**

| Code | Description                        |
| ---- | ---------------------------------- |
| 200  | Success                            |
| 400  | Invalid or missing prompt          |
| 429  | Rate limit exceeded                |
| 500  | AI service error or not configured |

---

### `POST /api/ai/paraphrase`

Paraphrase text with a specified tone using Google Gemini AI.

**Headers**

| Header       | Value            | Required |
| ------------ | ---------------- | -------- |
| Content-Type | application/json | Yes      |

**Request Body**

| Field | Type   | Required | Description                                                    |
| ----- | ------ | -------- | -------------------------------------------------------------- |
| text  | string | Yes      | The text to paraphrase                                         |
| tone  | string | No       | Desired tone (e.g., "professional", "casual", "formal"). Default: "professional" |

**Example Request**

```json
{
  "text": "Hey, can you fix this bug ASAP? It's super annoying!",
  "tone": "professional"
}
```

**Response**

```json
{
  "text": "Could you please address this bug at your earliest convenience? It is causing significant inconvenience."
}
```

**Status Codes**

| Code | Description                        |
| ---- | ---------------------------------- |
| 200  | Success                            |
| 429  | Rate limit exceeded                |
| 500  | AI service error or not configured |

---

## Share Endpoints

Content sharing system with optional expiration.

### `POST /api/share`

Create a new shareable content link.

**Headers**

| Header       | Value            | Required |
| ------------ | ---------------- | -------- |
| Content-Type | application/json | Yes      |

**Request Body**

| Field      | Type   | Required | Description                                                |
| ---------- | ------ | -------- | ---------------------------------------------------------- |
| content    | string | Yes      | The content to share (max 10MB)                            |
| type       | string | No       | Content type identifier (e.g., "svg", "json"). Default: "svg" |
| expiration | string | No       | Expiration time: "1 Hour", "24 Hours", "7 Days", or "Never" |

**Example Request**

```json
{
  "content": "<svg xmlns=\"http://www.w3.org/2000/svg\">...</svg>",
  "type": "svg",
  "expiration": "24 Hours"
}
```

**Response**

```json
{
  "id": "a1b2c3d4"
}
```

The shareable URL will be: `https://dulundu.tools/share/a1b2c3d4`

**Status Codes**

| Code | Description              |
| ---- | ------------------------ |
| 200  | Share created            |
| 400  | Content is required      |
| 500  | Server error             |

---

### `GET /api/share/:id`

Retrieve shared content by ID.

**URL Parameters**

| Parameter | Type   | Description                    |
| --------- | ------ | ------------------------------ |
| id        | string | The share ID (8 hex characters) |

**Example Request**

```
GET /api/share/a1b2c3d4
```

**Response**

```json
{
  "id": "a1b2c3d4",
  "content": "<svg xmlns=\"http://www.w3.org/2000/svg\">...</svg>",
  "type": "svg",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "expiresAt": "2024-01-16T10:30:00.000Z"
}
```

**Status Codes**

| Code | Description                           |
| ---- | ------------------------------------- |
| 200  | Success                               |
| 400  | Invalid ID format                     |
| 404  | Share not found                       |
| 410  | Share has expired (deleted from server) |

---

## Error Handling

All error responses follow this format:

```json
{
  "error": "Error message description",
  "message": "Detailed error message (development only)"
}
```

### Common Error Responses

**Rate Limit Exceeded (429)**

```json
{
  "message": "Too many requests from this IP, please try again after 15 minutes"
}
```

**Internal Server Error (500)**

```json
{
  "error": "Internal Server Error"
}
```

---

## Security

### Rate Limiting

- AI endpoints: 100 requests per 15 minutes per IP
- Headers: `RateLimit-*` standard headers included in responses

### CORS

Allowed origins:
- `https://dulundu.tools`
- `https://www.dulundu.tools`
- `http://localhost:3000` (development only)
- `http://localhost:3001` (development only)
- `http://localhost:5173` (development only)

### Content Security Policy

The server applies CSP headers to protect against XSS attacks.

### Input Validation

- Share IDs are validated against `/^[a-f0-9]+$/i` to prevent directory traversal
- JSON payload limit: 10MB

---

## Environment Variables

| Variable              | Description                      | Required |
| --------------------- | -------------------------------- | -------- |
| PORT                  | Server port (default: 3000)      | No       |
| NODE_ENV              | Environment (production/development) | No   |
| GEMINI_API_KEY        | Google Gemini API key            | Yes*     |
| VITE_GEMINI_API_KEY   | Alternative Gemini API key       | Yes*     |
| VITE_APP_URL          | Application URL for CORS         | No       |

\* At least one Gemini API key is required for AI features.

---

## Example Usage

### cURL Examples

**Generate Code**

```bash
curl -X POST https://dulundu.tools/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Write a hello world in Python", "language": "python"}'
```

**Create a Share**

```bash
curl -X POST https://dulundu.tools/api/share \
  -H "Content-Type: application/json" \
  -d '{"content": "Hello World!", "type": "text", "expiration": "24 Hours"}'
```

**Get Shared Content**

```bash
curl https://dulundu.tools/api/share/a1b2c3d4
```

### JavaScript/Fetch Examples

```javascript
// Generate code
const response = await fetch('/api/ai/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'Create a React hook for dark mode',
    language: 'typescript'
  })
});
const data = await response.json();
console.log(data.text);

// Create a share
const shareResponse = await fetch('/api/share', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    content: svgContent,
    type: 'svg',
    expiration: '7 Days'
  })
});
const { id } = await shareResponse.json();
console.log(`Share URL: /share/${id}`);
```
