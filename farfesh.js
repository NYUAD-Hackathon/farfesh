Stories = new Mongo.Collection("Stories");

Router.route('/', function () {
  this.render('main');
});

Router.route('/post', function () {
  this.render('post');
});


if (Meteor.isClient) {
    Meteor.startup(function() {
       $('body').attr('align', 'right');
    });

    Template.main.helpers({
        stories: function () {
            return Stories.find({}, {sort: {createdAt: -1}});
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

    Template.post.rendered = function() {
        $('select').material_select();
    };

    Template.main.rendered = function() {
        $('.button-collapse').sideNav({
                menuWidth: 400, // Default is 240
                edge: 'left', // Choose the horizontal origin
                closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
            }
        );
    };
    Template.post.events({
        'submit .newStory' : function(event) {
            event.preventDefault();
            var story = event.target.storyText.value;
            var age = event.target.age.value;
            var language = event.target.languageType.value;
            var timeSince = new Date();
            var ipAddress = function () {
                if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
                else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
                xmlhttp.open("GET", "http://api.hostip.info/get_html.php", false);
                xmlhttp.send();

                hostipInfo = xmlhttp.responseText.split("\n");

                for (var i = 0; hostipInfo.length >= i; i++) {
                    var ipAdd = hostipInfo[i].split(":");
                    if (ipAdd[0] == "IP") return ipAddress[1];
                }
            };
            Stories.insert({
                storyText: story,
                ipAddress: ipAddress,
                age: age,
                language: language,
                createdAt: new Date(),
                country: "UAE",
                face1value:0,
                face2value:0,
                face3value:0,
                face4value:0
            });
           Router.go('/');
        }
    })
}

    if (Meteor.isServer) {
        Meteor.startup(function () {
            // code to run on server at startup
        });
    }
