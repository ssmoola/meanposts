{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Launch index.html",
            "type": "firefox",
            "request": "launch",
            "file": "${workspaceRoot}/index.html"
        },
        {
            "name": "Launch localhost",
            "type": "firefox",
            "request": "launch",
            "url": "http://localhost:8001/",
            "webRoot": "${workspaceRoot}"
        },
        {
            "name": "Attach",
            "type": "firefox",
            "request": "attach"
        }
    ]
}