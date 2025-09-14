# Technical Documentation – Business Licensing Evaluation System

---

## 1. ארכיטקטורת המערכת

המערכת בנויה משלושה חלקים עיקריים:

- **Frontend (React)**  
  מציג שאלון למשתמש, שולח את הנתונים לשרת ומציג את הדו"ח המותאם שהתקבל מה־AI.

- **Backend (Node.js + Express)**  
  מקבל את נתוני השאלון, מבצע ולידציה (Joi), משווה מול החוקים (`rules.json`) ושולח בקשה ל־AI.

- **AI Integration (Gemini)**  
  מעבד את נתוני העסק והחוקים המתאימים ומחזיר דו"ח רגולטורי ברור בעברית.

### דיאגרמת זרימה (Mermaid)

```mermaid
flowchart TD
  A[משתמש] -->|ממלא שאלון| B[Frontend - React]
  B -->|POST /api/questionnaire| C[Backend - Express]
  C -->|בדיקת חוקים| D[Rules JSON]
  C -->|יצירת דו"ח| E[Gemini API]
  D --> C
  E --> C
  C -->|דו"ח מותאם אישית| B
  B -->|תצוגת דו"ח| A
```

---

## 2. תיעוד API

### נקודת קצה: `POST /api/questionnaire`

#### בקשה

```json
{
  "bizName": "מסעדת טעים",
  "bizSize": 120,
  "seats": 150,
  "alcohol": false,
  "servingFood": true,
  "gas": true
}
```

#### תגובת הצלחה (200)

```json
{
  "matchedRules": [{ "id": 1, "requirement": "דרישת כיבוי אש" }],
  "aiReport": "העסק עומד ברוב הדרישות, מומלץ להשלים את אישור כיבוי האש..."
}
```

#### תגובת שגיאה (400)

```json
{
  "errors": [{ "field": "bizName", "message": "שם העסק הוא שדה חובה" }]
}
```

#### תגובת שגיאה (500)

```json
{
  "message": "Internal Server Error",
  "error": "Something went wrong"
}
```

---

## 3. מבנה נתונים

### Rules JSON (חוקים לדוגמה)

```json
[
  {
    "id": 1,
    "requirement": "דרישת כיבוי אש",
    "condition": { "seating_lte": 200 }
  },
  {
    "id": 2,
    "requirement": "רישיון משרד הבריאות",
    "condition": { "servingFood": true }
  },
  {
    "id": 3,
    "requirement": "אישור מערכת גז",
    "condition": { "gas": true }
  }
]
```

### סכמה (Joi Validation)

```javascript
{
  bizName: string().required().min(2),
  bizSize: number().min(1).required(),
  seats: number().min(0).required(),
  servingFood: boolean().required(),
  gas: boolean().required(),
  alcohol: boolean().required()
}
```

---

## 4. אלגוריתם ההתאמה

### שלבים:

1. המערכת מקבלת את נתוני השאלון מהמשתמש.
2. הפונקציה `matchRules` משווה בין נתוני העסק לבין התנאים בקובץ `rules.json`.
3. כל חוק שהתקיים – נוסף לרשימת החוקים הרלוונטיים (`matchedRules`).
4. רשימת החוקים יחד עם נתוני העסק נשלחת למודל ה־AI (Gemini).
5. המודל מחזיר דו"ח ברור בעברית הכולל:
   - סעיפים שהתקיימו
   - סעיפים חסרים
   - המלצות פעולה

---

מסמך זה משלים את ה־README הראשי ומספק תמונה טכנית מלאה של המערכת.
