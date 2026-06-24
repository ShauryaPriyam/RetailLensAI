import joblib

from core.config import ARTIFACT_DIR

# xgb_model = joblib.load(
#     ARTIFACT_DIR / "xgb_model_with_customer_without_lag.pkl"
# )

lgb_model = joblib.load(
    ARTIFACT_DIR / "lgb_model_with_customer_without_lag.pkl"
)

feature_columns = joblib.load(
    ARTIFACT_DIR / "feature_columns_with_customer.pkl"
)