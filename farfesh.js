Stories = new Mongo.Collection("Stories");
if (Meteor.isClient) {
    // counter stars at 0
    Session.setDefault('counter', 0);

    Template.body.helpers({
        stories: function () {
            console.log(Stories.find({}));
            return Stories.find({});
        },
        counter: function () {
            return Session.get("counter");
        },
        count_faces: function () {
            var face1 = 0, face2 = 0, face3 = 0, face4 = 0;
            for (var i; i < votes.length; i++) {
                if (votes[i].faceType == "face1") {
                    face1++;
                } else if (votes[i].faceType == "face2") {
                    face2++;
                } else if (votes[i].faceType == "face3") {
                    face3++;
                } else if (votes[i].faceType == "face4") {
                    face4++;
                }
            }

        }
    });

    Template.hello.events({
        'submit .new-story': function(event) {
            var story = event.target.story-text.value;
            var age = event.target.age.value;
            var faceType = event.target.faceType.value;
            var language = event.target.lang_type.value;
            Stories.insert({
                storyText: story,
                votes: [{faceType: faceType}],
                count_votes: votes.length,
                create_date: new Date(),
                ipAddress: function () {
                    if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
                    else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
                    xmlhttp.open("GET", "http://api.hostip.info/get_html.php", false);
                    xmlhttp.send();

                    hostipInfo = xmlhttp.responseText.split("\n");

                    for (i = 0; hostipInfo.length >= i; i++) {
                        ipAddress = hostipInfo[i].split(":");
                        if (ipAddress[0] == "IP") return ipAddress[1];
                    }
                },
                age: age,
                language: language
            });
        },
        'click button': function () {
            // increment the counter when button is clicked
            Session.set("counter", Session.get("counter") + 1);
        }
    });
}
    if (Meteor.isServer) {
        Meteor.startup(function () {
            // code to run on server at startup
        });
    }
