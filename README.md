# 💰 SpendWise Analytics — Data Science & Financial Intelligence

## 🌟 Project Overview
**SpendWise Analytics** is a high-fidelity **Data Science Project** designed to provide automated financial intelligence. Far beyond a simple dashboard, this platform implements a full-stack analytical pipeline: from raw data acquisition and cleaning to sophisticated feature engineering and decision-support insight generation.

---

## 🏗️ Data Science Architecture
This project implements the **CRISP-DM** inspired workflow:

### 1. Data Acquisition & Simulation (Phase 1)
- Generates high-variance "Dirty Raw Data" representing unformatted transaction logs.
- Simulates noisy categorical names and string-formatted quantitative variables.

### 2. Preprocessing & Data Cleaning (Phase 2)
- **Normalization:** Trimming whitespace and case-standardizing labels.
- **Type Conversion:** Handling string-to-float parsing for statistical computation.
- **Consistency Gating:** Mapping raw identifiers to strict project schemas.

### 3. Feature Engineering (Phase 3)
- **Temporal Analysis:** Extracting `Is_Weekend` and `Month` features from raw timestamps.
- **Outlier Detection:** Implementing dynamic thresholds to flag "High Spend" anomalies (>1.5x category mean).
- **Statistical Smoothing:** Calculating `Rolling 7-Transaction Moving Averages` (MA7) to identify spending velocity.

### 4. Decision Support & Insights (Phase 4)
- **Heuristic Modeling:** Logic-based engines generating real-time warnings (e.g., Critical Savings Rate alerts).
- **Behavioral Analysis:** Identifying top "Cost Drivers" using data aggregation.
- **Automated Alerts:** Visual flags for anomalous behavior to assist in immediate decision-making.

---

## 🚀 Key Features
- **Real-time Pipeline:** Watch the "Acquisition → Cleaning → Engineering" sequence execute in the browser.
- **DS Dashboard:** Track Income-to-Expense ratios, Savings velocity, and Anomaly counts.
- **Insight Panel:** AI-style summaries providing actionable financial advice.
- **Flagged Data Grid:** Detailed view showing the metadata and analysis flags attached to every transaction record.

---

## 🛠️ Tech Stack
| Tier | Technology |
| :--- | :--- |
| **Logic/Pipeline** | TypeScript ES2022 |
| **Analysis** | custom Data Processing Engine |
| **UI/UX** | React 19 + Tailwind CSS |
| **Visualization** | Recharts (Linear & Categorical) |
| **Animations** | Motion |
| **Temporal Logic** | date-fns |

---

## 🏁 How to Run
1. **Repository Setup:**
   ```bash
   git clone https://github.com/your-username/spendwise-analytics.git
   ```
2. **Install Analytical Core:**
   ```bash
   npm install
   ```
3. **Execute Pipeline:**
   ```bash
   npm run dev
   ```

---

## 🎙️ Interview Preparation (DS Focus)
- **Q: How is "High Spend" defined?**
  - *A: We calculate the mean for each category dynamically. Any transaction exceeding 1.5 standard deviations or a fixed 1.5x multiplier against the mean is flagged as a behavioral outlier.*
- **Q: Why use a rolling average?**
  - *A: In financial data, individual transactions are noisy. A 7-day rolling average (MA7) smooths variance to reveal the true underlying spending velocity.*
- **Q: How does the pipeline handle scaling?**
  - *A: The cleaning and engineering logic is decoupled from the UI, allowing it to be easily ported to a backend Node.js worker or a Python microservice for processing millions of records.*

---
**Advanced Financial Intelligence | Built for Placement Success**
