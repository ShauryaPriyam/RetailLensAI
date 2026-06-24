import pandas as pd
import numpy as np

from core.model_loader import (
    lgb_model,
    feature_columns
)


def predict_sales(features):

    X = pd.DataFrame([features])

    X = X.reindex(
        columns=feature_columns,
        fill_value=0
    )

    pred = lgb_model.predict(X)[0]

    sales = np.expm1(pred)

    return round(float(sales), 2)