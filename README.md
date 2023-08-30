# Get the Jira Dashboard & Filters Owned by Inactive Jira Users in Cloud Script


## Description

Follow the set up directions in the Setup Instructions section to run this script. This script will allow you to find all inactive users in your Jira instance and find any dashboards or filters that they might own. This data is then exported into a CSV file.

## Table of Contents
* [Setup Instructions](#setup-instructions)
* [Usage](#usage)
* [Credits](#credits)
* [Basic Auth](#basic-auth)

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

API_KEY - see Basic Auth section on how to get this value (note: you have to be an org admin for this script to work)

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

## Credits

This was created by anicrob. 

Used this [resource](https://www.geeksforgeeks.org/how-to-create-and-download-csv-file-in-javascript/) to help with creating the csv file.

You can find more of my work at [anicrob](https://github.com/anicrob).

## Basic Auth

Atlassian uses Basic Auth for a few of their REST endpoints for their authentication headers. Here are the steps to get your API token into Basic Auth format:

1. Ensure you have an API key created. Go here to create one if needed: https://id.atlassian.com/manage-profile/security/api-tokens

2. The format of basic auth is username:password then base64. The username is your email associated with your Atlassian account and then the password is the API key.

3. In the terminal run this command: (replacing user@example.com with your Atlassian account email and api_token_string with your api ke from step 1)

~~~
echo -n user@example.com:api_token_string | base64
~~~
