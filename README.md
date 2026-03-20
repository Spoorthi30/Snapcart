# 🛒 Snapcart - Full Stack AI-Powered Grocery Delivery

Snapcart is a cutting-edge, full-stack grocery delivery platform built with the latest web technologies. It features real-time logistics, an intelligent AI communication layer, and a seamless user experience powered by modern animations.

## 🚀 Tech Stack

- **Frontend:** Next.js 16 (App Router), Tailwind CSS, Framer Motion
- **Backend:** Node.js, Socket.io (Real-time events)
- **Database:** MongoDB with Mongoose
- **Authentication:** NextAuth.js
- **Maps & Tracking:** Leaflet / Google Maps API for Live Tracking
- **AI Integration:** Advanced AI Chat System (User ↔ Delivery Partner)

---

## ✨ Key Features

### 🗺️ Live Order Tracking
Real-time map integration that allows users to track their delivery partner's location from the store to their doorstep using **Socket.io** for low-latency updates.

### 🤖 AI-Powered Chat System
An advanced communication bridge between the User and the Delivery Partner. 
- **Smart Suggestions:** AI suggests quick replies based on the chat context.
- **Auto-Translation:** Real-time translation for diverse delivery teams.
- **Sentiment Analysis:** Ensures professional communication.

### 🔐 Secure Authentication
Robust user and partner authentication using **NextAuth**, supporting Social Logins and secure JWT-based sessions.

### 🎭 Fluid User Interface
A premium feel achieved through **Framer Motion** animations, including staggered list entries, smooth page transitions, and interactive gesture-based components.

---

## 🛠️ Installation & Setup

1. **Clone the repository:**
   git clone [https://github.com/Spoorthi30/Snapcart.git](https://github.com/Spoorthi30/Snapcart.git)

2. **Install dependencies:**
   # For the Next.js Frontend
   cd snapcart
   npm install
  
   # For the Socket Server
   cd ../socket
   npm install

3. **Environment Variables:**
   Create a .env file in both folders and add your MongoDB URI, NextAuth Secret, and API Keys.

4. **Run the Project:**
   # Start Socket Server
   cd socket
   npm run dev
  
   # Start Next.js App
   cd snapcart
   nodemon index.js
