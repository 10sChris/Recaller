# Recaller

A Flask web application that lets users search FDA recall data across food, drugs, and cosmetics — and, powered by Google Gemini, suggests safer alternative products when an item has been recalled.

## Overview

Product recalls are hard to track and even harder to act on. FDA Recaller pulls live recall data from the openFDA API so users can quickly search for a food, drug, or cosmetic item, see exactly why it was recalled, and get AI-generated suggestions for safer alternatives via the Gemini API.

## Features

- 🔍 **Search across categories** — look up recalls for food, drugs, and cosmetics in one place
- 📋 **Recall details** — view the specific reason each item was recalled
- 🤖 **AI-powered alternatives** — Gemini API suggests safer alternative products based on recall results
- 🌐 **Web-based interface** — built with Flask and server-rendered templates for a fast, simple experience
- **Database** - Database built with SQL to save items of interest on carts page

## Tech Stack

- **Backend:** Python, Flask
- **Templating:** Jinja2
- **Frontend:** HTML, CSS, JavaScript
- **APIs:**
  - [openFDA API](https://open.fda.gov/apis/) — food, drug, and cosmetic recall data
  - [Google Gemini API](https://ai.google.dev/) — alternative product suggestions
- **Deployment:** PythonAnywhere
- **Version Control:** Git / GitHub

## Getting Started

### Prerequisites

- Python 3.x
- pip

### Installation

1. Clone the repository
   \`\`\`bash
   git clone https://github.com/your-username/fda-recaller.git
   cd fda-recaller
   \`\`\`

2. (Optional but recommended) Create and activate a virtual environment
   \`\`\`bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   \`\`\`

3. Install dependencies
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`

4. Run the app
   \`\`\`bash
   flask run
   \`\`\`

5. Open your browser to \`http://127.0.0.1:5000\`

## How It Works

1. A user searches for a food, drug, or cosmetic item by name.
2. The app queries the openFDA API and returns any matching recall records, including the recall reason.
3. If a recall is found, the Gemini API is used to generate suggestions for safer alternative products.
4. Results are rendered back to the user through the Flask/Jinja2 templates.
5. Users can add different items to cart through database feature. 

## Deployment

This app is deployed on [PythonAnywhere](https://www.pythonanywhere.com/). Live demo link: *add your PythonAnywhere URL here*

## Contributors

- Angel Rodriguez
- Haithem Salmi
- Christopher Hernandez
- Laali Nembot

## License

This project is for educational purposes.
