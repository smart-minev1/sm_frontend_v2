# SmartMine: AI-Augmented Safety Intelligence for Mining Operations

## Overview
**SmartMine** is a predictive safety and monitoring system for mines, designed to prevent accidents, optimize operations, and provide real-time insights using AI and simulated IoT sensors.  
This project was developed as part of a school hackathon / Junior Achievement competition and demonstrates how technology can augment mining safety and operational efficiency in Rwanda.

---

## Problem Statement
Mining in Rwanda is **dangerous and inefficient**. Data from the Rwanda Mines, Petroleum and Gas Board (RMB) shows that from 2018–2022 there were **337 reported mining accidents**, resulting in hundreds of deaths and serious injuries. Current challenges include:

- Lack of real-time monitoring of underground conditions  
- No predictive hazard detection (landslides, gas, vibration)  
- Limited operational efficiency and decision-making tools  

SmartMine addresses these issues by simulating sensor networks, AI risk scoring, and dashboards for real-time alerts.

---

## Solution
SmartMine provides:

- **Virtual Sensor Simulation:** Generates vibration, gas, and moisture data to simulate real underground conditions.  
- **AI Risk Scoring:** Simple predictive algorithm calculates risk scores in real-time.  
- **Web Dashboard:** Displays live sensor data, risk levels, and alerts for managers.  
- **Mobile Simulation:** Sends alerts to miners and supervisors to simulate field notifications.  
- **Impact:** Improves safety, reduces downtime, and supports proactive mining decisions.

---

## Features
- Real-time data visualization of simulated sensors  
- Dynamic AI-based risk scoring  
- Color-coded alerts: Green (Safe), Orange (Warning), Red (Danger)  
- Interactive hazard simulation button  
- Dashboard + mobile view for multi-role demonstration  
- Fully virtual prototype — no physical hardware needed  

---

## Technology Stack
**Frontend:** HTML, CSS, JavaScript, React 
**Backend:** Node.js / Python (Flask)   
**AI Layer:** Risk scoring algorithm based on simulated sensor data  
**Simulation Tools:** Randomized sensor data generator, WebSocket or HTTP updates  
**Visualization:** Browser-based dashboard for live updates  

---

## Installation & Running
1. Clone the repository:

```bash
git clone https://github.com/smart-minev1/sm_frontend_v2.git
cd sm_frontend_v2

# If Node.js
npm install
#If Python 
pip install -r requirements.txt

#Node.js
npm start
#Python 
python app.py

---
