from fastapi import APIRouter, HTTPException

from services.store_service import (
    get_all_stores,
    get_store,
    search_stores,
    get_store_map,
    get_similar_stores,
    get_store_insights,
)

router = APIRouter(
    prefix="/api/stores",
    tags=["Stores"]
)

@router.get("")
def fetch_stores():

    return get_all_stores()

@router.get("/search")
def store_search(q: str):
    return search_stores(q)

@router.get("/map")
def store_map():
    return get_store_map()

@router.get("/{store_id}/similar")
def similar_stores(store_id: int):
    return get_similar_stores(store_id)


@router.get("/{store_id}/insights")
def store_insights(store_id: int):

    result = get_store_insights(
        store_id
    )

    if result is None:
        return {
            "success": False,
            "message": "Store not found"
        }

    return result

@router.get("/{store_id}")
def fetch_store(store_id: int):

    store = get_store(store_id)

    if not store:
        raise HTTPException(
            status_code=404,
            detail="Store not found"
        )

    return store
