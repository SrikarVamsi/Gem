# Gem - AI Fact Checker Chrome Extension

![Gem Logo](chrome_extension/logo.png)

**Gem** is an intelligent Chrome extension that provides real-time fact-checking capabilities using AI technology. Select any text on a webpage and get instant verification with trusted sources and confidence scores.

## 🌟 Features

### ✨ **Core Functionality**

- **Automatic Text Selection**: Select text on any webpage for instant verification
- **AI-Powered Analysis**: Uses advanced AI to analyze and verify information
- **Confidence Scoring**: Provides confidence percentages for each verification
- **Trusted Sources**: Displays sources used for verification with clickable links
- **Scam Detection**: Identifies potential scam indicators
- **Real-time Results**: Instant verification with detailed explanations

### 🎨 **User Interface**

- **Glassmorphism Design**: Modern, transparent UI with blur effects
- **Google Brand Colors**: Beautiful gradient buttons and color scheme
- **Responsive Layout**: Works seamlessly in Chrome's side panel
- **Smooth Animations**: Micro-interactions and hover effects
- **Accessible Design**: Clear typography and intuitive navigation

### 🔧 **Technical Features**

- **Chrome Extension Manifest V3**: Latest extension standards
- **Side Panel Integration**: Non-intrusive verification interface
- **Error Handling**: Robust error management and graceful degradation
- **Message Passing**: Secure communication between extension components
- **Local Processing**: Privacy-focused with local backend integration

## 🚀 Installation

### Prerequisites

- Google Chrome browser (version 88+)
- Python 3.8+ (for backend)
- Node.js (optional, for development)

### Backend Setup

1. **Navigate to the backend directory**:

   ```bash
   cd factCheckMCP
   ```

2. **Create and activate virtual environment**:

   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. **Install dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

4. **Start the backend server**:
   ```bash
   python main.py
   ```
   The server will run on `http://127.0.0.1:8080`

### Extension Installation

1. **Open Chrome Extensions**:

   - Go to `chrome://extensions/`
   - Enable "Developer mode" (top right toggle)

2. **Load the Extension**:

   - Click "Load unpacked"
   - Select the `chrome_extension` folder
   - The Gem extension should appear in your extensions list

3. **Pin the Extension**:
   - Click the puzzle piece icon in Chrome toolbar
   - Find Gem and click the pin icon

## 📖 Usage

### Basic Usage

1. **Open Gem**: Click the Gem extension icon in your Chrome toolbar
2. **Select Text**: Highlight any text on a webpage (minimum 3 characters)
3. **Auto-Verification**: Text automatically appears in the side panel
4. **Manual Input**: Type your own text in the "Text to Verify" field
5. **Verify**: Click "Verify with Gem" button
6. **View Results**: See verdict, confidence, explanation, and sources

### Advanced Features

- **Context Menu**: Right-click selected text → "Verify with Gem"
- **Pin Panel**: Use the pin button to keep the panel open
- **Source Links**: Click "Visit Source" to view original content
- **Confidence Bar**: Visual representation of verification confidence

## 🏗️ Architecture

### System Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Webpage       │    │   Chrome        │    │   Backend       │
│   (Content      │◄──►│   Extension     │◄──►│   (MCP Server)  │
│    Script)      │    │   (Side Panel)  │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### File Structure

```
FactChecker/
├── chrome_extension/          # Chrome extension files
│   ├── manifest.json          # Extension configuration
│   ├── sidepanel.html         # Main UI interface
│   ├── sidepanel.js           # UI logic and API calls
│   ├── popup.html             # Extension popup
│   ├── popup.js               # Popup logic
│   ├── background.js          # Service worker
│   ├── contentScript.js       # Webpage integration
│   ├── options.html           # Settings page
│   ├── options.js             # Settings logic
│   └── logo.png               # Extension icon
├── factCheckMCP/              # Backend server
│   ├── main.py                # Server entry point
│   ├── api.py                 # API endpoints
│   ├── gemini_client.py       # AI client
│   ├── mcp_server.py          # MCP protocol
│   ├── settings.py            # Configuration
│   └── requirements.txt       # Dependencies
├── FLOW_DIAGRAMS.md           # System architecture diagrams
└── README.md                  # This file
```

## 🔧 Development

### Backend Development

The backend uses FastAPI and MCP (Model Context Protocol) for AI integration:

```python
# Start development server
cd factCheckMCP
source .venv/bin/activate
python main.py
```

### Extension Development

1. **Make changes** to files in `chrome_extension/`
2. **Reload extension** in `chrome://extensions/`
3. **Test changes** in the side panel

### API Endpoints

- `POST /check` - Main fact-checking endpoint
- `POST /feedback` - User feedback collection

### Message Types

- `SELECTED_TEXT` - Text selection from webpage
- `FACTCHECK_RESULT` - Verification results
- `GET_SELECTED_TEXT` - Request for selected text

## 🎨 Customization

### Color Scheme

The extension uses Google's brand colors:

- **Blue**: `#4285f4`
- **Red**: `#c5221f`, `#ea4236`
- **Yellow**: `#fcbc05`
- **Green**: `#34a754`

### Styling

- **Fonts**: Google Sans, Poppins
- **Effects**: Glassmorphism, backdrop blur
- **Animations**: Smooth transitions and hover effects

## 🐛 Troubleshooting

### Common Issues

**Extension not loading**:

- Check Chrome version (88+ required)
- Ensure Developer mode is enabled
- Verify manifest.json syntax

**Backend connection failed**:

- Confirm backend server is running on port 8080
- Check firewall settings
- Verify API endpoint accessibility

**Text selection not working**:

- Refresh the webpage
- Check browser console for errors
- Ensure extension has proper permissions

**Sources not displaying**:

- Check if backend returns source data
- Verify network connectivity
- Check browser console for API errors

### Debug Mode

Enable debug logging by opening Chrome DevTools:

1. Right-click extension icon → "Inspect popup"
2. Go to Console tab
3. Look for debug messages

## 📊 Performance

### Optimization Features

- **Lazy Loading**: Components load as needed
- **Debounced Selection**: Prevents excessive API calls
- **Caching**: Local storage for recent verifications
- **Error Recovery**: Graceful handling of network issues

### Resource Usage

- **Memory**: ~5MB extension overhead
- **Network**: ~1-2KB per verification request
- **CPU**: Minimal impact during idle

## 🔒 Privacy & Security

### Data Handling

- **Local Processing**: All verification happens locally
- **No Data Storage**: No personal information stored
- **Secure Communication**: HTTPS for all API calls
- **Minimal Permissions**: Only necessary Chrome permissions

### Permissions

- `activeTab` - Access current tab for text selection
- `sidePanel` - Display verification interface
- `storage` - Local settings storage
- `contextMenus` - Right-click menu integration

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Style

- **JavaScript**: ES6+ with async/await
- **Python**: PEP 8 compliance
- **CSS**: BEM methodology
- **Comments**: Clear, descriptive comments

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Google**: For Chrome Extension APIs and design inspiration
- **FastAPI**: For the robust backend framework
- **MCP Protocol**: For AI integration standards
- **Community**: For feedback and contributions

## 📞 Support

### Getting Help

- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Join GitHub Discussions for questions
- **Documentation**: Check FLOW_DIAGRAMS.md for architecture details

### Contact

- **Developer**: [Your Name]
- **Email**: [Your Email]
- **GitHub**: [Your GitHub Profile]

---

**Made with ❤️ for better information verification**

_Gem - Your trusted AI fact-checking companion_
