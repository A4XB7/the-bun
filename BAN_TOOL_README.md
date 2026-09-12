# Ban Tool 🚫

A comprehensive moderation and user management system for enforcing bans, managing whitelists, and tracking moderation activity.

## Features

✨ **Admin Authentication** - Secure login and registration for administrators
🚫 **Ban Management** - Create and manage bans for users, IPs, emails, and usernames
📊 **Real-time Dashboard** - View statistics and recent activity
🔍 **Ban Checking** - Check if a user/IP/email is banned
✅ **Whitelist Management** - Add trusted users to bypass bans
📋 **Ban History** - Track all moderation actions and changes
⏰ **Temporary Bans** - Set expiration dates for bans
🗄️ **SQLite Database** - Persistent storage of all ban data
🔐 **JWT Authentication** - Secure API endpoints
📱 **Responsive UI** - Works on desktop and mobile

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Authentication**: JWT (JSON Web Tokens)
- **Encryption**: bcryptjs for password hashing

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/A4XB7/the-bun.git
cd the-bun
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Create a `.env` file:
```env
JWT_SECRET=your_secret_key_here
PORT=3000
NODE_ENV=development
```

### 4. Start the Server
```bash
node ban-server.js
```

Or for development with auto-reload:
```bash
npm run dev
```

### 5. Open in Browser
Navigate to: `http://localhost:3000`

## Usage

### Admin Registration & Login

1. **Register**: Create a new admin account with username, email, and password
2. **Login**: Use credentials to access the dashboard
3. **Logout**: Safely logout and clear session

### Managing Bans

#### Add a Ban
1. Navigate to "Add Ban" tab
2. Select ban type:
   - **User ID** - Ban specific user accounts
   - **IP Address** - Ban IP addresses
   - **Email** - Ban email addresses
   - **Username** - Ban usernames
3. Enter target value
4. Add reason (optional)
5. Set expiration (optional - leave empty for permanent)
6. Click "Ban"

#### View Bans
1. Go to "Active Bans" tab
2. Filter by type or status
3. Search for specific targets
4. View ban details or remove bans

#### Check Ban Status
1. Navigate to "Check Ban" tab
2. Select type and enter value
3. Get instant feedback if banned
4. See ban details if banned

### Whitelist Management

#### Add to Whitelist
1. Go to "Whitelist" tab
2. Enter type, target, and reason
3. Click "Add to Whitelist"

#### Remove from Whitelist
1. View whitelist entries
2. Click "Remove" button on desired entry

### Dashboard Overview

**Statistics Cards:**
- Total Bans - All-time ban count
- Active Bans - Currently active bans
- User Bans - Specific user bans
- IP Bans - IP address bans

**Recent Activity:**
- Latest ban actions
- Quick status overview

## API Endpoints

### Authentication

**Register Admin**
```
POST /api/auth/register
Body: { username, email, password }
```

**Login Admin**
```
POST /api/auth/login
Body: { username, password }
Returns: { token, user }
```

### Ban Management

**Create Ban**
```
POST /api/bans
Headers: Authorization: Bearer <token>
Body: { type, target, reason, expiresAt }
```

**Get All Bans**
```
GET /api/bans?type=user&status=active
Headers: Authorization: Bearer <token>
```

**Get Ban Details**
```
GET /api/bans/:id
Headers: Authorization: Bearer <token>
```

**Update Ban**
```
PUT /api/bans/:id
Headers: Authorization: Bearer <token>
Body: { reason, expiresAt }
```

**Remove Ban**
```
DELETE /api/bans/:id
Headers: Authorization: Bearer <token>
```

**Check Ban Status** (Public)
```
POST /api/bans/check
Body: { type, target }
```

### Whitelist

**Add to Whitelist**
```
POST /api/whitelist
Headers: Authorization: Bearer <token>
Body: { type, target, reason }
```

**Get Whitelist**
```
GET /api/whitelist
Headers: Authorization: Bearer <token>
```

