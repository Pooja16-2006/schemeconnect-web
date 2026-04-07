"use client";

import React, { useMemo, useState } from "react";

const SCHEMES = [
  {
    id: "pmkisan",
    name: "PM-KISAN",
    category: "National",
    monthlyAmount: 500,
    check: (d) => d.occupation === "farmer" && d.landHoldingAcres <= 5,
  },
  {
    id: "pmsym",
    name: "PM-SYM",
    category: "National",
    monthlyAmount: 3000,
    check: (d) => d.age >= 18 && d.age <= 40 && d.monthlyIncome <= 15000,
  },
  {
    id: "nfhw",
    name: "National Food Security Support",
    category: "National",
    monthlyAmount: 1200,
    check: (d) => d.monthlyIncome <= 18000,
  },
  {
    id: "ayushman",
    name: "Ayushman Bharat (Health Support)",
    category: "National",
    monthlyAmount: 800,
    check: (d) => d.isBpl || d.monthlyIncome <= 20000,
  },
  {
    id: "ujjwala",
    name: "PM Ujjwala Support",
    category: "National",
    monthlyAmount: 300,
    check: (d) => d.gender === "female" && (d.isBpl || d.monthlyIncome <= 20000),
  },
  {
    id: "samman",
    name: "Senior Citizen Samman",
    category: "National",
    monthlyAmount: 1000,
    check: (d) => d.age >= 60,
  },
  {
    id: "widow",
    name: "Widow Pension Support",
    category: "National",
    monthlyAmount: 1200,
    check: (d) => d.isWidow,
  },
  {
    id: "disability",
    name: "Disability Assistance",
    category: "National",
    monthlyAmount: 1500,
    check: (d) => d.hasDisability,
  },
  {
    id: "ksandhya",
    name: "Karnataka Sandhya Suraksha",
    category: "Karnataka",
    monthlyAmount: 1200,
    check: (d) => d.state === "Karnataka" && d.age >= 58,
  },
  {
    id: "kganga",
    name: "Karnataka Ganga Kalyana",
    category: "Karnataka",
    monthlyAmount: 1500,
    check: (d) => d.state === "Karnataka" && d.occupation === "farmer",
  },
  {
    id: "kbhagya",
    name: "Karnataka Gruha Lakshmi",
    category: "Karnataka",
    monthlyAmount: 2000,
    check: (d) => d.state === "Karnataka" && d.gender === "female" && d.isHeadOfFamily,
  },
  {
    id: "kbpl",
    name: "Karnataka Anna Bhagya",
    category: "Karnataka",
    monthlyAmount: 1000,
    check: (d) => d.state === "Karnataka" && d.isBpl,
  },
  {
    id: "kstudent",
    name: "Karnataka Student Scholarship",
    category: "Karnataka",
    monthlyAmount: 1500,
    check: (d) => d.state === "Karnataka" && d.isStudent && d.monthlyIncome <= 25000,
  },
  {
    id: "kanimal",
    name: "Karnataka Livestock Support",
    category: "Karnataka",
    monthlyAmount: 900,
    check: (d) => d.state === "Karnataka" && d.ownsLivestock,
  },
];

const DEFAULT_FORM = {
  citizenName: "",
  age: "",
  gender: "",
  state: "Karnataka",
  occupation: "",
  monthlyIncome: "",
  annualIncome: "",
  landHoldingAcres: "",
  isBpl: false,
  hasDisability: false,
  isWidow: false,
  isStudent: false,
  isHeadOfFamily: false,
  ownsLivestock: false,
};

