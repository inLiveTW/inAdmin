angular.module('inlive.service', [])

.factory('fbevent', function($http){
  var data = null;
  var FBevent4Chrome = Parse.Object.extend("fbevent");
  var Query4Chrome = new Parse.Query(FBevent4Chrome);
  return {
    get: function (fbid, cb) {
      $http.get('https://graph.facebook.com/v2.0/' + fbid + '?method=GET&format=json&suppress_http_code=1&access_token=729105557142181%7CA9jfDB7oKeEJ3QPvDK1P5wVq7V4')
      .success(function(res){
        cb(null, {
          title: res.name,
          owner: res.owner.name,
          start: res.start_time.replace(/T.+/gi,''),
          location: res.location,
          link: 'https://www.facebook.com/events/' + res.id + '/'
        });
      })
      .error(function(res, status){
        cb(status, {});
      });
    },
    reload: function(){
      data = [];
      Parse.initialize('IYt2sQC9UsZDKeTzD2AxVhw8z6IGCzOivxK1ppp8', 'Ia4cRpS1UhJusj1hjsatBoOIVh6GXFpwO2xxxCBY');
      Parse.User.logIn("yutin", "@318max", {
        success: function(user) {
          async.waterfall([
            function(cb) {
              Query4Chrome.find({
                success: function(results) {
                  var collections = {};
                  results.forEach(function(item){
                    if ( /^[0-9]+$/i.exec(item.attributes.eid) ) {
                      collections[item.attributes.eid] = (collections[item.attributes.eid] || 0) + 1;
                    }
                  });
                  cb(null, collections);
                },
                error: function(err) {
                  cb(err);
                }
              });
            },
            function (collections, cb) {
              for ( item in collections ) {
                data.push({
                  eid: item,
                  like: collections[item]
                });
              }
              cb(null);
            },
            function (err) {
              async.each(data, function(item, cb) {
                this.get(item.eid, function (err, evt) {
                  item.title = evt.title;
                  item.owner = evt.owner;
                  item.start = evt.start
                  item.location = evt.location;
                  item.link = evt.link
                });
                cb(null);
              }.bind(this));
            }.bind(this)
          ]);
        }.bind(this),
        error: function(user, error) {
          console.log(user, error);
        }
      });
    },
    fetch: function(){
      if ( data == null ) {
        this.reload();
      }
      return data;
    }
  }
})

.factory('livevt', function($http, fbevent){
  var FBevent4Live = Parse.Object.extend("fbevent");
  var Query4Live = new Parse.Query(FBevent4Live);
  return {
    save: function(fbid) {
      fbevent.get(fbid, function (err, evt) {
        if ( err == null ) {
          Parse.initialize('t2C2TsQXSxjugA3DRRf0YTrrKFgltoytkzMnIwFT', '8Vw1Ylca5Oti2g0ZtAr1XfvcZaw7V1KfuhW0rtAS');
          Query4Live.equalTo("eid", fbid);
          Query4Live.first({
            success: function(fbevent) {
              if ( !fbevent ) {
                fbevent = new FBevent4Live();
                fbevent.save({
                  'eid': fbid,
                  'title': evt.title,
                  'owner': evt.owner,
                  'start': evt.start,
                  'location': evt.location,
                  'link': evt.link
                },{
                  success: function(fbevent) {
                    console.log('success create', fbid);
                  },
                  error: function(fbevent, error) {
                    console.log('failed create', fbid);
                  }
                });
              }else{
                console.log('existed', fbid);
              }
            }
          });
        }
      });
    }
  }
});