# 🔥 IoT Smart Fire Alarm 🚨

**IoT Smart Fire Alarm** is a smart fire detection system that combines an **ESP32 microcontroller** with a **React Native mobile application**. The system monitors environmental conditions and sends real-time alerts to users via Wi-Fi when signs of fire (heat/smoke) are detected.

## 📱 Mobile Application

* **Technology:** React Native (Expo)
* **Features:**

  * Real-time display of data from ESP32 (temperature, smoke levels).
  * Instant fire alerts via push notifications.
  * User-friendly and responsive UI.
  * Option to connect and monitor multiple ESP32 devices.

## 🔧 Hardware

* **ESP32** microcontroller with Wi-Fi
* **Sensors:**

  * Temperature sensor (e.g., DHT11, DHT22)
  * Smoke sensor (e.g., MQ-2)
  * Flame sensor (e.g., KY-026)
* **Optional:** Buzzer, LED for local alerts

## 🌐 System Architecture

```
[Temperature & Smoke Sensors] → [ESP32] → [Wi-Fi] → [Firebase/MQTT] → [React Native App]
```

* ESP32 collects sensor data and pushes to a backend (Firebase or MQTT).
* The mobile app listens for updates and triggers alerts when thresholds are exceeded.

## 🚀 Getting Started

### 1. ESP32 Firmware

* Written in Arduino/C++
* Reads sensor data and sends to cloud
* Configure Wi-Fi credentials and Firebase/MQTT endpoints in code

### 2. React Native App

* Clone this repo
* Run the app:

```bash
npm install
npx expo start
```

* Make sure the app is connected to the same backend as ESP32.

## 🛡️ Alerts & Safety

* Alert levels are customizable (e.g., temperature > 50°C or high smoke density).
* Supports both visual and audible alerts on device and mobile.

## 📦 Future Improvements

* Add history and analytics of fire alerts.
* Integrate voice assistant control (e.g., Google Assistant).
* Support for SMS or email alerts.

## 🤝 Contributors

* \[Kien Duong Trung] - Mobile App Developer
* \[KienTech] - Embedded System Developer

---
