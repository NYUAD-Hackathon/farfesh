if (Meteor.isServer) {

  Meteor.startup(function() {});

  // Pull a tweet from Ahmed's server every 10 seconds.
  // Iterate through tweets from the top of the file, and when we hit
  // the first tweet that we haven't seen yet, we add it as a story.
  SyncedCron.add({
    name: 'Update tweets',
    schedule: function(parser) {
      return parser.text('every 30 seconds');
    },
    job: function() {

      // Links array must align to languages array.
      // This is really hacky, but time is short :)

      var links = [
        "http://cheermeapp.cloudapp.net/tweetDir/en.tweets",
        "http://cheermeapp.cloudapp.net/tweetDir/ar.tweets"
      ];

      var languages = [
        "english",
        "arabic"
      ];

      for (var i = 0; i < links.length; i++) {
        Meteor.http.get(links[i], function (err, res) {
          if(res.statusCode == 200) {
            var tweets = res.content.split("\n");
            for(var i = 0; i < tweets.length; i++) {
              var tweet = tweets[i];
              var existingTweet = Stories.findOne({storyText: tweet})
              if(existingTweet == null) {
                Stories.insert({
                    storyText: tweet,
                    language: languages[i],
                    face1value:0,
                    face2value:0,
                    face3value:0,
                    face4value:0,
                    tweet: true,
                    createdAt: new Date(),
                    country: "UAE"
                });
                break;
              }
            }
          }
        });
      }
    }
  });

  SyncedCron.start();

}
