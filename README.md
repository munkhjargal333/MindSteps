
# MindSteps Project — Full Stack Application

## 📌 Overview

MindSteps бол сэтгэцийн эрүүл мэнд, хувь хүний хөгжлийн чиглэлтэй бүрэн хэмжээний **full-stack web application** төсөл юм. Энэхүү систем нь хэрэглэгчид сэтгэцийн эрүүл мэндийн оношилгоо, дасгал, контент болон өөрийгөө хөгжүүлэх ахицын хяналтыг онлайн хэлбэрээр ашиглах боломжийг олгоно.

Төслийн архитектур нь **frontend (Next.js), backend (Go), database (MySQL/PostgreSQL), CI/CD**, модульчлал, интерфэйс‑тулгуурласан дизайн болон үр ашигтай clean architecture‑д тулгуурлан хийгдсэн.

---

## 📂 Project Structure

```
MindSteps/
├── backend/        # Go backend — Clean architecture + Modular Monolith
├── frontend/       # Next.js frontend
├── test/           # Performance test scripts
└── README.md       # Main project documentation (this file)
```

---

## LAB Work Summary

Доорх нь төслийн хөгжүүлэлтийн үе шатууд (LAB1–LAB13) болон тэдгээрийн гүйцэтгэлийн статус.

### **LAB1 — Сэтгэцийн эрүүл мэндийн судалгаа**

✔ DONE — Домайн ойлголт, MVP хүрээ тодорхойлсон.

### **LAB2 — User Stories**

✔ DONE — Google Sheet дээр бичиж, бизнес логик тодорхойлсон.

### **LAB3 — User Story Analysis**

✔ DONE — Story segmentation / front vs. back салгалт хийх шаардлагатай гэж дүгнэсэн.

### **LAB4 — Definition of Done + TDD**

✔ DONE — DoD тодорхойлсон, unit test хийгдсэн.

### **LAB5 — Git Workflow / CI Pipeline**

✔ DONE — PR flow, code review, CI/CD тестлэл, merge процесс бүрэн ажилласан.

### **LAB6 — Pair Programming & Code Review (Advanced)**

✔ DONE — Clean architecture, modular monolith, exception handling, security basics.

### **LAB8 — Continuous Integration (CI)**

✔ DONE — GitHub Actions тохируулсан.

### **LAB9 — External Libraries & Error Handling**

✔ DONE — Package structure, error wrapping, logging.

### **LAB10 — Sprint 2 Advanced Features**

✔ DONE — MVP‑аа сайжруулсан, зорилго хэсгийг дахин загварчилсан.

### **LAB11 — Frontend Development**

✔ DONE — Navigation, responsive UI, UX сайжруулалт, LocalStorage auth.

### **LAB12 — (To be completed)**

* TBD

### **LAB13 — Performance & Security Basics**

✔ DONE — Performance tests, SQL injection, XSS хамгаалалт, secure password hashing.

---

## ⚙️ Backend (Go) — Architecture

Backend нь **Clean Architecture + Modular Monolith** загвараар бүтээгдсэн.

### Key Folders

```
backend/
├── app/                  # Application layer
├── internal/             # Domain + Service + Handler
├── pkg/                  # Reusable libraries
├── config/               # Config loader
├── cmd/api               # Main entrypoint
├── database/             # Migration, SQL
└── test/                 # Unit tests
```

### Гол технологиуд

* Go 1.22+
* Echo / Chi (handler)
* Clean architecture layer separation
* Custom error response system
* Logging middleware
* SQL database (MySQL/PostgreSQL)

---

## 💻 Frontend (Next.js)

* Next.js 14 (App Router)
* TypeScript
* TailwindCSS
* Jest unit tests
* API service layer with client wrapper
* LocalStorage authentication flow

### Folders

```
frontend/
├── app/          # Pages/Routes
├── components/   # Reusable UI components
├── context/      # Global state
├── lib/api       # API client
└── __tests__/    # Jest tests
```

---

## 🔁 CI/CD Pipeline

GitHub Actions дээр дараах workflow ажиллана:

* Go backend test
* Frontend Jest test
* Coverage build
* Linting
* PR merge‑ээс өмнө автомат баталгаажуулалт

---

## 🧪 Testing Summary

### Backend

* Unit Tests (Go)
* Error handling tests
* Integration readiness

### Frontend

* Jest component tests
* API mocking

### Performance (LAB13)

