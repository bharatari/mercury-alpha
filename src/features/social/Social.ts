import graph from 'fbgraph';
import * as moment from 'moment';
import * as request from 'request';

/**
 * Make sure the access token has the following scopes:
 * read_insights, manage_pages, pages_manage_cta, business_management, read_audience_network_insights, public_profile
 *
 * Use the Graph API Explorer to generate a user access token with the required scopes.
 * The Access Token Tool allows you to debug and extend access tokens for longer term use.
 */

export default abstract class Social {
  protected dailySocial() {
    console.log('Checking Daily Social Stats');

    this.checkFeed((err: any) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Checked Feed');
      }
    });

    this.checkLikes((err: any) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Checked Likes');
      }
    });
  }

  protected weeklySocial() {
    console.log('Checking Weekly Social Stats');

    this.checkEngagement((err: any) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Checked Engagement');
      }
    });
  }

  private checkEngagement(cb: Function) {
    graph.setAccessToken(process.env.FB_TOKEN);

    graph.get('/TheUTDMercury/insights/page_engaged_users?period=week', (err: any, res: any) => {
      if (!err && res) {
        const latest: any = res.data[0].values[0].value;
        const second: any = res.data[0].values[1].value;

        if (latest < second) {
          const percentDiff: any = ((1 - (latest / second)) * 100).toFixed(2);

          this.postToSocial({
            pretext: 'Fewer users engaged with our page this week :caramoji:',
            text: `${percentDiff}% decrease in engagement`,
            color: 'danger',
          }, () => {
            cb();
          });
        } else if (latest > second) {
          const percentDiff: any = ((1 - (second / latest)) * 100).toFixed(2);

          this.postToSocial({
            pretext: 'More users engaged with our page this week!',
            text: `${percentDiff}% increase in engagement`,
            color: 'good',
          }, () => {
            cb();
          });
        } else {
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
  }

  private checkLikes(cb: Function) {
    graph.setAccessToken(process.env.FB_TOKEN);

    graph.get('/TheUTDMercury/insights/page_fan_adds?period=day', (err: any, res: any) => {
      if (!err && res) {
        const latest: any = res.data[0].values[0].value;

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
  }

  private checkFeed(cb: Function) {
    graph.setAccessToken(process.env.FB_TOKEN);

    graph.get('/TheUTDMercury/feed', (err: any, res: any) => {
      if (!err && res) {
        const latest: any = res.data[0];

        const latestDate: any = moment(latest.created_time);
        const dayLater: any = latestDate.add(24, 'hours');
        const now: any = moment();

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
  }

  private postToSocial(content: any, cb: Function) {
    const body: any = {
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
  }
};
