import graph from 'fbgraph';
import moment from 'moment';

/**
 * Make sure the access token has the following scopes:
 * read_insights, manage_pages, pages_manage_cta, business_management, read_audience_network_insights, public_profile
 *
 * Use the Graph API Explorer to generate a user access token with the required scopes.
 * The Access Token Tool allows you to debug and extend access tokens for longer term use.
 */
export default {
  postedADraft() {

  },

  checkEngagement(cb) {
    graph.setAccessToken(process.env.FB_TOKEN);

    graph.get('/TheUTDMercury/insights/page_engaged_users?period=week', (err, res) => {
      if (!err && res) {
        const latest = res.data[0].values[0].value;
        const second = res.data[0].values[1].value;

        if (latest < second) {
          const percentDiff = ((1 - (latest / second)) * 100).toFixed(0);

          this.postToSocial({
            pretext: 'Fewer users engaged with our page this week :caramoji:',
            text: `${percentDiff}% decrease in engagement`,
            color: 'danger',
          }, () => {
            cb();
          });
        } else if (latest > second) {
          const percentDiff = ((1 - (second / latest)) * 100).toFixed(0);

          this.postToSocial({
            pretext: 'More users engaged with our page this week!',
            text: `${percentDiff}% increase in engagement`,
            color: 'good',
          }, () => {
            cb();
          });
        } else {
          const percentDiff = (latest / second).toFixed(2);

          this.postToSocial({
            pretext: 'The exact same number of users engaged with our page this week as compared to last week',
            text: 'Crazy stuff',
            color: 'warning',
          }, () => {
            cb();
          });
        }
      } else {
        cb('Could not check engagement');
      }
    });
  },

  checkLikes(cb) {
    graph.setAccessToken(process.env.FB_TOKEN);

    graph.get('/TheUTDMercury/insights/page_fan_adds?period=day', (err, res) => {
      if (!err && res) {
        const latest = res.data[0].values[0].value;

        if (latest > 0) {
          this.postToSocial({
            pretext: 'We gained fans!',
            text: `${latest} people liked our page today`,
            color: 'good',
          }, () => {
            cb();
          });
        }
      } else {
        cb('Could not check likes');
      }
    });
  },

  checkFeed(cb) {
    graph.setAccessToken(process.env.FB_TOKEN);

    graph.get('/TheUTDMercury/feed', (err, res) => {
      if (!err && res) {
        const latest = res.data[0];

        const latestDate = moment(latest.created_time);
        const dayLater = latestDate.add(24, 'hours');
        const now = moment();

        if (now.isAfter(dayLater)) {
          this.postToSocial({
            pretext: "It's been a while since we've posted to Facebook",
            text: `Last posted: ${latestDate.format('dddd, MMMM Do YYYY')}`,
            color: 'warning',
          }, () => {
            cb();
          });
        }
      } else {
        cb('Could not check feed');
      }
    });
  },

  postToSocial(content, cb) {
    const body = {
      username: 'Merc Bot',
      icon_emoji: ':mercury:',
    };
    Object.assign(body, content);

    request.post({
      url: process.env.SOCIAL_HOOK, 
      body,
      json: true,
    }, (err) => {
      cb();
    });
  },
};
