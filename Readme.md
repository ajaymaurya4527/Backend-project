# 🎥 YouTube Backend Engine - Scalable Video Streaming & Engagement API

A high-performance, robust RESTful API built on top of Node.js and Express.js that powers a full-scale video-sharing platform. This backend microservice orchestrates complex asset management, multi-stage data aggregations, secure cross-origin user authentication, and real-time interaction triggers using MongoDB and global file storage integrations.

---

## ⚡ Core Engine Features

### 🎞️ Video Lifecycle & Asset Pipelines
- **Streamlined Media Uploads:** Multi-part video and thumbnail uploads handled seamlessly via an internal memory buffer before delivery to global cloud CDNs.
- **Dynamic Content Feed Algorithms:** Custom query pipelines pulling subscription-based feeds, trending metrics, global search indexes, and personalized recommendations.
- **Privacy & Watch History Control:** Granular visibility flags (*Public*, *Unlisted*, *Private*) matched with an atomic historical log tracker (Watch History) featuring single-item deletion properties.

### 👥 User Engagement & Social Fabrics
- **Asymmetric Subscription Engine:** Robust follow/subscribe mapping handling real-time creator subscriber counts and personalized user subscription feeds.
- **Complex Interactivity Framework:** Atomic multi-tier interaction structures enabling users to Like/Dislike videos, publish nestable comments, and reply to existing text threads.
- **Custom Playlists & Collections:** Complete CRUD suite allowing users to create, modify, or delete custom playlists (*Watch Later*, *Favorites*, and user-curated mixtapes).

### 🛡️ Enterprise Security & Database Architecture
- **Stateless Session Security:** Dual-token mechanism using cryptographic Access and Refresh tokens stored strictly within secure, HTTP-Only, anti-CSRF cookies.
- **Advanced DB Aggregation Pipelines:** Complex, multi-stage MongoDB aggregations using Mongoose facets to query deep analytics (e.g., *Total views on a channel*, *Most liked comments*, *Engagement ratios*).
- **Rate-Limiting & Query Performance:** Optimized collection indexes mapping user lookups, text indexing for search bars, and security shields ensuring protection against query strain.

---

## 🛠️ Architecture & Tech Stack

- **Runtime Environment:** Node.js (Configured with ES Modules via `type: "module"`)
- **Web Framework:** Express.js (Utilizing advanced error boundaries and centralized middleware controllers)
- **Database Architecture:** MongoDB Atlas via Mongoose 9 ODM (Object Document Mapper)
- **Advanced DB Extensions:** `mongoose-aggregate-paginate-v2` for highly optimized feed pagination
- **File Interception Engine:** Multer Middleware (Optimized for processing high-payload video streams and images)
- **Asset Persistence:** Cloudinary SDK / Amazon S3 Integration (Media transformation and scalable delivery)
- **Cryptographic Suite:** JSON Web Tokens (JWT) & Bcrypt (Password hashing using 10-round salt mechanics)
- **Code Optimization:** Prettier & ESLint for architectural code formatting standards

---

## 📂 System Folder Structure

```text
youtube-backend/
├── src/
│   ├── db/                 # MongoDB database initialization & lifecycle handlers
│   ├── models/             # Scalable Mongoose Schemas (User, Video, Comment, Like, Playlist, Subscription)
│   ├── controllers/        # Unified business logic routers (User, Video, Tweet, HealthCheck, etc.)
│   ├── middlewares/        # Authorization guards, error parsers, and Multer file rules
│   ├── routes/             # REST Endpoints mapping cleanly onto specific services
│   ├── utils/              # Global API response classes, Error exceptions, and Cloud asset wrappers
│   ├── app.js              # Base Express configurations (CORS, CookieParsers, JSON limits)
│   └── index.js            # Core initialization hook linking DB and starting server
├── public/temp/            # Temporary disk storage for incoming Multer stream chunks
├── .env.sample             # Blueprints for setting up local variables
└── package.json            # Scripts, project metadata, and server modules
