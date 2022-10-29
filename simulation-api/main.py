import json

import pysd
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse

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
        room_temperature: float = 20.0,
        initial_teacup_temperature: float = 20.0,
        final_time_parameter: int = 100.0,
):
    model = pysd.read_vensim("models/Teacup/Teacup.mdl")
    dataframe = model.run(progress=True,
                          params={'Room Temperature': room_temperature},
                          initial_condition=(0, {'teacup_temperature': initial_teacup_temperature}),
                          return_columns=['Teacup Temperature'],
                          final_time=final_time_parameter)
    result = dataframe.to_dict('index')
    # parsed = json.loads(dataframe)
    return JSONResponse(content=result)


@app.get("/model-details")
def get_model_details():
    model = pysd.read_vensim("models/Teacup/Teacup.mdl")
    dataframe = model.doc.to_json(orient="records")
    parsed = json.loads(dataframe)
    return parsed


@app.get("/model-plot")
def get_model_plot():
    model = pysd.read_vensim("models/Teacup/Teacup.mdl")
    model.run()
    return model.plot()


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
