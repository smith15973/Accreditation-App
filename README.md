<h1>ARC (Accreditation Renewal Continuum)</h1>

This project was inspired by John Phillippe, the Training Director at Davis-Besse Nuclear Power plant. The goal of this project was to consolidate and streamline the process of gathering and creating the resources needed to complete an INPO accreditation check for a nuclear power plant's training center. 

<h3>Tech Stack</h3>
This projct was created using <a href="https://www.mongodb.com/">MongoDB</a> to store the data, <a href="https://expressjs.com/en/5x/api.html">Express.js</a> as the Web framework, EJS for templating, and <a href="https://nodejs.org/docs/latest/api/">Node.js</a> as the backend language to run the server. This tech stack was chosen primarily because I was the most familiar with Javascript, so node was an obvious choice. From there mongo and express work very seamlessly due to many of npm packages available with good documentation. This project could be transitioned to React, however I chose not to do this because I didn't believe the scale was large enough to warrant it, and I am more familiar with EJS syntax. 

<h3>Storage</h3>
In addition to that, I chose to use AWS S3 to store the files and images for the project. AWS was chosen mostly because of how popular it is, but any file storage system could be implemented easily that <a href="https://www.npmjs.com/package/multer">Multer</a> has support for. The Mongo database can either be stored locally on the machine, or can be run in Atlas on the cloud.

<h3>Access and Authentication</h3>
<ol>
<a href="https://www.passportjs.org/packages/">Passport</a> local and passport Microsoft were implemented to allow for secure, conveinent login for the user.

<h3>How to Run Application</h3>

1. Make sure <a href="https://nodejs.org/en/download/package-manager">node</a> is installed on the machine (Developed with v22.1.0).

2. In the terminal, go to the top level of the apps directory and run <b>npm install</b>. This will install all the packages and dependencies in the package.json file.

3. Setup file storage <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/creating-bucket.html">(AWS S3)</a> and <a href="https://www.passportjs.org/packages/passport-microsoft/">Microsft authentication</a> if used.

4. Setup Enviroment variables:
PORT=
SESSION_SECRET=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
S3_REGION=
S3_BUCKET=
DB_URL=
AZURE_CLIENT_ID=
AZURE_CLIENT_SECRET=
AZURE_SECRET_ID=
AZURE_REDIRECT_URL=

5. In the terminal run <b>npm start</b> to startup the application
</ol>

If you want to deploy this project, <a href="https://www.sammeechward.com/deploying-full-stack-js-to-aws-ec2">here</a> is the example I followed to setup an EC2 instance on AWS.


© 2024 Noah Smith (nosmith2004@gmail.com), All Rights Reserved.


