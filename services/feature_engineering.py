import pandas as pd
import numpy as np

from services.store_service import get_store


MONTH_MAP = {
    1: 'Jan',
    2: 'Feb',
    3: 'Mar',
    4: 'Apr',
    5: 'May',
    6: 'Jun',
    7: 'Jul',
    8: 'Aug',
    9: 'Sept',
    10: 'Oct',
    11: 'Nov',
    12: 'Dec'
}


def create_features(request):

    store = get_store(request["store"])

    if store is None:
        raise ValueError(
            f"Store {request['store']} not found"
        )

    date = pd.to_datetime(request["date"])

    features = {}

    # ==================================
    # RAW FEATURES
    # ==================================

    features["Store"] = request["store"]

    features["DayOfWeek"] = date.dayofweek + 1

    features["Customers"] = request["customers"]

    features["Open"] = request["open"]

    features["Promo"] = request["promo"]

    features["SchoolHoliday"] = request["school_holiday"]

    features["CompetitionDistance"] = float(
        store["CompetitionDistance"]
    )

    features["CompetitionOpenSinceMonth"] = int(
        store["CompetitionOpenSinceMonth"]
    )

    features["CompetitionOpenSinceYear"] = int(
        store["CompetitionOpenSinceYear"]
    )

    features["Promo2"] = int(store["Promo2"])

    features["Promo2SinceWeek"] = int(
        store["Promo2SinceWeek"]
    )

    features["Promo2SinceYear"] = int(
        store["Promo2SinceYear"]
    )

    # ==================================
    # DATE FEATURES
    # ==================================

    features["Year"] = date.year

    features["Month"] = date.month

    features["WeekOfYear"] = int(
        date.isocalendar().week
    )

    features["DayOfYear"] = int(
        date.dayofyear
    )

    features["IsWeekend"] = int(
        features["DayOfWeek"] >= 6
    )

    features["IsMonthStart"] = int(
        date.is_month_start
    )

    features["IsMonthEnd"] = int(
        date.is_month_end
    )

    # ==================================
    # CYCLICAL FEATURES
    # ==================================

    features["Month_sin"] = np.sin(
        2 * np.pi * features["Month"] / 12
    )

    features["Month_cos"] = np.cos(
        2 * np.pi * features["Month"] / 12
    )

    features["Dow_sin"] = np.sin(
        2 * np.pi * features["DayOfWeek"] / 7
    )

    features["Dow_cos"] = np.cos(
        2 * np.pi * features["DayOfWeek"] / 7
    )

    # ==================================
    # COMPETITION FEATURES
    # ==================================

    try:

        comp_date = pd.to_datetime(
            {
                "year": [
                    np.nan
                    if features[
                        "CompetitionOpenSinceYear"
                    ] == 0
                    else features[
                        "CompetitionOpenSinceYear"
                    ]
                ],
                "month": [
                    np.nan
                    if features[
                        "CompetitionOpenSinceMonth"
                    ] == 0
                    else features[
                        "CompetitionOpenSinceMonth"
                    ]
                ],
                "day": [1]
            },
            errors="coerce"
        )[0]

        features["CompetitionOpenMonths"] = max(
            0,
            (date - comp_date).days / 30
        )

    except:
        features["CompetitionOpenMonths"] = 0

    dist = features["CompetitionDistance"]

    if dist <= 500:
        features["CompetitionDistanceBin"] = 0
    elif dist <= 2000:
        features["CompetitionDistanceBin"] = 1
    elif dist <= 5000:
        features["CompetitionDistanceBin"] = 2
    elif dist <= 10000:
        features["CompetitionDistanceBin"] = 3
    else:
        features["CompetitionDistanceBin"] = 4

    # ==================================
    # PROMO FEATURES
    # ==================================

    month_name = MONTH_MAP[
        features["Month"]
    ]

    promo_interval = str(
        store.get("PromoInterval", "None")
    )

    if features["Promo2"] == 0:
        features["Promo2Active"] = 0

    else:

        promo_months = promo_interval.split(",")

        features["Promo2Active"] = int(
            month_name in promo_months
        )

    try:

        if features["Promo2SinceYear"] == 0:

            features["PromoOpenMonths"] = 0

        else:

            promo_date = pd.to_datetime(
                f"{features['Promo2SinceYear']}-01-01"
            )

            features["PromoOpenMonths"] = max(
                0,
                (date - promo_date).days / 30
            )

    except:

        features["PromoOpenMonths"] = 0

    # ==================================
    # INTERACTION FEATURES
    # ==================================

    features["Promo_DayOfWeek"] = (
        features["Promo"]
        * features["DayOfWeek"]
    )

    features["Promo_Competition"] = (
        features["Promo"]
        * features["CompetitionDistance"]
    )

    features["Promo2_Competition"] = (
        features["Promo2Active"]
        * features["CompetitionDistance"]
    )

    # ==================================
    # STORE TYPE
    # ==================================

    features["StoreType_a"] = store["StoreType_a"]
    features["StoreType_b"] = store["StoreType_b"]
    features["StoreType_c"] = store["StoreType_c"]
    features["StoreType_d"] = store["StoreType_d"]

    # ==================================
    # ASSORTMENT
    # ==================================

    features["Assortment_a"] = store["Assortment_a"]
    features["Assortment_b"] = store["Assortment_b"]
    features["Assortment_c"] = store["Assortment_c"]

    # ==================================
    # STATE HOLIDAY
    # ==================================

    holiday = str(
        request.get(
            "state_holiday",
            "0"
        )
    )

    for x in ["0", "a", "b", "c"]:

        features[
            f"StateHoliday_{x}"
        ] = int(
            holiday == x
        )

    return features