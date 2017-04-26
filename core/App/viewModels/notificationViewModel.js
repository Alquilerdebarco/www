/**
 * Created by ernestomr87@gmail.com on 1/29/2016.
 */

var async = require("async");
var isoFieldView = require("./IsoFieldViewModel");
var localizationViewModel = require("./localizationViewModel");
var emailNotification = require("./../utils/emailNotification");
var configGen = require("../viewModels/configurationViewModel");
var urlUtil = require("url");

var shipUrl = "/es/detalle-de-barco/";

function validateNotification(data) {
  if (!data) {
    return false;
  }
  if (data.subject.length != data.body.length) {
    return false;
  }

  for (var i = 0; i < data.subject.length; i++) {
    if (!data.subject[i].value.length) {
      return false;
    }
    if (!data.body[i].value.length) {
      return false;
    }
  }
  return true;
}
function ReplaceAll(str, find, replace) {
  var repeat = true;
  while (repeat) {
    var newStr = str.replace(find, replace);
    if (str == newStr) {
      repeat = false;
    } else {
      str = newStr;
    }
  }
  return str;
}
function loadConfiguration(cb) {
  db.Configurations.findOne().select("general").exec(function(err, success) {
    cb(err, success);
  });
}
//rejectRequest
var notificationFunctions = {
  get: function(cb) {
    db.Notifications.count().exec(function(err, count) {
      if (count) {
        db.Notifications.findOne()
          .populate("rejectRequest.subject rejectRequest.body" +
            " userParticular.subject userParticular.body" +
            " userRegister.subject userRegister.body" +
            " bulletin.subject bulletin.body" +
            " recoveryPassword.subject recoveryPassword.body" +
            " publicationBoat.subject publicationBoat.body" +
            " userRequest.subject userRequest.body" +
            " ownerRequest.subject ownerRequest.body" +
            " userOffer.subject userOffer.body" +
            " ownerOffer.subject ownerOffer.body" +
            " userRefundConfirmation.subject userRefundConfirmation.body" +
            " ownerRefundConfirmation.subject ownerRefundConfirmation.body" +
            " userExpireTime.subject userExpireTime.body" +
            " userBuyConfirmation.subject userBuyConfirmation.body" +
            " ownerBuyConfirmation.subject ownerBuyConfirmation.body")
          .exec(function(err, noty) {
            cb(err, noty);
          });
      } else {
        var notyDb = db.Notifications({
          userRegister: {
            subject: [],
            body: []
          },
          userParticular: {
            subject: [],
            body: []
          },
          bulletin: {
            subject: [],
            body: []
          },
          recoveryPassword: {
            subject: [],
            body: []
          },
          publicationBoat: {
            subject: [],
            body: []
          },
          userRequest: {
            subject: [],
            body: []
          },
          ownerRequest: {
            subject: [],
            body: []
          },
          userOffer: {
            subject: [],
            body: []
          },
          ownerOffer: {
            subject: [],
            body: []
          },
          rejectRequest: {
            subject: [],
            body: []
          },
          userBuyConfirmation: {
            subject: [],
            body: []
          },
          ownerBuyConfirmation: {
            subject: [],
            body: []
          },
          userRefundConfirmation: {
            subject: [],
            body: []
          },
          ownerRefundConfirmation: {
            subject: [],
            body: []
          },
          userExpireTime: {
            subject: [],
            body: []
          },

        });

        notyDb.save(function(err, success) {
          if (err || !success) {
            cb(err, success);
          } else {
            db.Notifications.findOne()
              .populate("rejectRequest.subject rejectRequest.body" +
                " userParticular.subject userParticular.body" +
                " userRegister.subject userRegister.body" +
                " bulletin.subject bulletin.body" +
                " recoveryPassword.subject recoveryPassword.body" +
                " publicationBoat.subject publicationBoat.body" +
                " userRequest.subject userRequest.body" +
                " ownerRequest.subject ownerRequest.body" +
                " userOffer.subject userOffer.body" +
                " ownerOffer.subject ownerOffer.body" +
                " userRefundConfirmation.subject userRefundConfirmation.body" +
                " ownerRefundConfirmation.subject ownerRefundConfirmation.body" +
                " userExpireTime.subject userExpireTime.body" +
                " userBuyConfirmation.subject userBuyConfirmation.body" +
                " ownerBuyConfirmation.subject ownerBuyConfirmation.body")
              .exec(function(err, noty) {
                cb(err, noty);
              });
          }
        });
      }
    });
  },
  saveNotificationUserRegister: function(data, cb) {
    if (validateNotification(data)) {
      async.parallel([
        function(cbp) {
          isoFieldView.validateCreateIsoField(data.subject, function(data) {
            if (data) {
              cbp(null, data);
            } else {
              cbp(true, null);
            }
          });
        },
        function(cbp) {
          isoFieldView.validateCreateIsoField(data.body, function(data) {
            if (data) {
              cbp(null, data);
            } else {
              cbp(true, null);
            }
          });
        }
      ], function(err, result) {
        if (err || !result) {
          cb(err, result);
        } else {
          db.Notifications.findOne().exec(function(err, noty) {
            if (err || !noty) {
              cb(err, noty);
            } else {
              async.parallel([
                function(cbp) {
                  async.map(noty._doc.userRegister.subject, function(text, callback) {
                    isoFieldView.remove(text, function(err, iso) {
                      callback(err, iso);
                    });
                  }, function(err, result) {
                    cbp(err, result);
                  });
                },
                function(cbp) {
                  async.map(noty._doc.userRegister.body, function(text, callback) {
                    isoFieldView.remove(text, function(err, iso) {
                      callback(err, iso);
                    });
                  }, function(err, result) {
                    cbp(err, result);
                  });
                }
              ], function(err, result) {
                if (err || !result) {
                  cb(err, result);
                } else {
                  async.parallel([
                    function(cbp) {
                      async.map(data.subject, function(t, callback) {
                        isoFieldView.create(t._id, t.value, function(err, iso) {
                          callback(err, iso);
                        });
                      }, function(err, result) {
                        cbp(err, result);
                      });
                    },
                    function(cbp) {
                      async.map(data.body, function(t, callback) {
                        isoFieldView.create(t._id, t.value, function(err, iso) {
                          callback(err, iso);
                        });
                      }, function(err, result) {
                        cbp(err, result);
                      });
                    }
                  ], function(err, result) {
                    if (err || !result) {
                      cb(err, result);
                    } else {
                      var subject = [];
                      for (var i = 0; i < result[0].length; i++) {
                        subject.push(result[0][i]._doc._id);

                      }
                      var body = [];
                      for (var j = 0; j < result[1].length; j++) {
                        body.push(result[1][j]._doc._id);
                      }

                      db.Notifications.findOneAndUpdate({
                        $set: {
                          "userRegister.subject": subject,
                          "userRegister.body": body
                        }
                      }).exec(function(err, success) {
                        if (err || !success) {
                          cb(err, success);
                        } else {
                          db.Notifications.findOne()
                            .populate("rejectRequest.subject rejectRequest.body" +
                              " userParticular.subject userParticular.body" +
                              " userRegister.subject userRegister.body" +
                              " bulletin.subject bulletin.body" +
                              " recoveryPassword.subject recoveryPassword.body" +
                              " publicationBoat.subject publicationBoat.body" +
                              " userRequest.subject userRequest.body" +
                              " ownerRequest.subject ownerRequest.body" +
                              " userOffer.subject userOffer.body" +
                              " ownerOffer.subject ownerOffer.body" +
                              " userRefundConfirmation.subject userRefundConfirmation.body" +
                              " ownerRefundConfirmation.subject ownerRefundConfirmation.body" +
                              " userExpireTime.subject userExpireTime.body" +
                              " userBuyConfirmation.subject userBuyConfirmation.body" +
                              " ownerBuyConfirmation.subject ownerBuyConfirmation.body")
                            .exec(function(err, noty) {
                              cb(err, noty);
                            });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    } else {
      var error = {
        message: "Formulario Incorrecto."
      };
      cb(error, null);
    }
  },
  saveNotificationUserParticular: function(data, cb) {
    if (validateNotification(data)) {
      async.parallel([
        function(cbp) {
          isoFieldView.validateCreateIsoField(data.subject, function(data) {
            if (data) {
              cbp(null, data);
            } else {
              cbp(true, null);
            }
          });
        },
        function(cbp) {
          isoFieldView.validateCreateIsoField(data.body, function(data) {
            if (data) {
              cbp(null, data);
            } else {
              cbp(true, null);
            }
          });
        }
      ], function(err, result) {
        if (err || !result) {
          cb(err, result);
        } else {
          db.Notifications.findOne().exec(function(err, noty) {
            if (err || !noty) {
              cb(err, noty);
            } else {
              async.parallel([
                function(cbp) {
                  async.map(noty._doc.userParticular.subject, function(text, callback) {
                    isoFieldView.remove(text, function(err, iso) {
                      callback(err, iso);
                    });
                  }, function(err, result) {
                    cbp(err, result);
                  });
                },
                function(cbp) {
                  async.map(noty._doc.userParticular.body, function(text, callback) {
                    isoFieldView.remove(text, function(err, iso) {
                      callback(err, iso);
                    });
                  }, function(err, result) {
                    cbp(err, result);
                  });
                }
              ], function(err, result) {
                if (err || !result) {
                  cb(err, result);
                } else {
                  async.parallel([
                    function(cbp) {
                      async.map(data.subject, function(t, callback) {
                        isoFieldView.create(t._id, t.value, function(err, iso) {
                          callback(err, iso);
                        });
                      }, function(err, result) {
                        cbp(err, result);
                      });
                    },
                    function(cbp) {
                      async.map(data.body, function(t, callback) {
                        isoFieldView.create(t._id, t.value, function(err, iso) {
                          callback(err, iso);
                        });
                      }, function(err, result) {
                        cbp(err, result);
                      });
                    }
                  ], function(err, result) {
                    if (err || !result) {
                      cb(err, result);
                    } else {
                      var subject = [];
                      for (var i = 0; i < result[0].length; i++) {
                        subject.push(result[0][i]._doc._id);

                      }
                      var body = [];
                      for (var j = 0; j < result[1].length; j++) {
                        body.push(result[1][j]._doc._id);
                      }

                      db.Notifications.findOneAndUpdate({
                        $set: {
                          "userParticular.subject": subject,
                          "userParticular.body": body
                        }
                      }).exec(function(err, success) {
                        if (err || !success) {
                          cb(err, success);
                        } else {
                          db.Notifications.findOne()
                            .populate("rejectRequest.subject rejectRequest.body" +
                              " userParticular.subject userParticular.body" +
                              " userRegister.subject userRegister.body" +
                              " bulletin.subject bulletin.body" +
                              " recoveryPassword.subject recoveryPassword.body" +
                              " publicationBoat.subject publicationBoat.body" +
                              " userRequest.subject userRequest.body" +
                              " ownerRequest.subject ownerRequest.body" +
                              " userOffer.subject userOffer.body" +
                              " ownerOffer.subject ownerOffer.body" +
                              " userRefundConfirmation.subject userRefundConfirmation.body" +
                              " ownerRefundConfirmation.subject ownerRefundConfirmation.body" +
                              " userExpireTime.subject userExpireTime.body" +
                              " userBuyConfirmation.subject userBuyConfirmation.body" +
                              " ownerBuyConfirmation.subject ownerBuyConfirmation.body")
                            .exec(function(err, noty) {
                              cb(err, noty);
                            });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    } else {
      var error = {
        message: "Formulario Incorrecto."
      };
      cb(error, null);
    }
  },
  saveNotificationBulletin: function(data, cb) {
    if (validateNotification(data)) {
      async.parallel([
        function(cbp) {
          isoFieldView.validateCreateIsoField(data.subject, function(data) {
            if (data) {
              cbp(null, data);
            } else {
              cbp(true, null);
            }
          });
        },
        function(cbp) {
          isoFieldView.validateCreateIsoField(data.body, function(data) {
            if (data) {
              cbp(null, data);
            } else {
              cbp(true, null);
            }
          });
        }
      ], function(err, result) {
        if (err || !result) {
          cb(err, result);
        } else {
          db.Notifications.findOne().exec(function(err, noty) {
            if (err || !noty) {
              cb(err, noty);
            } else {
              async.parallel([
                function(cbp) {
                  async.map(noty._doc.bulletin.subject, function(text, callback) {
                    isoFieldView.remove(text, function(err, iso) {
                      callback(err, iso);
                    });
                  }, function(err, result) {
                    cbp(err, result);
                  });
                },
                function(cbp) {
                  async.map(noty._doc.bulletin.body, function(text, callback) {
                    isoFieldView.remove(text, function(err, iso) {
                      callback(err, iso);
                    });
                  }, function(err, result) {
                    cbp(err, result);
                  });
                }
              ], function(err, result) {
                if (err || !result) {
                  cb(err, result);
                } else {
                  async.parallel([
                    function(cbp) {
                      async.map(data.subject, function(t, callback) {
                        isoFieldView.create(t._id, t.value, function(err, iso) {
                          callback(err, iso);
                        });
                      }, function(err, result) {
                        cbp(err, result);
                      });
                    },
                    function(cbp) {
                      async.map(data.body, function(t, callback) {
                        isoFieldView.create(t._id, t.value, function(err, iso) {
                          callback(err, iso);
                        });
                      }, function(err, result) {
                        cbp(err, result);
                      });
                    }
                  ], function(err, result) {
                    if (err || !result) {
                      cb(err, result);
                    } else {
                      var subject = [];
                      for (var i = 0; i < result[0].length; i++) {
                        subject.push(result[0][i]._doc._id);

                      }
                      var body = [];
                      for (var j = 0; j < result[1].length; j++) {
                        body.push(result[1][j]._doc._id);
                      }

                      db.Notifications.findOneAndUpdate({
                        $set: {
                          "bulletin.subject": subject,
                          "bulletin.body": body

                        }
                      }).exec(function(err, success) {
                        if (err || !success) {
                          cb(err, success);
                        } else {
                          db.Notifications.findOne()
                            .populate("rejectRequest.subject rejectRequest.body" +
                              " userParticular.subject userParticular.body" +
                              " userRegister.subject userRegister.body" +
                              " bulletin.subject bulletin.body" +
                              " recoveryPassword.subject recoveryPassword.body" +
                              " publicationBoat.subject publicationBoat.body" +
                              " userRequest.subject userRequest.body" +
                              " ownerRequest.subject ownerRequest.body" +
                              " userOffer.subject userOffer.body" +
                              " ownerOffer.subject ownerOffer.body" +
                              " userRefundConfirmation.subject userRefundConfirmation.body" +
                              " ownerRefundConfirmation.subject ownerRefundConfirmation.body" +
                              " userExpireTime.subject userExpireTime.body" +
                              " userBuyConfirmation.subject userBuyConfirmation.body" +
                              " ownerBuyConfirmation.subject ownerBuyConfirmation.body")
                            .exec(function(err, noty) {
                              cb(err, noty);
                            });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    } else {
      var error = {
        message: "Formulario Incorrecto."
      };
      cb(error, null);
    }
  },
  saveNotificationRecoveryPassword: function(data, cb) {
    if (validateNotification(data)) {
      async.parallel([
        function(cbp) {
          isoFieldView.validateCreateIsoField(data.subject, function(data) {
            if (data) {
              cbp(null, data);
            } else {
              cbp(true, null);
            }
          });
        },
        function(cbp) {
          isoFieldView.validateCreateIsoField(data.body, function(data) {
            if (data) {
              cbp(null, data);
            } else {
              cbp(true, null);
            }
          });
        }
      ], function(err, result) {
        if (err || !result) {
          cb(err, result);
        } else {
          db.Notifications.findOne().exec(function(err, noty) {
            if (err || !noty) {
              cb(err, noty);
            } else {
              async.parallel([
                function(cbp) {
                  async.map(noty._doc.recoveryPassword.subject, function(text, callback) {
                    isoFieldView.remove(text, function(err, iso) {
                      callback(err, iso);
                    });
                  }, function(err, result) {
                    cbp(err, result);
                  });
                },
                function(cbp) {
                  async.map(noty._doc.recoveryPassword.body, function(text, callback) {
                    isoFieldView.remove(text, function(err, iso) {
                      callback(err, iso);
                    });
                  }, function(err, result) {
                    cbp(err, result);
                  });
                }
              ], function(err, result) {
                if (err || !result) {
                  cb(err, result);
                } else {
                  async.parallel([
                    function(cbp) {
                      async.map(data.subject, function(t, callback) {
                        isoFieldView.create(t._id, t.value, function(err, iso) {
                          callback(err, iso);
                        });
                      }, function(err, result) {
                        cbp(err, result);
                      });
                    },
                    function(cbp) {
                      async.map(data.body, function(t, callback) {
                        isoFieldView.create(t._id, t.value, function(err, iso) {
                          callback(err, iso);
                        });
                      }, function(err, result) {
                        cbp(err, result);
                      });
                    }
                  ], function(err, result) {
                    if (err || !result) {
                      cb(err, result);
                    } else {
                      var subject = [];
                      for (var i = 0; i < result[0].length; i++) {
                        subject.push(result[0][i]._doc._id);
                      }
                      var body = [];
                      for (var j = 0; j < result[1].length; j++) {
                        body.push(result[1][j]._doc._id);
                      }

                      db.Notifications.findOneAndUpdate({
                        $set: {
                          "recoveryPassword.subject": subject,
                          "recoveryPassword.body": body
                        }
                      }).exec(function(err, success) {
                        if (err || !success) {
                          cb(err, success);
                        } else {
                          db.Notifications.findOne()
                            .populate("rejectRequest.subject rejectRequest.body" +
                              " userParticular.subject userParticular.body" +
                              " userRegister.subject userRegister.body" +
                              " bulletin.subject bulletin.body" +
                              " recoveryPassword.subject recoveryPassword.body" +
                              " publicationBoat.subject publicationBoat.body" +
                              " userRequest.subject userRequest.body" +
                              " ownerRequest.subject ownerRequest.body" +
                              " userOffer.subject userOffer.body" +
                              " ownerOffer.subject ownerOffer.body" +
                              " userRefundConfirmation.subject userRefundConfirmation.body" +
                              " ownerRefundConfirmation.subject ownerRefundConfirmation.body" +
                              " userExpireTime.subject userExpireTime.body" +
                              " userBuyConfirmation.subject userBuyConfirmation.body" +
                              " ownerBuyConfirmation.subject ownerBuyConfirmation.body")
                            .exec(function(err, noty) {
                              cb(err, noty);
                            });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    } else {
      var error = {
        message: "Formulario Incorrecto."
      };
      cb(error, null);
    }
  },
  saveNotificationPublicationBoat: function(data, cb) {
    if (validateNotification(data)) {
      async.parallel([
        function(cbp) {
          isoFieldView.validateCreateIsoField(data.subject, function(data) {
            if (data) {
              cbp(null, data);
            } else {
              cbp(true, null);
            }
          });
        },
        function(cbp) {
          isoFieldView.validateCreateIsoField(data.body, function(data) {
            if (data) {
              cbp(null, data);
            } else {
              cbp(true, null);
            }
          });
        }
      ], function(err, result) {
        if (err || !result) {
          cb(err, result);
        } else {
          db.Notifications.findOne().exec(function(err, noty) {
            if (err || !noty) {
              cb(err, noty);
            } else {
              async.parallel([
                function(cbp) {
                  async.map(noty._doc.publicationBoat.subject, function(text, callback) {
                    isoFieldView.remove(text, function(err, iso) {
                      callback(err, iso);
                    });
                  }, function(err, result) {
                    cbp(err, result);
                  });
                },
                function(cbp) {
                  async.map(noty._doc.publicationBoat.body, function(text, callback) {
                    isoFieldView.remove(text, function(err, iso) {
                      callback(err, iso);
                    });
                  }, function(err, result) {
                    cbp(err, result);
                  });
                }
              ], function(err, result) {
                if (err || !result) {
                  cb(err, result);
                } else {
                  async.parallel([
                    function(cbp) {
                      async.map(data.subject, function(t, callback) {
                        isoFieldView.create(t._id, t.value, function(err, iso) {
                          callback(err, iso);
                        });
                      }, function(err, result) {
                        cbp(err, result);
                      });
                    },
                    function(cbp) {
                      async.map(data.body, function(t, callback) {
                        isoFieldView.create(t._id, t.value, function(err, iso) {
                          callback(err, iso);
                        });
                      }, function(err, result) {
                        cbp(err, result);
                      });
                    }
                  ], function(err, result) {
                    if (err || !result) {
                      cb(err, result);
                    } else {
                      var subject = [];
                      for (var i = 0; i < result[0].length; i++) {
                        subject.push(result[0][i]._doc._id);
                      }
                      var body = [];
                      for (var j = 0; j < result[1].length; j++) {
                        body.push(result[1][j]._doc._id);
                      }

                      db.Notifications.findOneAndUpdate({
                        $set: {
                          "publicationBoat.subject": subject,
                          "publicationBoat.body": body
                        }
                      }).exec(function(err, success) {
                        if (err || !success) {
                          cb(err, success);
                        } else {
                          db.Notifications.findOne()
                            .populate("rejectRequest.subject rejectRequest.body" +
                              " userParticular.subject userParticular.body" +
                              " userRegister.subject userRegister.body" +
                              " bulletin.subject bulletin.body" +
                              " recoveryPassword.subject recoveryPassword.body" +
                              " publicationBoat.subject publicationBoat.body" +
                              " userRequest.subject userRequest.body" +
                              " ownerRequest.subject ownerRequest.body" +
                              " userOffer.subject userOffer.body" +
                              " ownerOffer.subject ownerOffer.body" +
                              " userRefundConfirmation.subject userRefundConfirmation.body" +
                              " ownerRefundConfirmation.subject ownerRefundConfirmation.body" +
                              " userExpireTime.subject userExpireTime.body" +
                              " userBuyConfirmation.subject userBuyConfirmation.body" +
                              " ownerBuyConfirmation.subject ownerBuyConfirmation.body")
                            .exec(function(err, noty) {
                              cb(err, noty);
                            });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    } else {
      var error = {
        message: "Formulario Incorrecto."
      };
      cb(error, null);
    }
  },
  saveNotificationUserRequest: function(data, cb) {
    if (validateNotification(data)) {
      async.parallel([
        function(cbp) {
          isoFieldView.validateCreateIsoField(data.subject, function(data) {
            if (data) {
              cbp(null, data);
            } else {
              cbp(true, null);
            }
          });
        },
        function(cbp) {
          isoFieldView.validateCreateIsoField(data.body, function(data) {
            if (data) {
              cbp(null, data);
            } else {
              cbp(true, null);
            }
          });
        }
      ], function(err, result) {
        if (err || !result) {
          cb(err, result);
        } else {
          db.Notifications.findOne().exec(function(err, noty) {
            if (err || !noty) {
              cb(err, noty);
            } else {
              async.parallel([
                function(cbp) {
                  async.map(noty._doc.userRequest.subject, function(text, callback) {
                    isoFieldView.remove(text, function(err, iso) {
                      callback(err, iso);
                    });
                  }, function(err, result) {
                    cbp(err, result);
                  });
                },
                function(cbp) {
                  async.map(noty._doc.userRequest.body, function(text, callback) {
                    isoFieldView.remove(text, function(err, iso) {
                      callback(err, iso);
                    });
                  }, function(err, result) {
                    cbp(err, result);
                  });
                }
              ], function(err, result) {
                if (err || !result) {
                  cb(err, result);
                } else {
                  async.parallel([
                    function(cbp) {
                      async.map(data.subject, function(t, callback) {
                        isoFieldView.create(t._id, t.value, function(err, iso) {
                          callback(err, iso);
                        });
                      }, function(err, result) {
                        cbp(err, result);
                      });
                    },
                    function(cbp) {
                      async.map(data.body, function(t, callback) {
                        isoFieldView.create(t._id, t.value, function(err, iso) {
                          callback(err, iso);
                        });
                      }, function(err, result) {
                        cbp(err, result);
                      });
                    }
                  ], function(err, result) {
                    if (err || !result) {
                      cb(err, result);
                    } else {
                      var subject = [];
                      for (var i = 0; i < result[0].length; i++) {
                        subject.push(result[0][i]._doc._id);
                      }
                      var body = [];
                      for (var j = 0; j < result[1].length; j++) {
                        body.push(result[1][j]._doc._id);
                      }

                      db.Notifications.findOneAndUpdate({
                        $set: {
                          "userRequest.subject": subject,
                          "userRequest.body": body
                        }
                      }).exec(function(err, success) {
                        if (err || !success) {
                          cb(err, success);
                        } else {
                          db.Notifications.findOne()
                            .populate("rejectRequest.subject rejectRequest.body" +
                              " userParticular.subject userParticular.body" +
                              " userRegister.subject userRegister.body" +
                              " bulletin.subject bulletin.body" +
                              " recoveryPassword.subject recoveryPassword.body" +
                              " publicationBoat.subject publicationBoat.body" +
                              " userRequest.subject userRequest.body" +
                              " ownerRequest.subject ownerRequest.body" +
                              " userOffer.subject userOffer.body" +
                              " ownerOffer.subject ownerOffer.body" +
                              " userRefundConfirmation.subject userRefundConfirmation.body" +
                              " ownerRefundConfirmation.subject ownerRefundConfirmation.body" +
                              " userExpireTime.subject userExpireTime.body" +
                              " userBuyConfirmation.subject userBuyConfirmation.body" +
                              " ownerBuyConfirmation.subject ownerBuyConfirmation.body")
                            .exec(function(err, noty) {
                              cb(err, noty);
                            });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    } else {
      var error = {
        message: "Formulario Incorrecto."
      };
      cb(error, null);
    }
  },
  saveNotificationOwnerRequest: function(data, cb) {
    if (validateNotification(data)) {
      async.parallel([
        function(cbp) {
          isoFieldView.validateCreateIsoField(data.subject, function(data) {
            if (data) {
              cbp(null, data);
            } else {
              cbp(true, null);
            }
          });
        },
        function(cbp) {
          isoFieldView.validateCreateIsoField(data.body, function(data) {
            if (data) {
              cbp(null, data);
            } else {
              cbp(true, null);
            }
          });
        }
      ], function(err, result) {
        if (err || !result) {
          cb(err, result);
        } else {
          db.Notifications.findOne().exec(function(err, noty) {
            if (err || !noty) {
              cb(err, noty);
            } else {
              async.parallel([
                function(cbp) {
                  async.map(noty._doc.ownerRequest.subject, function(text, callback) {
                    isoFieldView.remove(text, function(err, iso) {
                      callback(err, iso);
                    });
                  }, function(err, result) {
                    cbp(err, result);
                  });
                },
                function(cbp) {
                  async.map(noty._doc.ownerRequest.body, function(text, callback) {
                    isoFieldView.remove(text, function(err, iso) {
                      callback(err, iso);
                    });
                  }, function(err, result) {
                    cbp(err, result);
                  });
                }
              ], function(err, result) {
                if (err || !result) {
                  cb(err, result);
                } else {
                  async.parallel([
                    function(cbp) {
                      async.map(data.subject, function(t, callback) {
                        isoFieldView.create(t._id, t.value, function(err, iso) {
                          callback(err, iso);
                        });
                      }, function(err, result) {
                        cbp(err, result);
                      });
                    },
                    function(cbp) {
                      async.map(data.body, function(t, callback) {
                        isoFieldView.create(t._id, t.value, function(err, iso) {
                          callback(err, iso);
                        });
                      }, function(err, result) {
                        cbp(err, result);
                      });
                    }
                  ], function(err, result) {
                    if (err || !result) {
                      cb(err, result);
                    } else {
                      var subject = [];
                      for (var i = 0; i < result[0].length; i++) {
                        subject.push(result[0][i]._doc._id);
                      }
                      var body = [];
                      for (var j = 0; j < result[1].length; j++) {
                        body.push(result[1][j]._doc._id);
                      }

                      db.Notifications.findOneAndUpdate({
                        $set: {
                          "ownerRequest.subject": subject,
                          "ownerRequest.body": body
                        }
                      }).exec(function(err, success) {
                        if (err || !success) {
                          cb(err, success);
                        } else {
                          db.Notifications.findOne()
                            .populate("rejectRequest.subject rejectRequest.body" +
                              " userParticular.subject userParticular.body" +
                              " userRegister.subject userRegister.body" +
                              " bulletin.subject bulletin.body" +
                              " recoveryPassword.subject recoveryPassword.body" +
                              " publicationBoat.subject publicationBoat.body" +
                              " userRequest.subject userRequest.body" +
                              " ownerRequest.subject ownerRequest.body" +
                              " userOffer.subject userOffer.body" +
                              " ownerOffer.subject ownerOffer.body" +
                              " userRefundConfirmation.subject userRefundConfirmation.body" +
                              " ownerRefundConfirmation.subject ownerRefundConfirmation.body" +
                              " userExpireTime.subject userExpireTime.body" +
                              " userBuyConfirmation.subject userBuyConfirmation.body" +
                              " ownerBuyConfirmation.subject ownerBuyConfirmation.body")
                            .exec(function(err, noty) {
                              cb(err, noty);
                            });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    } else {
      var error = {
        message: "Formulario Incorrecto."
      };
      cb(error, null);
    }
  },
  saveNotificationRejectRequest: function(data, cb) {
    if (validateNotification(data)) {
      async.parallel([
        function(cbp) {
          isoFieldView.validateCreateIsoField(data.subject, function(data) {
            if (data) {
              cbp(null, data);
            } else {
              cbp(true, null);
            }
          });
        },
        function(cbp) {
          isoFieldView.validateCreateIsoField(data.body, function(data) {
            if (data) {
              cbp(null, data);
            } else {
              cbp(true, null);
            }
          });
        }
      ], function(err, result) {
        if (err || !result) {
          cb(err, result);
        } else {
          db.Notifications.findOne().exec(function(err, noty) {
            if (err || !noty) {
              cb(err, noty);
            } else {
              async.parallel([
                function(cbp) {
                  async.map(noty._doc.rejectRequest.subject, function(text, callback) {
                    isoFieldView.remove(text, function(err, iso) {
                      callback(err, iso);
                    });
                  }, function(err, result) {
                    cbp(err, result);
                  });
                },
                function(cbp) {
                  async.map(noty._doc.rejectRequest.body, function(text, callback) {
                    isoFieldView.remove(text, function(err, iso) {
                      callback(err, iso);
                    });
                  }, function(err, result) {
                    cbp(err, result);
                  });
                }
              ], function(err, result) {
                if (err || !result) {
                  cb(err, result);
                } else {
                  async.parallel([
                    function(cbp) {
                      async.map(data.subject, function(t, callback) {
                        isoFieldView.create(t._id, t.value, function(err, iso) {
                          callback(err, iso);
                        });
                      }, function(err, result) {
                        cbp(err, result);
                      });
                    },
                    function(cbp) {
                      async.map(data.body, function(t, callback) {
                        isoFieldView.create(t._id, t.value, function(err, iso) {
                          callback(err, iso);
                        });
                      }, function(err, result) {
                        cbp(err, result);
                      });
                    }
                  ], function(err, result) {
                    if (err || !result) {
                      cb(err, result);
                    } else {
                      var subject = [];
                      for (var i = 0; i < result[0].length; i++) {
                        subject.push(result[0][i]._doc._id);
                      }
                      var body = [];
                      for (var j = 0; j < result[1].length; j++) {
                        body.push(result[1][j]._doc._id);
                      }

                      db.Notifications.findOneAndUpdate({
                        $set: {
                          "rejectRequest.subject": subject,
                          "rejectRequest.body": body
                        }
                      }).exec(function(err, success) {
                        if (err || !success) {
                          cb(err, success);
                        } else {
                          db.Notifications.findOne()
                            .populate("rejectRequest.subject rejectRequest.body" +
                              " userParticular.subject userParticular.body" +
                              " userRegister.subject userRegister.body" +
                              " bulletin.subject bulletin.body" +
                              " recoveryPassword.subject recoveryPassword.body" +
                              " publicationBoat.subject publicationBoat.body" +
                              " userRequest.subject userRequest.body" +
                              " ownerRequest.subject ownerRequest.body" +
                              " userOffer.subject userOffer.body" +
                              " ownerOffer.subject ownerOffer.body" +
                              " userRefundConfirmation.subject userRefundConfirmation.body" +
                              " ownerRefundConfirmation.subject ownerRefundConfirmation.body" +
                              " userExpireTime.subject userExpireTime.body" +
                              " userBuyConfirmation.subject userBuyConfirmation.body" +
                              " ownerBuyConfirmation.subject ownerBuyConfirmation.body")
                            .exec(function(err, noty) {
                              cb(err, noty);
                            });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    } else {
      var error = {
        message: "Formulario Incorrecto."
      };
      cb(error, null);
    }
  },
  saveNotificationUserOffer: function(data, cb) {
    if (validateNotification(data)) {
      async.parallel([
        function(cbp) {
          isoFieldView.validateCreateIsoField(data.subject, function(data) {
            if (data) {
              cbp(null, data);
            } else {
              cbp(true, null);
            }
          });
        },
        function(cbp) {
          isoFieldView.validateCreateIsoField(data.body, function(data) {
            if (data) {
              cbp(null, data);
            } else {
              cbp(true, null);
            }
          });
        }
      ], function(err, result) {
        if (err || !result) {
          cb(err, result);
        } else {
          db.Notifications.findOne().exec(function(err, noty) {
            if (err || !noty) {
              cb(err, noty);
            } else {
              async.parallel([
                function(cbp) {
                  async.map(noty._doc.userOffer.subject, function(text, callback) {
                    isoFieldView.remove(text, function(err, iso) {
                      callback(err, iso);
                    });
                  }, function(err, result) {
                    cbp(err, result);
                  });
                },
                function(cbp) {
                  async.map(noty._doc.userOffer.body, function(text, callback) {
                    isoFieldView.remove(text, function(err, iso) {
                      callback(err, iso);
                    });
                  }, function(err, result) {
                    cbp(err, result);
                  });
                }
              ], function(err, result) {
                if (err || !result) {
                  cb(err, result);
                } else {
                  async.parallel([
                    function(cbp) {
                      async.map(data.subject, function(t, callback) {
                        isoFieldView.create(t._id, t.value, function(err, iso) {
                          callback(err, iso);
                        });
                      }, function(err, result) {
                        cbp(err, result);
                      });
                    },
                    function(cbp) {
                      async.map(data.body, function(t, callback) {
                        isoFieldView.create(t._id, t.value, function(err, iso) {
                          callback(err, iso);
                        });
                      }, function(err, result) {
                        cbp(err, result);
                      });
                    }
                  ], function(err, result) {
                    if (err || !result) {
                      cb(err, result);
                    } else {
                      var subject = [];
                      for (var i = 0; i < result[0].length; i++) {
                        subject.push(result[0][i]._doc._id);
                      }
                      var body = [];
                      for (var j = 0; j < result[1].length; j++) {
                        body.push(result[1][j]._doc._id);
                      }

                      db.Notifications.findOneAndUpdate({
                        $set: {
                          "userOffer.subject": subject,
                          "userOffer.body": body
                        }
                      }).exec(function(err, success) {
                        if (err || !success) {
                          cb(err, success);
                        } else {
                          db.Notifications.findOne()
                            .populate("rejectRequest.subject rejectRequest.body" +
                              " userParticular.subject userParticular.body" +
                              " userRegister.subject userRegister.body" +
                              " bulletin.subject bulletin.body" +
                              " recoveryPassword.subject recoveryPassword.body" +
                              " publicationBoat.subject publicationBoat.body" +
                              " userRequest.subject userRequest.body" +
                              " ownerRequest.subject ownerRequest.body" +
                              " userOffer.subject userOffer.body" +
                              " ownerOffer.subject ownerOffer.body" +
                              " userRefundConfirmation.subject userRefundConfirmation.body" +
                              " ownerRefundConfirmation.subject ownerRefundConfirmation.body" +
                              " userExpireTime.subject userExpireTime.body" +
                              " userBuyConfirmation.subject userBuyConfirmation.body" +
                              " ownerBuyConfirmation.subject ownerBuyConfirmation.body")
                            .exec(function(err, noty) {
                              cb(err, noty);
                            });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    } else {
      var error = {
        message: "Formulario Incorrecto."
      };
      cb(error, null);
    }
  },
  saveNotificationOwnerOffer: function(data, cb) {
    if (validateNotification(data)) {
      async.parallel([
        function(cbp) {
          isoFieldView.validateCreateIsoField(data.subject, function(data) {
            if (data) {
              cbp(null, data);
            } else {
              cbp(true, null);
            }
          });
        },
        function(cbp) {
          isoFieldView.validateCreateIsoField(data.body, function(data) {
            if (data) {
              cbp(null, data);
            } else {
              cbp(true, null);
            }
          });
        }
      ], function(err, result) {
        if (err || !result) {
          cb(err, result);
        } else {
          db.Notifications.findOne().exec(function(err, noty) {
            if (err || !noty) {
              cb(err, noty);
            } else {
              async.parallel([
                function(cbp) {
                  async.map(noty._doc.ownerOffer.subject, function(text, callback) {
                    isoFieldView.remove(text, function(err, iso) {
                      callback(err, iso);
                    });
                  }, function(err, result) {
                    cbp(err, result);
                  });
                },
                function(cbp) {
                  async.map(noty._doc.ownerOffer.body, function(text, callback) {
                    isoFieldView.remove(text, function(err, iso) {
                      callback(err, iso);
                    });
                  }, function(err, result) {
                    cbp(err, result);
                  });
                }
              ], function(err, result) {
                if (err || !result) {
                  cb(err, result);
                } else {
                  async.parallel([
                    function(cbp) {
                      async.map(data.subject, function(t, callback) {
                        isoFieldView.create(t._id, t.value, function(err, iso) {
                          callback(err, iso);
                        });
                      }, function(err, result) {
                        cbp(err, result);
                      });
                    },
                    function(cbp) {
                      async.map(data.body, function(t, callback) {
                        isoFieldView.create(t._id, t.value, function(err, iso) {
                          callback(err, iso);
                        });
                      }, function(err, result) {
                        cbp(err, result);
                      });
                    }
                  ], function(err, result) {
                    if (err || !result) {
                      cb(err, result);
                    } else {
                      var subject = [];
                      for (var i = 0; i < result[0].length; i++) {
                        subject.push(result[0][i]._doc._id);
                      }
                      var body = [];
                      for (var j = 0; j < result[1].length; j++) {
                        body.push(result[1][j]._doc._id);
                      }

                      db.Notifications.findOneAndUpdate({
                        $set: {
                          "ownerOffer.subject": subject,
                          "ownerOffer.body": body
                        }
                      }).exec(function(err, success) {
                        if (err || !success) {
                          cb(err, success);
                        } else {
                          db.Notifications.findOne()
                            .populate("rejectRequest.subject rejectRequest.body" +
                              " userParticular.subject userParticular.body" +
                              " userRegister.subject userRegister.body" +
                              " bulletin.subject bulletin.body" +
                              " recoveryPassword.subject recoveryPassword.body" +
                              " publicationBoat.subject publicationBoat.body" +
                              " userRequest.subject userRequest.body" +
                              " ownerRequest.subject ownerRequest.body" +
                              " userOffer.subject userOffer.body" +
                              " ownerOffer.subject ownerOffer.body" +
                              " userRefundConfirmation.subject userRefundConfirmation.body" +
                              " ownerRefundConfirmation.subject ownerRefundConfirmation.body" +
                              " userExpireTime.subject userExpireTime.body" +
                              " userBuyConfirmation.subject userBuyConfirmation.body" +
                              " ownerBuyConfirmation.subject ownerBuyConfirmation.body")
                            .exec(function(err, noty) {
                              cb(err, noty);
                            });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    } else {
      var error = {
        message: "Formulario Incorrecto."
      };
      cb(error, null);
    }
  },
  saveNotificationUserBuyConfirmation: function(data, cb) {
    if (validateNotification(data)) {
      async.parallel([
        function(cbp) {
          isoFieldView.validateCreateIsoField(data.subject, function(data) {
            if (data) {
              cbp(null, data);
            } else {
              cbp(true, null);
            }
          });
        },
        function(cbp) {
          isoFieldView.validateCreateIsoField(data.body, function(data) {
            if (data) {
              cbp(null, data);
            } else {
              cbp(true, null);
            }
          });
        }
      ], function(err, result) {
        if (err || !result) {
          cb(err, result);
        } else {
          db.Notifications.findOne().exec(function(err, noty) {
            if (err || !noty) {
              cb(err, noty);
            } else {
              async.parallel([
                function(cbp) {
                  async.map(noty._doc.userBuyConfirmation.subject, function(text, callback) {
                    isoFieldView.remove(text, function(err, iso) {
                      callback(err, iso);
                    });
                  }, function(err, result) {
                    cbp(err, result);
                  });
                },
                function(cbp) {
                  async.map(noty._doc.userBuyConfirmation.body, function(text, callback) {
                    isoFieldView.remove(text, function(err, iso) {
                      callback(err, iso);
                    });
                  }, function(err, result) {
                    cbp(err, result);
                  });
                }
              ], function(err, result) {
                if (err || !result) {
                  cb(err, result);
                } else {
                  async.parallel([
                    function(cbp) {
                      async.map(data.subject, function(t, callback) {
                        isoFieldView.create(t._id, t.value, function(err, iso) {
                          callback(err, iso);
                        });
                      }, function(err, result) {
                        cbp(err, result);
                      });
                    },
                    function(cbp) {
                      async.map(data.body, function(t, callback) {
                        isoFieldView.create(t._id, t.value, function(err, iso) {
                          callback(err, iso);
                        });
                      }, function(err, result) {
                        cbp(err, result);
                      });
                    }
                  ], function(err, result) {
                    if (err || !result) {
                      cb(err, result);
                    } else {
                      var subject = [];
                      for (var i = 0; i < result[0].length; i++) {
                        subject.push(result[0][i]._doc._id);
                      }
                      var body = [];
                      for (var j = 0; j < result[1].length; j++) {
                        body.push(result[1][j]._doc._id);
                      }

                      db.Notifications.findOneAndUpdate({
                        $set: {
                          "userBuyConfirmation.subject": subject,
                          "userBuyConfirmation.body": body
                        }
                      }).exec(function(err, success) {
                        if (err || !success) {
                          cb(err, success);
                        } else {
                          db.Notifications.findOne()
                            .populate("rejectRequest.subject rejectRequest.body" +
                              " userParticular.subject userParticular.body" +
                              " userRegister.subject userRegister.body" +
                              " bulletin.subject bulletin.body" +
                              " recoveryPassword.subject recoveryPassword.body" +
                              " publicationBoat.subject publicationBoat.body" +
                              " userRequest.subject userRequest.body" +
                              " ownerRequest.subject ownerRequest.body" +
                              " userOffer.subject userOffer.body" +
                              " ownerOffer.subject ownerOffer.body" +
                              " userRefundConfirmation.subject userRefundConfirmation.body" +
                              " ownerRefundConfirmation.subject ownerRefundConfirmation.body" +
                              " userExpireTime.subject userExpireTime.body" +
                              " userBuyConfirmation.subject userBuyConfirmation.body" +
                              " ownerBuyConfirmation.subject ownerBuyConfirmation.body")
                            .exec(function(err, noty) {
                              cb(err, noty);
                            });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    } else {
      var error = {
        message: "Formulario Incorrecto."
      };
      cb(error, null);
    }
  },
  saveNotificationOwnerBuyConfirmation: function(data, cb) {
    if (validateNotification(data)) {
      async.parallel([
        function(cbp) {
          isoFieldView.validateCreateIsoField(data.subject, function(data) {
            if (data) {
              cbp(null, data);
            } else {
              cbp(true, null);
            }
          });
        },
        function(cbp) {
          isoFieldView.validateCreateIsoField(data.body, function(data) {
            if (data) {
              cbp(null, data);
            } else {
              cbp(true, null);
            }
          });
        }
      ], function(err, result) {
        if (err || !result) {
          cb(err, result);
        } else {
          db.Notifications.findOne().exec(function(err, noty) {
            if (err || !noty) {
              cb(err, noty);
            } else {
              async.parallel([
                function(cbp) {
                  async.map(noty._doc.ownerBuyConfirmation.subject, function(text, callback) {
                    isoFieldView.remove(text, function(err, iso) {
                      callback(err, iso);
                    });
                  }, function(err, result) {
                    cbp(err, result);
                  });
                },
                function(cbp) {
                  async.map(noty._doc.ownerBuyConfirmation.body, function(text, callback) {
                    isoFieldView.remove(text, function(err, iso) {
                      callback(err, iso);
                    });
                  }, function(err, result) {
                    cbp(err, result);
                  });
                }
              ], function(err, result) {
                if (err || !result) {
                  cb(err, result);
                } else {
                  async.parallel([
                    function(cbp) {
                      async.map(data.subject, function(t, callback) {
                        isoFieldView.create(t._id, t.value, function(err, iso) {
                          callback(err, iso);
                        });
                      }, function(err, result) {
                        cbp(err, result);
                      });
                    },
                    function(cbp) {
                      async.map(data.body, function(t, callback) {
                        isoFieldView.create(t._id, t.value, function(err, iso) {
                          callback(err, iso);
                        });
                      }, function(err, result) {
                        cbp(err, result);
                      });
                    }
                  ], function(err, result) {
                    if (err || !result) {
                      cb(err, result);
                    } else {
                      var subject = [];
                      for (var i = 0; i < result[0].length; i++) {
                        subject.push(result[0][i]._doc._id);
                      }
                      var body = [];
                      for (var j = 0; j < result[1].length; j++) {
                        body.push(result[1][j]._doc._id);
                      }

                      db.Notifications.findOneAndUpdate({
                        $set: {
                          "ownerBuyConfirmation.subject": subject,
                          "ownerBuyConfirmation.body": body
                        }
                      }).exec(function(err, success) {
                        if (err || !success) {
                          cb(err, success);
                        } else {
                          db.Notifications.findOne()
                            .populate("rejectRequest.subject rejectRequest.body" +
                              " userParticular.subject userParticular.body" +
                              " userRegister.subject userRegister.body" +
                              " bulletin.subject bulletin.body" +
                              " recoveryPassword.subject recoveryPassword.body" +
                              " publicationBoat.subject publicationBoat.body" +
                              " userRequest.subject userRequest.body" +
                              " ownerRequest.subject ownerRequest.body" +
                              " userOffer.subject userOffer.body" +
                              " ownerOffer.subject ownerOffer.body" +
                              " userRefundConfirmation.subject userRefundConfirmation.body" +
                              " ownerRefundConfirmation.subject ownerRefundConfirmation.body" +
                              " userExpireTime.subject userExpireTime.body" +
                              " userBuyConfirmation.subject userBuyConfirmation.body" +
                              " ownerBuyConfirmation.subject ownerBuyConfirmation.body")
                            .exec(function(err, noty) {
                              cb(err, noty);
                            });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    } else {
      var error = {
        message: "Formulario Incorrecto."
      };
      cb(error, null);
    }
  },
  saveNotificationUserRefundConfirmation: function(data, cb) {
    if (validateNotification(data)) {
      async.parallel([
        function(cbp) {
          isoFieldView.validateCreateIsoField(data.subject, function(data) {
            if (data) {
              cbp(null, data);
            } else {
              cbp(true, null);
            }
          });
        },
        function(cbp) {
          isoFieldView.validateCreateIsoField(data.body, function(data) {
            if (data) {
              cbp(null, data);
            } else {
              cbp(true, null);
            }
          });
        }
      ], function(err, result) {
        if (err || !result) {
          cb(err, result);
        } else {
          db.Notifications.findOne().exec(function(err, noty) {
            if (err || !noty) {
              cb(err, noty);
            } else {
              async.parallel([
                function(cbp) {
                  async.map(noty._doc.userRefundConfirmation.subject, function(text, callback) {
                    isoFieldView.remove(text, function(err, iso) {
                      callback(err, iso);
                    });
                  }, function(err, result) {
                    cbp(err, result);
                  });
                },
                function(cbp) {
                  async.map(noty._doc.userRefundConfirmation.body, function(text, callback) {
                    isoFieldView.remove(text, function(err, iso) {
                      callback(err, iso);
                    });
                  }, function(err, result) {
                    cbp(err, result);
                  });
                }
              ], function(err, result) {
                if (err || !result) {
                  cb(err, result);
                } else {
                  async.parallel([
                    function(cbp) {
                      async.map(data.subject, function(t, callback) {
                        isoFieldView.create(t._id, t.value, function(err, iso) {
                          callback(err, iso);
                        });
                      }, function(err, result) {
                        cbp(err, result);
                      });
                    },
                    function(cbp) {
                      async.map(data.body, function(t, callback) {
                        isoFieldView.create(t._id, t.value, function(err, iso) {
                          callback(err, iso);
                        });
                      }, function(err, result) {
                        cbp(err, result);
                      });
                    }
                  ], function(err, result) {
                    if (err || !result) {
                      cb(err, result);
                    } else {
                      var subject = [];
                      for (var i = 0; i < result[0].length; i++) {
                        subject.push(result[0][i]._doc._id);
                      }
                      var body = [];
                      for (var j = 0; j < result[1].length; j++) {
                        body.push(result[1][j]._doc._id);
                      }

                      db.Notifications.findOneAndUpdate({
                        $set: {
                          "userRefundConfirmation.subject": subject,
                          "userRefundConfirmation.body": body
                        }
                      }).exec(function(err, success) {
                        if (err || !success) {
                          cb(err, success);
                        } else {
                          db.Notifications.findOne()
                            .populate("rejectRequest.subject rejectRequest.body" +
                              " userParticular.subject userParticular.body" +
                              " userRegister.subject userRegister.body" +
                              " bulletin.subject bulletin.body" +
                              " recoveryPassword.subject recoveryPassword.body" +
                              " publicationBoat.subject publicationBoat.body" +
                              " userRequest.subject userRequest.body" +
                              " ownerRequest.subject ownerRequest.body" +
                              " userOffer.subject userOffer.body" +
                              " ownerOffer.subject ownerOffer.body" +
                              " userRefundConfirmation.subject userRefundConfirmation.body" +
                              " ownerRefundConfirmation.subject ownerRefundConfirmation.body" +
                              " userExpireTime.subject userExpireTime.body" +
                              " userBuyConfirmation.subject userBuyConfirmation.body" +
                              " ownerBuyConfirmation.subject ownerBuyConfirmation.body")
                            .exec(function(err, noty) {
                              cb(err, noty);
                            });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    } else {
      var error = {
        message: "Formulario Incorrecto."
      };
      cb(error, null);
    }
  },
  saveNotificationOwnerRefundConfirmation: function(data, cb) {
    if (validateNotification(data)) {
      async.parallel([
        function(cbp) {
          isoFieldView.validateCreateIsoField(data.subject, function(data) {
            if (data) {
              cbp(null, data);
            } else {
              cbp(true, null);
            }
          });
        },
        function(cbp) {
          isoFieldView.validateCreateIsoField(data.body, function(data) {
            if (data) {
              cbp(null, data);
            } else {
              cbp(true, null);
            }
          });
        }
      ], function(err, result) {
        if (err || !result) {
          cb(err, result);
        } else {
          db.Notifications.findOne().exec(function(err, noty) {
            if (err || !noty) {
              cb(err, noty);
            } else {
              async.parallel([
                function(cbp) {
                  async.map(noty._doc.ownerRefundConfirmation.subject, function(text, callback) {
                    isoFieldView.remove(text, function(err, iso) {
                      callback(err, iso);
                    });
                  }, function(err, result) {
                    cbp(err, result);
                  });
                },
                function(cbp) {
                  async.map(noty._doc.ownerRefundConfirmation.body, function(text, callback) {
                    isoFieldView.remove(text, function(err, iso) {
                      callback(err, iso);
                    });
                  }, function(err, result) {
                    cbp(err, result);
                  });
                }
              ], function(err, result) {
                if (err || !result) {
                  cb(err, result);
                } else {
                  async.parallel([
                    function(cbp) {
                      async.map(data.subject, function(t, callback) {
                        isoFieldView.create(t._id, t.value, function(err, iso) {
                          callback(err, iso);
                        });
                      }, function(err, result) {
                        cbp(err, result);
                      });
                    },
                    function(cbp) {
                      async.map(data.body, function(t, callback) {
                        isoFieldView.create(t._id, t.value, function(err, iso) {
                          callback(err, iso);
                        });
                      }, function(err, result) {
                        cbp(err, result);
                      });
                    }
                  ], function(err, result) {
                    if (err || !result) {
                      cb(err, result);
                    } else {
                      var subject = [];
                      for (var i = 0; i < result[0].length; i++) {
                        subject.push(result[0][i]._doc._id);
                      }
                      var body = [];
                      for (var j = 0; j < result[1].length; j++) {
                        body.push(result[1][j]._doc._id);
                      }

                      db.Notifications.findOneAndUpdate({
                        $set: {
                          "ownerRefundConfirmation.subject": subject,
                          "ownerRefundConfirmation.body": body
                        }
                      }).exec(function(err, success) {
                        if (err || !success) {
                          cb(err, success);
                        } else {
                          db.Notifications.findOne()
                            .populate("rejectRequest.subject rejectRequest.body" +
                              " userParticular.subject userParticular.body" +
                              " userRegister.subject userRegister.body" +
                              " bulletin.subject bulletin.body" +
                              " recoveryPassword.subject recoveryPassword.body" +
                              " publicationBoat.subject publicationBoat.body" +
                              " userRequest.subject userRequest.body" +
                              " ownerRequest.subject ownerRequest.body" +
                              " userOffer.subject userOffer.body" +
                              " ownerOffer.subject ownerOffer.body" +
                              " userRefundConfirmation.subject userRefundConfirmation.body" +
                              " ownerRefundConfirmation.subject ownerRefundConfirmation.body" +
                              " userExpireTime.subject userExpireTime.body" +
                              " userBuyConfirmation.subject userBuyConfirmation.body" +
                              " ownerBuyConfirmation.subject ownerBuyConfirmation.body")
                            .exec(function(err, noty) {
                              cb(err, noty);
                            });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    } else {
      var error = {
        message: "Formulario Incorrecto."
      };
      cb(error, null);
    }
  },
  saveNotificationUserExpireTime: function(data, cb) {
    if (validateNotification(data)) {
      async.parallel([
        function(cbp) {
          isoFieldView.validateCreateIsoField(data.subject, function(data) {
            if (data) {
              cbp(null, data);
            } else {
              cbp(true, null);
            }
          });
        },
        function(cbp) {
          isoFieldView.validateCreateIsoField(data.body, function(data) {
            if (data) {
              cbp(null, data);
            } else {
              cbp(true, null);
            }
          });
        }
      ], function(err, result) {
        if (err || !result) {
          cb(err, result);
        } else {
          db.Notifications.findOne().exec(function(err, noty) {
            if (err || !noty) {
              cb(err, noty);
            } else {
              async.parallel([
                function(cbp) {
                  async.map(noty._doc.userExpireTime.subject, function(text, callback) {
                    isoFieldView.remove(text, function(err, iso) {
                      callback(err, iso);
                    });
                  }, function(err, result) {
                    cbp(err, result);
                  });
                },
                function(cbp) {
                  async.map(noty._doc.userExpireTime.body, function(text, callback) {
                    isoFieldView.remove(text, function(err, iso) {
                      callback(err, iso);
                    });
                  }, function(err, result) {
                    cbp(err, result);
                  });
                }
              ], function(err, result) {
                if (err || !result) {
                  cb(err, result);
                } else {
                  async.parallel([
                    function(cbp) {
                      async.map(data.subject, function(t, callback) {
                        isoFieldView.create(t._id, t.value, function(err, iso) {
                          callback(err, iso);
                        });
                      }, function(err, result) {
                        cbp(err, result);
                      });
                    },
                    function(cbp) {
                      async.map(data.body, function(t, callback) {
                        isoFieldView.create(t._id, t.value, function(err, iso) {
                          callback(err, iso);
                        });
                      }, function(err, result) {
                        cbp(err, result);
                      });
                    }
                  ], function(err, result) {
                    if (err || !result) {
                      cb(err, result);
                    } else {
                      var subject = [];
                      for (var i = 0; i < result[0].length; i++) {
                        subject.push(result[0][i]._doc._id);
                      }
                      var body = [];
                      for (var j = 0; j < result[1].length; j++) {
                        body.push(result[1][j]._doc._id);
                      }

                      db.Notifications.findOneAndUpdate({
                        $set: {
                          "userExpireTime.subject": subject,
                          "userExpireTime.body": body
                        }
                      }).exec(function(err, success) {
                        if (err || !success) {
                          cb(err, success);
                        } else {
                          db.Notifications.findOne()
                            .populate("rejectRequest.subject rejectRequest.body" +
                              " userParticular.subject userParticular.body" +
                              " userRegister.subject userRegister.body" +
                              " bulletin.subject bulletin.body" +
                              " recoveryPassword.subject recoveryPassword.body" +
                              " publicationBoat.subject publicationBoat.body" +
                              " userRequest.subject userRequest.body" +
                              " ownerRequest.subject ownerRequest.body" +
                              " userOffer.subject userOffer.body" +
                              " ownerOffer.subject ownerOffer.body" +
                              " userRefundConfirmation.subject userRefundConfirmation.body" +
                              " ownerRefundConfirmation.subject ownerRefundConfirmation.body" +
                              " userExpireTime.subject userExpireTime.body" +
                              " userBuyConfirmation.subject userBuyConfirmation.body" +
                              " ownerBuyConfirmation.subject ownerBuyConfirmation.body")
                            .exec(function(err, noty) {
                              cb(err, noty);
                            });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    } else {
      var error = {
        message: "Formulario Incorrecto."
      };
      cb(error, null);
    }
  },
  /********************************************************/


  sendMailRegister: function(lang, user, token, cb) {
    loadConfiguration(function(err, conf) {
      if (err) {
        cb(err, false);
      } else {
        var server = conf._doc.general.domain;
        if (server) {
          db.Notifications.findOne()
            .select("userRegister")
            .populate({
              path: "userRegister.subject",
              select: "value",
              match: { language: lang }
            })
            .populate({
              path: "userRegister.body",
              select: "value",
              match: { language: lang }
            })
            .exec(function(err, success) {
              if (err || !success) {
                cb(err, success);
              } else {
                var url = urlUtil.resolve(server, "/service/users/activate/" + token);
                var body = success._doc.userRegister.body[0].value;

                  //html: 'Embedded image: <img src="cid:unique@kreata.ee"/>',
                var attachments = [
                  {
                    filename: "image.jpg",
                    path: server + "/common/img/Retina/img_56px_email_logo_header@2x.png",
                    cid: "logoheader@alquilerdebarco.com" //same cid value as in the html img src
                  },
                  {
                    filename: "image2.jpg",
                    path: server + "/common/img/Retina/img_164px_email_logo_footer@2x.png",
                    cid: "logofooter@alquilerdebarco.com" //same cid value as in the html img src
                  }
                ];
                body = ReplaceAll(body, "../common/img/Standard/img_56px_email_logo_header.png", "cid:logoheader@alquilerdebarco.com");
                body = ReplaceAll(body, "../common/img/Standard/img_164px_email_logo_footer.png", "cid:logofooter@alquilerdebarco.com");


                body = ReplaceAll(body, "[name_user]", user.name + " " + user.surname);
                body = ReplaceAll(body, "[url_site]", url);

                var data = {
                  subject: success._doc.userRegister.subject[0].value,
                  body: body
                };

                emailNotification.sendMessage(user.email, data, attachments, function(err, success) {
                  console.log(err, success);
                });

              }
            }
            );
        } else {
          cb(true, null);
        }

      }
    });
  },
  sendMailParticular: function(lang, user, cb) {
    loadConfiguration(function(err, conf) {
      if (err) {
        cb(err, false);
      } else {
        var server = conf._doc.general.domain;
        if (server) {
          db.Notifications.findOne()
            .select("userParticular")
            .populate({
              path: "userParticular.subject",
              select: "value",
              match: { language: lang }
            })
            .populate({
              path: "userParticular.body",
              select: "value",
              match: { language: lang }
            })
            .exec(function(err, success) {
              if (err || !success) {
                cb(err, success);
              } else {

                var body = success._doc.userParticular.body[0].value;

                var attachments = [
                  {
                    filename: "image.jpg",
                    path: server + "/common/img/Retina/img_56px_email_logo_header@2x.png",
                    cid: "logoheader@alquilerdebarco.com" //same cid value as in the html img src
                  },
                  {
                    filename: "image2.jpg",
                    path: server + "/common/img/Retina/img_164px_email_logo_footer@2x.png",
                    cid: "logofooter@alquilerdebarco.com" //same cid value as in the html img src
                  }
                ];
                body = ReplaceAll(body, "../common/img/Standard/img_56px_email_logo_header.png", "cid:logoheader@alquilerdebarco.com");
                body = ReplaceAll(body, "../common/img/Standard/img_164px_email_logo_footer.png", "cid:logofooter@alquilerdebarco.com");

                body = ReplaceAll(body, "[name_user]", user.name);

                var data = {
                  subject: success._doc.userParticular.subject[0].value,
                  body: body
                };

                emailNotification.sendMessage(user.email, data, attachments, function(err, success) {
                  console.log(err, success);
                });

              }
            }
            );
        } else {
          cb(true, null);
        }
      }
    });
  },
  sendNotificationBulletin: function(lang,cb) {
    loadConfiguration(function(err, conf) {
      if (err) {
        cb(err, false);
      } else {
        var server = conf._doc.general.domain;
        if (server) {
          db.Subscriptions.find().exec(function(err, emails) {
            if (err || !emails) {
              cb(err, emails);
            } else {
              var array = [];
              for (var i = 0; i < emails.length; i++) {
                array.push(emails[i]._doc.email);
              }
              db.Notifications.findOne()
                .select("bulletin")
                .populate({
                  path: "bulletin.subject",
                  select: "value",
                  match: { language: lang },
                })
                .populate({
                  path: "bulletin.body",
                  select: "value",
                  match: { language: lang },
                })
                .exec(function(err, success) {
                  if (err || !success) {
                    cb(err, success);
                  } else {
                    var body = success._doc.userRegister.body[0].value;
                    var attachments = [
                      {
                        filename: "image.jpg",
                        path: server + "/common/img/Retina/img_56px_email_logo_header@2x.png",
                        cid: "logoheader@alquilerdebarco.com" //same cid value as in the html img src
                      },
                      {
                        filename: "image2.jpg",
                        path: server + "/common/img/Retina/img_164px_email_logo_footer@2x.png",
                        cid: "logofooter@alquilerdebarco.com" //same cid value as in the html img src
                      }
                    ];
                    body = ReplaceAll(body, "../common/img/Standard/img_56px_email_logo_header.png", "cid:logoheader@alquilerdebarco.com");
                    body = ReplaceAll(body, "../common/img/Standard/img_164px_email_logo_footer.png", "cid:logofooter@alquilerdebarco.com");
                    var data = {
                      subject: success._doc.userRegister.subject[0].value,
                      body: body
                    };

                    emailNotification.sendMessage(array, data, attachments, function(err, success) {
                      console.log(err, success);
                    });
                  }
                }
                );
            }
          });
        } else {
          cb(true, null);
        }
      }
    });
  },
  sendMailRecoveryPassword: function(lang, user, activationKey, cb) {
    loadConfiguration(function(err, conf) {
      if (err) {
        cb(err, false);
      } else {
        var server = conf._doc.general.domain;
        if (server) {
          db.Notifications.findOne()
            .select("recoveryPassword")
            .populate({
              path: "recoveryPassword.subject",
              select: "value",
              match: { language: lang }
            })
            .populate({
              path: "recoveryPassword.body",
              select: "value",
              match: { language: lang }
            })
            .exec(function(err, success) {
              if (err || !success) {
                cb(err, success);
              } else {

                var url = urlUtil.resolve(server, "/backoffice/reset_pass/" + activationKey);
                var body = ReplaceAll(success._doc.recoveryPassword.body[0].value, "[name_user]", user.name + " " + user.surname);

                body = ReplaceAll(body, "[url_site]", url);

                var attachments = [
                  {
                    filename: "image.jpg",
                    path: server + "/common/img/Retina/img_56px_email_logo_header@2x.png",
                    cid: "logoheader@alquilerdebarco.com" //same cid value as in the html img src
                  },
                  {
                    filename: "image2.jpg",
                    path: server + "/common/img/Retina/img_164px_email_logo_footer@2x.png",
                    cid: "logofooter@alquilerdebarco.com" //same cid value as in the html img src
                  }
                ];
                body = ReplaceAll(body, "../common/img/Standard/img_56px_email_logo_header.png", "cid:logoheader@alquilerdebarco.com");
                body = ReplaceAll(body, "../common/img/Standard/img_164px_email_logo_footer.png", "cid:logofooter@alquilerdebarco.com");

                var data = {
                  subject: success._doc.recoveryPassword.subject[0].value,
                  body: body
                };
                emailNotification.sendMessage(user.email, data, attachments, function(err, success) {
                  console.log(err, success);
                });

              }
            }
            );
        } else {
          cb(true, null);
        }
      }
    });
  },
  sendMailPublicationBoat: function(lang, user, ship_name, cb) {
    loadConfiguration(function(err, conf) {
      if (err) {
        cb(err, false);
      } else {
        var server = conf._doc.general.domain;
        if (server) {
          db.Notifications.findOne()
            .select("publicationBoat")
            .populate({
              path: "publicationBoat.subject",
              select: "value",
              match: { language: lang }
            })
            .populate({
              path: "publicationBoat.body",
              select: "value",
              match: { language: lang }
            })
            .exec(function(err, success) {
              if (err || !success) {
                cb(err, success);
              } else {
                var body = ReplaceAll(success._doc.publicationBoat.body[0].value, "[name_user]", user.name + " " + user.surname);
                var attachments = [
                  {
                    filename: "image.jpg",
                    path: server + "/common/img/Retina/img_56px_email_logo_header@2x.png",
                    cid: "logoheader@alquilerdebarco.com" //same cid value as in the html img src
                  },
                  {
                    filename: "image1.jpg",
                    path: server + "/common/img/Retina/img_164px_email_logo_footer@2x.png",
                    cid: "logofooter@alquilerdebarco.com" //same cid value as in the html img src
                  }
                ];
                body = ReplaceAll(body, "../common/img/Standard/img_56px_email_logo_header.png", "cid:logoheader@alquilerdebarco.com");
                body = ReplaceAll(body, "../common/img/Standard/img_164px_email_logo_footer.png", "cid:logofooter@alquilerdebarco.com");
                body = ReplaceAll(body, "[ship_name]", ship_name);

                var data = {
                  subject: success._doc.publicationBoat.subject[0].value,
                  body: body
                };
                emailNotification.sendMessage(user.email, data, attachments, function(err, success) {
                  console.log(err, success);
                });

              }
            }
            );
        } else {
          cb(true, null);
        }
      }
    });
  },
  sendMailUserRequest: function(lang, request, cb) {
    loadConfiguration(function(err, conf) {
      if (err) {
        cb(err, false);
      } else {
        var server = conf._doc.general.domain;
        if (server) {
          db.Notifications.findOne()
            .select("userRequest")
            .populate({
              path: "userRequest.subject",
              select: "value",
              match: { language: lang }
            })
            .populate({
              path: "userRequest.body",
              select: "value",
              match: { language: lang }
            })
            .exec(function(err, success) {
              if (err || !success) {
                cb(err, success);
              } else {
                configGen.getExperience(request.experience, function(err, xp) {
                  if (err || !xp) {
                    cb(err, false);
                  } else {
                    var body = success._doc.userRequest.body[0].value;
                    var patron = request.patron ? "Si" : "No";
                    var aux = request.duration.unity === 0 ? "Horas" : request.duration.unity === 1 ? "Días" : "Semanas";
                    var duration = request.duration.quantity + " " + aux;
                    var date = new Date(request.bookDate),
                      create_date = new Date(request.createDate);
                    date = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
                    create_date = create_date.getDate() + "/" + (create_date.getMonth() + 1) + "/" + create_date.getFullYear();

                    var attachments = [
                      {
                        filename: "image.jpg",
                        path: server + "/common/img/Retina/img_56px_email_logo_header@2x.png",
                        cid: "logoheader@alquilerdebarco.com" //same cid value as in the html img src
                      },
                      {
                        filename: "image1.jpg",
                        path: server + "/common/img/Retina/img_164px_email_logo_footer@2x.png",
                        cid: "logofooter@alquilerdebarco.com" //same cid value as in the html img src
                      }
                    ];
                    body = ReplaceAll(body, "../common/img/Standard/img_56px_email_logo_header.png", "cid:logoheader@alquilerdebarco.com");
                    body = ReplaceAll(body, "../common/img/Standard/img_164px_email_logo_footer.png", "cid:logofooter@alquilerdebarco.com");
                    body = ReplaceAll(body, "[name_user]", request.name);
                    body = ReplaceAll(body, "[request_ship_name]", request.ship.name);
                    body = ReplaceAll(body, "[request_ship_port]", request.ship.localization.port.name[0].value);
                    body = ReplaceAll(body, "[request_book_date]", date);
                    body = ReplaceAll(body, "[request_duration]", duration);
                    body = ReplaceAll(body, "[request_patron]", patron);
                    body = ReplaceAll(body, "[request_conditions]", request.message);
                    body = ReplaceAll(body, "[ship_url]", server + shipUrl + request.ship.slug + "/" + xp._doc.slug[0].value);
                    body = ReplaceAll(body, "[name_client]", request.name);
                    body = ReplaceAll(body, "[request_create_date]", create_date);
                    body = ReplaceAll(body, "[ship_maker_model]", request.ship.manufacturer + " " + request.ship.model);

                    var data = {
                      subject: success._doc.userRequest.subject[0].value,
                      body: body
                    };

                    emailNotification.sendMessage(request.email, data, attachments, function(err, success) {
                      console.log(err, success);
                      cb(err, success);
                    });
                  }
                });
              }
            }
            );
        } else {
          cb(true, null);
        }
      }
    });
  },
  sendMailRejectRequest: function(iso, request, cb) {
    loadConfiguration(function(err, conf) {
      if (err) {
        cb(err, false);
      } else {
        var server = conf._doc.general.domain;
        if (server) {
          db.Languages.findOne({ iso: iso }).exec(function(err, lang) {
            if (err || !lang) {
              cb(err, lang);
            } else {
              db.Notifications.findOne()
                .select("rejectRequest")
                .populate({
                  path: "rejectRequest.subject",
                  select: "value",
                  match: { language: lang }
                })
                .populate({
                  path: "rejectRequest.body",
                  select: "value",
                  match: { language: lang }
                })
                .exec(function(err, success) {
                  if (err || !success) {
                    cb(err, success);
                  } else {

                    var body = success._doc.rejectRequest.body[0].value;
                    var attachments = [
                      {
                        filename: "image.jpg",
                        path: server + "/common/img/Retina/img_56px_email_logo_header@2x.png",
                        cid: "logoheader@alquilerdebarco.com" //same cid value as in the html img src
                      },
                      {
                        filename: "image2.jpg",
                        path: server + "/common/img/Retina/img_164px_email_logo_footer@2x.png",
                        cid: "logofooter@alquilerdebarco.com" //same cid value as in the html img src
                      }
                    ];
                    body = ReplaceAll(body, "../common/img/Standard/img_56px_email_logo_header.png", "cid:logoheader@alquilerdebarco.com");
                    body = ReplaceAll(body, "../common/img/Standard/img_164px_email_logo_footer.png", "cid:logofooter@alquilerdebarco.com");
                    body = ReplaceAll(body, "[name_user]", request.name);
                    body = ReplaceAll(body, "[request_ship_name]", request.ship.name);
                    var data = {
                      subject: success._doc.rejectRequest.subject[0].value,
                      body: body
                    };

                    emailNotification.sendMessage(request.email, data, attachments, function(err, success) {
                      console.log(err, success);
                      cb(err, success);
                    });

                  }
                }
                );
            }
          });
        } else {
          cb(true, null);
        }
      }
    });
  },
  sendMailOwnerRequest: function(lang, request, cb) {
    loadConfiguration(function(err, conf) {
      if (err) {
        cb(err, false);
      } else {
        var server = conf._doc.general.domain;
        if (server) {
          db.Notifications.findOne()
            .select("ownerRequest")
            .populate({
              path: "ownerRequest.subject",
              select: "value",
              match: { language: lang }
            })
            .populate({
              path: "ownerRequest.body",
              select: "value",
              match: { language: lang }
            })
            .exec(function(err, success) {
              if (err || !success) {
                cb(err, success);
              } else {
                var body = success._doc.ownerRequest.body[0].value;
                var patron = request.patron ? "Si" : "No";
                var aux = request.duration.unity === 0 ? "Horas" : request.duration.unity == 1 ? "Días" : "Semanas";
                var duration = request.duration.quantity + " " + aux;
                var date = new Date(request.bookDate),
                  create_date = new Date(request.createDate);
                date = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
                create_date = create_date.getDate() + "/" + (create_date.getMonth() + 1) + "/" + create_date.getFullYear();
                var attachments = [
                  {
                    filename: "image.jpg",
                    path: server + "/common/img/Retina/img_56px_email_logo_header@2x.png",
                    cid: "logoheader@alquilerdebarco.com" //same cid value as in the html img src
                  },
                  {
                    filename: "image2.jpg",
                    path: server + "/common/img/Retina/img_164px_email_logo_footer@2x.png",
                    cid: "logofooter@alquilerdebarco.com" //same cid value as in the html img src
                  }
                ];
                body = ReplaceAll(body, "../common/img/Standard/img_56px_email_logo_header.png", "cid:logoheader@alquilerdebarco.com");
                body = ReplaceAll(body, "../common/img/Standard/img_164px_email_logo_footer.png", "cid:logofooter@alquilerdebarco.com");

                body = ReplaceAll(body, "[name_client]", request.name);
                body = ReplaceAll(body, "[name_user]", request.shipowner.name + " " + request.shipowner.surname);
                body = ReplaceAll(body, "[request_create_date]", create_date);
                body = ReplaceAll(body, "[ship_maker_model]", request.ship.manufacturer + " " + request.ship.model);
                body = ReplaceAll(body, "[request_ship_name]", request.ship.name);
                body = ReplaceAll(body, "[request_ship_port]", request.ship.localization.port.name[0].value);
                body = ReplaceAll(body, "[request_book_date]", date);
                body = ReplaceAll(body, "[request_duration]", duration);
                body = ReplaceAll(body, "[request_patron]", patron);
                body = ReplaceAll(body, "[request_conditions]", request.message);

                body = ReplaceAll(body, "[available]", server + "/backoffice/requests/get/" + request._id.toString());
                body = ReplaceAll(body, "[unavailable]", server + "/backoffice/requests/delete/" + request._id.toString());


                var data1 = {
                  subject: success._doc.ownerRequest.subject[0].value,
                  body: body
                };

                emailNotification.sendMessage(request.shipowner.email, data1, attachments, function(err, success) {
                  cb(err, success);
                });

              }
            }
            );
        } else {
          cb(true, null);
        }
      }
    });
  },
  sendMailUserOffer: function(iso, offer, cb) {
    loadConfiguration(function(err, conf) {
      if (err) {
        cb(err, false);
      } else {
        var server = conf._doc.general.domain;
        if (server) {
          db.Languages.findOne({ iso: iso }).exec(function(err, lang) {
            if (err || !lang) {
              cb(err, lang);
            } else {
              db.Notifications.findOne()
                .select("userOffer")
                .populate({
                  path: "userOffer.subject",
                  select: "value",
                  match: { language: lang }
                })
                .populate({
                  path: "userOffer.body",
                  select: "value",
                  match: { language: lang }
                })
                .exec(function(err, success) {
                  if (err || !success) {
                    cb(err, success);
                  } else {
                    configGen.getExperience(offer.experience, function(err, xp) {
                      if (err || !xp) {
                        cb(err, false);
                      } else {
                        var patron = offer.patron ? "Si" : "No";
                        var aux = offer.duration.unity === 0 ? "Horas" : offer.duration.unity == 1 ? "Días" : "Semanas";
                        var duration = offer.duration.quantity + " " + aux;
                        var date = new Date(offer.bookDate);
                        date = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

                        var original = offer.pricePatron + offer.priceRent;
                        var price = original - ((original * offer.discount) / 100);

                        var body = success._doc.userOffer.body[0].value;
                        var attachments = [
                          {
                            filename: "image.jpg",
                            path: server + "/common/img/Retina/img_56px_email_logo_header@2x.png",
                            cid: "logoheader@alquilerdebarco.com" //same cid value as in the html img src
                          },
                          {
                            filename: "image2.jpg",
                            path: server + "/common/img/Retina/img_164px_email_logo_footer@2x.png",
                            cid: "logofooter@alquilerdebarco.com" //same cid value as in the html img src
                          },
                          {
                            filename: "image3.jpg",
                            path: server + "/service/media/" + offer.ship.photos[0].media,
                            cid: "shipimage@alquilerdebarco.com" //same cid value as in the html img src
                          }
                        ];
                        body = ReplaceAll(body, "../common/img/Standard/img_56px_email_logo_header.png", "cid:logoheader@alquilerdebarco.com");
                        body = ReplaceAll(body, "../common/img/Standard/img_164px_email_logo_footer.png", "cid:logofooter@alquilerdebarco.com");

                        body = ReplaceAll(body, "[name_user]", offer.request.name);
                        body = ReplaceAll(body, "[offer_ship_name]", offer.ship.name);
                        body = ReplaceAll(body, "[offer_ship_description]", offer.ship.description[0].value);
                        body = ReplaceAll(body, "[offer_ship_port]", offer.ship.localization.port.name[0].value);
                        body = ReplaceAll(body, "[offer_book_date]", date);
                        body = ReplaceAll(body, "[offer_duration]", duration);
                        body = ReplaceAll(body, "[offer_original_price]", original.toFixed(2) + " €");
                        body = ReplaceAll(body, "[offer_price]", price.toFixed(2) + " €");
                        body = ReplaceAll(body, "[offer_conditions]", offer.conditions);
                        body = ReplaceAll(body, "[offer_patron]", patron + " (" + offer.pricePatron.toFixed(2) + " €)");
                        body = ReplaceAll(body, "../common/img/Retina/bote.jpg", "cid:shipimage@alquilerdebarco.com");
                        body = ReplaceAll(body, "[booking]", server + "/es/reservacion/" + offer.token);
                        body = ReplaceAll(body, "[ship_url]", server + shipUrl + offer.ship.slug + "/" + xp._doc.slug[0].value);
                        var data = {
                          subject: success._doc.userOffer.subject[0].value,
                          body: body
                        };

                        emailNotification.sendMessage(offer.email, data, attachments, function(err, success) {
                          console.log(err, success);
                          cb(err, success);
                        });
                      }
                    });
                  }
                }
                );
            }
          });
        } else {
          cb(true, null);
        }
      }
    });
  },
  sendMailOwnerOffer: function(lang, offer, cb) {
    loadConfiguration(function(err, conf) {
      if (err) {
        cb(err, false);
      } else {
        var server = conf._doc.general.domain;
        if (server) {
          db.Notifications.findOne()
            .select("ownerOffer")
            .populate({
              path: "ownerOffer.subject",
              select: "value",
              match: { language: lang }
            })
            .populate({
              path: "ownerOffer.body",
              select: "value",
              match: { language: lang }
            })
            .exec(function(err, success) {
              if (err || !success) {
                cb(err, success);
              } else {
                var patron = offer.patron ? "Si" : "No";
                var aux = offer.duration.unity === 0 ? "Horas" : offer.duration.unity == 1 ? "Días" : "Semanas";
                var duration = offer.duration.quantity + " " + aux;
                var date = new Date(offer.bookDate);
                date = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

                var original = offer.pricePatron + offer.priceRent;
                var price = original - ((original * offer.discount) / 100);

                var body = success._doc.ownerOffer.body[0].value;
                var attachments = [
                  {
                    filename: "image.jpg",
                    path: server + "/common/img/Retina/img_56px_email_logo_header@2x.png",
                    cid: "logoheader@alquilerdebarco.com" //same cid value as in the html img src
                  },
                  {
                    filename: "image1.jpg",
                    path: server + "/common/img/Retina/img_164px_email_logo_footer@2x.png",
                    cid: "logofooter@alquilerdebarco.com" //same cid value as in the html img src
                  },
                  {
                    filename: "image3.jpg",
                    path: server + "/service/media/" + offer.ship.photos[0].media,
                    cid: "shipimage@alquilerdebarco.com" //same cid value as in the html img src
                  }
                ];
                body = ReplaceAll(body, "../common/img/Standard/img_56px_email_logo_header.png", "cid:logoheader@alquilerdebarco.com");
                body = ReplaceAll(body, "../common/img/Standard/img_164px_email_logo_footer.png", "cid:logofooter@alquilerdebarco.com");
                body = ReplaceAll(body, "[name_user]", offer.shipowner.name + " " + offer.shipowner.surname);
                body = ReplaceAll(body, "[offer_ship_name]", offer.ship.name);
                body = ReplaceAll(body, "[offer_ship_description]", offer.ship.description[0].value);


                body = ReplaceAll(body, "[offer_ship_port]", offer.ship.localization.port.name[0].value);
                body = ReplaceAll(body, "[offer_book_date]", date);
                body = ReplaceAll(body, "[offer_duration]", duration);
                body = ReplaceAll(body, "[offer_original_price]", original.toFixed(2) + " €");
                body = ReplaceAll(body, "[offer_price]", price.toFixed(2) + " €");
                body = ReplaceAll(body, "[offer_conditions]", offer.conditions);
                body = ReplaceAll(body, "[offer_patron]", patron + " (" + offer.pricePatron.toFixed(2) + " €)");
                body = ReplaceAll(body, "../common/img/Retina/bote.jpg", "cid:shipimage@alquilerdebarco.com");

                var data = {
                  subject: success._doc.ownerOffer.subject[0].value,
                  body: body
                };

                emailNotification.sendMessage(offer.shipowner.email, data, attachments, function(err, success) {
                  console.log(err, success);
                  cb(err, success);
                });

              }
            }
            );
        } else {
          cb(true, null);
        }
      }
    });
  },
  sendMailUserConfirmation: function(iso, offer, cb) {
    offer = JSON.parse(JSON.stringify(offer));
    loadConfiguration(function(err, conf) {
      if (err) {
        cb(err, false);
      } else {
        var server = conf._doc.general.domain;
        if (server) {
          db.Languages.findOne({ iso: iso }).exec(function(err, lang) {
            if (err || !lang) {
              cb(err, lang);
            } else {
              db.Notifications.findOne()
                .select("userBuyConfirmation")
                .populate({
                  path: "userBuyConfirmation.subject",
                  select: "value",
                  match: { language: lang }
                })
                .populate({
                  path: "userBuyConfirmation.body",
                  select: "value",
                  match: { language: lang }
                })
                .exec(function(err, success) {
                  if (err || !success) {
                    cb(err, success);
                  } else {
                    configGen.getExperience(offer.experience, function(err, xp) {
                      if (err || !xp) {
                        cb(err, false);
                      } else {
                        var patron = offer.patron ? "Si" : "No";
                        var aux = offer.duration.unity === 0 ? "Horas" : offer.duration.unity == 1 ? "Días" : "Semanas";
                        var duration = offer.duration.quantity + " " + aux;
                        var date = new Date(offer.bookDate);
                        date = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

                        var original = offer.pricePatron + offer.priceRent;
                        var price = original - ((original * offer.discount) / 100);


                        var body = success._doc.userBuyConfirmation.body[0].value;
                        var attachments = [
                          {
                            filename: "image.jpg",
                            path: server + "/common/img/Retina/img_56px_email_logo_header@2x.png",
                            cid: "logoheader@alquilerdebarco.com" //same cid value as in the html img src
                          },
                          {
                            filename: "image1.jpg",
                            path: server + "/common/img/Retina/img_164px_email_logo_footer@2x.png",
                            cid: "logofooter@alquilerdebarco.com" //same cid value as in the html img src
                          },
                          {
                            filename: "image3.jpg",
                            path: server + "/service/media/" + offer.ship.photos[0].media,
                            cid: "shipimage@alquilerdebarco.com" //same cid value as in the html img src
                          }
                        ];
                        body = ReplaceAll(body, "../common/img/Standard/img_56px_email_logo_header.png", "cid:logoheader@alquilerdebarco.com");
                        body = ReplaceAll(body, "../common/img/Standard/img_164px_email_logo_footer.png", "cid:logofooter@alquilerdebarco.com");
                        body = ReplaceAll(body, "[name_user]", offer.request.name);
                        body = ReplaceAll(body, "[offer_ship_name]", offer.ship.name);
                        body = ReplaceAll(body, "[offer_ship_description]", offer.ship.description[0].value);
                        body = ReplaceAll(body, "[offer_ship_port]", offer.ship.localization.port.name[0].value);
                        body = ReplaceAll(body, "[offer_book_date]", date);
                        body = ReplaceAll(body, "[offer_duration]", duration);
                        body = ReplaceAll(body, "[offer_original_price]", original.toFixed(2) + " €");
                        body = ReplaceAll(body, "[offer_price]", price.toFixed(2) + " €");
                        body = ReplaceAll(body, "[offer_conditions]", offer.conditions);
                        body = ReplaceAll(body, "[offer_patron]", patron + " (" + offer.pricePatron.toFixed(2) + " €)");

                        body = ReplaceAll(body, "../common/img/Retina/bote.jpg", "cid:shipimage@alquilerdebarco.com");
                        body = ReplaceAll(body, "[ship_url]", server + shipUrl + offer.ship.slug + "/" + xp._doc.slug[0].value);

                        if ((offer.percentage < 100 && offer.sale.length == 1) && !offer.finish && (offer.secondPayment != "5" && offer.secondPayment != "0")) {
                          body = ReplaceAll(body, "[second_url]", server + "/es/segundo-pago/" + offer.token);
                          body = ReplaceAll(body, "hidden", "");
                        }
                        var data = {
                          subject: success._doc.userBuyConfirmation.subject[0].value,
                          body: body
                        };

                        emailNotification.sendMessage(offer.email, data, attachments, function(err, success) {
                          cb(err, success);
                        });
                      }
                    });

                  }
                }
                );
            }
          });
        } else {
          cb(true, null);
        }
      }
    });
  },
  sendMailOwnerConfirmation: function(lang, offer, cb) {
    offer = JSON.parse(JSON.stringify(offer));
    loadConfiguration(function(err, conf) {
      if (err) {
        cb(err, false);
      } else {
        var server = conf._doc.general.domain;
        if (server) {
          db.Notifications.findOne()
            .select("ownerBuyConfirmation")
            .populate({
              path: "ownerBuyConfirmation.subject",
              select: "value",
              match: { language: lang }
            })
            .populate({
              path: "ownerBuyConfirmation.body",
              select: "value",
              match: { language: lang }
            })
            .exec(function(err, success) {
              if (err || !success) {
                cb(err, success);
              } else {
                var patron = offer.patron ? "Si" : "No";
                var aux = offer.duration.unity === 0 ? "Horas" : offer.duration.unity == 1 ? "Días" : "Semanas";
                var duration = offer.duration.quantity + " " + aux;
                var date = new Date(offer.bookDate);
                date = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

                var original = offer.pricePatron + offer.priceRent;
                var price = original - ((original * offer.discount) / 100);

                var body = success._doc.ownerBuyConfirmation.body[0].value;
                var attachments = [
                  {
                    filename: "image.jpg",
                    path: server + "/common/img/Retina/img_56px_email_logo_header@2x.png",
                    cid: "logoheader@alquilerdebarco.com" //same cid value as in the html img src
                  },
                  {
                    filename: "image1.jpg",
                    path: server + "/common/img/Retina/img_164px_email_logo_footer@2x.png",
                    cid: "logofooter@alquilerdebarco.com" //same cid value as in the html img src
                  },
                  {
                    filename: "image3.jpg",
                    path: server + "/service/media/" + offer.ship.photos[0].media,
                    cid: "shipimage@alquilerdebarco.com" //same cid value as in the html img src
                  }
                ];
                body = ReplaceAll(body, "../common/img/Standard/img_56px_email_logo_header.png", "cid:logoheader@alquilerdebarco.com");
                body = ReplaceAll(body, "../common/img/Standard/img_164px_email_logo_footer.png", "cid:logofooter@alquilerdebarco.com");
                body = ReplaceAll(body, "[name_user]", offer.shipowner.name + " " + offer.shipowner.surname);
                body = ReplaceAll(body, "[offer_ship_name]", offer.ship.name);
                body = ReplaceAll(body, "[offer_ship_description]", offer.ship.description[0].value);
                body = ReplaceAll(body, "[offer_ship_port]", offer.ship.localization.port.name[0].value);
                body = ReplaceAll(body, "[offer_book_date]", date);
                body = ReplaceAll(body, "[offer_duration]", duration);
                body = ReplaceAll(body, "[offer_original_price]", original.toFixed(2) + " €");
                body = ReplaceAll(body, "[offer_price]", price.toFixed(2) + " €");
                body = ReplaceAll(body, "[offer_conditions]", offer.conditions);
                body = ReplaceAll(body, "[offer_patron]", patron + " (" + offer.pricePatron.toFixed(2) + " €)");
                body = ReplaceAll(body, "../common/img/Retina/bote.jpg", "cid:shipimage@alquilerdebarco.com");

                var data = {
                  subject: success._doc.ownerBuyConfirmation.subject[0].value,
                  body: body
                };

                emailNotification.sendMessage(offer.shipowner.email, data, attachments, function(err, success) {
                  cb(err, success);
                });
              }
            }
            );
        } else {
          cb(true, null);
        }
      }
    });
  },
  sendMailUserRefund: function(lang, offer, cb) {
    loadConfiguration(function(err, conf) {
      if (err) {
        cb(err, false);
      } else {
        var server = conf._doc.general.domain;
        if (server) {
          localizationViewModel.getPort(offer.ship.localization.port, function(err, port) {
            if (err || !port) {
              cb(err, port);
            } else {
              db.Notifications.findOne()
                .select("userRefundConfirmation")
                .populate({
                  path: "userRefundConfirmation.subject",
                  select: "value",
                  match: { language: lang }
                })
                .populate({
                  path: "userRefundConfirmation.body",
                  select: "value",
                  match: { language: lang }
                })
                .exec(function(err, success) {
                  if (err || !success) {
                    cb(err, success);
                  } else {
                    var patron = offer.patron ? "Si" : "No";
                    var aux = offer.duration.unity === 0 ? "Horas" : offer.duration.unity == 1 ? "Días" : "Semanas";
                    var duration = offer.duration.quantity + " " + aux;
                    var date = new Date(offer.bookDate);
                    date = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

                    var original = offer.pricePatron + offer.priceRent;
                    var price = original - ((original * offer.discount) / 100);


                    var body = success._doc.userRefundConfirmation.body[0].value;
                    var attachments = [
                      {
                        filename: "image.jpg",
                        path: server + "/common/img/Retina/img_56px_email_logo_header@2x.png",
                        cid: "logoheader@alquilerdebarco.com" //same cid value as in the html img src
                      },
                      {
                        filename: "image1.jpg",
                        path: server + "/common/img/Retina/img_164px_email_logo_footer@2x.png",
                        cid: "logofooter@alquilerdebarco.com" //same cid value as in the html img src
                      },
                      {
                        filename: "image3.jpg",
                        path: server + "/service/media/" + offer.ship.photos[0].media,
                        cid: "shipimage@alquilerdebarco.com" //same cid value as in the html img src
                      }
                    ];
                    body = ReplaceAll(body, "../common/img/Standard/img_56px_email_logo_header.png", "cid:logoheader@alquilerdebarco.com");
                    body = ReplaceAll(body, "../common/img/Standard/img_164px_email_logo_footer.png", "cid:logofooter@alquilerdebarco.com");
                    body = ReplaceAll(body, "[name_user]", offer.request.name);
                    body = ReplaceAll(body, "[offer_ship_name]", offer.ship.name);
                    body = ReplaceAll(body, "[offer_ship_description]", offer.ship.description[0].value);
                    body = ReplaceAll(body, "[offer_ship_port]", port.name[0].value);
                    body = ReplaceAll(body, "[offer_book_date]", date);
                    body = ReplaceAll(body, "[offer_duration]", duration);
                    body = ReplaceAll(body, "[offer_original_price]", original.toFixed(2) + " €");
                    body = ReplaceAll(body, "[offer_price]", price.toFixed(2) + " €");
                    body = ReplaceAll(body, "[offer_conditions]", offer.conditions);
                    body = ReplaceAll(body, "[offer_patron]", patron + " (" + offer.pricePatron.toFixed(2) + " €)");
                    body = ReplaceAll(body, "[more_info]", "hola");
                    body = ReplaceAll(body, "../common/img/Retina/bote.jpg", "cid:shipimage@alquilerdebarco.com");


                    var data = {
                      subject: success._doc.userRefundConfirmation.subject[0].value,
                      body: body
                    };

                    emailNotification.sendMessage(offer.email, data, attachments, function(err, success) {
                      console.log(err, success);
                      cb(err, success);
                    });

                  }
                }
                );
            }
          });
        } else {
          cb(true, null);
        }
      }
    });
  },
  sendMailOwnerRefund: function(lang, offer, cb) {
    loadConfiguration(function(err, conf) {
      if (err) {
        cb(err, false);
      } else {
        var server = conf._doc.general.domain;
        if (server) {
          localizationViewModel.getPort(offer.ship.localization.port, function(err, port) {
            if (err || !port) {
              cb(err, port);
            } else {
              db.Notifications.findOne()
                .select("ownerRefundConfirmation")
                .populate({
                  path: "ownerRefundConfirmation.subject",
                  select: "value",
                  match: { language: lang }
                })
                .populate({
                  path: "ownerRefundConfirmation.body",
                  select: "value",
                  match: { language: lang }
                })
                .exec(function(err, success) {
                  if (err || !success) {
                    cb(err, success);
                  } else {
                    var patron = offer.patron ? "Si" : "No";
                    var aux = offer.duration.unity === 0 ? "Horas" : offer.duration.unity == 1 ? "Días" : "Semanas";
                    var duration = offer.duration.quantity + " " + aux;
                    var date = new Date(offer.bookDate);
                    date = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

                    var original = offer.pricePatron + offer.priceRent;
                    var price = original - ((original * offer.discount) / 100);

                    var body = success._doc.ownerRefundConfirmation.body[0].value;
                    var attachments = [
                      {
                        filename: "image.jpg",
                        path: server + "/common/img/Retina/img_56px_email_logo_header@2x.png",
                        cid: "logoheader@alquilerdebarco.com" //same cid value as in the html img src
                      },
                      {
                        filename: "image1.jpg",
                        path: server + "/common/img/Retina/img_164px_email_logo_footer@2x.png",
                        cid: "logofooter@alquilerdebarco.com" //same cid value as in the html img src
                      },
                      {
                        filename: "image3.jpg",
                        path: server + "/service/media/" + offer.ship.photos[0].media,
                        cid: "shipimage@alquilerdebarco.com" //same cid value as in the html img src
                      }
                    ];
                    body = ReplaceAll(body, "../common/img/Standard/img_56px_email_logo_header.png", "cid:logoheader@alquilerdebarco.com");
                    body = ReplaceAll(body, "../common/img/Standard/img_164px_email_logo_footer.png", "cid:logofooter@alquilerdebarco.com");
                    body = ReplaceAll(body, "[name_user]", offer.shipowner.name + " " + offer.shipowner.surname);
                    body = ReplaceAll(body, "[offer_ship_description]", offer.ship.description[0].value);
                    body = ReplaceAll(body, "[offer_ship_name]", offer.ship.name);
                    body = ReplaceAll(body, "[offer_ship_port]", port.name[0].value);
                    body = ReplaceAll(body, "[offer_book_date]", date);
                    body = ReplaceAll(body, "[offer_duration]", duration);
                    body = ReplaceAll(body, "[offer_original_price]", original.toFixed(2) + " €");
                    body = ReplaceAll(body, "[offer_price]", price.toFixed(2) + " €");
                    body = ReplaceAll(body, "[offer_conditions]", offer.conditions);
                    body = ReplaceAll(body, "[offer_patron]", patron + " (" + offer.pricePatron.toFixed(2) + " €)");
                    body = ReplaceAll(body, "../common/img/Retina/bote.jpg", "cid:shipimage@alquilerdebarco.com");

                    var data = {
                      subject: success._doc.ownerRefundConfirmation.subject[0].value,
                      body: body
                    };

                    emailNotification.sendMessage(offer.shipowner.email, data, attachments, function(err, success) {
                      console.log(err, success);
                      cb(err, success);
                    });

                  }
                }
                );
            }
          });
        } else {
          cb(true, null);
        }
      }
    });
  },
  sendMailSubscription: function(lang, subscript, cb) {
    loadConfiguration(function(err, conf) {
      if (err) {
        cb(err, false);
      } else {
        var server = conf._doc.general.domain;
        if (server) {
          db.Notifications.findOne()
            .select("bulletin")
            .populate({
              path: "bulletin.subject",
              select: "value",
              match: { language: lang }
            })
            .populate({
              path: "bulletin.body",
              select: "value",
              match: { language: lang }
            })
            .exec(function(err, success) {
              if (err || !success) {
                cb(err, success);
              } else {
                var body = success._doc.bulletin.body[0].value;

                var attachments = [
                  {
                    filename: "image.jpg",
                    path: server + "/common/img/Retina/img_56px_email_logo_header@2x.png",
                    cid: "logoheader@alquilerdebarco.com" //same cid value as in the html img src
                  },
                  {
                    filename: "image1.jpg",
                    path: server + "/common/img/Retina/img_164px_email_logo_footer@2x.png",
                    cid: "logofooter@alquilerdebarco.com" //same cid value as in the html img src
                  }
                ];
                body = ReplaceAll(body, "../common/img/Standard/img_56px_email_logo_header.png", "cid:logoheader@alquilerdebarco.com");
                body = ReplaceAll(body, "../common/img/Standard/img_164px_email_logo_footer.png", "cid:logofooter@alquilerdebarco.com");
                body = ReplaceAll(body, "[name_user]", subscript.email);


                body = ReplaceAll(body, "[update_subscription]", server + "/es/suscripcion/" + subscript.token);
                body = ReplaceAll(body, "[remove_subscription]", server + "/es/cancelar-newsletter/" + subscript.token);

                var data = {
                  subject: success._doc.bulletin.subject[0].value,
                  body: body
                };

                emailNotification.sendMessage(subscript.email, data, attachments, function(err, success) {
                  console.log(err, success);
                  cb(err, success);
                });
              }
            }
            );
        } else {
          cb(true, null);
        }
      }
    });
  },
  sendMailUserExpireTime: function(offer, lang, email, count, cb) {
    loadConfiguration(function(err, conf) {
      if (err) {
        cb(err, false);
      } else {
        var server = conf._doc.general.domain;
        if (server) {
          db.Notifications.findOne()
            .select("userExpireTime")
            .populate({
              path: "userExpireTime.subject",
              select: "value",
              match: { language: lang }
            })
            .populate({
              path: "userExpireTime.body",
              select: "value",
              match: { language: lang }
            })
            .exec(function(err, success) {
              if (err || !success) {
                cb(err, success);
              } else {
                var body = success._doc.userExpireTime.body[0].value;
                var attachments = [
                  {
                    filename: "image.jpg",
                    path: server + "/common/img/Retina/img_56px_email_logo_header@2x.png",
                    cid: "logoheader@alquilerdebarco.com" //same cid value as in the html img src
                  },
                  {
                    filename: "image1.jpg",
                    path: server + "/common/img/Retina/img_164px_email_logo_footer@2x.png",
                    cid: "logofooter@alquilerdebarco.com" //same cid value as in the html img src
                  }
                ];
                body = ReplaceAll(body, "../common/img/Standard/img_56px_email_logo_header.png", "cid:logoheader@alquilerdebarco.com");
                body = ReplaceAll(body, "../common/img/Standard/img_164px_email_logo_footer.png", "cid:logofooter@alquilerdebarco.com");
                body = ReplaceAll(body, "[booking_time]", count);
                body = ReplaceAll(body, "[name_user]", offer.request.name);
                  // body = ReplaceAll(body, '[refund_url]', 'url');
                body = ReplaceAll(body, "[second_payment_url]", server + "/es/segundo-pago/" + offer.token);

                var data = {
                  subject: success._doc.userExpireTime.subject[0].value,
                  body: body
                };
                emailNotification.sendMessage(email, data, attachments, function(err, success) {
                  console.log(err, success);
                  cb(err, success);
                });
              }
            }
            );
        } else {
          cb(true, null);
        }
      }
    });
  },

  sendMailTest: function(cb) {
    db.Configurations.findOne().select("mailSettings").exec(function(err, conf) {
      if (err || !conf) {
        cb(err, conf);
      } else {
        var data = {
          subject: "AlquilerdeBarco",
          body: "<p>This is an e-mail message sent automatically by AlquilerdeBarco while testing the settings for your account. </p>"
        };

        emailNotification.sendMessageTest(conf._doc.mailSettings.email, data, function(err, success) {
          cb(err, success);
        });
      }
    });
  }
};


module.exports = notificationFunctions;