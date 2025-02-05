# QuickResume - Professional Resume Builder

QuickResume is a modern web application that helps users create professional resumes with AI-powered suggestions, multiple templates, and real-time preview.

## Features

-  Multiple professional templates
-  AI-powered content suggestions
-  Responsive design
-  Dark/Light mode
-  Auto-save functionality
-  PDF export
-  ATS optimization tips
-  User authentication
-  Resume analytics

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- npm (comes with Node.js)

## Setup Instructions

1. Clone the repository:

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Firebase:
   - Create a new project in [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password and Google Sign-in)
   - Create a Firestore database
   - Replace the Firebase configuration in `js/firebaseConfig.js`:
     ```javascript
     const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_AUTH_DOMAIN",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_STORAGE_BUCKET",
       messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
       appId: "YOUR_APP_ID",
       measurementId: "YOUR_MEASUREMENT_ID"
     };
     ```

4. Configure OpenAI API:
   - Get an API key from [OpenAI](https://platform.openai.com/)
   - Replace the API key in `js/ai/config.js`:
     ```javascript
     export const AI_CONFIG = {
       apiKey: 'YOUR_OPENAI_API_KEY',
       // ... other config options
     };
     ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
quickresume/
├── css/                  # Stylesheets
├── js/                   # JavaScript modules
│   ├── ai/              # AI-related functionality
│   ├── analyzer/        # Resume analysis
│   ├── auth/            # Authentication
│   ├── editor/          # Rich text editor
│   └── services/        # Various services
├── index.html           # Landing page
├── builder.html         # Resume builder
├── dashboard.html       # User dashboard
├── login.html           # Login page
└── signup.html          # Signup page
```

## Security Considerations

1. **Firebase Configuration**: 
   - Never commit real Firebase credentials to version control
   - Use environment variables in production
   - Restrict Firebase Security Rules appropriately

2. **OpenAI API Key**:
   - Keep your API key secure
   - Implement rate limiting
   - Use environment variables in production

3. **Authentication**:
   - Enable only necessary authentication providers
   - Set up proper security rules in Firebase
   - Implement proper session management

## Support

For support, email naveensathya1830@gmail.com.

## Acknowledgments

- [OpenAI](https://openai.com/) for AI capabilities
- [Firebase](https://firebase.google.com/) for backend services
- [Font Awesome](https://fontawesome.com/) for icons
- [TinyMCE](https://www.tiny.cloud/) for rich text editing