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
        }
        /*count_faces: function () {
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
        },*/
    });

    Template.main.events({
        'click .face': function(event){
            var face=event.target.value;
        },
        'submit newStory' : function(event) {
            var story = event.target.story-text.value;
            var age = event.target.age.value;
            var language = event.target.lang_type.value;
            var timeSince = new Date();
            var IpAddress = function () {
                if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
                else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
                xmlhttp.open("GET", "http://api.hostip.info/get_html.php", false);
                xmlhttp.send();

                hostipInfo = xmlhttp.responseText.split("\n");

                for (i = 0; hostipInfo.length >= i; i++) {
                    ipAddress = hostipInfo[i].split(":");
                    if (ipAddress[0] == "IP") return ipAddress[1];
                }
            };
            Stories.insert({
                storyText: story,
                ipAddress: ipAddress,
                age: age,
                language: language,
                timeSince: timeSince,
                IpAddress: IpAddress,
                face1value:0,
                face2value:0,
                face3value:0,
                face4value:0,
                votes: [{}]
            });
            console.log(Stories.find({}, {sort: {createDate: -1}}));
        }
    });
    Template.story.events({
        'click .face':function(event){
            var value = $(event.target).attr("value");
            if(value == "face1")
            {
                Stories.update(this._id,{$inc:{"face1value":1}});
            }
            else if(value == "face2")
            {
                Stories.update(this._id,{$inc:{"face2value":1}});
            }
            else if(value == "face3")
            {
                Stories.update(this._id,{$inc:{"face3value":1}});
            }
            else if(value == "face4")
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
