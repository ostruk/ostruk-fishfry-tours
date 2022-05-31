[![Build Status](https://app.travis-ci.com/ostruk/ostruk-fishfry-tours.svg?token=yN8ryPBhYxYBm7q6aXmc&branch=master)](https://app.travis-ci.com/ostruk/ostruk-fishfry-tours)

# Fishfry Tours
![Fishfry Tours Screenshot](screenshot1.PNG)

# Documentation
To view published project, navigate to [ostruk-fishfry-tours.herokuapp.com](https://ostruk-fishfry-tours.herokuapp.com/)

## Architecture
### Backend
The backend is written with Node.js and Express.

[api.js](src/api.js) contains all REST endpoints that serve the app.

[utils.js](src/utils.js) contains a utility function that validates if a boat is valid.

[db.js](src/db.js) contains an in-memory database implementation in the form of an array. In production this would be replaced with a SQL database.

### Frontend
The frontend is written with React.js. The list of developed components used in the project can be found in the [components](front/src/Components) folder.

The app uses [asseinfo/react-kanban](https://github.com/asseinfo/react-kanban) library as the starting point for the kanban board feature.

The responsive styling is provided by [React Material UI](https://mui.com/) package. All graphics are provided by [Google's Material Symbols](https://fonts.google.com/icons) icons.

[App.css](front/src/App.css) contains custom CSS to give the board unique coloring style.

Connectivity to API is provided using [Axios](https://axios-http.com/) HTTP client.

Features:
- Displays boats in appropriate columns
- Drag and drop functionality to change the boat status
- Add button to create new boats
- Menu on each card for deleting/editing existing boats

The app has been tested on mobile device and works as expected.

NOTE: The UI doesn't currently handle errors issued by the API.

NOTE: There should be a length limit on the items to prevent UI glitches.

NOTE: UI and API don't handle empty boat name as invalid.

### Testing
Tests are perfomed using the Junit library and are written for both the backend and the frontend portions of the project.

#### Backend testing
Backend tests are contained in [__tests__](__tests__) folder. 

[boat-api.test.js](__tests__/boat-api.test.js) file contains functional tests that verify functionality of all use cases. This is done using [supertest](https://github.com/visionmedia/supertest#readme) library. Tests verify that API endpoints return correct response code and verify that in-memory array used to store data updates correctly.

[db.test.js](__tests__/db.test.js) and [utils.test.js](__tests__/utils.test.js) files contain unit tests that verify functionality of utils.js and db.js files, respectively.

In production an actual database would be used and would have to be mocked with an in-memory solution, such as SQLite or using a docker instance with an actual database.

#### Frontend testing
Frontend tests are contained in the [app-test.js](front/src/__tests__) file. They are DOM tests written with the help of [React's Testing Library](https://testing-library.com/). Axios requests to the API are mocked using Jest's mock function. Tests verify that the board gets rendered with all the items as well as use case functionality by simulating user interactions such as clicking buttons and entering text into input fields.

Other functional tests could be written using [snapshot approach](https://jestjs.io/docs/snapshot-testing) provided by Jest as well as individual component testing and unit tests.

### DevOps Pipeline
[.travis.yml](.travis.yml) file contains build instructions for Travis CI. There are 2 phases - the testing phase and the deployment phase. During testing phase the backend and the frontend tests are ran. If the testing phase is successful, the deployment phase runs, during which the app gets deployed to Heroku.

On Heroku the app runs as a single project, react files are served by the API project when none of the REST API endpoints gets matched. In development http-proxy-middleware package is used to channel requests from the front end to the express project.
