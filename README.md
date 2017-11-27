# Mercury Ion

Mercury Ion is a set of utilities and tools designed for The Mercury. Ion primarily comprises of Slack integrations and a feature to record Radio UTD live streams.

# Running

After cloning this repository, you'll have to add a `.env` file to the root project directory with the following variables set:

    FB_TOKEN=<facebook access token>
    SOCIAL_HOOK=<slack webhook url>
    RADIO_HOOK=<slack webhook url>
    DO_SPACES_ACCESS_KEY_ID=<key_id>
    DO_SPACES_SECRET_ACCESS_KEY=<access_key>

You will also have to add a `config.json` file to the root project directory:

    {
        "record": {
            "task": true,
            "now": false,
            "crontab": ["57 9 * * 2", "57 9 * * 5"]
        },
        "dailySocial": {
            "task": false,
            "now": false,
            "crontab": ["0 11 * * *"]
        },
        "weeklySocial": {
            "task": false,
            "now": false,
            "crontab": ["0 11 7 * 1"]
        }
    }


The configuration file declares what features should run when the server starts. All features are implicitly disabled by default. You must explicitly enable them in the configuration file.

Create an `output` folder in the root project directory to hold recordings.

Finally, to be able to run the application, you'll have to install dependencies and transpile the source files:

1. `npm install` to install project dependencies
2. `npm start` to transpile the source files and start the application
