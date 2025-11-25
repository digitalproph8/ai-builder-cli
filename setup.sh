#!/bin/bash

# AI Builder CLI Auto-Installer
# Automatically detects and installs all dependencies

set -e

echo "🚀 AI Builder CLI Auto-Installer"
echo "=================================="

# Function to detect OS
detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "linux"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macos"
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
        echo "windows"
    else
        echo "unknown"
    fi
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to install Node.js
install_nodejs() {
    echo "📦 Installing Node.js..."
    
    OS=$(detect_os)
    
    case $OS in
        "linux")
            # Try NVM first
            if command_exists curl; then
                echo "🔄 Installing via NVM..."
                curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
                export NVM_DIR="$HOME/.nvm"
                [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
                nvm install 18
                nvm use 18
            else
                echo "❌ curl not found, trying direct download..."
                cd ~
                wget https://nodejs.org/dist/v18.18.0/node-v18.18.0-linux-x64.tar.xz
                tar -xf node-v18.18.0-linux-x64.tar.xz
                mv node-v18.18.0-linux-x64 node
                echo 'export PATH=~/node/bin:$PATH' >> ~/.bashrc
                export PATH=~/node/bin:$PATH
            fi
            ;;
        "macos")
            if command_exists brew; then
                echo "🔄 Installing via Homebrew..."
                brew install node
            else
                echo "🔄 Installing via NVM..."
                curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
                export NVM_DIR="$HOME/.nvm"
                [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
                nvm install 18
                nvm use 18
            fi
            ;;
        "windows")
            echo "🔄 Please download and install Node.js from https://nodejs.org"
            echo "🔄 Then run this script again"
            exit 1
            ;;
        *)
            echo "❌ Unsupported OS: $OS"
            exit 1
            ;;
    esac
}

# Function to install Python dependencies
install_python_deps() {
    echo "🐍 Installing Python dependencies..."
    
    if command_exists pip; then
        echo "📦 Installing Python packages..."
        pip install subprocess32
        pip install nodeenv
        pip install requests
        pip install websockets
    else
        echo "❌ pip not found"
    fi
}

# Function to setup project
setup_project() {
    echo "🔧 Setting up AI Builder CLI..."
    
    # Create package.json if it doesn't exist
    if [ ! -f "package.json" ]; then
        echo "📝 Creating package.json..."
        cat > package.json << 'EOF'
{
  "name": "ai-builder-cli",
  "version": "1.0.0",
  "description": "AI Builder CLI with auto-deployment, database integration, and chat capabilities",
  "main": "lib/index.js",
  "bin": {
    "ai-builder": "./bin/ai-builder"
  },
  "scripts": {
    "start": "node lib/index.js",
    "build": "tsc",
    "dev": "ts-node src/index.ts",
    "test": "jest",
    "install:all": "npm install && npm run build",
    "setup": "./setup.sh"
  },
  "dependencies": {
    "commander": "^9.4.1",
    "inquirer": "^9.1.4",
    "chalk": "^5.2.0",
    "ws": "^8.11.0",
    "crypto": "^1.0.1",
    "fs-extra": "^11.1.0",
    "axios": "^1.3.4"
  },
  "devDependencies": {
    "typescript": "^4.9.5",
    "@types/node": "^18.14.6",
    "@types/ws": "^8.5.4",
    "@types/inquirer": "^9.0.3",
    "@types/fs-extra": "^9.0.13",
    "jest": "^29.4.3",
    "@types/jest": "^29.4.0",
    "ts-node": "^10.9.1"
  }
}
EOF
    fi
    
    # Create tsconfig.json if it doesn't exist
    if [ ! -f "tsconfig.json" ]; then
        echo "📝 Creating tsconfig.json..."
        cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "es2020",
    "lib": ["es2020"],
    "module": "commonjs",
    "declaration": true,
    "outDir": "./lib",
    "rootDir": "./src",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "moduleResolution": "node",
    "baseUrl": ".",
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "lib", "tests"]
}
EOF
    fi
    
    # Create executable script
    if [ ! -d "bin" ]; then
        mkdir -p bin
    fi
    
    echo "📝 Creating executable script..."
    cat > bin/ai-builder << 'EOF'
#!/usr/bin/env node
require('../lib/index.js');
EOF
    
    chmod +x bin/ai-builder
}

# Function to install Node.js dependencies
install_node_deps() {
    echo "📦 Installing Node.js dependencies..."
    
    if command_exists npm; then
        npm install
    else
        echo "❌ npm not found, installing Node.js first..."
        install_nodejs
        npm install
    fi
}

# Function to build the project
build_project() {
    echo "🔨 Building the project..."
    
    if command_exists npm; then
        npm run build
    else
        echo "❌ npm not found"
        exit 1
    fi
}

# Function to verify installation
verify_installation() {
    echo "✅ Verifying installation..."
    
    if command_exists node; then
        echo "✅ Node.js: $(node --version)"
    else
        echo "❌ Node.js not found"
        exit 1
    fi
    
    if command_exists npm; then
        echo "✅ npm: $(npm --version)"
    else
        echo "❌ npm not found"
        exit 1
    fi
    
    if [ -f "lib/index.js" ]; then
        echo "✅ Project built successfully"
    else
        echo "❌ Project not built"
        exit 1
    fi
}

# Function to run the CLI
run_cli() {
    echo "🚀 Starting AI Builder CLI..."
    npm start
}

# Main installation flow
main() {
    echo "🔍 Detecting environment..."
    
    # Check if Node.js is installed
    if ! command_exists node; then
        echo "❌ Node.js not found, installing..."
        install_nodejs
    else
        echo "✅ Node.js found: $(node --version)"
    fi
    
    # Check if npm is installed
    if ! command_exists npm; then
        echo "❌ npm not found"
        exit 1
    else
        echo "✅ npm found: $(npm --version)"
    fi
    
    # Setup project files
    setup_project
    
    # Install dependencies
    install_node_deps
    install_python_deps
    
    # Build project
    build_project
    
    # Verify installation
    verify_installation
    
    echo ""
    echo "🎉 AI Builder CLI installed successfully!"
    echo ""
    echo "📋 Available commands:"
    echo "  npm start          - Run the CLI"
    echo "  npm run dev        - Run in development mode"
    echo "  npm test           - Run tests"
    echo "  npm run build      - Build the project"
    echo ""
    echo "🚀 To start the CLI now, run: npm start"
    echo ""
    
    # Ask if user wants to start the CLI
    read -p "🚀 Do you want to start the AI Builder CLI now? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        run_cli
    fi
}

# Run main function
main
