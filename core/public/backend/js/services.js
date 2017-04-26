/**
 * Created by ernestomr87@gmail.com on 18/11/2015.
 */

angular.module("rentShipApp.Services", ["ngResource"])
  .factory("Texts", [
    "$resource", function ($resource) {
      var resource = $resource("/service/text/:group", {}, {
        create: {
          method: "POST",
          cache: false
        },
        get: {
          method: "GET",
          cache: false
        },
        update: {
          method: "PUT",
          cache: false
        },
        remove: {
          method: "DELETE",
          cache: false
        }
      });
      resource.photos = $resource("/service/text/photos", {}, {
        create: {
          method: "POST",
          cache: false
        },
        remove: {
          method: "DELETE",
          cache: false
        },
      });

      resource.pagePhotos = $resource("/service/text/page/photos", {}, {
        get: {
          method: "GET",
          cache: false
        },
        delete: {
          method: "PUT",
          cache: false
        },
      });

      resource.menu = $resource("/service/text/menu", {}, {
        menu: {
          method: "POST",
          cache: false
        }
      });
      return resource;
    }
  ])
  .factory("Localizations", [
    "$resource", function ($resource) {

      var resource = $resource("/service/localization/", {}, {
        get: {
          method: "GET",
          cache: false
        }
      });
      resource.country = $resource("/service/localization/country", {}, {
        get: {
          method: "GET",
          cache: false
        },
        update: {
          method: "PUT",
          cache: false
        },
        create: {
          method: "POST",
          cache: false
        },
        remove: {
          method: "DELETE",
          cache: false
        }
      });
      resource.city = $resource("/service/localization/city", {}, {
        get: {
          method: "GET",
          cache: false
        },
        update: {
          method: "PUT",
          cache: false
        },
        create: {
          method: "POST",
          cache: false
        },
        remove: {
          method: "DELETE",
          cache: false
        }
      });
      resource.port = $resource("/service/localization/port", {}, {
        get: {
          method: "GET",
          cache: false
        },
        update: {
          method: "PUT",
          cache: false
        },
        create: {
          method: "POST",
          cache: false
        },
        remove: {
          method: "DELETE",
          cache: false
        }
      });
      resource.area = $resource("/service/localization/area", {}, {
        get: {
          method: "GET",
          cache: false
        },
        update: {
          method: "PUT",
          cache: false
        },
        create: {
          method: "POST",
          cache: false
        },
        remove: {
          method: "DELETE",
          cache: false
        }
      });

      return resource;
    }
  ])
  .factory("Ships", [
    "$resource", function ($resource) {
      var resource = $resource("/service/ships/", {}, {
        get: {
          method: "GET",
          cache: false
        },
        add: {
          method: "POST",
          cache: false
        },
        change: {
          method: "PUT",
          cache: false
        },
        remove: {
          method: "DELETE",
          cache: false
        }
      });
      resource.status = $resource("/service/ships/status", {}, {
        update: {
          method: "POST",
          cache: false
        }
      });
      resource.publish = $resource("/service/ships/publish", {}, {
        update: {
          method: "POST",
          cache: false
        }
      });
      resource.updateLocation = $resource("/service/ships/updateLocalization", {}, {
        update: {
          method: "POST",
          cache: false
        }
      });
      resource.technicalDetails = $resource("/service/ships/technicalDetails", {}, {
        update: {
          method: "PUT",
          cache: false
        }
      });
      resource.updateEquip = $resource("/service/ships/updateNameField", {}, {
        update: {
          method: "POST",
          cache: false
        }
      });
      resource.equipments = $resource("/service/ships/equipments", {}, {
        //create: { method: 'POST' },
        update: {
          method: "PUT",
          cache: false
        },
        //remove: { method: 'DELETE' }
      });
      /*
       resource.equip = $resource('/service/ships/equip', {}, {
       create: { method: 'POST' },
       update: { method: 'PUT' },
       remove: { method: 'DELETE' }
       });*/

      resource.equipStatus = $resource("/service/ships/equip/status", {}, {
        status: {
          method: "POST",
          cache: false
        }
      });
      resource.event = $resource("/service/ships/event", {}, {
        create: {
          method: "POST",
          cache: false
        },
        update: {
          method: "PUT",
          cache: false
        },
        remove: {
          method: "DELETE",
          cache: false
        }
      });
      resource.season = $resource("/service/ships/season", {}, {
        create: {
          method: "POST",
          cache: false
        },
        update: {
          method: "PUT",
          cache: false
        },
        remove: {
          method: "DELETE",
          cache: false
        }
      });
      resource.conditions = $resource("/service/ships/conditions", {}, {
        create: {
          method: "POST",
          cache: false
        }
      });
      resource.discounts = $resource("/service/ships/discounts", {}, {
        save: {
          method: "PUT",
          cache: false
        },
      });
      resource.photos = $resource("/service/ships/photos", {}, {
        create: {
          method: "POST",
          cache: false
        },
        remove: {
          method: "DELETE",
          cache: false
        },
        status: {
          method: "PUT",
          cache: false
        }
      });
      resource.available = $resource("/service/ships/available", {}, {
        get: {
          method: "POST",
          cache: false
        }
      });
      return resource;
    }
  ])
  .factory("Configurations", [
    "$resource", function ($resource) {
      var resource = $resource("/service/configurations/", {}, {
        get: {
          method: "GET",
          cache: false
        }
      });
      resource.general = $resource("/service/configurations/general", {}, {
        save: {
          method: "POST",
          cache: false
        }
      });
      resource.metaData = $resource("/service/configurations/metaData", {}, {
        save: {
          method: "POST",
          cache: false
        }
      });
      resource.mailSettings = $resource("/service/configurations/mailSettings", {}, {
        save: {
          method: "POST",
          cache: false
        }
      });
      resource.duration = $resource("/service/configurations/duration", {}, {
        create: {
          method: "POST",
          cache: false
        },
        delete: {
          method: "DELETE",
          cache: false
        }
      });
      resource.experience = $resource("/service/configurations/experience/:id", {}, {
        default: {
          method: "GET",
          cache: false
        },
        create: {
          method: "POST",
          cache: false
        },
        save: {
          method: "PUT",
          cache: false
        },
        delete: {
          method: "DELETE",
          cache: false
        }
      });
      resource.unCheckXp = $resource("/service/configurations/experience/unCheck", {}, {
        exec: {
          method: "POST",
          cache: false
        }
      });
      resource.photos = $resource("/service/configurations/photos", {}, {
        create: {
          method: "POST",
          cache: false
        },
        remove: {
          method: "DELETE",
          cache: false
        }
      });
      resource.types = $resource("/service/configurations/types", {}, {
        list: {
          method: "GET",
          cache: false
        },
        create: {
          method: "POST",
          cache: false
        },
        remove: {
          method: "DELETE",
          cache: false
        },
        save: {
          method: "PUT",
          cache: false
        }
      });
      resource.tags = $resource("/service/configurations/tags", {}, {
        list: {
          method: "GET",
          cache: false
        },
        create: {
          method: "POST",
          cache: false
        },
        remove: {
          method: "DELETE",
          cache: false
        },
        save: {
          method: "PUT",
          cache: false
        }
      });
      resource.equipments = $resource("/service/configurations/equipments", {}, {
        get: {
          method: "GET",
          cache: false
        },
        create: {
          method: "POST",
          cache: false
        },
        update: {
          method: "PUT",
          cache: false
        },
        remove: {
          method: "DELETE",
          cache: false
        }
      });
      resource.equip = $resource("/service/configurations/equip", {}, {
        create: {
          method: "POST",
          cache: false
        },
        update: {
          method: "PUT",
          cache: false
        },
        remove: {
          method: "DELETE",
          cache: false
        }
      });
      resource.equipStatus = $resource("/service/configurations/equip/status", {}, {
        status: {
          method: "POST",
          cache: false
        }
      });
      resource.paypal = $resource("/service/configurations/paypal", {}, {
        save: {
          method: "POST",
          cache: false
        }
      });
      resource.redsys = $resource("/service/configurations/redsys", {}, {
        save: {
          method: "POST",
          cache: false
        }
      });
      resource.iva = $resource("/service/configurations/iva", {}, {
        save: {
          method: "POST",
          cache: false
        }
      });
      resource.test = $resource("/service/configurations/test", {}, {
        send: {
          method: "POST",
          cache: false
        }
      });
      resource.contract = $resource("/service/configurations/contract", {}, {
        save: {
          method: "POST",
          cache: false
        }
      });
      resource.updateSEO = $resource("/service/configurations/updateseo", {}, {
        seo: {
          method: "POST",
          cache: false
        }
      });
      resource.currencies = $resource("/service/configurations/currencies", {}, {
        create: {
          method: "POST",
          cache: false
        },
        update: {
          method: "PUT",
          cache: false
        },
        remove: {
          method: "DELETE",
          cache: false
        },
        list: {
          method: "GET",
          cache: false
        }
      });
      resource.currenciesMenu = $resource("/service/configurations/currencies/menu", {}, {
        menu: {
          method: "POST",
          cache: false
        }
      });

      resource.backup = $resource("/service/configurations/backup", {}, {
        export: {
          method: "PUT",
          cache: false
        }
      });
      return resource;
    }
  ])
  .factory("Users", [
    "$resource", function ($resource) {
      var resource = $resource("/service/users/", {}, {
        get: {
          method: "GET",
          cache: false
        },
        add: {
          method: "POST",
          cache: false
        },
        change: {
          method: "PUT",
          cache: false
        },
        remove: {
          method: "DELETE",
          cache: false
        }
      });
      resource.status = $resource("/service/users/status", {}, {
        update: {
          method: "POST",
          cache: false
        }
      });
      resource.password = $resource("/service/users/user-change-password", {}, {
        update: {
          method: "POST",
          cache: false
        }
      });
      resource.permissions = $resource("/service/users/permissions", {}, {
        admin: {
          method: "POST",
          cache: false
        },
        owner: {
          method: "PUT",
          cache: false
        }
      });
      resource.profile = $resource("/service/users/profile", {}, {
        update: {
          method: "POST",
          cache: false
        }
      });
      resource.contact = $resource("/service/users/contact", {}, {
        update: {
          method: "POST",
          cache: false
        }
      });
      resource.contactAdmin = $resource("/service/users/contactByAdmin", {}, {
        update: {
          method: "POST",
          cache: false
        }
      });
      resource.invoice = $resource("/service/users/invoice", {}, {
        update: {
          method: "POST",
          cache: false
        }
      });
      resource.contract = $resource("/service/users/contract", {}, {
        get: {
          method: "POST",
          cache: false
        }
      });
      return resource;
    }
  ])
  .factory("Particulars", [
    "$resource", function ($resource) {

      var resource = $resource("/service/particular/", {}, {
        get: {
          method: "GET",
          cache: false
        },
        add: {
          method: "POST",
          cache: false
        },
        change: {
          method: "PUT",
          cache: false
        },
        remove: {
          method: "DELETE",
          cache: false
        }
      });

      resource.status = $resource("/service/particular/status", {}, {
        update: {
          method: "POST",
          cache: false
        }
      });
      return resource;
    }
  ])
  .factory("Subscriptions", [
    "$resource", function ($resource) {
      var resource = $resource("/service/subscriptions/", {}, {
        get: {
          method: "GET",
          cache: false
        },
        add: {
          method: "POST",
          cache: false
        },
        change: {
          method: "PUT",
          cache: false
        },
        remove: {
          method: "DELETE",
          cache: false
        }
      });
      resource.delete = $resource("/service/subscriptions/remove", {}, {
        complete: {
          method: "POST",
          cache: false
        }
      });
      resource.toggle = $resource("/service/subscriptions/toggle", {}, {
        complete: {
          method: "POST",
          cache: false
        }
      });
      return resource;
    }
  ])
  .factory("Medias", [
    "$resource", function ($resource) {
      var resource = $resource("/service/media/:id", {
        id: "@id"
      }, {
        get: {
          method: "GET",
          cache: false
        }
      });

      return resource;
    }
  ])
  .factory("Notifications", [
    "$resource", function ($resource) {

      var resource = $resource("/service/notifications/", {}, {
        get: {
          method: "GET",
          cache: false
        }
      });

      resource.register = $resource("/service/notifications/saveNotificationUserRegister", {}, {
        save: {
          method: "POST",
          cache: false
        }
      });

      resource.particular = $resource("/service/notifications/saveNotificationUserParticular", {}, {
        save: {
          method: "POST",
          cache: false
        }
      });

      resource.bulletin = $resource("/service/notifications/saveNotificationBulletin", {}, {
        save: {
          method: "POST",
          cache: false
        },
        send: {
          method: "PUT",
          cache: false
        }
      });

      resource.password = $resource("/service/notifications/saveNotificationRecoveryPassword", {}, {
        save: {
          method: "POST",
          cache: false
        }
      });

      resource.publication = $resource("/service/notifications/saveNotificationPublicationBoat", {}, {
        save: {
          method: "POST",
          cache: false
        }
      });


      resource.userRequest = $resource("/service/notifications/saveNotificationUserRequest", {}, {
        save: {
          method: "POST",
          cache: false
        }
      });

      resource.ownerRequest = $resource("/service/notifications/saveNotificationOwnerRequest", {}, {
        save: {
          method: "POST",
          cache: false
        }
      });

      resource.userOffer = $resource("/service/notifications/saveNotificationUserOffer", {}, {
        save: {
          method: "POST",
          cache: false
        }
      });

      resource.ownerOffer = $resource("/service/notifications/saveNotificationOwnerOffer", {}, {
        save: {
          method: "POST",
          cache: false
        }
      });

      resource.userBuy = $resource("/service/notifications/saveNotificationUserBuyConfirmation", {}, {
        save: {
          method: "POST",
          cache: false
        }
      });

      resource.ownerBuy = $resource("/service/notifications/saveNotificationOwnerBuyConfirmation", {}, {
        save: {
          method: "POST",
          cache: false
        }
      });

      resource.rejectRequest = $resource("/service/notifications/saveNotificationRejectRequest", {}, {
        save: {
          method: "POST",
          cache: false
        }
      });


      resource.userRefund = $resource("/service/notifications/saveNotificationUserRefundConfirmation", {}, {
        save: {
          method: "POST",
          cache: false
        }
      });

      resource.ownerRefund = $resource("/service/notifications/saveNotificationOwnerRefundConfirmation", {}, {
        save: {
          method: "POST",
          cache: false
        }
      });

      resource.userExpireTime = $resource("/service/notifications/saveNotificationUserExpireTime", {}, {
        save: {
          method: "POST",
          cache: false
        }
      });


      return resource;
    }
  ])
  .factory("Requests", [
    "$resource", function ($resource) {
      var resource = $resource("/service/requests/:id", {
        id: "@id"
      }, {
        get: {
          method: "GET",
          cache: false
        },
        unavailable: {
          method: "DELETE",
          cache: false
        }
      });
      return resource;
    }
  ])
  .factory("Offers", [
    "$resource", function ($resource) {
      var resource = $resource("/service/offers/:id", {
        id: "@id"
      }, {
        get: {
          method: "GET",
          cache: false
        },
        create: {
          method: "POST",
          cache: false
        },
        delete: {
          method: "DELETE",
          cache: false
        }
      });
      resource.list = $resource("/service/offers/list", {}, {
        list: {
          method: "POST",
          cache: false
        }
      });
      resource.delete = $resource("/service/offers/delete", {}, {
        delete: {
          method: "POST",
          cache: false
        }
      });
      resource.reject = $resource("/service/offers/reject", {}, {
        update: {
          method: "POST",
          cache: false
        }
      });
      return resource;
    }
  ])
  .factory("Messages", [
    "$resource", function ($resource) {
      var resource = $resource("/service/messages/:id", {
        id: "@id"
      }, {
        get: {
          method: "GET",
          cache: false
        },
        create: {
          method: "POST",
          cache: false
        },
        list: {
          method: "PUT",
          cache: false
        }
      });
      return resource;
    }
  ])
  .factory("Engine", [
    "$resource", function ($resource) {
      var resource = $resource("/service/engine/:id", {
        id: "@id"
      }, {
        get: {
          method: "GET",
          cache: false
        },
        create: {
          method: "POST",
          cache: false
        },
        list: {
          method: "PUT",
          cache: false
        }
      });

      resource.refund = $resource("/service/engine/refund", {}, {
        execute: {
          method: "POST",
          cache: false
        }
      });

      resource.invoice = $resource("/service/engine/invoice", {}, {
        get: {
          method: "POST",
          cache: false
        },
        list: {
          method: "PUT",
          cache: false
        },
        admin: {
          method: "GET",
          cache: false
        }
      });

      resource.graphic = $resource("/service/engine/graphic", {}, {
        get: {
          method: "POST",
          cache: false
        },
        list: {
          method: "PUT",
          cache: false
        }
      });

      return resource;
    }
  ])
  .factory("Landings", [
    "$resource", function ($resource) {
      var resource = $resource("/service/landing/", {}, {
        create: {
          method: "POST",
          cache: false
        },
        update: {
          method: "PUT",
          cache: false
        },
        list: {
          method: "GET",
          cache: false
        },
        remove: {
          method: "DELETE",
          cache: false
        }
      });
      resource.publish = $resource("/service/landing/publish", {}, {
        publish: {
          method: "POST",
          cache: false
        }
      });
      resource.noindex = $resource("/service/landing/noindex", {}, {
        noindex: {
          method: "POST",
          cache: false
        }
      });
      resource.nofollow = $resource("/service/landing/nofollow", {}, {
        nofollow: {
          method: "POST",
          cache: false
        }
      });
      resource.menu = $resource("/service/landing/menu", {}, {
        menu: {
          method: "POST",
          cache: false
        }
      });
      return resource;
    }
  ])
  .factory("Languages", [
    "$resource", function ($resource) {

      var resource = $resource("/service/language/", {}, {
        get: {
          method: "GET",
          cache: false
        },
        add: {
          method: "POST",
          cache: false
        },
        change: {
          method: "PUT",
          cache: false
        },
        remove: {
          method: "DELETE",
          cache: false
        }
      });
      resource.status = $resource("/service/language/status", {}, {
        update: {
          method: "POST",
          cache: false
        }
      });
      resource.active = $resource("/service/language/active", {}, {
        get: {
          method: "POST",
          cache: false
        }
      });
      resource.removed = $resource("/service/language/restore", {}, {
        restore: {
          method: "POST",
          cache: false
        },
        remove: {
          method: "DELETE",
          cache: false
        }
      });
      resource.menu = $resource("/service/language/menu", {}, {
        menu: {
          method: "POST",
          cache: false
        }
      });
      return resource;
    }
  ]);