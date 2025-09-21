#!/bin/bash

echo "🚀 Setting up Gem Fact Checker..."

# Activate conda environment
echo "📦 Activating conda environment 'gem'..."
conda activate gem

# Install backend dependencies
echo "📥 Installing backend dependencies..."
cd factCheckMCP
pip install -r requirements.txt

# Install frontend dependencies
echo "📥 Installing frontend dependencies..."
cd ..
pip install -r requirements.txt

echo "✅ Setup complete!"
echo ""
echo "🎯 To run your prototype:"
echo ""
echo "1. Start the backend (in one terminal):"
echo "   cd factCheckMCP"
echo "   python main.py"
echo ""
echo "2. Start the frontend (in another terminal):"
echo "   streamlit run app.py"
echo ""
echo "3. Open browser to: http://localhost:8501"
echo ""
echo "💎 Your Gem prototype is ready!"
