import pandas as pd
import numpy as np
import math
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler

from core.config import DATA_DIR

stores_df = pd.merge(
    pd.read_csv(DATA_DIR / "store_metadata.csv"),
    pd.read_csv(DATA_DIR / "store_locations.csv"),
    on="Store",
    how="left"
)

def get_all_stores():
    return stores_df[
            [
                "Store",
                "DisplayName",
                "City",
                "Country",
                "Latitude",
                "Longitude",
                "StoreType_a",
                "StoreType_b",
                "StoreType_c",
                "StoreType_d",
                "Assortment_a",
                "Assortment_b",
                "Assortment_c"
                
            ]
        ].to_dict("records")

def get_store(store_id: int):

    row = stores_df[
        stores_df["Store"] == store_id
    ]

    if row.empty:
        return None

    row=row.replace({np.nan: None}) 

    return row.iloc[0].to_dict()

def search_stores(query: str):

    query = query.lower().strip()

    mask = (
        stores_df["DisplayName"]
        .str.lower()
        .str.contains(query, na=False)
    )

    results = stores_df.loc[
        mask,
        ["Store", "DisplayName", "City", "Country"]
    ]

    return results.to_dict(
        orient="records"
    )

def get_store_map():

    return stores_df[
        [
            "Store",
            "DisplayName",
            "Latitude",
            "Longitude",
            "City",
            "Country"
        ]
    ].to_dict("records")


def get_similar_stores(
    store_id: int,
    top_k: int = 5
):

    features = [
        "CompetitionDistance",
        "Promo2",
        "CompetitionOpenMonths",
        "PromoOpenMonths",
        "CompetitionDistanceBin",
        "StoreType_a",
        "StoreType_b",
        "StoreType_c",
        "StoreType_d",
        "Assortment_a",
        "Assortment_b",
        "Assortment_c"
    ]

    df = stores_df.copy()

    if store_id not in df["Store"].values:
        return None

    X = df[features].fillna(0)

    scaler = StandardScaler()

    X_scaled = scaler.fit_transform(X)

    target_idx = df[
        df["Store"] == store_id
    ].index[0]

    similarities = cosine_similarity(
        [X_scaled[target_idx]],
        X_scaled
    )[0]

    df["similarity"] = (
        similarities * 100
    ).round(2)

    results = (
        df[df["Store"] != store_id]
        .sort_values(
            "similarity",
            ascending=False
        )
        .head(top_k)
    )

    return results[
        [
            "Store",
            "DisplayName",
            "City",
            "Country",
            "similarity"
        ]
    ].to_dict(
        orient="records"
    )


def get_store_insights(store_id: int):
    row = stores_df[stores_df["Store"] == store_id]
    if row.empty:
        return None

    store = row.iloc[0]
    df = stores_df.copy()

    insights = []

    # Competition distance percentile
    comp_dist = df["CompetitionDistance"].fillna(df["CompetitionDistance"].median())
    store_comp = store["CompetitionDistance"]
    comp_rank = comp_dist.rank(pct=True).loc[store.name] * 100

    if comp_rank < 25:
        insights.append(
            f"This store faces higher nearby competition than about {100 - int(comp_rank)}% of stores."
        )
    elif comp_rank > 75:
        insights.append(
            f"This store has lower nearby competition than about {int(comp_rank)}% of stores."
        )
    else:
        insights.append(
            "This store sits in a moderate competition zone compared with the network."
        )

    # Store type insight
    store_type = "Unknown"
    if store.get("StoreType_a", 0) == 1:
        store_type = "A"
        insights.append("Store Type A locations usually behave like strong baseline performers.")
    elif store.get("StoreType_b", 0) == 1:
        store_type = "B"
        insights.append("Store Type B stores often depend more on promotion timing.")
    elif store.get("StoreType_c", 0) == 1:
        store_type = "C"
        insights.append("Store Type C stores often show steadier, mid-range performance.")
    elif store.get("StoreType_d", 0) == 1:
        store_type = "D"
        insights.append("Store Type D stores can be more location-sensitive than average.")

    # Assortment insight
    assortment = "Unknown"
    if store.get("Assortment_a", 0) == 1:
        assortment = "Basic"
        insights.append("Basic assortment suggests a more focused product mix.")
    elif store.get("Assortment_b", 0) == 1:
        assortment = "Extra"
        insights.append("Extra assortment indicates broader product coverage.")
    elif store.get("Assortment_c", 0) == 1:
        assortment = "Extended"
        insights.append("Extended assortment gives this store the widest product range.")

    # Promo insight
    if store.get("Promo2", 0) == 1:
        insights.append("Promo2 is active, which can support recurring sales lift over time.")
    else:
        insights.append("Promo2 is not active, so sales may rely more on short-term promotions.")

    # Compare to network averages
    avg_comp = df["CompetitionDistance"].median()
    if pd.notna(store_comp):
        if store_comp < avg_comp:
            insights.append("Competition distance is below the network median.")
        elif store_comp > avg_comp:
            insights.append("Competition distance is above the network median.")
        else:
            insights.append("Competition distance is very close to the network median.")

    # Similar stores
    similar = get_similar_stores(store_id, top_k=3)
    if similar:
        similar_names = ", ".join([s["DisplayName"] for s in similar])
        insights.append(f"Most similar stores are {similar_names}.")

    return {
        "store": int(store_id),
        "display_name": store.get("DisplayName"),
        "city": store.get("City"),
        "country": store.get("Country"),
        "store_type": store_type,
        "assortment": assortment,
        "competition_distance": None if pd.isna(store_comp) else float(store_comp),
        "insights": insights,
    } 