# Benefit Calculator Integration Guide

This package includes:

- `outputs/BenefitCalculator.jsx`
- Two modes in one component:
  - Citizen portal: `<BenefitCalculator mode="citizen" />`
  - Admin dashboard: `<BenefitCalculator mode="admin" />`

## 1) Copy the file

Copy `BenefitCalculator.jsx` into each project where you want to use it.

- Next.js app (`frontend`): `frontend/components/BenefitCalculator.jsx`
- React app (`client`): `client/src/components/BenefitCalculator.jsx`

## 2) Use in Citizen portal

```jsx
import BenefitCalculator from "@/components/BenefitCalculator";

export default function EligibilityPage() {
  return <BenefitCalculator mode="citizen" />;
}
```

For React (`client`) style imports:

```jsx
import BenefitCalculator from "../components/BenefitCalculator";
```

## 3) Use in Admin dashboard

```jsx
import BenefitCalculator from "@/components/BenefitCalculator";

const citizenProfile = {
  citizenName: "Anita Kumari",
  age: 34,
  gender: "female",
  state: "Karnataka",
  occupation: "farmer",
  monthlyIncome: 12000,
  landHoldingAcres: 2,
  isBpl: true,
  isHeadOfFamily: true,
};

export default function AdminEligibility() {
  return (
    <BenefitCalculator
      mode="admin"
      prefillData={citizenProfile}
    />
  );
}
```

Admin mode adds:

- Citizen Name field
- Print Report button

## 4) Add routes (quick examples)

### Next.js (`frontend/app`)

- Citizen route file: `frontend/app/eligibility/page.tsx`
- Admin route file: `frontend/app/admin/benefit-calculator/page.tsx`

Example admin route:

```tsx
import BenefitCalculator from "@/components/BenefitCalculator";

export default function AdminBenefitCalculatorPage() {
  return <BenefitCalculator mode="admin" />;
}
```

### React Router (`client/src/pages`)

```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BenefitCalculator from "./components/BenefitCalculator";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/eligibility" element={<BenefitCalculator mode="citizen" />} />
        <Route path="/admin/benefit-calculator" element={<BenefitCalculator mode="admin" />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## 5) What the component includes

- 3-step form: Personal -> Economic -> Additional flags
- Instant local eligibility evaluation (14 schemes, no API call)
- Summary card:
  - Schemes eligible
  - Monthly total
  - Annual total
- Breakdown by:
  - National schemes
  - Karnataka schemes
- Recalculate flow

