# The F1 Legends Garage 🏁

A highly interactive, web-based 3D educational experience featuring iconic McLaren Formula 1 cars. Users can explore different F1 eras, view exploded chassis components, and converse with an AI-powered subject matter expert.

## Features ✨

*   **Interactive 3D Stage**: Built with React, Three.js, and React-Three-Fiber. Explore the cars with full 360-degree orbit controls.
*   **Dynamic Exploded Views**: Toggle the "Explode View" to see internal mechanisms. Uses precise GSAP mathematical interpolation to smoothly separate components (wheels, wings, engine) along their respective axes.
*   **The Garage Carousel**: Instantly switch between four legendary McLaren chassis:
    *   **1988 MP4/4** (Analog, dangerous, dominant)
    *   **1998 MP4/13** (Narrow-track, V10)
    *   **2008 MP4-23** (Complex aero-war era)
    *   **2024 MCL38** (Modern ground-effect hybrid)
*   **Mac - The AI Mechanic**: A highly knowledgeable, pragmatic, and slightly grease-stained "virtual mechanic" powered by Google's Gemini LLM. The AI dynamically knows which car you are looking at and whether you have it exploded or assembled.
*   **Rich Aesthetics**: Deep dark-mode theme utilizing glassmorphic UI elements and high-definition PBR environment maps.

## Tech Stack 🛠️

*   **Frontend**: React (via Vite)
*   **Styling**: Vanilla CSS (CSS Variables, Flexbox, Glassmorphism)
*   **3D UI Integration**: `@react-three/fiber` & `@react-three/drei`
*   **3D Animations**: `gsap` (GreenSock)
*   **Backend Server**: Node.js & Express
*   **AI Integration**: `@google/genai` (Gemini 2.5 Flash)

## Getting Started 🚀

### Prerequisites
*   Node.js (LTS recommended)
*   A [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### Installation
1.  Clone the repository:
    ```bash
    git clone https://github.com/ivanramirez609/F1-Garage.git
    cd F1-Garage
    ```
2.  Install all project dependencies:
    ```bash
    npm install
    ```
3.  Set up your AI credentials:
    *   Rename the `.env.example` file in the root directory to `.env`
    *   Add your Gemini API key:
        ```env
        GEMINI_API_KEY=your_real_api_key_here
        ```

### Running the Application

This project requires both the Frontend (Vite) and Backend (Express) servers to be running simultaneously.

1.  **Start the AI Backend:**
    Open a terminal and run:
    ```bash
    node server.js
    ```
    *(The backend will start on http://localhost:3001)*

2.  **Start the Frontend:**
    Open a second terminal and run:
    ```bash
    npm run dev
    ```
    *(The frontend will be available at http://localhost:5173/)*

## Notes on 3D Assets 🏎️
Currently, the application uses dynamically styled, mathematically animated **primitive components (boxes/cylinders)** as proxy placeholders to prove out the complex animation logic. 

These can be trivially replaced with fully-textured, separated `.glb`/`.gltf` meshes by dropping them into the `/public/models` directory and updating the `CarModel.jsx` asset references. The application's core logic is already structurally rigged to handle mesh traversal.
