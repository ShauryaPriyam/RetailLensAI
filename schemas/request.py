from pydantic import BaseModel

class ForecastRequest(BaseModel):

    store: int

    date: str

    promo: int

    school_holiday: int

    state_holiday: str = "0"

    customers: int

    open: int


class ForecastRangeRequest(BaseModel):

    store: int

    start_date: str

    days: int = 30

    promo: int

    school_holiday: int

    state_holiday: str = "0"

    customers: int

    open: int