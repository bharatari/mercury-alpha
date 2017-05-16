# Mercury Ion

Mercury Ion is a set of utilities and tools designed for The Mercury. Ion primarily comprises of Slack integrations and a feature to record Radio UTD live streams.

# Running

After cloning this repository, you'll have to add a `.env` file to the root project directory with the following variables set:

    FB_TOKEN=<facebook access token>
    SOCIAL_HOOK=<slack webhook url>
    RADIO_HOOK=<slack webhook url>

Finally, to be able to run the application, you'll have to install dependencies and transpile the source files:

1. `npm install` to install project dependencies
2. `npm start` to transpile the source files and start the application