* Python‑оор load testing

---

## 🔐 Security

Төслийн security хэсэгт дараах зүйлс хийгдсэн:

* DTO validation
* SQL injection prevention (prepared statements)
* XSS prevention (frontend sanitation)
* Password hashing (bcrypt/hashing fix)
* Centralized error handler

---

## 📦 Convertor Module

HTML → PNG/PDF болгон хөрвүүлэх жижиг туслах модуль

```
convertor/
├── index.html
├── convert.js
└── output.pdf
```

Purpose: Reporting, infographic export гэх мэт.

---

## 📝 Development Guidelines

* PR бүр unit test‑тэй байх
* Functions ≤ 30 LOC байх
* Handler → Service → Repository strict separation
* Frontend: components must be pure
* DTO validation хийх (backend + frontend)

---

## 🚀 Running the Project

### Backend

```
cd backend
make run
```

### Frontend

```
cd frontend
yarn install
yarn dev
```

---

## ✨ Author

**Мөнхжаргал Ц. — MindSteps Full Stack Project**

---

Хэрвээ хүсвэл би:

* Архитектурын диаграм оруулж өгч болно
* Backend/Frontend API spec үүсгэж өгч болно
* Readme‑г илүү corporate/enterprise хэв маягаар болгож өгч болно


LAB1: DONE
    Сэтгэцийн эрүүл мэнд хувь хүний хөгжил

LAB2: DONE
    user stories : https://docs.google.com/spreadsheets/d/1RDHwRrCDGrjEVz3nAbzCs_SIib8rv95r/edit?usp=sharing&ouid=109856725816458642879&rtpof=true&sd=true

LAB3: DONE
    user stories оноо өгсөн дүгнэсэн. (front-end , back-end) үүдийн асуудалыг салгаагүй болохоор
    асуудал ихтэй байна.

LAB4: DONE
    (DoD) тодорхойлох
    Test-Driven Development (TDD)
    Unit test - DONE

LAB5: DONE
    1. GitHub дээр шинэ pull request үүсгэх
    2. Кодын үнэлгээ (code review) хийлгэх
    3. CI/CD pipeline-аар туршилтуудыг гүйцэтгэх
    4. Pull request-г merge хийх ?

LAB6: 
    Pair Programming ба код үзэх (Code Review)
        Кодын бүтэц - Clean architecture, design patterns
            Modular monolith
        Алдааны менежмент - Exception handling
            DONE
        Аюулгүй байдал - SQL injection, XSS болон бусад vulnerabilities
            Тодорхой хэмжээнд боломжтой гэхдээ TDO гэх зэргээрээ аргалаж болно.(бас л асуудалтай)
        Гүйцэтгэл - Давтамжтай ашиглагдах код оновчтой эсэх
            сайн
        Уншигдахуун - Нэршил, documentation
            сайн

LAB8: DONE
    Тасралтгүй интеграцчилал (CI) байгуулах - done
        /github

LAB9: 
    Гадаад сангуудтай ажиллах ба алдааны мэдээлэл (Error Handling) - done
        Гадаад пакетүүдийг хэрхэн менежмент хийх, суурилуулах
            backend/pkg/...
        Алдаа илрүүлэх төрөл бүрийн аргууд
            ???
        Custom exception классууд үүсгэх
        Хэрэглэгчид ойлгомжтой алдааны мэдээлэл харуулах
            backend/internal/shared/response.go
        Алдааны лог хийх, боловсруулах
            backend/cmd/api/main.go

LAB10:  DONE(сайжруулж байгаа)
    Хоёрдогч Sprint - Дэвшилтэт функцууд
        Залруулсан(зорилгын хэсгийг хойшлуулах өөрчлөх талаар бодсон)

LAB11:  DONE
    Интерфэйс хөгжүүлэлт (Front-end) 
        Цэсний систем - DONE
        Хариуцлагатай дизайн - DONE
        Хэрэглэгчийн туршлагыг сайжруулах - DONE()
        Хэрэглэгчийн мэдээлэл - сайжруулж байгаа
        LocalStorage ашиглах - DONE lib/api/client.go

LAB12: 

LAB13: 
    Гүйцэтгэлийн туршилт ба аюулгүй байдлын үндэс
        Гүйцэтгэлийн туршилт(Performance testing) DONE
        SQL injection, XSS   - DTO
        Нууц үгийг хэрхэн аюулгүй хадгалах талаар - bypass hash


    
