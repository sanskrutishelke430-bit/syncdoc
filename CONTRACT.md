\# SyncDoc — Shared Contract (Backend ↔ Frontend)



\## 1. AST Node Shape



Every block in a document is a node with this shape:



{

&#x20; "id": "string (unique, e.g. uuid)",

&#x20; "type": "paragraph | heading1 | heading2 | heading3 | bulletList | numberedList | quote | codeBlock | divider | image",

&#x20; "content": "string (the text/content of the block)",

&#x20; "attributes": {},

&#x20; "children": \[],

&#x20; "createdBy": "string (user id)",

&#x20; "updatedAt": "ISO date string"

}



A Document is:

{

&#x20; "\_id": "string",

&#x20; "title": "string",

&#x20; "owner": "user id",

&#x20; "collaborators": \["user id", "..."],

&#x20; "ast": {

&#x20;   "type": "document",

&#x20;   "children": \[ /\* array of nodes above \*/ ]

&#x20; },

&#x20; "createdAt": "ISO date string",

&#x20; "updatedAt": "ISO date string"

}



\## 2. REST API Routes



POST   /api/auth/signup        { name, email, password } -> { token, user }

POST   /api/auth/login         { email, password } -> { token, user }



GET    /api/documents          -> \[ documents (list, no full ast) ]

POST   /api/documents          { title } -> { document }

GET    /api/documents/:id      -> { document }  (includes full ast)

PUT    /api/documents/:id      { title?, ast? } -> { document }

DELETE /api/documents/:id      -> { success: true }

POST   /api/documents/:id/share   { email } -> { document }

GET    /api/documents/:id/versions -> \[ versions ]



All routes except signup/login require header:

Authorization: Bearer <token>



\## 3. WebSocket / Real-Time



\- Room name: document:<documentId>

\- Client connects with the document id and user info after joining a document page.

\- Events:

&#x20; - "user-joined"   { userId, name }

&#x20; - "user-left"     { userId }

&#x20; - "ast-updated"   (Yjs sync update, handled by y-websocket automatically)

&#x20; - "presence"      { userId, name, editingBlockId }



\## 4. Notes



\- Backend is the source of truth for saved documents (MongoDB).

\- Yjs handles live in-session sync; periodic snapshots get saved to MongoDB as the `ast` field via PUT /api/documents/:id.

\- Frontend should never trust node `id`s from user input alone — backend validates AST shape on save.

