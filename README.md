# Camping Booking System
CPU6008 - Software Engineering Camping Site Software

# Getting Started
## Clone The Repository
Ensure you have the latest version of Git installed on your system. Open a Git CMD Prompt and change directory to your desired location.
`git clone https://www.github.com/TomPlum/highfarmcamping`

## Install the Relevant NPM Packages
There are number of packages required by the application that must be installed before it can be run. To install a package you must first ensure you have the latest version of NodeJS installed on your system. Open a NodeJS Command Prompt window and change the working directory to the location of the cloned repository. `npm install package_name --save` where 'package_name' is the name of the NPM package. The required packages are as follows;
* `npm i async --save`
* `npm i bcrypt-nodejs --save`
* `npm i body-parser --save`
* `npm i connect-flash --save`
* `npm i cookie-parse --save`
* `npm i express --save`
* `npm i express-session --save`
* `npm i forever --save`
* `npm i morgan --save`
* `npm i mysql --save`
* `npm i node-async-loop --save`
* `npm i nodemailer --save`
* `npm i passport --save`
* `npm i passport-local --save`
* `npm i path --save`
* `npm i pug --save`
* `npm i serve-favicon --save`
* `npm i xoauth2 --save`

`--save` ensures that the dependencies in `package.json` are kept up to date with the latest versions of the packages.

## Start the Application
Open a NodeJS Command Prompt window. Change directory to the location of the cloned git repository. Run the command `npm start`. Should this command fail, try `node bin/www`.

## Logging into the Application
Accesing the root route of the application (`localhost:3000/` or `https://highfarmcamping.com/`) will greet you with a landing page. Here you may login or register. If you do not have an account, you may register one and login to access the application.

## Changing the Server Port
Should you wish to change the port that the application listens on, possibly due to conflicts, you can simply alter the value in the `bin/www` file. Line 15 `let port = normalizePort(process.env.PORT || '3000');` delcares a variable with the given port.

## Authors
* Thomas Plumpton
* Florian Nikollbibaj
* Jack Taylor
* Vincent Heimburg
* Svenja Lebenhagen
* Jonathan Pacek
* Syed Khubaib
