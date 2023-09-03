# Get CSV of the Jira Dashboard & Filters Owned by Inactive Jira Users in Cloud Script


## Description

Follow the set up directions in the Setup Instructions section to run this script. This script will allow you to find any dashboards or filters that inactive Jira users might own. This data is then exported into a CSV file.

## Table of Contents
* [Setup Instructions](#setup-instructions)
* [Usage](#usage)
* [Basic Auth](#basic-auth)
* [Permissions](#permissions)
* [Credits](#credits)


## Setup Instructions

Here are the setup steps:

1. Ensure you have Node.js downloaded: https://nodejs.org/en (note this link is for MacOS)

Select the option on the left. 

To check and see if you have node already installed or if the install was successful, run the command:

~~~
node -v
~~~

2. After doing a git clone, install the necessary packages. They are already added to the package.json, so all that's needed is to run the following commmand:
~~~
npm i
~~~

3. Set up an .env file

Run the following command:
~~~
touch .env
~~~

Add two values to this file with the following titles:

API_KEY - see Basic Auth section on how to get this value; see permissions section to see which permissions this user needs

URL - this is the Atlassian url instance (e.g. https://your-domain.atlassian.net)

## Usage

To use this script, run it by using the following command:

~~~
npm run start
~~~

OR

~~~
node index.js
~~~

## Basic Auth

Atlassian uses Basic Auth for a few of their REST endpoints for their authentication headers. Here are the steps to get your API token into Basic Auth format:

1. Ensure you have an API key created. Go here to create one if needed: https://id.atlassian.com/manage-profile/security/api-tokens

2. The format of basic auth is username:password then base64. The username is your email associated with your Atlassian account and then the password is the API key.

3. In the terminal run this command: (replacing user@example.com with your Atlassian account email and api_token_string with your api ke from step 1)

~~~
echo -n user@example.com:api_token_string | base64
~~~

## Permissions 

The only permissions needed for this script is the Browse users and groups global permission for the Get all Users REST API endpoint. No other permissions are needed, but please note that the dashboards and filters returned depend on the following:

Only the following filters that match the query parameters are returned:

- filters owned by the user.
- filters shared with a group that the user is a member of.
- filters shared with a private project that the user has Browse projects project permission for.
- filters shared with a public project.
- filters shared with the public. 

The following dashboards that match the query parameters are returned:

- Dashboards owned by the user. Not returned for anonymous users.
- Dashboards shared with a group that the user is a member of. Not returned for anonymous users.
- Dashboards shared with a private project that the user can browse. Not returned for anonymous users.
- Dashboards shared with a public project.
- Dashboards shared with the public.

Therefore, this script cannot guarantee that ALL dashboards and filters owned by inactive users are returned, but any available based on the above limitations to the API endpoints. 

## Credits

This was created by anicrob. 

Jira Cloud REST APIs Endpoints used: 
- [Search for Filters](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-filters/#api-rest-api-3-filter-search-get)
- [Search for Dashboards](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-dashboards/#api-rest-api-3-dashboard-search-get)
- [Get all Users](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-users/#api-rest-api-3-users-search-get)

Used this [resource](https://www.geeksforgeeks.org/how-to-create-and-download-csv-file-in-javascript/) to help with creating the csv file.

You can find more of my work at [anicrob](https://github.com/anicrob).

