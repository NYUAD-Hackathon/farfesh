Stories = new Mongo.Collection("Stories");
if (Meteor.isClient) {
    // counter stars at 0
    Session.setDefault('counter', 0);

    Template.body.helpers({
        stories: function () {
            console.log(Stories.find({}));
            return Stories.find({});
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

    Template.body.events({
        'click .face': function(event){
            var face=event.target.value;
            Stories.insert({

            });
        },
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
    });

    Template.story.events({
        'click .face':function(event){
            Stories.update(this._id,{$push: {votes: {faceType: event.target.value}}})
        }
    });
}

    if (Meteor.isServer) {
        Meteor.startup(function () {
            // code to run on server at startup
        });
    }
