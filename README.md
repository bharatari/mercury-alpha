# Mercury Ion

Mercury Ion is a set of utilities and tools designed for The Mercury. Ion primarily comprises of Slack integrations and a feature to record Radio UTD live streams.

# Running

After cloning this repository, you'll have to add a `.env` file to the root project directory with the following variables set:

    FB_TOKEN=<facebook access token>
    SOCIAL_HOOK=<slack webhook url>
    RADIO_HOOK=<slack webhook url>

You will also have to add a `config.js` file to the root project directory:

    export default {
        record: {
            task: true,
            now: false,
        },
        dailySocial: {
            task: true,
            now: false,
        },
        weeklySocial: {
            task: true,
            now: false,
        },
    }

The configuration file declares what features should run when the server starts. All features are implicitly disabled by default. You must explicitly enable them in the configuration file.

Create an `output` folder in the root project directory to hold recordings.

Finally, to be able to run the application, you'll have to install dependencies and transpile the source files:

1. `npm install` to install project dependencies
2. `npm start` to transpile the source files and start the application
