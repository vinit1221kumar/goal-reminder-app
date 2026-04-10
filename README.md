<div align="center">

# 📚 Countdown Study Calendar

### A mobile-first PWA to track exams, deadlines, and study progress day by day

🗓️ Plan smarter • ✅ Stay consistent • 📈 Track momentum • 📱 Works offline

</div>

---

## ✨ What this app does

Countdown Study Calendar helps you run multiple countdown plans in parallel.
Each event gets its own timeline calendar where you can mark each day as:

- ✅ **Completed**
- ❌ **Missed**
- ⬜ **Pending**

Everything is stored locally in your browser (no login, no backend, no sync setup).

---

## 🧩 Core highlights

| Feature | Description |
|---|---|
| Multi-event tracking | Run multiple study/event countdowns at the same time |
| Interactive day grid | Update each day directly in the event calendar |
| Progress analytics | Total, completed, missed, remaining, streak, days left |
| Local-first storage | Zustand + localStorage persistence |
| PWA support | Installable and usable offline after first load |
| Mobile-first UI | Responsive layout for phone-first usage |

---

## 🛠 Tech stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Zustand** (persisted store)
- **date-fns** (date utilities)

---

## 🚀 Getting started

### 1) Install dependencies

```bash
pnpm install
```

### 2) Start development

```bash
pnpm dev
```

Open: `http://localhost:3000`

### 3) Build and run production

```bash
pnpm build
pnpm start
```

---

## 📂 Project structure

```text
app/
  page.tsx
  event/[id]/page.tsx
  layout.tsx
  manifest.ts
  globals.css

components/
  HomeScreen.tsx
  EventDetailScreen.tsx
  EventForm.tsx
  EventCard.tsx
  CalendarGrid.tsx
  ProgressBar.tsx
  PwaRegister.tsx

store/
  useStore.ts

utils/
  dateHelpers.ts

public/
  sw.js
```

---

## 📊 Event behavior rules

### Event lifecycle

1. Create an event with title + end date
2. Start date is automatically set to today
3. Open event details to mark daily status
4. Track progress and streak automatically

### Status logic

- Past day not completed → treated as **missed**
- Today/future day → can be changed
- Day can be set to completed, missed, or reset to pending

---

## 📱 PWA notes

- Manifest is generated from `app/manifest.ts`
- Service worker is in `public/sw.js`
- For best install/offline verification, test the production build

---

## 🧪 Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
```

---

## 📝 Development notes

- Data is local to the browser profile on this device
- Clearing browser storage removes saved events
- Route-level client wrappers are used for stable persisted-state rendering
- Date logic is centralized in `utils/dateHelpers.ts`

---

<div align="center">

Built for focused self-study and deadline discipline ⚡

</div>
# goal-reminder-app
