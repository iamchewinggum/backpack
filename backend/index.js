


const express = require('express'); // Import Express.js to create the server
const cors = require('cors'); // Import CORS middleware to allow cross-origin requests from the frontend

//Convention is to keep all your requires grouped
//together at the top of the file
//then local files 
const { unpackBackpack,
    addToBackpack,
    emptyBackpack} = require('./data');



const app = express(); // Create an instance of the Express application
//Port Variable
/*
localhost::3000
http://localhost:3000
localhost -> your machine
3000 -> port number
*/
const PORT = 3000; // Define the port on which the server will listen for incoming requests

// Middleware setup
// CORS (Cross-Origin Resource Sharing) allows the frontend (running on a different port) to communicate with the backend without being blocked by the browser's same-origin policy. By using cors(), we enable all cross-origin requests, allowing our frontend to make API calls to this backend server without any issues.
// Telling Express "Run the CORS middleware for every incoming request, allowing cross-origin requests from the frontend." This is essential for enabling communication between the frontend and backend when they are running on different ports during development.

app.use(cors()); // Use CORS middleware to enable cross-origin requests from the frontend
/*
app gets used for
.get
.post
.put
.delete
.listen 
*/






//Parse JSON Bodies
/*
Suppose this is sent: 
{
  "url": "https://google.com",
  "title": "Google"
}
without express.json() middleware, req.body would be undefined in the route handler, and we wouldn't be able to access the url and title properties. By using express.json(), we can parse the incoming JSON request body and access its properties through req.body, allowing us to handle the data sent from the frontend effectively.
*/
app.use(express.json()); // Middleware to parse incoming JSON requests, allowing us to access req.body in our routes
// Handles HTTP GET request
// This endpoint is a simple health check to confirm that the backend server is running and can respond to requests. It sends a plain text response "Backend is alive" when accessed.

//Express doesn't automatically understand JSON
/*
The middleware converts
raw JSON text
into 

req.body = {
  url: "https://google.com",
  title: "Google"
}
*/

//GET Endpoint
/*
Opening a webpage
Vistiting a URL
Fetching data
*/

//GET Route 
//when someone sends a GET request to /, this function runs
/*

// '/' -> root endpoint, the base URL of the server
// so http://localhost:3000/ -> this endpoint

The Callback funcction 
(req, res) => {
}

express automatically gives you two objects

req -> Request object

conatins info about:
headers 
URL
body
query params

think of it as what did the client send me?

res -> Response object

response object
Used to send something back
think 
what do i want to send back?

*/



app.set('json spaces', 2);

app.get('/', (req, res) => {
  res.send('Backend is alive and well'); // Simple endpoint to check if the server is running
});





// POST Endpoint
// Handles HTTP POST request
/*
"When someone sends a POST request to /tabs,
run this function"

Full URL: http://localhost:3000/tabs

Read Data From the Request Body
const { url, title } = req.body;

this is called object destructuring, it allows us to extract the url and title properties from the req.body object and assign them to variables with the same names. So if req.body is { url: "https://google.com", title: "Google" }, then after this line of code, we will have two variables: url with the value "https://google.com" and title with the value "Google". This makes it easier to work with the data sent in the request body.

Supppose:

req.body = {
  url: "https://google.com",
  title: "Google"
};

Then: 

const { url, title } = req.body;

becomes:

const url = req.body.url;
const title = req.body.title;


so afterwards:

url 

contains: "https://google.com"

and 

title

contains: "Google"






Log the Data
console.log('Received tab:', { url, title });

prints to the terminal:
Received tab: {
  url: 'https://google.com',
  title: 'Google'
}
nothing is sent to the browser, its in the terminal 


Send JSON Back

res.json({
  message: 'Tab received',
  url,
  title
});

res.json()
it sends a JSON response
The browser receives:

{
  "message": "Tab received",
  "url": "https://google.com",
  "title": "Google"
}


*/

//route
app.post('/tabs', (req, res) => {
  const { url, title } = req.body;
  const newTab = addToBackpack({url, title});
  res.json({ message: 'Tab added to backpack', tab: newTab });
});

/*
Listen for Requests
app.listen(PORT, () => {
});

"Start the server and listen for incoming 
requests"

using 
PORT variable we defined earlier, which is 3000


Run a Function When the Server Starts
The second argument to app.listen() is a callback function that gets executed once the server starts successfully and begins listening for incoming requests. 
In this case, we use it to log a message to the console indicating that the server is running and on which URL it can be accessed. 
This is helpful for confirming that the server has started correctly and provides the URL for testing or development purposes.

Output in the terminal when the server starts:
Server running on http://localhost:3000
*/
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  
});




//route to view the whole backpack
app.get('/backpack', (req, res) => {
  res.json(unpackBackpack());
});