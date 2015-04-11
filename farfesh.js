Stories = new Mongo.Collection("Stories");

Router.route('/', function () {
  this.render('main');
});

if (Meteor.isClient) {
    Meteor.startup(function() {
       $('body').attr('align', 'right');
    });

    Template.main.helpers({
        stories: function () {
            console.log(Stories.find({}));
            return Stories.find({});
        },
        count_faces: function () {
            for (var i; i < votes.length; i++) {
                if (votes[i].faceType == "face1value") {
                    face1value++;
                } else if (votes[i].faceType == "face2value") {
                    face2value++;
                } else if (votes[i].faceType == "face3value") {
                    face3value++;
                } else if (votes[i].faceType == "face4value") {
                    face4value++;
                }
            }
        }
    });

    Template.main.events({
        'click .face': function(event){
            var face=event.target.value;
        },
        'submit .new-story': function(event) {
            var face1value = event.target.face1value;
            var face2value = event.target.face2value;
            var face3value = event.target.face3value;
            var face4value = event.target.face4value;
            var story = event.target.story-text.value;
            var age = event.target.age.value;
            var faceType = event.target.faceType.value;
            var language = event.target.lang_type.value;
            Stories.insert({
                face1value:0,
                face2value:0,
                face3value:0,
                face4value:0,
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
            if(event.target.value=="face1")
            {
                Stories.update(this._id,{$inc:{"face1value":1}});
            }
            else if(event.target.value=="face2")
            {
                Stories.update(this._id,{$inc:{"face2value":1}});
            }
            else if(event.target.value=="face3")
            {
                Stories.update(this._id,{$inc:{"face3value":1}});
            }
            else if(event.target.value=="face4")
            {
                Stories.update(this._id,{$inc:{"face4value":1}});
            }
        }
    });
}

    if (Meteor.isServer) {
        Meteor.startup(function () {
            // code to run on server at startup
        });
    }
