import azure.functions as func

app = func.FunctionApp()

@app.route(route="test", methods=["GET"], auth_level=func.AuthLevel.ANONYMOUS)
def test_function(req: func.HttpRequest) -> func.HttpResponse:
    return func.HttpResponse("Test works!", status_code=200)
