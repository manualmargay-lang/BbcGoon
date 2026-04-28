# BbcGoon - Media Aggregation Platform

A unified media aggregation platform that connects Reddit, X (Twitter), and multiple adult video platforms (Scrolller, RedGif, XFree, TwPornstars, XVideos, ThisVid) to autoplay video clips tagged, captioned, or containing specific user-defined keywords.

## ✨ Features

- 🔐 **Multi-Platform Authentication**: Securely connect Reddit, X, and other video platforms
- 🎬 **Unified Video Player**: Autoplay videos from all connected platforms
- 🔍 **Keyword Filtering**: Create custom keyword lists to filter and discover content
- 📱 **Responsive UI**: Web and mobile-friendly interface
- 🔔 **Smart Notifications**: Get alerts for new matching content
- 💾 **Save & Bookmark**: Save favorite videos for later viewing

## 🛠️ Tech Stack

- **Backend**: Node.js/Express.js
- **Frontend**: React/Next.js (future)
- **Database**: PostgreSQL
- **Authentication**: OAuth 2.0 (Reddit, X)
- **Video APIs**: Official APIs + Compliant Scraping

## 📁 Project Structure

```
BbcGoon/
├── backend/
│   ├── auth/                 # OAuth and authentication
│   │   └── oauth.js         # OAuth implementations
│   ├── filtering/            # Keyword matching logic
│   │   └── keywordMatcher.js
│   ├── aggregation/          # Video fetching from platforms
│   │   └── videoFetcher.js
│   ├── database/             # DB models and queries
│   └── routes/               # API endpoints (coming soon)
├── frontend/
│   ├── components/           # React components (coming soon)
│   ├── pages/                # Next.js pages (coming soon)
│   └── styles/               # CSS modules (coming soon)
├── database/
│   └── schema.sql            # PostgreSQL schema
├── .env.example              # Environment variables template
├── package.json              # Dependencies
├── README.md                 # This file
└── CONTRIBUTING.md           # Contribution guidelines
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** v16 or higher
- **PostgreSQL** v12 or higher
- **Reddit API credentials** (from https://www.reddit.com/prefs/apps)
- **X/Twitter API credentials** (from https://developer.twitter.com)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/manualmargay-lang/BbcGoon.git
   cd BbcGoon
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API credentials
   ```

4. **Set up the database**
   ```bash
   # Create database (if needed)
   createdb bbcgoon
   
   # Run schema
   psql -d bbcgoon < database/schema.sql
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Server will run on `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

#### Get Reddit Auth URL
```javascript
GET /auth/reddit
```

#### Get X Auth URL
```javascript
GET /auth/x
```

#### Callback handlers
```javascript
GET /auth/reddit/callback?code=XXX
GET /auth/x/callback?code=XXX
```

### Video Endpoints

#### Get recent videos
```javascript
GET /api/videos/recent?limit=25
```

#### Search videos
```javascript
GET /api/videos/search?q=keyword
```

#### Get platform-specific videos
```javascript
GET /api/videos/platform/:platform
```

### Keyword Endpoints

#### Add keyword
```javascript
POST /api/keywords
Body: { keyword: "string", type: "allow|block" }
```

#### Get user keywords
```javascript
GET /api/keywords
```

#### Remove keyword
```javascript
DELETE /api/keywords/:id
```

## 🔑 Environment Variables

Create a `.env` file based on `.env.example`:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/bbcgoon

# Reddit OAuth
REDDIT_CLIENT_ID=your_id
REDDIT_CLIENT_SECRET=your_secret
REDDIT_REDIRECT_URI=http://localhost:3000/auth/reddit/callback

# X/Twitter OAuth
X_CLIENT_ID=your_id
X_CLIENT_SECRET=your_secret
X_REDIRECT_URI=http://localhost:3000/auth/x/callback

# JWT
JWT_SECRET=your-super-secret-key

# Session
SESSION_SECRET=your-session-secret
```

## 🗺️ Roadmap

- [x] Project setup and infrastructure
- [x] Database schema
- [x] OAuth authentication modules
- [x] Keyword filtering engine
- [x] Video aggregation logic
- [ ] API endpoints
- [ ] Web UI (React)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Community features
- [ ] Video caching and optimization

## 📖 Module Documentation

### Video Aggregation (`backend/aggregation/videoFetcher.js`)

Handles fetching videos from multiple platforms:

```javascript
const videoFetcher = require('./backend/aggregation/videoFetcher');

// Aggregate videos for a user
const videos = await videoFetcher.aggregateVideos(userId);

// Get recent videos
const recent = await videoFetcher.getRecentVideos(limit);

// Search by platform
const reddit = await videoFetcher.searchByPlatform('reddit');
```

### Keyword Filtering (`backend/filtering/keywordMatcher.js`)

Manages user keywords and content filtering:

```javascript
const keywordMatcher = require('./backend/filtering/keywordMatcher');

// Add keyword
await keywordMatcher.addKeyword(userId, 'keyword', 'allow');

// Get filtered videos
const filtered = await keywordMatcher.getFilteredVideos(userId);

// Search by keyword
const results = await keywordMatcher.searchByKeyword(userId, 'term');
```

### OAuth Authentication (`backend/auth/oauth.js`)

Handles Reddit and X authentication:

```javascript
const oauth = require('./backend/auth/oauth');

// Get auth URLs
const redditUrl = oauth.getRedditAuthUrl();
const xUrl = oauth.getXAuthUrl();

// Exchange codes for tokens
const redditToken = await oauth.exchangeRedditCode(code);
const xToken = await oauth.exchangeXCode(code);

// Generate JWT
const token = oauth.generateJWT(userId);
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test videoFetcher.test.js
```

## 🤝 Contributing

We welcome contributions! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- Open an issue on GitHub for bug reports
- Check existing issues before opening new ones
- Provide detailed information and reproduction steps

## 👥 Authors

- **manualmargay-lang** - Initial development

## 🙏 Acknowledgments

- Thanks to Reddit and X/Twitter for their APIs
- Thanks to all contributors and users

---

**Ready to get started?** See [Getting Started](#-getting-started) section above or check out the [issues](https://github.com/manualmargay-lang/BbcGoon/issues) for tasks to work on!
