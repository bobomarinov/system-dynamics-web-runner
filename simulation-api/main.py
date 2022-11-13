import json

import pysd
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse

# constant
model_path = "models/Bank Balance/bank_balance.mdl"

app = FastAPI()

origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/model-results")
def get_model_results(
        deposits: float = 20.0,
        initial_balance: float = 20.0,
        final_time_parameter: int = 100.0,
        interest: float = 0.1,
        average_inflation: float = 0.1
):
    model = pysd.read_vensim(model_path)
    dataframe = model.run(progress=True,
                          params={'Deposits': deposits, 'Interest Rate': interest, 'Inflation Rate': average_inflation},
                          initial_condition=(0, {'balance': initial_balance}),
                          return_columns=['Balance', 'Real Balance'],
                          final_time=final_time_parameter)
    result = dataframe.to_dict('index')
    # parsed = json.loads(dataframe)
    return JSONResponse(content=result)


@app.get("/model-details")
def get_model_details():
    model = pysd.read_vensim(model_path)
    dataframe = model.doc.to_json(orient="records")
    parsed = json.loads(dataframe)
    return parsed


@app.get("/model-plot")
def get_model_plot():
    model = pysd.read_vensim(model_path)
    model.run()
    return model.plot()


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
