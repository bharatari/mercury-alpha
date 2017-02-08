# Mercury Alpha

Mercury Alpha is a set of utilities and tools designed for The Mercury. Alpha primarily comprises of Slack integrations and a feature to record Radio UTD live streams.

# Running

After cloning this repository, you'll have to add a `.env` file to the root project directory with the following variables set:

    FB_TOKEN=<facebook access token>
    SOCIAL_HOOK=<slack webhook url>
    RADIO_HOOK=<slack webhook url>

Finally, to be able to run the application, you'll have to transpile the source files:

1. `npm install` to install project dependencies
2. `npm run build` to transpile the source files
3. `npm start` to start the application

# Development

Don't forget to `npm run build` everytime you make changes to the source files. Otherwise, you'll keep running the transpiled version of older code.
