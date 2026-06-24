from fastapi import APIRouter, HTTPException
from datetime import timedelta
import pandas as pd

from schemas.request import ForecastRangeRequest, ForecastRequest

from services.feature_engineering import (
    create_features
)

from services.predictor import (
    predict_sales
)

router = APIRouter(
    prefix="/api/forecast",
    tags=["Forecast"]
)


@router.post("")
def forecast(request: ForecastRequest):

    try:

        features = create_features(
            request.model_dump()
        )

        prediction = predict_sales(
            features
        )

        return {
            "success": True,
            "store": request.store,
            "prediction": prediction
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
    

@router.post("/range")
def forecast_range(
    request: ForecastRangeRequest
):

    try:

        start_date = pd.to_datetime(
            request.start_date
        )

        forecasts = []

        total_sales = 0

        for i in range(request.days):

            current_date = (
                start_date
                + timedelta(days=i)
            )

            payload = {
                "store": request.store,
                "date": current_date.strftime(
                    "%Y-%m-%d"
                ),
                "promo": request.promo,
                "school_holiday":
                    request.school_holiday,
                "state_holiday":
                    request.state_holiday,
                "customers":
                    request.customers,
                "open":
                    request.open,
            }

            features = create_features(
                payload
            )

            prediction = predict_sales(
                features
            )

            total_sales += prediction

            forecasts.append(
                {
                    "date":
                        current_date.strftime(
                            "%Y-%m-%d"
                        ),
                    "sales":
                        prediction
                }
            )

        return {
            "success": True,
            "store": request.store,
            "days": request.days,
            "total_sales":
                round(total_sales, 2),
            "average_sales":
                round(
                    total_sales /
                    request.days,
                    2
                ),
            "forecast":
                forecasts
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )    