Create 2 railway services. Point the first one to ROOT DIRECTORY backend. Point the second one to ROOT DIRECTORY `.`.

The ROOT DIRECTORY requires an additional service variable equal to ${{backend.RAILWAY_PRIVATE_DOMAIN}}:8080

The BACKEND needs a fixed PORT service variable that is equal to that in the service variable above.