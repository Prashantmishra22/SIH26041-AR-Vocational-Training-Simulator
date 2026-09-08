# JH-Safety AR — Augmented Reality Industrial Safety Training Platform

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.0-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Unity](https://img.shields.io/badge/Unity-2022.3_LTS-000000?logo=unity)](https://unity.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Problem Statement ID:** 26041  
**Category:** Smart Education / Vocational Industrial Safety  
**Target Region:** Jharkhand Mining (Coal & Iron), Steel & Manufacturing, and Mica Sectors  
**Target Audience:** Grassroots industrial miners and factory workers across Dhanbad, Bokaro, Jamshedpur, Ranchi, Ramgarh, and Koderma.

---

## 🌟 Key Highlights

- 📱 **No VR Headset Required:** Runs on mid-range Android smartphones (Android 10+). Features automatic 3D simulation mode on devices without AR sensors.
- 🗣️ **Trilingual Localization:** Complete native audio & UI support for **Hindi (हिंदी)**, **Santali (ᱥᱟᱱᱛᱟᱲᱤ - Ol Chiki)**, and **English**.
- 🔥 **Interactive AR Vocational Modules:**
  1. *Underground Mine Fire & Explosion Protocol* (6 interactive steps).
  2. *Toxic Methane (CH4) & CO Gas Detection & Confined Space Safety* (5 interactive steps).
- 📜 **Cryptographic Digital Certificates:** Automatic issuance upon scoring 70%+ on composite practical (60%) and theoretical (40%) evaluations.
- 🔍 **Instant QR Verification:** Scan QR credentials with any smartphone camera or web validator to authenticate against the Jharkhand State Safety Registry.
- 📶 **100% Offline-First Execution:** Uninterrupted training underground in deep pits with queue-based batch sync to cloud when surface connectivity is restored.
- 📊 **Web Compliance Dashboard:** Full-featured React + TypeScript command center with KPI metrics, Recharts visualizers, worker registry filters, and DGMS compliance reporting.

---

## 📁 Repository Structure

```
├── android-ar/                # Unity AR Android mobile application (C# scripts, JSON data, build guide)
│   ├── Assets/
│   │   ├── Scripts/           # 30+ production C# scripts (AR, Core, Modules, Assessment, UI, Offline)
│   │   └── Resources/         # Trilingual localizations (hi, sat, en) and module curricula JSON
│   ├── Packages/manifest.json # Unity AR Foundation & ARCore dependencies
│   └── BUILD_INSTRUCTIONS.md  # Detailed APK compilation guide
│
├── backend/                   # FastAPI REST API & database service
│   ├── app/                   # Models, routes, schemas, services, utils, and seed data
│   ├── tests/                 # Pytest test suite covering auth, scoring, and certificates
│   └── requirements.txt       # Python dependencies
│
├── admin-dashboard/           # React + TypeScript + Tailwind CSS v4 web portal
│   ├── src/                   # Dashboard pages, Recharts components, and mock/API services
│   └── package.json           # Node.js dependencies
│
└── docs/                      # Architecture, API specifications, demo script, and offline guide
```

---

## 🚀 Quick Start Guide

### 1. Backend Service (FastAPI)
```bash
cd backend
pip install -r requirements.txt pytest httpx
pytest tests/ -v
python -m uvicorn app.main:app --reload --port 8000
```
- API Docs & Swagger UI: `http://localhost:8000/docs`

### 2. Admin Compliance Dashboard (React + TypeScript)
```bash
cd admin-dashboard
npm install
npm run build
npm run dev
```
- Web Portal: `http://localhost:3000` (Features live data toggle & standalone offline demo mode)

### 3. Unity Android AR Client
- Open `android-ar/` in **Unity 2022.3 LTS**.
- Follow [BUILD_INSTRUCTIONS.md](file:///c:/Users/ASUS/OneDrive/Desktop/hackathon%20project/android-ar/BUILD_INSTRUCTIONS.md) to compile `JH-Safety-AR.apk`.

---

## 🏛️ Compliance & Regulatory Alignment
- **DGMS (Directorate General of Mines Safety):** Coal Mines Regulations 2017 (Reg 133/134/169).
- **Factories Act 1948 (Jharkhand State Rules):** Sections 35 & 41 for metal melt shops.
- **Mines Act 1952:** Section 22A for occupational dust and silicosis suppression.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](file:///c:/Users/ASUS/OneDrive/Desktop/hackathon%20project/LICENSE) file for details.
