# IVY
IVY league consulting service using machine learning.

## Getting Started
These instructions will help you to install IVY service in your web server. You can run this service on any server that can run Node.js and MongoDB.

### Tested Environments
- Mac OS X 10.13.3
- Ubuntu 16.04

### Prerequisites
Before run these codes, you have to install Node.js and MongoDB depend on environment of your web server. You can find install instructions at the links below. This service is developed on **Node.js v8.9.4** and **MongoDB v3.6.4**. We recommend using same versions.
- Node.js: https://nodejs.org/en/download/package-manager/
- MongoDB: https://docs.mongodb.com/manual/installation/

You have to run MongoDB service on your server after installation.

### Installing
Just clone the git.

    git clone https://github.com/jh95kr2004/IVY.git

Now you have to configure database for this service. Just type the command below on the root directory of this project. If the database of which name is *IVY* is already exists in your MongoDB, you have to drop that database before type commands.

    mongorestore database

## Running the service
### Run Node.js
Just type command below on the root directory of this project.

    node app.js
You SHOULD NOT close the terminal that runs Node.js. Unless the service will be terminated. If you want to run the service as the background service, see this link: [How do I run a node.js app as a background service?](https://stackoverflow.com/questions/4018154/how-do-i-run-a-node-js-app-as-a-background-service)<br>

### Use service
Now you can use IVY service using web browser. Just type the address of your web server on the browser. Default port of this service is 3000.

    http://<address of your webserver>:3000

### Login administrator account
Default account of administrator:
- ID: admin@ivy.com
- PW: 123

If you want to change the ID of administrator account, you have to modify it in the MongoDB manually. But password can be changed in the account page of administrator.

### Make first consultant account
You can add consultant account via administrator page. Make first consultant account and enjoy the service. Initial passwor d of consultant is *123*.

## Caution
This service doesn't have any encryption or security function. So be careful to use your usual password.

## To Do List
- 'EDIT' and 'REMOVE' function for students.
- Make 'CONTACT' page.
- Make 'LEARN' MORE page.
- Add radar chart in the portfolio page.
- Add Secure HTTP (HTTPS)
- Add Activity recommendation function.
- Improve administrator page.

## Known bugs
- Cannot divide interests using comma when type 2-byte charaters.

## Built With
- Front-End: HTML5, CSS3, Javascript, [billboard.js](https://naver.github.io/billboard.js/)
- Back-End: [Node.js](https://nodejs.org/), [MongoDB](https://www.mongodb.com/)

## Authors
 - Ryan Koo: Representative
 - Junghoon Jang: Full-Stack Web developer ([github](https://github.com/jh95kr2004/), [facebook](https://www.facebook.com/jh95kr2004), [instagram](https://www.instagram.com/j_hoooon_/))
