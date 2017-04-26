/**
 * Created by ernestomr87@gmail.com on 10/11/2014.
 */
var tool = require("./toolController");
var path = __dirname + "/index.ejs";
var async = require("async");
var _ = require("lodash");


function maintenance(cb) {
  async.waterfall([
    function (cbw) {
      var isofields = [];
      db.Configurations
        .findOne()
        .exec(function (err, obj) {
          if (err) {
            cbw(err, null);
          } else {
            var cont = 0;
            _.forEach(obj.metaData.siteMetaDescription, function (value) {
              isofields.push(value.toString());
              cont++;
            });
            _.forEach(obj.metaData.siteMetaKeywords, function (value) {
              isofields.push(value.toString());
              cont++;
            });
            _.forEach(obj.shipSettings.experiences, function (experience) {
              _.forEach(experience.slug, function (value) {
                isofields.push(value.toString());
                cont++;
              });
              _.forEach(experience.name, function (value) {
                isofields.push(value.toString());
                cont++;
              });
              _.forEach(experience.description, function (value) {
                isofields.push(value.toString());
                cont++;
              });
            });
            _.forEach(obj.shipSettings.durations, function (duration) {
              _.forEach(duration.name, function (value) {
                isofields.push(value.toString());
                cont++;
              });
            });
            console.log("Configurations", cont);
            cbw(null, isofields);
          }
        });
    },
    function (isofields, cbw) {
      db.Equipments
        .find()
        .exec(function (err, objs) {
          if (err) {
            cbw(err, null);
          } else {
            var cont = 0;
            _.forEach(objs, function (obj) {
              _.forEach(obj.name, function (value) {
                isofields.push(value.toString());
                cont++;
              });
              _.forEach(obj.items, function (item) {
                _.forEach(item.name, function (value) {
                  isofields.push(value.toString());
                  cont++;
                });
              });
            });
            console.log("Equipments", cont);
            cbw(null, isofields);
          }
        });
    },
    function (isofields, cbw) {
      db.Landings
        .find()
        .exec(function (err, objs) {
          if (err) {
            cbw(err, null);
          } else {
            var cont = 0;
            _.forEach(objs, function (obj) {
              _.forEach(obj.name, function (value) {
                isofields.push(value.toString());
                cont++;
              });
              _.forEach(obj.slug, function (value) {
                isofields.push(value.toString());
                cont++;
              });
              _.forEach(obj.title, function (value) {
                isofields.push(value.toString());
                cont++;
              });
              _.forEach(obj.description, function (value) {
                isofields.push(value.toString());
                cont++;
              });
              _.forEach(obj.text1, function (value) {
                isofields.push(value.toString());
                cont++;
              });
              _.forEach(obj.text2, function (value) {
                isofields.push(value.toString());
                cont++;
              });
            });
            console.log("Landings", cont);
            cbw(null, isofields);
          }
        });
    },
    function (isofields, cbw) {
      db.Localizations
        .find()
        .exec(function (err, objs) {
          if (err) {
            cbw(err, null);
          } else {
            var cont = 0;
            _.forEach(objs, function (obj) {
              _.forEach(obj.name, function (value) {
                isofields.push(value.toString());
                cont++;
              });
              _.forEach(obj.slug, function (value) {
                isofields.push(value.toString());
                cont++;
              });
              _.forEach(obj.cities, function (city) {
                _.forEach(city.name, function (value) {
                  isofields.push(value.toString());
                  cont++;
                });
                _.forEach(city.slug, function (value) {
                  isofields.push(value.toString());
                  cont++;
                });
                _.forEach(city.areas, function (area) {
                  _.forEach(area.name, function (value) {
                    isofields.push(value.toString());
                    cont++;
                  });
                  _.forEach(area.slug, function (value) {
                    isofields.push(value.toString());
                    cont++;
                  });
                  _.forEach(area.ports, function (port) {
                    _.forEach(port.name, function (value) {
                      isofields.push(value.toString());
                      cont++;
                    });
                    _.forEach(port.slug, function (value) {
                      isofields.push(value.toString());
                      cont++;
                    });
                  });
                });
              });
            });
            console.log("Localizations", cont);
            cbw(null, isofields);
          }
        });
    },
    function (isofields, cbw) {
      db.Notifications
        .findOne()
        .exec(function (err, obj) {
          if (err) {
            cbw(err, null);
          } else {
            var cont = 0;
            _.forEach(obj.userRegister.subject, function (value) {
              isofields.push(value.toString());
              cont++;
            });
            _.forEach(obj.userRegister.body, function (value) {
              isofields.push(value.toString());
              cont++;
            });
            _.forEach(obj.userParticular.subject, function (value) {
              isofields.push(value.toString());
              cont++;
            });
            _.forEach(obj.userParticular.body, function (value) {
              isofields.push(value.toString());
              cont++;
            });
            _.forEach(obj.bulletin.subject, function (value) {
              isofields.push(value.toString());
              cont++;
            });
            _.forEach(obj.bulletin.body, function (value) {
              isofields.push(value.toString());
              cont++;
            });
            _.forEach(obj.recoveryPassword.subject, function (value) {
              isofields.push(value.toString());
              cont++;
            });
            _.forEach(obj.recoveryPassword.body, function (value) {
              isofields.push(value.toString());
              cont++;
            });
            _.forEach(obj.publicationBoat.subject, function (value) {
              isofields.push(value.toString());
              cont++;
            });
            _.forEach(obj.publicationBoat.body, function (value) {
              isofields.push(value.toString());
              cont++;
            });
            _.forEach(obj.userRequest.subject, function (value) {
              isofields.push(value.toString());
              cont++;
            });
            _.forEach(obj.userRequest.body, function (value) {
              isofields.push(value.toString());
              cont++;
            });
            _.forEach(obj.ownerRequest.subject, function (value) {
              isofields.push(value.toString());
              cont++;
            });
            _.forEach(obj.ownerRequest.body, function (value) {
              isofields.push(value.toString());
              cont++;
            });
            _.forEach(obj.rejectRequest.subject, function (value) {
              isofields.push(value.toString());
              cont++;
            });
            _.forEach(obj.rejectRequest.body, function (value) {
              isofields.push(value.toString());
              cont++;
            });
            _.forEach(obj.userOffer.subject, function (value) {
              isofields.push(value.toString());
              cont++;
            });
            _.forEach(obj.userOffer.body, function (value) {
              isofields.push(value.toString());
              cont++;
            });
            _.forEach(obj.ownerOffer.subject, function (value) {
              isofields.push(value.toString());
              cont++;
            });
            _.forEach(obj.ownerOffer.body, function (value) {
              isofields.push(value.toString());
              cont++;
            });
            _.forEach(obj.userBuyConfirmation.subject, function (value) {
              isofields.push(value.toString());
              cont++;
            });
            _.forEach(obj.userBuyConfirmation.body, function (value) {
              isofields.push(value.toString());
              cont++;
            });
            _.forEach(obj.ownerBuyConfirmation.subject, function (value) {
              isofields.push(value.toString());
              cont++;
            });
            _.forEach(obj.ownerBuyConfirmation.body, function (value) {
              isofields.push(value.toString());
              cont++;
            });
            _.forEach(obj.userRefundConfirmation.subject, function (value) {
              isofields.push(value.toString());
              cont++;
            });
            _.forEach(obj.userRefundConfirmation.body, function (value) {
              isofields.push(value.toString());
              cont++;
            });
            _.forEach(obj.ownerRefundConfirmation.subject, function (value) {
              isofields.push(value.toString());
              cont++;
            });
            _.forEach(obj.ownerRefundConfirmation.body, function (value) {
              isofields.push(value.toString());
              cont++;
            });
            _.forEach(obj.userExpireTime.subject, function (value) {
              isofields.push(value.toString());
              cont++;
            });
            _.forEach(obj.userExpireTime.body, function (value) {
              isofields.push(value.toString());
              cont++;
            });
            console.log("Notifications", cont);
            cbw(null, isofields);
          }
        });
    },
    function (isofields, cbw) {
      db.Ships
        .find()
        .exec(function (err, objs) {
          if (err) {
            cbw(err, null);
          } else {
            var cont = 0;
            _.forEach(objs, function (obj) {
              _.forEach(obj.title, function (value) {
                isofields.push(value.toString());
                cont++;
              });
              _.forEach(obj.description, function (value) {
                isofields.push(value.toString());
                cont++;
              });
              _.forEach(obj.finder, function (value) {
                isofields.push(value.toString());
                cont++;
              });
              _.forEach(obj.conditions.text, function (value) {
                isofields.push(value.toString());
                cont++;
              });
            });
            console.log("Ships", cont);
            cbw(null, isofields);
          }
        });
    },
    function (isofields, cbw) {
      db.shipTypes
        .find()
        .exec(function (err, objs) {
          if (err) {
            cbw(err, null);
          } else {
            var cont = 0;
            _.forEach(objs, function (obj) {
              _.forEach(obj.name, function (value) {
                isofields.push(value.toString());
                cont++;
              });
              _.forEach(obj.description, function (value) {
                isofields.push(value.toString());
                cont++;
              });
              _.forEach(obj.slug, function (value) {
                isofields.push(value.toString());
                cont++;
              });
            });
            console.log("shipTypes", cont);
            cbw(null, isofields);
          }
        });
    },
    function (isofields, cbw) {
      db.Tags
        .find()
        .exec(function (err, objs) {
          if (err) {
            cbw(err, null);
          } else {
            var cont = 0;
            _.forEach(objs, function (obj) {
              _.forEach(obj.name, function (value) {
                isofields.push(value.toString());
                cont++;
              });
              _.forEach(obj.title, function (value) {
                isofields.push(value.toString());
                cont++;
              });
              _.forEach(obj.description, function (value) {
                isofields.push(value.toString());
                cont++;
              });
              _.forEach(obj.slug, function (value) {
                isofields.push(value.toString());
                cont++;
              });
            });
            console.log("Tags", cont);
            cbw(null, isofields);
          }
        });
    },
    function (isofields, cbw) {
      db.Texts
        .find()
        .exec(function (err, objs) {
          if (err) {
            cbw(err, null);
          } else {
            var cont = 0;
            _.forEach(objs, function (obj) {
              _.forEach(obj.components, function (component) {
                _.forEach(component.text, function (value) {
                  isofields.push(value.toString());
                  cont++;
                });
              });
            });
            console.log("Texts", cont);
            cbw(null, isofields);
          }
        });
    }
  ], function (err, result) {
    console.log("Isofields", result.length);
    db.IsoFields.find().exec(function(err,isofields){
      if(err){cb(err,null);}
      else{
        var remove=[];
        for (var i = 0; i < isofields.length; i++) {
          var flag=false;
          for (var j = 0; j < result.length; j++) {
            if(isofields[i]._doc._id.toString() === result[j]){
              flag=true;
              break;
            } 
          }
          if(!flag) remove.push(isofields[i]._doc._id.toString());
        }
         console.log("Remove", remove.length);
        async.map(remove,function(iso,cbm){
          db.IsoFields.remove({_id:iso}).exec(function(err,success){
            cbm(err,success);
          });
        },function(err,resultMap){
          cb(err,resultMap);
        });
       
      }
    });
  });
}

exports.configRoutes = function (app) {
  /*API REST*/
  app.get("/load/getDataInfo", tool.getDataInfo);
  app.post("/load/loadData", tool.loadData);
  app.post("/load/loadDataByCollection", tool.loadCollection);
  app.post("/load/removeDataByCollection", tool.removeCollection);
  app.post("/load/removeSession", tool.removeSession);
  app.post("/load/maintenance", function (req, res) {
    maintenance(function (success, err) {
      res.json({
        res: success,
        error: err
      });
    });
  });

  /*TEMPLATES*/
  app.get("/loadData", function (req, res) {
    res.render(path);
  });


};