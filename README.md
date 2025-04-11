# AI Code Generator

A full-stack application that generates HTML code from natural language descriptions and provides live previews.

![App Screenshot](./screenshot.png)

## Features

- Natural language to HTML code generation
- Syntax highlighted code viewer
- Interactive web preview
- Expandable/collapsible sections
- Professional UI design

## Technologies

- **Frontend**: React, React Syntax Highlighter, Axios
- **Backend**: Python (FastAPI)
- **Styling**: CSS with modern design system

## Installation

### Prerequisites

- Node.js (v16+) for frontend
- Python (3.8+) for backend

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```
2. Create virtual environment:
   ```bash
   python -m venv venv
   ```
3. Activate virtual environment:
   ```bash
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate     # Windows
   ```
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Start backend server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm start
   ```

## Usage

1. Open the app in your browser (http://localhost:3000)
2. Describe the HTML component you want to generate
3. View the generated code and live preview
4. Expand sections as needed

## Configuration

### Environment Variables

Backend (`.env`):
```
API_KEY=your_openai_key
```

Frontend (`.env`):
```
REACT_APP_API_URL=http://localhost:8000
```

## Project Structure

```
project/
├── backend/               # Python backend
│   ├── main.py           # FastAPI server
│   └── requirements.txt  # Python dependencies
└── frontend/             # React frontend
    ├── public/           # Static files
    └── src/              # Source code
```

## License

MIT
# CodeGenerator-V1
