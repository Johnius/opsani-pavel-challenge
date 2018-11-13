This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

This project was made as a part of interview process for Opsani.

It solves the problem of failed request that needs to execute another request that fixes the server for the initial request.
And server fix request should be shared across different other user requests. So whenever some user request fails we have to send a server-fix request, and retry initial user request when server-fix request finishes successfuly. This logic should be applicable or any user request. There shouldn't be more than one simultaneous server-fix request in any given moment in time.