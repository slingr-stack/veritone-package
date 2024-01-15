<table class="table" style="margin-top: 10px">
    <thead>
    <tr>
        <th>Title</th>
        <th>Last Updated</th>
        <th>Summary</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>Veritone package</td>
        <td>January 12, 2024</td>
        <td>Detailed description of the API of the Veritone package.</td>
    </tr>
    </tbody>
</table>

# Overview

Veritone is a leading provider of artificial intelligence (AI) technology and solutions. 
The company's proprietary operating system, aiWARETM, 
orchestrates an expanding ecosystem of machine learning models to transform audio, 
video and other data sources into actionable intelligence.

Reference the [GraphQL API](https://docs.veritone.com/#/apis/using-graphql) and [GraphQL API Documentation](https://api.veritone.com/v3/graphqldocs/) for more information.

## Package

1. Go to the App Builder of your Application in the section "Packages," MARKETPLACE, veritone, and click on the button "Install."
2. Copy the last field "OAuth callback" (We will complete the fields in the Slingr App again after creating the Veritone App).
3. You will need to create an account at Veritone [here](https://www.veritone.com/careers/contact-us/)
4. Login to Veritone in Content Management System [Login](https://login.veritone.com/) (Make sure to select the correct environment [stage/prod] and location [us-1/uk-1..])
5. Go to the Developer App [here](https://developer.veritone.com/overview)
6. Open the Applications section and create a new application by clicking the button "+ Create New" -> Application.
7. Complete the fields with name and description of your choice.
   The URL and Oauth URL fields have to be based on those copied in step 2.**
   (i.e. URL: https://applicationtest.slingr.io/dev/runtime and Oauth URL:
   https://applicationtest.slingr.io/dev/packages/veritone/authCallback)
   and click on the button "SUBMIT".
8. Under the Veritone App name, you will see the Client ID and Client Secret (after revealing it). Copy these values and complete the fields in the Slingr App.
9. You will need to create an action under the User Entity to login with the Oauth Dependency of Veritone Package. `pkg.veritone.api.getAccessToken();`
10. When you perform the Push of the Slingr application, and make click on the previous created action,
   you will be prompted to log in to Veritone, once done, the package is fully configured
   (This last step of logging in to Veritone will be requested to all users who use the Slingr App).

- The environment and Geographic region (Or location) fields can be obtained from the url from which you are registered and to which you are logging in step 4.

## Single Sign On

There is an option in the Security section of the Builder of each Slingr Application
that allows to configure a Single Sign On,
this package is necessary to be able to configure this SSO.

After configuring the Package and the Veritone Application:

1. Go to the App Builder of your Application in the section "Security -> Single Sign On" and click on the button "+ Create."
2. Select type "Veritone" and complete the fields with the label and name.
3. Select the same environment and location as in the Veritone Package.
4. Copy the field OAuth redirect URI provided by the Veritone Package. (Same value as in step 2 or 7 of the Package configuration)
5. Complete the fields "Client ID" and "Client Secret" with the values obtained in the Veritone Application.
6. Click on the button "+ Create" and then "Push changes."

# Javascript API

The Javascript API of the Veritone package has two pieces:

- **HTTP requests**
- **Flow steps**

## HTTP requests
You can make `GET`,`PUT`,`PATCH`,`DELETE`
requests to the [veritone API](https://api.veritone.com/v3/graphqldocs/) like this:
```javascript
var response = pkg.veritone.api.post("/v3/graphql", {query: "{graphqlServiceInfo {buildInfo}}"})
```

Please take a look at the documentation of the [HTTP service](https://github.com/slingr-stack/http-service)
for more information about generic requests.

## Flow Step

As an alternative option to using scripts, you can make use of Flows and Flow Steps specifically created for the package:
<details>
    <summary>Click here to see the Flow Steps</summary>

<br>

### Generic Flow Step

Generic flow step for full use of the entire package and its services.

<h3>Inputs</h3>

<table>
    <thead>
    <tr>
        <th>Label</th>
        <th>Type</th>
        <th>Required</th>
        <th>Default</th>
        <th>Visibility</th>
        <th>Description</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>URL (Method)</td>
        <td>choice</td>
        <td>yes</td>
        <td> - </td>
        <td>Always</td>
        <td>
            This is the http method to be used against the package. <br>
            Possible values are: <br>
            <i><strong>GET,PUT,PATCH,DELETE</strong></i>
        </td>
    </tr>
    <tr>
        <td>URL (Path)</td>
        <td>choice</td>
        <td>yes</td>
        <td> - </td>
        <td>Always</td>
        <td>
            The url to which this package will send the request. This is the exact service to which the http request will be made. <br>
            Possible values are: <br>
            <i><strong>/testPath<br>/path3<br>/path1/{testPath}<br>/path2?param2=' + httpOptions.query.param2 + '&param3=' + httpOptions.query.param3 + '<br>/path4<br></strong></i>
        </td>
    </tr>
    <tr>
        <td>Headers</td>
        <td>keyValue</td>
        <td>no</td>
        <td> - </td>
        <td>Always</td>
        <td>
            Used when you want to have a custom http header for the request.
        </td>
    </tr>
    <tr>
        <td>Query Params</td>
        <td>keyValue</td>
        <td>no</td>
        <td> - </td>
        <td>Always</td>
        <td>
            Used when you want to have a custom query params for the http call.
        </td>
    </tr>
    <tr>
        <td>Body</td>
        <td>json</td>
        <td>no</td>
        <td> - </td>
        <td>Always</td>
        <td>
            A payload of data can be sent to the server in the body of the request.
        </td>
    </tr>
    <tr>
        <td>Override Settings</td>
        <td>boolean</td>
        <td>no</td>
        <td> false </td>
        <td>Always</td>
        <td></td>
    </tr>
    <tr>
        <td>Follow Redirect</td>
        <td>boolean</td>
        <td>no</td>
        <td> false </td>
        <td> overrideSettings </td>
        <td>It Indicates that the resource has to be downloaded into a file instead of returning it in the response.</td>
    </tr>
    <tr>
        <td>Download</td>
        <td>boolean</td>
        <td>no</td>
        <td> false </td>
        <td> overrideSettings </td>
        <td>If true, the method won't return until the file has been downloaded, and it will return all the information of the file.</td>
    </tr>
    <tr>
        <td>File name</td>
        <td>text</td>
        <td>no</td>
        <td></td>
        <td> overrideSettings </td>
        <td>If provided, the file will be stored with this name. If empty, the file name will be calculated from the URL.</td>
    </tr>
    <tr>
        <td>Full response</td>
        <td> boolean </td>
        <td>no</td>
        <td> false </td>
        <td> overrideSettings </td>
        <td>Includes extended information about response</td>
    </tr>
    <tr>
        <td>Connection Timeout</td>
        <td> number </td>
        <td>no</td>
        <td> 5000 </td>
        <td> overrideSettings </td>
        <td>Connect a timeout interval in milliseconds (0 = infinity).</td>
    </tr>
    <tr>
        <td>Read Timeout</td>
        <td> number </td>
        <td>no</td>
        <td> 60000 </td>
        <td> overrideSettings </td>
        <td>Read a timeout interval in milliseconds (0 = infinity).</td>
    </tr>
    </tbody>
</table>

<h3>Outputs</h3>

<table>
    <thead>
    <tr>
        <th>Name</th>
        <th>Type</th>
        <th>Description</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>response</td>
        <td>object</td>
        <td>
            Object resulting from the response to the package call.
        </td>
    </tr>
    </tbody>
</table>


</details>

## Dependencies
* HTTP Service (v1.3.9)
* Oauth Package (v1.0.20)

# About SLINGR

SLINGR is a low-code rapid application development platform that accelerates development, with robust architecture for integrations and executing custom workflows and automation.

[More info about SLINGR](https://slingr.io)

# License

This package is licensed under the Apache License 2.0. See the `LICENSE` file for more details.
