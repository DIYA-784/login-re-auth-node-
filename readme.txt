in package.json 

the start is for prodution and dev is for development server.

node --watch --trace-warnings --env-file=.env index.js    => it will run index.js and the watch and warning flags are used to restart the server when we make any changes.

previously we use nodemon for this restart