import pandas as pd
import joblib

from core.config import DATA_DIR
from core.model_loader import lgb_model, feature_columns

stores_df = pd.merge(
    pd.read_csv(DATA_DIR / "store_metadata.csv"),
    pd.read_csv(DATA_DIR / "store_locations.csv"),
    on="Store",
    how="left"
)

model = lgb_model


def get_dashboard():

    # ==================================
    # OVERVIEW
    # ==================================

    overview = {
        "total_stores": int(len(stores_df)),
        "total_countries": int(
            stores_df["Country"].nunique()
        ),
        "total_cities": int(
            stores_df["City"].nunique()
        ),
        "promo2_active_stores": int(
            stores_df["Promo2"].sum()
        ),
        "avg_daily_sales": round(
            float(stores_df["Sales"].mean()),
            2
        ),
        "avg_daily_customers": round(
            float(stores_df["Customers"].mean()),
            2
        )

    }

    # ==================================
    # STORE TYPES
    # ==================================

    store_types = {
        "A": int(stores_df["StoreType_a"].sum()),
        "B": int(stores_df["StoreType_b"].sum()),
        "C": int(stores_df["StoreType_c"].sum()),
        "D": int(stores_df["StoreType_d"].sum())
    }

    # ==================================
    # ASSORTMENTS
    # ==================================

    assortments = {
        "Basic": int(stores_df["Assortment_a"].sum()),
        "Extra": int(stores_df["Assortment_b"].sum()),
        "Extended": int(stores_df["Assortment_c"].sum())
    }

    # ==================================
    # TOP PERFORMING STORES
    # ==================================

    top_stores_df = (
        stores_df
        .groupby("Store")["Sales"]
        .mean()
        .sort_values(ascending=False)
        .head(10)
        .reset_index()
    )

    top_stores_df = top_stores_df.merge(
        stores_df[
            [
                "Store",
                "DisplayName",
                "City",
                "Country"
            ]
        ],
        on="Store",
        how="left"
    )

    top_performing_stores = [
        {
            "store": int(row["Store"]),
            "display_name": row["DisplayName"],
            "city": row["City"],
            "country": row["Country"],
            "avg_daily_sales": round(
                float(row["Sales"]),
                2
            )
        }
        for _, row in top_stores_df.iterrows()
    ]

    # ==================================
    # KEY SALES FACTORS
    # ==================================

    feature_names = model.feature_names_in_

    importance_map = {
        "Customers": "Customer Traffic",
        "Store": "Store Characteristics",
        "CompetitionDistance": "Competition Distance",
        "CompetitionOpenMonths": "Competition Presence",
        "DayOfYear": "Seasonality",
        "PromoOpenMonths": "Promotion Duration",
        "DayOfWeek": "Weekday Effects",
        "Promo_Competition": "Promotion & Competition",
        "Promo2SinceWeek": "Long-Term Promotions"
    }

    top_features = sorted(
        zip(
            feature_names,
            model.feature_importances_
        ),
        key=lambda x: x[1],
        reverse=True
    )[:10]

    total_importance = sum(
        score for _, score in top_features
    )

    key_sales_factors = [
        {
            "factor": importance_map.get(
                feature,
                feature
            ),
            "importance": round( float(
                score / total_importance * 100
            ),2)
        }
        for feature, score in top_features
    ]

    # ==================================
    # FINAL RESPONSE
    # ==================================

    return {
        "overview": overview,
        "store_types": store_types,
        "assortments": assortments,
        "top_performing_stores": top_performing_stores,
        "key_sales_factors": key_sales_factors
    }