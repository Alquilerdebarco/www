/**
 * Created by ernestomr87@gmail.com on 3/16/2016.
 */

require('./../../app');
var async = require('async');
var shipViewModel = require('./../../core/App/viewModels/shipViewModel');
var IsoFieldViewModel = require('./../../core/App/viewModels/IsoFieldViewModel');
var mediaViewModel = require('./../../core/App/viewModels/mediaViewModel');

db.IsoFields.find().exec(function (err, isos) {
    var totalCount = 0;
    var ConfigurationCount = 0;
    var EquipmentsCount = 0;
    var LandingsCount = 0;
    var LocalizationsCount = 0;
    var NotificationsCount = 0;
    var TextsCount = 0;
    var ShipTypesCount = 0;

    async.mapSeries(isos, function (iso, cbm) {
        async.series([
            function (cbp) {
                console.log("****Configurations****");
                db.Configurations.findOne().select('metaData shipSettings').exec(function (err, conf) {
                    var exist = false;
                    for (var i = 0; i < conf._doc.metaData.siteMetaDescription.length; i++) {
                        if (conf._doc.metaData.siteMetaDescription[i].toString() == iso._doc._id.toString()) {
                            exist = true;
                            break;
                        }
                    }

                    if (!exist) {
                        for (var i = 0; i < conf._doc.metaData.siteMetaKeywords.length; i++) {
                            if (conf._doc.metaData.siteMetaKeywords[i].toString() == iso._doc._id.toString()) {
                                exist = true;
                                break;
                            }
                        }
                    }

                    if (!exist) {
                        for (var i = 0; i < conf._doc.shipSettings.experiences.length; i++) {
                            for (var j = 0; j < conf._doc.shipSettings.experiences[i]._doc.slug.length; j++) {
                                if (conf._doc.shipSettings.experiences[i]._doc.slug[j].toString() == iso._doc._id.toString()) {
                                    exist = true;
                                    break;
                                }

                            }
                            if (exist)break;
                        }
                    }

                    if (!exist) {
                        for (var i = 0; i < conf._doc.shipSettings.experiences.length; i++) {
                            for (var j = 0; j < conf._doc.shipSettings.experiences[i]._doc.name.length; j++) {
                                if (conf._doc.shipSettings.experiences[i]._doc.name[j].toString() == iso._doc._id.toString()) {
                                    exist = true;
                                    break;
                                }

                            }
                            if (exist)break;
                        }
                    }

                    if (!exist) {
                        for (var i = 0; i < conf._doc.shipSettings.experiences.length; i++) {
                            for (var j = 0; j < conf._doc.shipSettings.experiences[i]._doc.description.length; j++) {
                                if (conf._doc.shipSettings.experiences[i]._doc.description[j].toString() == iso._doc._id.toString()) {
                                    exist = true;
                                    break;
                                }

                            }
                            if (exist)break;
                        }
                    }

                    if (exist)ConfigurationCount++;
                    cbp(null, exist);


                })
            },
            function (cbp) {
                db.Equipments.find().exec(function (err, equipments) {
                    console.log("****Equipments****");
                    var exist = false;
                    for (var i = 0; i < equipments.length; i++) {
                        for (var j = 0; j < equipments[i]._doc.name.length; j++) {
                            if (equipments[i]._doc.name[j].toString() == iso._doc._id.toString()) {
                                exist = true;
                                break;
                            }
                        }
                        if (exist)break;

                        for (var j = 0; j < equipments[i].items.length; j++) {
                            for (var k = 0; k < equipments[i]._doc.items[j]._doc.name.length; k++) {
                                if (equipments[i]._doc.items[j]._doc.name[k].toString() == iso._doc._id.toString()) {
                                    exist = true;
                                    break;
                                }
                            }
                            if (exist)break;
                        }
                        if (exist)break;
                    }
                    if (exist)EquipmentsCount++;
                    cbp(null, exist);
                })
            },
            function (cbp) {
                db.Landings.find().exec(function (err, landings) {
                    console.log("****Landings****");
                    var exist = false;
                    for (var i = 0; i < landings.length; i++) {
                        for (var j = 0; j < landings[i]._doc.name.length; j++) {
                            if (landings[i]._doc.name[j].toString() == iso._doc._id.toString()) {
                                exist = true;
                                break;
                            }
                        }
                        if (exist)break;

                        for (var j = 0; j < landings[i]._doc.slug.length; j++) {
                            if (landings[i]._doc.slug[j].toString() == iso._doc._id.toString()) {
                                exist = true;
                                break;
                            }
                        }
                        if (exist)break;

                        for (var j = 0; j < landings[i]._doc.title.length; j++) {
                            if (landings[i]._doc.title[j].toString() == iso._doc._id.toString()) {
                                exist = true;
                                break;
                            }
                        }
                        if (exist)break;

                        for (var j = 0; j < landings[i]._doc.description.length; j++) {
                            if (landings[i]._doc.description[j].toString() == iso._doc._id.toString()) {
                                exist = true;
                                break;
                            }
                        }
                        if (exist)break;
                    }
                    if (exist)LandingsCount++;
                    cbp(null, exist);
                })
            },
            function (cbp) {
                db.Localizations.find().exec(function (err, countries) {
                    console.log("****Localizations****");
                    var exist = false;
                    for (var i = 0; i < countries.length; i++) {
                        for (var j = 0; j < countries[i]._doc.name.length; j++) {
                            if (countries[i]._doc.name[j].toString() == iso._doc._id.toString()) {
                                exist = true;
                                break;
                            }
                        }

                        if (exist)break;
                        for (var j = 0; j < countries[i]._doc.slug.length; j++) {
                            if (countries[i]._doc.slug[j].toString() == iso._doc._id.toString()) {
                                exist = true;
                                break;
                            }
                        }

                        if (exist)break;
                        for (var j = 0; j < countries[i]._doc.cities.length; j++) {
                            for (var k = 0; k < countries[i]._doc.cities[j]._doc.name.length; k++) {
                                if (countries[i]._doc.cities[j]._doc.name[k].toString() == iso._doc._id.toString()) {
                                    exist = true;
                                    break;
                                }
                            }

                            if (exist)break
                            for (var k = 0; k < countries[i]._doc.cities[j]._doc.slug.length; k++) {
                                if (countries[i]._doc.cities[j]._doc.slug[k].toString() == iso._doc._id.toString()) {
                                    exist = true;
                                    break;
                                }
                            }

                            if (exist)break;
                            for (var k = 0; k < countries[i]._doc.cities[j]._doc.areas.length; k++) {
                                for (var l = 0; l < countries[i]._doc.cities[j]._doc.areas[k]._doc.name.length; l++) {
                                    if (countries[i]._doc.cities[j]._doc.areas[k]._doc.name[l].toString() == iso._doc._id.toString()) {
                                        exist = true;
                                        break;
                                    }
                                }

                                if (exist)break;
                                for (var l = 0; l < countries[i]._doc.cities[j]._doc.areas[k]._doc.slug.length; l++) {
                                    if (countries[i]._doc.cities[j]._doc.areas[k]._doc.slug[l].toString() == iso._doc._id.toString()) {
                                        exist = true;
                                        break;
                                    }
                                }

                                if (exist)break;
                                for (var l = 0; l < countries[i]._doc.cities[j]._doc.areas[k]._doc.ports.length; l++) {
                                    for (var m = 0; m < countries[i]._doc.cities[j]._doc.areas[k]._doc.ports[l]._doc.name.length; m++) {
                                        if (countries[i]._doc.cities[j]._doc.areas[k]._doc.ports[l]._doc.name[m].toString() == iso._doc._id.toString()) {
                                            exist = true;
                                            break;
                                        }
                                    }

                                    if (exist)break;
                                    for (var m = 0; m < countries[i]._doc.cities[j]._doc.areas[k]._doc.ports[l]._doc.name.length; m++) {
                                        if (countries[i]._doc.cities[j]._doc.areas[k]._doc.ports[l]._doc.name[m].toString() == iso._doc._id.toString()) {
                                            exist = true;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (exist)LocalizationsCount++;
                    cbp(null, exist);
                })
            },
            function (cbp) {
                db.Notifications.findOne().exec(function (err, notifications) {
                    console.log("****Notifications****");
                    var exist = false;

                    for (var i = 0; i < notifications._doc.userRegister.subject.length; i++) {
                        if (notifications._doc.userRegister.subject[i].toString() == iso._doc._id.toString()) {
                            exist = true;
                            break;
                        }
                    }
                    if (!exist) {
                        for (var i = 0; i < notifications._doc.userRegister.body.length; i++) {
                            if (notifications._doc.userRegister.body[i].toString() == iso._doc._id.toString()) {
                                exist = true;
                                break;
                            }
                        }
                    }

                    if (!exist) {
                        for (var i = 0; i < notifications._doc.userParticular.subject.length; i++) {
                            if (notifications._doc.userParticular.subject[i].toString() == iso._doc._id.toString()) {
                                exist = true;
                                break;
                            }
                        }
                    }
                    if (!exist) {
                        for (var i = 0; i < notifications._doc.userParticular.body.length; i++) {
                            if (notifications._doc.userParticular.body[i].toString() == iso._doc._id.toString()) {
                                exist = true;
                                break;
                            }
                        }
                    }

                    if (!exist) {
                        for (var i = 0; i < notifications._doc.bulletin.subject.length; i++) {
                            if (notifications._doc.bulletin.subject[i].toString() == iso._doc._id.toString()) {
                                exist = true;
                                break;
                            }
                        }
                    }
                    if (!exist) {
                        for (var i = 0; i < notifications._doc.bulletin.body.length; i++) {
                            if (notifications._doc.bulletin.body[i].toString() == iso._doc._id.toString()) {
                                exist = true;
                                break;
                            }
                        }
                    }

                    if (!exist) {
                        for (var i = 0; i < notifications._doc.recoveryPassword.subject.length; i++) {
                            if (notifications._doc.recoveryPassword.subject[i].toString() == iso._doc._id.toString()) {
                                exist = true;
                                break;
                            }
                        }
                    }
                    if (!exist) {
                        for (var i = 0; i < notifications._doc.recoveryPassword.body.length; i++) {
                            if (notifications._doc.recoveryPassword.body[i].toString() == iso._doc._id.toString()) {
                                exist = true;
                                break;
                            }
                        }
                    }

                    if (!exist) {
                        for (var i = 0; i < notifications._doc.publicationBoat.subject.length; i++) {
                            if (notifications._doc.publicationBoat.subject[i].toString() == iso._doc._id.toString()) {
                                exist = true;
                                break;
                            }
                        }
                    }
                    if (!exist) {
                        for (var i = 0; i < notifications._doc.publicationBoat.body.length; i++) {
                            if (notifications._doc.publicationBoat.body[i].toString() == iso._doc._id.toString()) {
                                exist = true;
                                break;
                            }
                        }
                    }

                    if (!exist) {
                        for (var i = 0; i < notifications._doc.userRequest.subject.length; i++) {
                            if (notifications._doc.userRequest.subject[i].toString() == iso._doc._id.toString()) {
                                exist = true;
                                break;
                            }
                        }
                    }
                    if (!exist) {
                        for (var i = 0; i < notifications._doc.userRequest.body.length; i++) {
                            if (notifications._doc.userRequest.body[i].toString() == iso._doc._id.toString()) {
                                exist = true;
                                break;
                            }
                        }
                    }

                    if (!exist) {
                        for (var i = 0; i < notifications._doc.ownerRequest.subject.length; i++) {
                            if (notifications._doc.ownerRequest.subject[i].toString() == iso._doc._id.toString()) {
                                exist = true;
                                break;
                            }
                        }
                    }
                    if (!exist) {
                        for (var i = 0; i < notifications._doc.ownerRequest.body.length; i++) {
                            if (notifications._doc.ownerRequest.body[i].toString() == iso._doc._id.toString()) {
                                exist = true;
                                break;
                            }
                        }
                    }

                    if (!exist) {
                        for (var i = 0; i < notifications._doc.rejectRequest.subject.length; i++) {
                            if (notifications._doc.rejectRequest.subject[i].toString() == iso._doc._id.toString()) {
                                exist = true;
                                break;
                            }
                        }
                    }
                    if (!exist) {
                        for (var i = 0; i < notifications._doc.rejectRequest.body.length; i++) {
                            if (notifications._doc.rejectRequest.body[i].toString() == iso._doc._id.toString()) {
                                exist = true;
                                break;
                            }
                        }
                    }

                    if (!exist) {
                        for (var i = 0; i < notifications._doc.userOffer.subject.length; i++) {
                            if (notifications._doc.userOffer.subject[i].toString() == iso._doc._id.toString()) {
                                exist = true;
                                break;
                            }
                        }
                    }
                    if (!exist) {
                        for (var i = 0; i < notifications._doc.userOffer.body.length; i++) {
                            if (notifications._doc.userOffer.body[i].toString() == iso._doc._id.toString()) {
                                exist = true;
                                break;
                            }
                        }
                    }

                    if (!exist) {
                        for (var i = 0; i < notifications._doc.ownerOffer.subject.length; i++) {
                            if (notifications._doc.ownerOffer.subject[i].toString() == iso._doc._id.toString()) {
                                exist = true;
                                break;
                            }
                        }
                    }
                    if (!exist) {
                        for (var i = 0; i < notifications._doc.ownerOffer.body.length; i++) {
                            if (notifications._doc.ownerOffer.body[i].toString() == iso._doc._id.toString()) {
                                exist = true;
                                break;
                            }
                        }
                    }

                    if (!exist) {
                        for (var i = 0; i < notifications._doc.userBuyConfirmation.subject.length; i++) {
                            if (notifications._doc.userBuyConfirmation.subject[i].toString() == iso._doc._id.toString()) {
                                exist = true;
                                break;
                            }
                        }
                    }
                    if (!exist) {
                        for (var i = 0; i < notifications._doc.userBuyConfirmation.body.length; i++) {
                            if (notifications._doc.userBuyConfirmation.body[i].toString() == iso._doc._id.toString()) {
                                exist = true;
                                break;
                            }
                        }
                    }

                    if (!exist) {
                        for (var i = 0; i < notifications._doc.ownerBuyConfirmation.subject.length; i++) {
                            if (notifications._doc.ownerBuyConfirmation.subject[i].toString() == iso._doc._id.toString()) {
                                exist = true;
                                break;
                            }
                        }
                    }
                    if (!exist) {
                        for (var i = 0; i < notifications._doc.ownerBuyConfirmation.body.length; i++) {
                            if (notifications._doc.ownerBuyConfirmation.body[i].toString() == iso._doc._id.toString()) {
                                exist = true;
                                break;
                            }
                        }
                    }

                    if (!exist) {
                        for (var i = 0; i < notifications._doc.userRefundConfirmation.subject.length; i++) {
                            if (notifications._doc.userRefundConfirmation.subject[i].toString() == iso._doc._id.toString()) {
                                exist = true;
                                break;
                            }
                        }
                    }
                    if (!exist) {
                        for (var i = 0; i < notifications._doc.userRefundConfirmation.body.length; i++) {
                            if (notifications._doc.userRefundConfirmation.body[i].toString() == iso._doc._id.toString()) {
                                exist = true;
                                break;
                            }
                        }
                    }

                    if (!exist) {
                        for (var i = 0; i < notifications._doc.userRefundConfirmation.subject.length; i++) {
                            if (notifications._doc.userRefundConfirmation.subject[i].toString() == iso._doc._id.toString()) {
                                exist = true;
                                break;
                            }
                        }
                    }
                    if (!exist) {
                        for (var i = 0; i < notifications._doc.userRefundConfirmation.body.length; i++) {
                            if (notifications._doc.userRefundConfirmation.body[i].toString() == iso._doc._id.toString()) {
                                exist = true;
                                break;
                            }
                        }
                    }

                    if (!exist) {
                        for (var i = 0; i < notifications._doc.ownerRefundConfirmation.subject.length; i++) {
                            if (notifications._doc.ownerRefundConfirmation.subject[i].toString() == iso._doc._id.toString()) {
                                exist = true;
                                break;
                            }
                        }
                    }
                    if (!exist) {
                        for (var i = 0; i < notifications._doc.ownerRefundConfirmation.body.length; i++) {
                            if (notifications._doc.ownerRefundConfirmation.body[i].toString() == iso._doc._id.toString()) {
                                exist = true;
                                break;
                            }
                        }
                    }

                    if (!exist) {
                        for (var i = 0; i < notifications._doc.userExpireTime.subject.length; i++) {
                            if (notifications._doc.userExpireTime.subject[i].toString() == iso._doc._id.toString()) {
                                exist = true;
                                break;
                            }
                        }
                    }
                    if (!exist) {
                        for (var i = 0; i < notifications._doc.userExpireTime.body.length; i++) {
                            if (notifications._doc.userExpireTime.body[i].toString() == iso._doc._id.toString()) {
                                exist = true;
                                break;
                            }
                        }
                    }
                    if (exist)NotificationsCount++;
                    cbp(null, exist);
                })
            },
            function (cbp) {
                db.Texts.find().exec(function (err, texts) {
                    console.log("****Texts****");
                    var exist = false;
                    for (var i = 0; i < texts.length; i++) {
                        for (var j = 0; j < texts[i]._doc.components.length; j++) {
                            for (var k = 0; k < texts[i]._doc.components[j]._doc.text.length; k++) {
                                if (texts[i]._doc.components[j]._doc.text[k].toString() == iso._doc._id.toString()) {
                                    exist = true;
                                    break;
                                }

                            }
                            if (exist)break;
                        }
                        if (exist)break;
                    }
                    if (exist)TextsCount++;
                    cbp(null, exist);
                })
            },
            function (cbp) {
                db.shipTypes.find().exec(function (err, types) {
                    console.log("****ShipTypes****");
                    var exist = false;
                    if(iso._doc._id.toString()=="5702bdf978abf800076fb1d3"){
                        console.log("BREAK");
                    }
                    for (var i = 0; i < types.length; i++) {
                        for (var j = 0; j < types[i]._doc.name.length; j++) {
                            if (types[i]._doc.name[j].toString() == iso._doc._id.toString()) {
                                exist = true;
                                break;
                            }
                        }
                        if (exist)break;

                        for (var j = 0; j < types[i]._doc.slug.length; j++) {
                            if (types[i]._doc.slug[j].toString() == iso._doc._id.toString()) {
                                exist = true;
                                break;
                            }
                        }
                        if (exist)break;

                        for (var j = 0; j < types[i]._doc.description.length; j++) {
                            if (types[i]._doc.description[j].toString() == iso._doc._id.toString()) {
                                exist = true;
                                break;
                            }
                        }
                        if (exist)break;
                    }
                    if (exist)ShipTypesCount++;
                    cbp(null, exist);
                })
            }
        ], function (err, result) {
            if (err) {
                console.error(err);
                cbm(err, false);
            }
            else {
                if (result[0] || result[1] || result[2] || result[3] || result[4] || result[5] || result[6]) {
                    console.error("OK");
                    totalCount++;
                    cbm(null, true);
                }
                else {
                    db.IsoFields.remove({_id: iso._id}).exec(function (err, success) {
                        if (err) {
                            console.error(err);
                            cbm(err, true);
                        }
                        else {
                            console.log("**************REMOVE ISOFIELD SUCCESS****************");
                            cbm(null, true);
                        }
                    })
                }
            }
        })
    }, function (err, success) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("**************REMOVE ALL ISOFIELD SUCCESS****************");
            console.log("total: " + totalCount);
            console.log("Configuration: " + ConfigurationCount);
            console.log("Equipments: " + EquipmentsCount);
            console.log("Landings: " + LandingsCount);
            console.log("Localizations: " + LocalizationsCount);
            console.log("Notifications: " + NotificationsCount);
            console.log("Texts: " + TextsCount);
            console.log("ShipTypes: " + ShipTypesCount);
        }
    })
})



