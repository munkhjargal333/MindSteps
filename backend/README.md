1. Code Level

Input validation & sanitation хийгдсэн
→ SQL Injection хамгаалалт эхэлнэ (validation + parameterized query)
Unit test бичсэн (Service гол анхаарал)
Static code analysis OK

2. Presentation Layer (API/Controller)

Integration test — HTTP endpoint шалгах
Manual test — Postman/REST Client               (голчлон)

3. Business Logic Layer (Service)

Unit test — Mock ашиглаж DB/External-оос салгана
Edge case, exception flow test                  (optional)
Нийт тестийн ихэнх хувь энд

4. Data Layer (Repository/DAO)

SQL Injection хамгаалалт энд баталгаажна
→ Parameterized query / Prepared statement
→ Dynamic query бол whitelist + escape