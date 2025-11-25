# AI Builder CLI - Quick Start Guide

## 🚀 One-Command Setup in JupyterLab

Copy and paste this into your JupyterLab terminal:

```bash
# Download and run the quick-start snippet
curl -o- https://raw.githubusercontent.com/digitalproph8/ai-builder-cli/main/quick-start-snippet.js | node
```

Or if you prefer to copy manually:

```bash
# Create the quick-start file
cat > ai-builder-quick.js << 'EOF'
[Paste the quick-start-snippet.js content here]
EOF

# Make it executable and run
chmod +x ai-builder-quick.js
node ai-builder-quick.js
```

## 📋 Available Commands

### Create Projects
```bash
# Express.js API
ai-builder init express-api my-api

# React App
ai-builder init react-app my-app

# Python FastAPI
ai-builder init python-api my-api

# ML Model
ai-builder init ml-model my-model
```

### Build & Deploy
```bash
# Build project
ai-builder build my-api

# Deploy locally
ai-builder deploy my-api local

# Check status
ai-builder status my-api
```

## 🎯 Quick Examples

### 1. Create Express API
```bash
ai-builder init express-api user-service
cd user-service
npm install
npm start
# → http://localhost:3000
```

### 2. Create React App
```bash
ai-builder init react-app dashboard
cd dashboard
npm install
npm start
# → http://localhost:3000
```

### 3. Create Python API
```bash
ai-builder init python-api data-api
cd data-api
pip install -r requirements.txt
python main.py
# → http://localhost:8000
```

### 4. Create ML Model
```bash
ai-builder init ml-model predictor
cd predictor
pip install -r requirements.txt
python model.py
# → Ready for training!
```

## 🔧 Features Included

- ✅ **Auto-installation** - No manual setup required
- ✅ **Multiple Templates** - Express, React, Python, ML
- ✅ **Cross-platform** - Works in any environment
- ✅ **Zero Dependencies** - Runs with just Node.js
- ✅ **Interactive Help** - Built-in command guide
- ✅ **Project Management** - Build, deploy, status

## 📁 Generated Project Structure

### Express API
```
my-api/
├── package.json
└── index.js
```

### React App
```
my-app/
├── package.json
└── src/
    └── App.js
```

### Python API
```
my-api/
├── requirements.txt
└── main.py
```

### ML Model
```
my-model/
├── requirements.txt
└── model.py
```

## 🚀 Integration with JupyterLab

### Use in Notebooks
```python
import subprocess
import json

# Create project from notebook
result = subprocess.run(['node', 'ai-builder-quick.js', 'init', 'express-api', 'notebook-api'], 
                       capture_output=True, text=True)
print(result.stdout)

# Check project status
status = subprocess.run(['node', 'ai-builder-quick.js', 'status', 'notebook-api'], 
                      capture_output=True, text=True)
print(status.stdout)
```

### Use in Terminal
```bash
# All commands work directly in JupyterLab terminal
ai-builder init express-api my-project
ai-builder build my-project
ai-builder deploy my-project local
```

## 🎯 Quick Start Workflow

1. **Create Project**: `ai-builder init express-api my-app`
2. **Navigate**: `cd my-app`
3. **Install**: `npm install` (or `pip install -r requirements.txt`)
4. **Run**: `npm start` (or `python main.py`)
5. **Deploy**: `ai-builder deploy my-app local`

## 📚 Advanced Usage

### Custom Templates
You can extend the CLI with your own templates by modifying the `templates` object in the snippet.

### Environment Variables
```bash
export AI_BUILDER_ENV=development
export AI_BUILDER_PORT=3000
```

### Configuration
The CLI automatically detects your environment and adapts accordingly.

---

**🎉 Ready to use! Just copy the snippet and start building!**
