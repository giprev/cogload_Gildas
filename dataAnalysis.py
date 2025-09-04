import pandas as pd
import json

# Path to your file
file_path = "/Users/domitilleprevost/Downloads/jatos_results_data_20250903131954(1).txt"

# First, let's see what the file looks like
df = pd.read_json(file_path, lines=True)
print(f"Shape: {df.shape}")
print(df.head())
print(str(df.iloc[0, -1])[-200:])
print(str(df.iloc[1, -1])[-200:])
print(str(df.iloc[1, 200]['subject']))
print(str(df.iloc[0, 200]['subject']))
print(str(df.iloc[0, -1]))


df_normalized = pd.json_normalize(df)
print(f"Normalized shape: {df_normalized.shape}")
print(df_normalized.head())