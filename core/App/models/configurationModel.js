/**
 * Created by ernestomr87@gmail.com on1/25/2016.
 */

module.exports = function (mongoose) {

  var Schema = mongoose.Schema;


  var configurationSchema = new Schema({
    general: {
      siteName: {
        type: String,
        required: true
      },
      sort: {
        type: Boolean,
        required: true,
        default: false
      },
      siteOffline: {
        type: Boolean,
        require: true,
        default: true
      },
      offlineMessage: {
        type: String,
        require: true
      },
      domain: {
        type: String,
        require: true
      },
      timeZone: {
        type: String,
        require: true
      },
    },
    metaData: {
      siteMetaDescription: [{
        type: Schema.Types.ObjectId,
        ref: "IsoField",
        required: true
      }],
      siteMetaKeywords: [{
        type: Schema.Types.ObjectId,
        ref: "IsoField",
        required: true
      }],
    },
    mailSettings: {
      mailServer: {
        type: String,
        required: true,
        default: false
      },
      mailPort: {
        type: Number,
        required: true
      },
      secureConnection: {
        type: Boolean,
        required: true,
        default: false
      },
      user: {
        type: String,
        required: true
      },
      password: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      },
    },
    shipSettings: {
      experiences: [{
        slug: [{
          type: Schema.Types.ObjectId,
          ref: "IsoField",
          required: true
        }],
        name: [{
          type: Schema.Types.ObjectId,
          ref: "IsoField",
          required: true
        }],
        description: [{
          type: Schema.Types.ObjectId,
          ref: "IsoField",
          required: true
        }],
        remove: {
          type: Boolean,
          required: true,
          default: false
        },
        default: {
          type: Boolean,
          required: true,
          default: false
        }
      }],
      durations: [{
        unity: {
          type: Number,
          enum: [0, 1, 7]
        },
        quantity: {
          type: Number
        },
        remove: {
          type: Boolean,
          required: true,
          default: false
        },
        name: [{
          type: Schema.Types.ObjectId,
          ref: "IsoField",
          required: true
        }]
      }]
    },
    paypal: {
      mode: {
        type: String,
        enum: ["sandbox", "live"],
        default: "sandbox"
      },
      client_id: {
        type: String,
        required: true
      },
      client_secret: {
        type: String,
        required: true
      },
      active: {
        type: Boolean,
        require: true,
        default: true
      },
    },
    redsys: {
      mode: {
        type: String,
        enum: ["real", "test"],
        default: "test"
      },
      commerce: {
        type: String,
        required: true
      },
      key: {
        type: String,
        required: true
      },
      active: {
        type: Boolean,
        require: true,
        default: true
      },
    },
    iva: {
      type: Number,
      required: true,
      default: 21
    },
    photos: [{
      type: Schema.Types.ObjectId,
      ref: "Media"
    }],
    contract: {
      particular: [{
        type: Schema.Types.ObjectId,
        ref: "IsoField",
        required: true
      }],
      enterprise: [{
        type: Schema.Types.ObjectId,
        ref: "IsoField",
        required: true
      }],
    },
    seo: {
      page_index: {
        noindex: {type: Boolean, require: false, default: false},
        nofollow: {type: Boolean, require: false, default: false}
      },
      page_user_guide: {
        noindex: {type: Boolean, require: false, default: false},
        nofollow: {type: Boolean, require: false, default: false}
      },
      page_sailor_guide: {
        noindex: {type: Boolean, require: false, default: false},
        nofollow: {type: Boolean, require: false, default: false}
      },
      page_access_user: {
        noindex: {type: Boolean, require: false, default: false},
        nofollow: {type: Boolean, require: false, default: false}
      },
      page_access_owner: {
        noindex: {type: Boolean, require: false, default: false},
        nofollow: {type: Boolean, require: false, default: false}
      },
      page_announce: {
        noindex: {type: Boolean, require: false, default: false},
        nofollow: {type: Boolean, require: false, default: false}
      },
      page_register_private: {
        noindex: {type: Boolean, require: false, default: false},
        nofollow: {type: Boolean, require: false, default: false}
      },
      page_register_owner: {
        noindex: {type: Boolean, require: false, default: false},
        nofollow: {type: Boolean, require: false, default: false}
      },
      page_about: {
        noindex: {type: Boolean, require: false, default: false},
        nofollow: {type: Boolean, require: false, default: false}
      },
      page_our_ships: {
        noindex: {type: Boolean, require: false, default: false},
        nofollow: {type: Boolean, require: false, default: false}
      },
      page_site_map: {
        noindex: {type: Boolean, require: false, default: false},
        nofollow: {type: Boolean, require: false, default: false}
      },
      page_service_conditions: {
        noindex: {type: Boolean, require: false, default: false},
        nofollow: {type: Boolean, require: false, default: false}
      },
      page_cookies_privacy: {
        noindex: {type: Boolean, require: false, default: false},
        nofollow: {type: Boolean, require: false, default: false}
      },
      page_frequently_questions: {
        noindex: {type: Boolean, require: false, default: false},
        nofollow: {type: Boolean, require: false, default: false}
      }
    }
  }, {
    versionKey: false
  });

  return mongoose.model("Configuration", configurationSchema);
};