function toNumber(value) {
  if (value === "" || value === null || value === undefined) return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function evaluateEligibility(form) {
  const data = {
    ...form,
    age: toNumber(form.age),
    monthlyIncome: toNumber(form.monthlyIncome),
    annualIncome: toNumber(form.annualIncome),
    landHoldingAcres: toNumber(form.landHoldingAcres),
  };

  const eligibleSchemes = SCHEMES.filter((scheme) => scheme.check(data));
  const monthlyTotal = eligibleSchemes.reduce((sum, item) => sum + item.monthlyAmount, 0);
  const annualTotal = monthlyTotal * 12;

  const byCategory = {
    National: eligibleSchemes.filter((s) => s.category === "National"),
    Karnataka: eligibleSchemes.filter((s) => s.category === "Karnataka"),
  };

  return {
    eligibleSchemes,
    byCategory,
    monthlyTotal,
    annualTotal,
  };
}

export default function BenefitCalculator({ mode = "citizen", prefillData = {} }) {
  const [step, setStep] = useState(1);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [formData, setFormData] = useState(() => ({
    ...DEFAULT_FORM,
    ...prefillData,
  }));

  const result = useMemo(() => evaluateEligibility(formData), [formData]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const calculate = () => {
    setHasCalculated(true);
  };

  const recalculate = () => {
    setFormData({ ...DEFAULT_FORM, ...prefillData });
    setStep(1);
    setHasCalculated(false);
  };

  const printReport = () => {
    window.print();
  };

  const isStep1Valid = mode === "citizen"
    ? !!formData.age && !!formData.gender && !!formData.state
    : !!formData.citizenName && !!formData.age && !!formData.gender && !!formData.state;
  const isStep2Valid = !!formData.occupation && (formData.monthlyIncome !== "" || formData.annualIncome !== "");

  return (
    <div style={styles.container}>
      <div style={styles.headerCard}>
        <h2 style={styles.h2}>Benefit Calculator</h2>
        <p style={styles.subtitle}>
          {mode === "admin"
            ? "Admin mode: evaluate citizen eligibility and print report."
            : "Citizen mode: check your eligibility instantly."}
        </p>
      </div>

      {!hasCalculated ? (
        <div style={styles.card}>
          <div style={styles.stepRow}>
            {[1, 2, 3].map((n) => (
              <div key={n} style={{ ...styles.stepPill, ...(step === n ? styles.stepPillActive : {}) }}>
                Step {n}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div style={styles.section}>
              <h3 style={styles.h3}>Personal Details</h3>

              {mode === "admin" && (
                <label style={styles.label}>
                  Citizen Name
                  <input
                    style={styles.input}
                    value={formData.citizenName}
                    onChange={(e) => handleChange("citizenName", e.target.value)}
                    placeholder="Enter full name"
                  />
                </label>
              )}

              <div style={styles.grid2}>
                <label style={styles.label}>
                  Age
                  <input
                    style={styles.input}
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleChange("age", e.target.value)}
                    placeholder="e.g. 34"
                  />
                </label>

                <label style={styles.label}>
                  Gender
                  <select
                    style={styles.input}
                    value={formData.gender}
                    onChange={(e) => handleChange("gender", e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                </label>
              </div>

              <label style={styles.label}>
                State
                <select
                  style={styles.input}
                  value={formData.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                >
                  <option value="Karnataka">Karnataka</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Other">Other</option>
                </select>
              </label>
            </div>
          )}

          {step === 2 && (
            <div style={styles.section}>
              <h3 style={styles.h3}>Economic Details</h3>
              <div style={styles.grid2}>
                <label style={styles.label}>
                  Occupation
                  <select
                    style={styles.input}
                    value={formData.occupation}
                    onChange={(e) => handleChange("occupation", e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="farmer">Farmer</option>
                    <option value="laborer">Laborer</option>
                    <option value="self-employed">Self-employed</option>
                    <option value="salaried">Salaried</option>
                    <option value="unemployed">Unemployed</option>
                    <option value="student">Student</option>
                  </select>
                </label>

                <label style={styles.label}>
                  Land Holding (Acres)
                  <input
                    style={styles.input}
                    type="number"
                    value={formData.landHoldingAcres}
                    onChange={(e) => handleChange("landHoldingAcres", e.target.value)}
                    placeholder="e.g. 2"
                  />
                </label>
              </div>

              <div style={styles.grid2}>
                <label style={styles.label}>
                  Monthly Income (INR)
                  <input
                    style={styles.input}
                    type="number"
                    value={formData.monthlyIncome}
                    onChange={(e) => handleChange("monthlyIncome", e.target.value)}
                    placeholder="e.g. 12000"
                  />
                </label>
                <label style={styles.label}>
                  Annual Income (INR)
                  <input
                    style={styles.input}
                    type="number"
                    value={formData.annualIncome}
                    onChange={(e) => handleChange("annualIncome", e.target.value)}
                    placeholder="e.g. 144000"
                  />
                </label>
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={styles.section}>
              <h3 style={styles.h3}>Additional Flags</h3>
              <div style={styles.checkboxGrid}>
                {[
                  ["isBpl", "BPL Family"],
                  ["hasDisability", "Person with Disability"],
                  ["isWidow", "Widow"],
                  ["isStudent", "Student"],
                  ["isHeadOfFamily", "Head of Family"],
                  ["ownsLivestock", "Owns Livestock"],
                ].map(([key, label]) => (
                  <label key={key} style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={!!formData[key]}
                      onChange={(e) => handleChange(key, e.target.checked)}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div style={styles.actions}>
            <button
              style={{ ...styles.button, ...styles.ghostButton }}
              disabled={step === 1}
              onClick={() => setStep((s) => Math.max(1, s - 1))}
            >
              Back
            </button>

            {step < 3 ? (
              <button
                style={styles.button}
                disabled={(step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid)}
                onClick={() => setStep((s) => Math.min(3, s + 1))}
              >
                Next
              </button>
            ) : (
              <button style={styles.button} onClick={calculate}>
                Check Eligibility
              </button>
            )}
          </div>
        </div>
      ) : (
        <div style={styles.card}>
          <div style={styles.summaryCard}>
            <h3 style={styles.h3}>Eligibility Summary</h3>
            <div style={styles.summaryGrid}>
              <div>
                <p style={styles.metricLabel}>Schemes Eligible</p>
                <p style={styles.metricValue}>{result.eligibleSchemes.length}</p>
              </div>
              <div>
                <p style={styles.metricLabel}>Monthly Total</p>
                <p style={styles.metricValue}>INR {result.monthlyTotal.toLocaleString("en-IN")}</p>
              </div>
              <div>
                <p style={styles.metricLabel}>Annual Total</p>
                <p style={styles.metricValue}>INR {result.annualTotal.toLocaleString("en-IN")}</p>
              </div>
            </div>
          </div>

          <div style={styles.grid2}>
            <SchemeList
              title="National Schemes"
              schemes={result.byCategory.National}
            />
            <SchemeList
              title="Karnataka Schemes"
              schemes={result.byCategory.Karnataka}
            />
          </div>

          <div style={styles.actions}>
            <button style={{ ...styles.button, ...styles.ghostButton }} onClick={recalculate}>
              Recalculate
            </button>
            {mode === "admin" && (
              <button style={styles.button} onClick={printReport}>
                Print Report
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SchemeList({ title, schemes }) {
  return (
    <div style={styles.schemeCard}>
      <h4 style={styles.h4}>{title}</h4>
      {schemes.length === 0 ? (
        <p style={styles.empty}>No eligible schemes in this category.</p>
      ) : (
        <div style={styles.schemeList}>
          {schemes.map((scheme) => (
            <div key={scheme.id} style={styles.schemeItem}>
              <div>
                <p style={styles.schemeName}>{scheme.name}</p>
                <p style={styles.schemeMeta}>{scheme.category}</p>
              </div>
              <p style={styles.schemeAmount}>INR {scheme.monthlyAmount.toLocaleString("en-IN")} / mo</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 980,
    margin: "0 auto",
    padding: 16,
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    color: "#0f172a",
  },
  headerCard: {
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: 16,
    background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
    marginBottom: 12,
  },
  card: {
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: 16,
    background: "#ffffff",
  },
  section: {
    marginBottom: 16,
  },
  stepRow: {
    display: "flex",
    gap: 8,
    marginBottom: 16,
  },
  stepPill: {
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid #cbd5e1",
    fontSize: 12,
    color: "#334155",
  },
  stepPillActive: {
    background: "#0f172a",
    color: "#ffffff",
    border: "1px solid #0f172a",
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    fontSize: 14,
    color: "#1e293b",
  },
  input: {
    border: "1px solid #cbd5e1",
    borderRadius: 8,
    padding: "10px 12px",
    fontSize: 14,
    background: "#fff",
  },
  checkboxGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 14,
    color: "#1e293b",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 12,
  },
  button: {
    border: "none",
    background: "#0f172a",
    color: "#fff",
    borderRadius: 8,
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: 600,
  },
  ghostButton: {
    background: "#f1f5f9",
    color: "#0f172a",
  },
  h2: {
    margin: 0,
    fontSize: 24,
  },
  h3: {
    margin: "0 0 10px 0",
    fontSize: 18,
  },
  h4: {
    margin: "0 0 10px 0",
    fontSize: 16,
  },
  subtitle: {
    margin: "6px 0 0 0",
    color: "#475569",
  },
  summaryCard: {
    border: "1px solid #cbd5e1",
    borderRadius: 10,
    background: "#f8fafc",
    padding: 12,
    marginBottom: 12,
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 10,
  },
  metricLabel: {
    margin: 0,
    fontSize: 12,
    color: "#475569",
  },
  metricValue: {
    margin: "4px 0 0 0",
    fontSize: 24,
    fontWeight: 700,
  },
  schemeCard: {
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    padding: 12,
  },
  schemeList: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  schemeItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    padding: 10,
    background: "#fff",
  },
  schemeName: {
    margin: 0,
    fontSize: 14,
    fontWeight: 600,
  },
  schemeMeta: {
    margin: "3px 0 0 0",
    fontSize: 12,
    color: "#64748b",
  },
  schemeAmount: {
    margin: 0,
    fontSize: 13,
    fontWeight: 600,
  },
  empty: {
    margin: 0,
    fontSize: 14,
    color: "#64748b",
  },
};
