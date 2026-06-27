# 🛒 RetailLensAI — Rossmann Store Sales Intelligence

> **End-to-end retail sales forecasting system** built on the Rossmann Store Sales dataset, covering exploratory analysis, hypothesis testing, advanced feature engineering, and gradient-boosted model training with XGBoost and LightGBM.

---

## 📁 Repository Structure

```
RetailLensAI/
├── api/                   # Backend API layer
├── core/                  # Core business logic
├── data/                  # Raw & processed datasets
├── frontend/              # Next.js / Vercel front-end
├── models/                # Serialised model artefacts
├── notebooks/             # Jupyter notebooks (analysis + training)
├── schemas/               # Pydantic / JSON schema definitions
├── services/              # Microservice modules
├── app.py                 # UptimeRobot health-check endpoint
├── requirements.txt       # Python dependencies
└── test.py                # Unit tests
```

---

## 📋 Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [Dataset](#2-dataset)
3. [Tech Stack](#3-tech-stack)
4. [Exploratory Data Analysis](#4-exploratory-data-analysis)
5. [Statistical Hypothesis Testing](#5-statistical-hypothesis-testing)
6. [Feature Engineering](#6-feature-engineering)
7. [Model Architecture](#7-model-architecture)
8. [Evaluation Metrics](#8-evaluation-metrics)
9. [Results](#9-results)
10. [Project Setup](#10-project-setup)

---

## 1. Problem Statement

**Rossmann** operates over **3,000 drug stores** across 7 European countries. Store managers must forecast daily sales up to **six weeks in advance**, a task complicated by promotions, competitor proximity, public and school holidays, seasonality, and locality. Prediction accuracy varies widely when done manually.

**Objective:** Build a machine-learning pipeline that accurately forecasts the `Sales` column at daily granularity for 1,115 Rossmann stores, minimising the **Root Mean Squared Percentage Error (RMSPE)**:

$$\text{RMSPE} = \sqrt{\frac{1}{n} \sum_{i=1}^{n} \left(\frac{y_i - \hat{y}_i}{y_i}\right)^2}$$

---

## 2. Dataset

| File | Description |
|------|-------------|
| `train.csv` | Historical daily sales for all stores |
| `store.csv` | Static metadata per store |
| `test.csv`  | Held-out period for submission |

### Key Columns

**`train.csv`**

| Column | Type | Description |
|--------|------|-------------|
| `Store` | int | Unique store ID (1–1115) |
| `DayOfWeek` | int | 1 = Monday … 7 = Sunday |
| `Date` | date | Transaction date |
| `Sales` | int | Daily turnover in EUR |
| `Customers` | int | Daily footfall |
| `Open` | bool | 0 = closed, 1 = open |
| `Promo` | bool | Whether a promotion was running |
| `StateHoliday` | str | `0`=None, `a`=Public, `b`=Easter, `c`=Christmas |
| `SchoolHoliday` | bool | Whether schools were closed |

**`store.csv`**

| Column | Description |
|--------|-------------|
| `StoreType` | Store format category: `a`, `b`, `c`, `d` |
| `Assortment` | `a`=Basic, `b`=Extra, `c`=Extended |
| `CompetitionDistance` | Distance (m) to nearest competitor |
| `CompetitionOpenSinceMonth/Year` | When competition opened |
| `Promo2` | Whether the store runs a sustained promotional campaign |
| `Promo2SinceWeek/Year` | When Promo2 started |
| `PromoInterval` | Months Promo2 restarts (e.g. `"Feb,May,Aug,Nov"`) |

After merging both files the working dataset has **1,017,209 rows × 18 columns** (before feature engineering).

---

## 3. Tech Stack

| Layer | Library / Tool |
|-------|---------------|
| Data wrangling | `pandas`, `numpy` |
| Visualisation | `matplotlib`, `seaborn`, `plotly` |
| Machine learning | `scikit-learn`, `xgboost`, `lightgbm` |
| Explainability | `shap` |
| Statistics | `scipy.stats` |
| Serialisation | `joblib`, `pickle` |
| API | `app.py` (UptimeRobot health endpoint) |
| Front-end | Next.js (Vercel) |

Python version: **3.x** · Kernel: **Python 3**

---

## 4. Exploratory Data Analysis

### 4.1 Sales Distribution

- Raw sales are **right-skewed** — log-transformation `log1p(Sales)` normalises the distribution.
- Outlier analysis via the **IQR fence method**:

$$\text{Lower fence} = Q_1 - 1.5 \times \text{IQR}, \quad \text{Upper fence} = Q_3 + 1.5 \times \text{IQR}$$

Approximately **3.64%** of open-store observations fall outside these bounds.

### 4.2 Temporal Trends

- Monthly average sales plotted with a **3-month rolling mean** to smooth short-term noise.
- Clear **seasonal spikes** visible in November–December (holiday trading).

### 4.3 Day-of-Week Effect

- **Friday** records the highest average daily sales.
- **Sunday/Monday** record the lowest, partially explained by reduced operating hours.

### 4.4 Store Type & Assortment

| Store Type | Avg Sales (€) |
|-----------|--------------|
| b | Highest |
| a | Moderate |
| c | Moderate |
| d | Lowest |

- **Extra assortment** (`b`) yields the highest average sales among assortment levels.
- **Basic assortment** (`a`) and **Extended** (`c`) trail behind.

### 4.5 Promotional Effect

| Condition | Avg Sales (€) | Sales Lift |
|-----------|--------------|-----------|
| No Promo  | baseline     | —         |
| Promo Active | higher   | **≈ +38.77%** |

`Promo2` does **not** show a comparable direct lift — it is a long-running background promotion with subtler impact.

### 4.6 Holiday Effects

- **Christmas** and **Easter** holidays produce the highest average store sales.
- School holidays show a statistically significant positive effect on turnover.

### 4.7 Competition Distance

- **Pearson r ≈ −0.036** — a weak negative relationship: stores with nearby competitors (<500 m) actually exhibit slightly *higher* average sales, likely due to high-footfall urban locations.

### 4.8 Feature Correlation

| Feature | Correlation with Sales |
|---------|----------------------|
| `Customers` | **0.89** (strongest) |
| `Promo` | 0.45 |
| `DayOfWeek` | −0.15 |
| `CompetitionDistance` | −0.036 |

---

## 5. Statistical Hypothesis Testing

All tests use **α = 0.05**.

### 5.1 Promotion A/B Test (Mann-Whitney U)

$$H_0: \text{Median}(\text{Sales}_{Promo=1}) \leq \text{Median}(\text{Sales}_{Promo=0})$$

- **p-value ≈ 0.00** → **Reject H₀**
- Promotions **significantly increase** sales.

### 5.2 Store Type Test (Kruskal-Wallis)

$$H_0: \text{Sales distributions are equal across all store types}$$

- **p-value ≈ 0.00** → **Reject H₀**
- Store types have **significantly different** sales distributions.

### 5.3 School Holiday Test (Mann-Whitney U, two-sided)

$$H_0: \text{Median}(\text{Sales}_{SchoolHoliday=1}) = \text{Median}(\text{Sales}_{SchoolHoliday=0})$$

- **p-value ≈ 0.00** → **Reject H₀**
- School holidays **significantly affect** sales.

---

## 6. Feature Engineering

The pipeline constructs **35+ features** across five categories:

### 6.1 Date & Cyclical Features

Extracted components: `Year`, `Month`, `WeekOfYear`, `DayOfYear`, `DayOfWeek`

Binary flags: `IsWeekend`, `IsMonthStart`, `IsMonthEnd`

**Cyclical encoding** prevents ordinal misinterpretation by the model:

$$\text{Month\_sin} = \sin\!\left(\frac{2\pi \cdot \text{Month}}{12}\right), \quad \text{Month\_cos} = \cos\!\left(\frac{2\pi \cdot \text{Month}}{12}\right)$$

$$\text{Dow\_sin} = \sin\!\left(\frac{2\pi \cdot \text{DayOfWeek}}{7}\right), \quad \text{Dow\_cos} = \cos\!\left(\frac{2\pi \cdot \text{DayOfWeek}}{7}\right)$$

### 6.2 Missing Value Imputation

| Feature | Strategy |
|---------|---------|
| `CompetitionDistance` | Median imputation |
| `CompetitionOpenSinceMonth/Year` | Fill 0 → cast `int` |
| `Promo2SinceWeek/Year` | Fill 0 → cast `int` |
| `PromoInterval` | Fill `"None"` |

### 6.3 Competition Features

- **`CompetitionOpenMonths`** — elapsed months since a competitor opened:

$$\text{CompetitionOpenMonths} = \max\!\left(0,\ \frac{(\text{Date} - \text{CompOpenDate}).days}{30}\right)$$

- **`CompetitionDistanceBin`** — ordinal binning: `[0, 500)`, `[500, 2k)`, `[2k, 5k)`, `[5k, 10k)`, `≥10k` metres.

### 6.4 Promotion Features

- **`Promo2Active`** — binary flag; set to 1 when the current month string appears in `PromoInterval`.
- **`PromoOpenMonths`** — elapsed months since Promo2 started, clipped ≥ 0.

### 6.5 Interaction Features

| Feature | Formula |
|---------|---------|
| `Promo_DayOfWeek` | `Promo × DayOfWeek` |
| `Promo_Competition` | `Promo × CompetitionDistance` |
| `Promo2_Competition` | `Promo2Active × CompetitionDistance` |

### 6.6 Target Transformation

Log-transform the target to reduce the effect of high-value outliers and stabilise variance:

$$\text{LogSales} = \ln(1 + \text{Sales})$$

Predictions are back-transformed via:

$$\hat{\text{Sales}} = e^{\hat{y}} - 1 = \text{expm1}(\hat{y})$$

### 6.7 Categorical Encoding

One-hot encoding (no `drop_first`) applied to: `StoreType`, `Assortment`, `StateHoliday`.

---

## 7. Model Architecture

### 7.1 Train / Validation Split

A **temporal hold-out** split is used (no data leakage):

| Set | Date Range |
|-----|-----------|
| Train | `< 2015-06-15` |
| Validation | `≥ 2015-06-15` |

### 7.2 Baseline

A `DummyRegressor(strategy='mean')` provides a naive benchmark to beat.

### 7.3 LightGBM

```python
lgb.LGBMRegressor(
    n_estimators    = 5000,
    learning_rate   = 0.02,
    num_leaves      = 127,
    subsample       = 0.8,
    colsample_bytree= 0.8,
    random_state    = 42
)
```

- Early stopping with patience = **200 rounds**.
- Custom `rmspe_lgb` callback evaluates RMSPE on the validation set after back-transforming predictions.

### 7.4 XGBoost

```python
xgb.XGBRegressor(
    objective           = 'reg:squarederror',
    n_estimators        = 5000,
    learning_rate       = 0.02,
    max_depth           = 10,
    min_child_weight    = 20,
    subsample           = 0.8,
    colsample_bytree    = 0.7,
    early_stopping_rounds = 200,
    random_state        = 42,
    n_jobs              = -1
)
```

Predictions use `iteration_range=(0, best_iteration + 1)` to prevent over-shooting beyond early stop.

### 7.5 Saved Artefacts

| File | Description |
|------|-------------|
| `lgb_model.pkl` | LightGBM (with `Customers`) |
| `xgb_model.pkl` | XGBoost (with `Customers`) |
| `lgb_model_with_customer_without_lag.pkl` | LightGBM, no lag features |
| `xgb_model_with_customer_without_lag.pkl` | XGBoost, no lag features |
| `feature_columns.pkl` | Ordered list of training column names |

---

## 8. Evaluation Metrics

| Metric | Formula | Goal |
|--------|---------|------|
| **RMSPE** | $\sqrt{\frac{1}{n}\sum\left(\frac{y-\hat{y}}{y}\right)^2}$ | **Primary (Kaggle)** — lower is better |
| MAE | $\frac{1}{n}\sum\|y-\hat{y}\|$ | Absolute average error in € |
| RMSE | $\sqrt{\frac{1}{n}\sum(y-\hat{y})^2}$ | Penalises large errors |
| R² | $1 - \frac{\text{SS}_\text{res}}{\text{SS}_\text{tot}}$ | Proportion of variance explained |

---

## 9. Results

### Final Model Comparison (Customers Feature Included)

| Model | MAE (€) | RMSE (€) | R² | RMSPE |
|-------|---------|---------|-----|-------|
| **XGBoost** | **268.82** | **440.66** | **0.9861** | **0.0588** |
| LightGBM | 282.38 | 460.72 | 0.9848 | 0.0601 |

**XGBoost** edges out LightGBM on all four metrics and is selected as the **production model**.

### Key Observations

- Both models explain **≥98.5%** of the variance in daily sales (`R² ≥ 0.985`).
- RMSPE below **0.06** places this pipeline in a highly competitive range for the Rossmann Kaggle benchmark.
- Residual plots confirm predictions are centred around zero without systematic bias.

### Top Predictive Features (LightGBM Feature Importance)

1. `Customers` — footfall is the single strongest signal
2. `CompetitionOpenMonths` — age of nearby competition
3. `DayOfWeek` / `Dow_sin` / `Dow_cos`
4. `Promo` — promotional activity
5. `Month_sin` / `Month_cos` — seasonal cyclical encoding
6. `CompetitionDistance` / `CompetitionDistanceBin`
7. `Year` / `WeekOfYear` — long-term trend
8. Interaction terms (`Promo_DayOfWeek`, `Promo_Competition`)

---

## 10. Project Setup

### Prerequisites

```bash
Python >= 3.8
```

### Installation

```bash
git clone https://github.com/ShauryaPriyam/RetailLensAI.git
cd RetailLensAI
pip install -r requirements.txt
```

### Running the Notebook

1. Place `rossmann-store-sales.zip` in the project root (download from [Kaggle](https://www.kaggle.com/competitions/rossmann-store-sales/data)).
2. Open `notebooks/retail_sales_intelligence_final.ipynb` in Jupyter or Google Colab.
3. Execute cells sequentially — the notebook is fully self-contained.

### API Health Check

```bash
python app.py
```

Exposes a lightweight endpoint consumed by UptimeRobot for uptime monitoring.

### Front-End

```bash
cd frontend
npm install
npm run dev          # Development server
npm run build        # Production build (Vercel)
```

---

## 📊 EDA Summary

| Insight | Finding |
|---------|---------|
| Sales skewness | Right-skewed; log-transform required |
| Outliers | 3.64% of open-store rows |
| Best day | Friday (highest avg sales) |
| Best store type | Type `b` |
| Best assortment | Extra (`b`) |
| Promo lift | ≈ +38.77% |
| Strongest feature | `Customers` (r = 0.89 with Sales) |
| Competition effect | Weak negative correlation (r = −0.036) |

---

## 🧑‍💻 Author

**ShauryaPriyam** — [GitHub](https://github.com/ShauryaPriyam/RetailLensAI)

---

*Last updated: June 2026*