**Remove from Whitelist**
```
DELETE /api/whitelist/:id
Headers: Authorization: Bearer <token>
```

### Statistics

**Get Stats**
```
GET /api/stats
Headers: Authorization: Bearer <token>
```

## Ban Types

- **user** - User account IDs (e.g., `user123`, `12345`)
- **ip** - IP addresses (e.g., `192.168.1.1`, `203.0.113.45`)
- **email** - Email addresses (e.g., `user@example.com`)
- **username** - Usernames (e.g., `john_doe`, `admin123`)

## Database Schema

### Admins Table
```sql
CREATE TABLE admins (
  id INTEGER PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Bans Table
```sql
CREATE TABLE bans (
  id INTEGER PRIMARY KEY,
  type TEXT NOT NULL,
  target TEXT NOT NULL,
  reason TEXT,
  banned_by TEXT,
  banned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME,
  status TEXT DEFAULT 'active',
  UNIQUE(type, target)
)
```

### Whitelist Table
```sql
CREATE TABLE whitelist (
  id INTEGER PRIMARY KEY,
  type TEXT NOT NULL,
  target TEXT NOT NULL,
  reason TEXT,
  added_by TEXT,
  added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(type, target)
)
```

### Ban History Table
```sql
CREATE TABLE ban_history (
  id INTEGER PRIMARY KEY,
  ban_id INTEGER,
  action TEXT,
  performed_by TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## Features Details

### Permanent & Temporary Bans
- Leave expiration blank for permanent bans
- Set a date/time for temporary bans
- System automatically handles expired bans

### Admin Audit Trail
- Track who banned whom
- Timestamp all actions
- View complete ban history

### Public Ban Checking
- `/api/bans/check` endpoint works without authentication
- Allows 3rd party services to verify bans
- Integrates with your application

### Whitelist Bypass
- Whitelisted entries cannot be banned
- Useful for trusted users/IPs
- Separate from ban records

## Security Features

🔐 **Password Hashing** - bcryptjs with salt rounds
🔑 **JWT Tokens** - Secure token-based authentication
📋 **Input Validation** - Server-side data validation
🛡️ **Error Handling** - Secure error messages
🔒 **Database Constraints** - Unique constraints prevent duplicates

## Deployment

### Deploy to Heroku
```bash
heroku login
heroku create ban-tool-app
git push heroku main
heroku config:set JWT_SECRET=your_secret_key
```

### Deploy to Railway/Render
1. Connect GitHub repository
2. Set environment variables
3. Deploy with one click

## Configuration

### Environment Variables
- `JWT_SECRET` - Secret key for JWT signing (required)
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

### Security Tips
- Use a strong JWT_SECRET in production
- Change default passwords frequently
- Review ban logs regularly
- Use HTTPS in production
- Implement rate limiting for API

## Future Enhancements

- [ ] Appeal system for banned users
- [ ] Email notifications for admins
- [ ] Ban templates for common reasons
- [ ] Bulk ban/unban operations
- [ ] Advanced filtering and search
- [ ] Detailed analytics and reports
- [ ] Ban reason categories
- [ ] Multi-admin permission levels
- [ ] Two-factor authentication
- [ ] IP range banning
- [ ] Automatic ban based on patterns
- [ ] Integration with Discord/Slack

## Troubleshooting

### "Cannot find module 'sqlite3'"
```bash
npm install sqlite3
```

### "Database error"
- Ensure the database file path is correct
- Check file permissions
- Try deleting `bans.db` to recreate

### "Invalid token"
- Token may be expired (24-hour expiry)
- Login again to get a new token
- Check token is passed in Authorization header

### CORS Errors
- Ensure CORS middleware is enabled
- Check origin is allowed

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push and open a Pull Request

## License

MIT License - Use freely for personal and commercial projects.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Open an issue on GitHub
3. Contact the maintainers

---

**Made with ❤️ for community moderation**
