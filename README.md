# Flare - Messenger

![App Screenshot](https://i.ibb.co/QrgKmKD/flare-background.jpg)

## Description
[Flare - Messenger](https://flare-messenger.com/) is a messenger app built with web technologies such as React and WebSockets. Some features includes private- and group-chats, custom profile, photo uploads, gif-files, in-app camera. 

I built this app because I wanted a place I could send messages to friends no matter which device or browser im using, the goal is to make a messenger app as accessible as possible.

## Installation

### Prerequisites
1. You need to have [MonogDb](https://www.mongodb.com/) installed locally on your machine.
2. Make sure you also have [Node.js](https://nodejs.org/en/) and NPM installed
3. Make an account on cloudinary and add the following inside a .env file in the server folder:
(Cloudinary is used for image uploading)
```
CLOUDINARY_CLOUD_NAME=[your_cloud_name]
CLOUDINARY_KEY=[your_api_key]
CLOUDINARY_SECRET=[your_api_secret]
```

### Installation
1. First create a folder where you want the project to be installed
2. Clone project:
```bash
git clone https://github.com/CarlssonK/flare.git .
```
3. Install packages in both client and server folders
```bash
cd client && npm i && cd ../server && npm i
```
4. Start MongoDb on your machine and start both server and client servers with ```npm start```
5. Open up a web browser and go to ```http://localhost:3000```

## Technologies
* React.js
* SCSS
* Node.js
* Express
* Socket.io
* MongoDb

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
https://choosealicense.com/licenses/mit/
