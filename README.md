# eobservatory

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `json-server --watch ./src/server/db.json --port 8000`
Runs the json server for temporary backend

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify


# Folder by partner
The client asks for a personalized URL for every partner so when somebody accesses this URL (http://eobsinnoenergy.com/ANicePartner/) the app is customized with 
some partner specific settings (logo, app name mainly).
* The general strategy is to have a folder for every partner and redirect requests to root folder that contains 
`index.html` that loads the React WPA. This react WPA has some URL query parameters that identify the partner, there are 
other possible parameters like the survey token that is sent in the mail.
* We use S3 to deliver our WPA so we're limited regarding URL transformation.
* This does not apply to email specify URL that do not need to show the partner.
* The issue requires to:
    - Get a default file `index.html` of a given resource (ANicePartner)
    - Load and run WPA code
    - Be easily expandable, adding partners should be easy
* This can be done with a combination of S3 folders + "AWS lambda on the edge".
    - A S3 folder will contain a `index.html` that will allow us to redirect the user to whatever URL we need
    - As default files in subresources are not supported by S3 static webserver or AWD Cloudfront we need a lambda on the
    edge function that transforms `/ANicePartner/`  to `/ANicePartner/index.html` (ending resource with `/` is important)
The process follows:
    * Create a lambda on the edge like this:
    https://aws.amazon.com/blogs/compute/implementing-default-directory-indexes-in-amazon-s3-backed-amazon-cloudfront-origins-using-lambdaedge/
    * This needs to be done only once
    * Now you can create a folder with index.html inside which forwards requests to /index.html with the needed parameters.
    * index.html contents:
    
```
<!DOCTYPE html>
<html>
<head>
   <!-- HTML meta refresh URL redirection -->
   <meta http-equiv="refresh" 
   content="0; url=/?partner=greenunivers">
</head>
<body>
</body>
</html>
```
    * To add a new partner just create a folder in the S3 deploy bucket with the desired name, place `index.html` inside and
tune partner parameter.
    * App will be responsible, once loaded, to change browser location to partner location so URL is not `index.html?partner=XXX` but
    `/ANicePartner`
