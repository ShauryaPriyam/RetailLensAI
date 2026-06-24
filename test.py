import pandas as pd

df = pd.read_csv("data/store_metadata.csv")

print(df.columns.tolist())
print(df.head(2))