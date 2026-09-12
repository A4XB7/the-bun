# The Bun 🍞

A collection of web applications built with Node.js, Express, and modern web technologies.

## Projects Included

### 1. 🔗 Messaging App - The Bun
A WhatsApp-like messaging application with real-time chat functionality.

**Features:**
- Real-time messaging with Socket.IO
- User authentication
- Multiple conversations
- Typing indicators
- Responsive design

**Quick Start:**
```bash
npm install
npm start
# Visit http://localhost:3000
```

📖 [Full Documentation](./README.md)

---

### 2. 🌤️ Weather Dashboard
Real-time weather information with forecasts from OpenWeatherMap API.

**Features:**
- Search cities worldwide
- Current weather conditions
- 5-day forecast
- Hourly breakdown
- Geolocation support
- Responsive design

**Quick Start:**
```bash
npm install
# Add your API key to .env
npm start
# Visit http://localhost:3000
```

**Required:** [OpenWeatherMap API Key](https://openweathermap.org/api)

📖 [Full Documentation](./WEATHER_README.md)

---

### 3. 🚫 Ban Tool
Comprehensive moderation system for managing bans and user restrictions.

**Features:**
- Admin authentication with JWT
- Ban management (User, IP, Email, Username)
- Whitelist system
- Ban checking API (public)
- Real-time dashboard
- Ban history tracking
- Temporary & permanent bans

**Quick Start:**
```bash
npm install
# Configure .env with JWT_SECRET
node ban-server.js
# Visit http://localhost:3000
```

📖 [Full Documentation](./BAN_TOOL_README.md)

---

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Real-time**: Socket.IO
- **Database**: SQLite3
- **Authentication**: JWT, bcryptjs
- **API**: OpenWeatherMap (Weather)

## Installation

Each project can run independently:

```bash
git clone https://github.com/A4XB7/the-bun.git
cd the-bun
npm install
```

## Quick Links

| Project | Link | Port |
|---------|------|------|
| Messaging App | `http://localhost:3000` | 3000 |
| Weather Dashboard | `http://localhost:3000` | 3000 |
| Ban Tool | `http://localhost:3000` | 3000 |

## Environment Variables

### Weather Dashboard (.env)
```env
WEATHER_API_KEY=your_openweathermap_api_key
PORT=3000
NODE_ENV=development
```

### Ban Tool (.env)
```env
JWT_SECRET=your_jwt_secret_key
PORT=3000
NODE_ENV=development
```

## Project Structure

```
the-bun/
├── server.js              # Messaging app backend
├── ban-server.js          # Ban tool backend
├── package.json           # Dependencies
├── .env.example           # Environment template
├── .gitignore             # Git ignore rules
├── README.md              # Messaging app docs
├── WEATHER_README.md      # Weather dashboard docs
├── BAN_TOOL_README.md     # Ban tool docs
└── public/
    ├── index.html         # Messaging app UI
    ├── app.js             # Messaging app logic
    ├── style.css          # Messaging app styles
    ├── ban-index.html     # Ban tool UI
    ├── ban-app.js         # Ban tool logic
    ├── ban-style.css      # Ban tool styles
    └── [weather files]    # Weather dashboard files
```

## Features Summary

✨ **Real-time Messaging** - Instant chat with Socket.IO
🌍 **Weather Data** - Live weather from OpenWeatherMap
🚫 **Ban Management** - Complete moderation system
🔐 **Security** - JWT auth & password hashing
📱 **Responsive** - Works on all devices
🎨 **Modern UI** - Beautiful gradient designs
📊 **Dashboards** - Real-time statistics & activity

## Deployment

### Heroku

```bash
# Messaging App
heroku create messaging-app-name
git push heroku main

# Weather Dashboard
heroku create weather-app-name
heroku config:set WEATHER_API_KEY=your_key
git push heroku main

# Ban Tool
heroku create ban-tool-name
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

### Railway / Render
1. Connect GitHub repository
2. Set environment variables in dashboard
3. Deploy automatically

## Usage Examples

### Messaging App
1. Register/Login with username and email
2. Create conversations with contacts
3. Send messages in real-time
4. See typing indicators
5. View message history

### Weather Dashboard
1. Search for a city
2. Get real-time weather data
3. View 5-day forecast
4. Check hourly breakdown
5. Use your current location

### Ban Tool
1. Register as admin
2. Add bans (User, IP, Email, Username)
3. Set permanent or temporary bans
4. Check ban status via API
5. Manage whitelist
6. Track all moderation activity

## API Endpoints

### Messaging App
- `GET /` - Main page
- `POST /api/users/register` - Register user
- `GET /api/users/:username` - Get user info
- `GET /api/messages/:conversationId` - Get messages
- Socket.IO events for real-time messaging

### Weather Dashboard
- `GET /` - Main page
- `GET /api/weather/city/:city` - Get weather by city
- `GET /api/weather/coordinates/:lat/:lon` - Get weather by coordinates
- `GET /api/cities/search/:query` - Search cities

### Ban Tool
- `POST /api/auth/register` - Register admin
- `POST /api/auth/login` - Login admin
- `POST /api/bans` - Create ban
- `GET /api/bans` - Get all bans
- `DELETE /api/bans/:id` - Remove ban
- `POST /api/bans/check` - Check ban status (public)
- `POST /api/whitelist` - Add to whitelist
- `GET /api/whitelist` - Get whitelist

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - Free for personal and commercial use

## Support

For issues or questions:
1. Check project documentation
2. Open a GitHub issue
3. Review error logs

## Author

Built with ❤️ by A4XB7

---

**Start building with The Bun today! 🍞**
