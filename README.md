# AgriLoop 2.0 🌾♻️

**AI-Powered Circular Economy Marketplace for Sustainable Agriculture**

AgriLoop 2.0 is a comprehensive web platform designed to transform agricultural waste from a liability (pollution source) into a monetizable asset. By connecting farmers, households, and industrial buyers, we facilitate the trade of biomass and organic waste while providing AI-driven agricultural intelligence.

---

## 🚀 Key Features

### 1. 🤖 AI Waste Value Analyzer 2.0
*   **Instant Analysis**: Farmers scan crop residue (stubble) using the camera.
*   **Gemini 2.5 Integration**: Identifies residue type, estimates **Moisture Content**, **Purity Score**, and **Market Price (₹)**.
*   **Carbon Impact**: Auto-calculates CO₂ emissions prevented by not burning the stubble.

### 2. 🛒 Digital Biomass Marketplace
*   **Listings**: Farmers list waste with quantity and location.
*   **Bidding System**: Buyers (Industry/Biogas plants) place bids on listings.
*   **Order Management**: Status tracking from "Open" to "Pending Pickup" to "Completed".

### 3. 🚜 AI Agricultural Planner
*   **Yield Calculator**: Inputs land dimensions (Length/Breadth) and crop type.
*   **Revenue Estimation**: Uses AI to predict earnings based on specific **Indian State Mandi Prices**.
*   **Optimization**: Suggests optimal crop spacing and soil requirements.

### 4. 🌍 Interactive Geo-Map Intelligence
*   **Satellite View**: Google Maps integration with 3D Tilt (Earth style).
*   **Data Visualization**: Interactive markers for Indian states (Punjab, Haryana, UP, etc.).
*   **District Insights**: Clicking a location reveals soil types, dominant crops, and residue availability.

### 5. 🎓 Farmer Learning Hub
*   **Input Scanner**: Scan Soil, Fertilizers, or Crops.
*   **AI Tutor**: Provides instant summaries, health scores, and actionable farming tips in simple language.

### 6. 🏠 Household & Biogas Integration
*   **Waste Segregation**: Households categorize waste as **Degradable** (for Biogas) or **Non-Degradable**.
*   **Procurement Dashboard**: Biogas companies can locate and collect organic waste sources efficiently.

### 7. 🏆 Gamification & Rewards
*   **Carbon Points**: Users earn points for sustainable actions (recycling/selling waste).
*   **Visual Dashboard**: Tracks CO₂ savings and financial earnings with interactive charts.

---

## 🛠️ Technology Stack

*   **Frontend**: React 19 (TypeScript)
*   **Styling**: Tailwind CSS
*   **AI Model**: Google Gemini 2.5 Flash (`@google/genai` SDK)
*   **Maps**: Google Maps JavaScript API (Satellite/3D View)
*   **Visualization**: Recharts (Data charts), Lucide React (Icons)
*   **Build Tool**: Vite (Recommended for local dev)

---

## ⚙️ Setup & Installation

### Prerequisites
*   Node.js (v18+)
*   Google Cloud API Key with access to:
    *   Generative Language API (Gemini)
    *   Maps JavaScript API

### Installation Steps

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/agriloop-2.0.git
    cd agriloop-2.0
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root directory:
    ```env
    # API Key for both Gemini and Google Maps
    API_KEY=your_google_api_key_here
    ```

4.  **Run the Development Server (Open the Website Locally)**

    **Step 1 – Open a terminal in the project folder**
    - Make sure your terminal path is the folder that contains `package.json` (for example: `.../agriloop-2.0 (3)`)
    - You can confirm with:
      ```bash
      pwd   # or 'cd' on Windows PowerShell to show current folder
      ```

    **Step 2 – Start the Vite dev server**
    ```bash
    npm run dev
    ```

    **Step 3 – Open the site in your browser**
    - After the command starts, you will see a line like:
      ```
      Local:   http://localhost:5173/
      ```
    - Press **Ctrl + click** on that URL in the terminal, or copy–paste it into Chrome/Edge.

    If you see `Missing script: "dev"` or `Missing script: "start"`, you are probably in the wrong folder. Go back to the folder that has `package.json` with:
    ```bash
    cd path/to/agriloop-2.0 (3)
    npm run dev
    ```

---

## 📂 Project Structure

```
AgriLoop-2.0/
├── components/           # Reusable UI Components
│   ├── Common/           # Buttons, Animations, Cursor
│   ├── ScanWaste/        # Camera & Scanning Logic
│   └── ...               # Feature-specific components
├── screens/              # Main Page Views
│   ├── LoginScreen.tsx          # Landing Page & Role Selection
│   ├── Dashboard.tsx            # Stats & Charts
│   ├── Marketplace.tsx          # Buying/Selling Logic
│   ├── GeoMapScreen.tsx         # 3D Map Intelligence
│   ├── FarmingGuide.tsx         # Yield Calculator
│   ├── LearningHub.tsx          # Crop/Soil Analysis
│   └── ...
├── services/             # API Integrations
│   └── geminiService.ts  # Google Gemini AI Logic
├── utils/                # Helpers & Types
│   ├── ai/               # AI Prompts & Schemas
│   └── types.ts          # TypeScript Interfaces
├── App.tsx               # Main Routing & State
└── index.html            # Entry point
```

---

## 🎮 Usage Guide

1.  **Landing Page**: Scroll down to explore the "Product Showcase".
2.  **Select Role**:
    *   **Farmer**: Access Dashboard, Marketplace, Planner, Learning Hub.
    *   **Buyer**: Browse listings, place bids.
    *   **Geo-Map**: Explore agricultural data on the 3D map.
    *   **Household**: Submit organic waste.
    *   **Biogas**: Collect household waste.
3.  **Tools (No Login Required)**:
    *   **Fertilizer Guide**: Click the card on the login screen to compare natural vs. chemical fertilizers.
    *   **Farm Planner**: Quick access via the teal card on the login screen.

---

## 🌟 Hackathon Highlights
*   **Visuals**: Custom "Target" cursor, Parallax scrolling, Glassmorphism UI.
*   **Real-world Tech**: Live integration with Google Gemini for image recognition and reasoning.
*   **Sustainability**: Direct calculation of Carbon Footprint reduction.
