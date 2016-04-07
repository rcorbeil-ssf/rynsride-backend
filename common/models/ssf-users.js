var CONTAINERS_URL = '/containers/common/download/'; //maps to ../server/storage/common

var loopback = require('loopback');
var path = require('path');
var fs = require('fs');

var app = module.exports = loopback();

module.exports = function(SSFUsers) {
    
    // This function receives an uploaded photo file to the ../server/storage/common
    // folder, then updates the SSFUsers instance with a partial URL, so that later
    // we will be able to download the photo using the partial URL, prepended with
    // the RESTServices ENDPOINT_URL.
    SSFUsers.observe('after save', function(ctx, next) {
        if(ctx.isNewInstance === true) {
            var instance = ctx.instance;
            instance.createAccessToken(1209600000, function(err, response) { 
                if(err === null) {
                    ctx.instance["token"] = response.id;
                }
                next();
            });
        } else {
             next();
        }
    });
    
    SSFUsers.upload = function (ctx,options,cb) {
        if(!options) options = {};
        ctx.req.params.container = 'common';

        SSFUsers.app.models.container.upload(ctx.req,ctx.result,options,function (err,fileObj) {
            if(err) {
                console.log('err');
                cb(err);
            } else {
                var userId = (fileObj.fields.userId[0]);
                //var userId = parseInt(fileObj.fields.userId[0]);
                var fileInfo = fileObj.files.file[0];
                SSFUsers.update({_id: userId}, {
                    photo: CONTAINERS_URL+fileInfo.name
                }, function(err, affected, resp) {
                    console.log(err);
                    console.log(affected);
                    console.log(resp);
                });
                
                cb(null, fileObj);
            }
        });
    };
    
    SSFUsers.remoteMethod(
        'upload',
        {
            description: 'Uploads a file',
            accepts: [
                { arg: 'ctx', type: 'object', http: { source:'context' } },
                { arg: 'options', type: 'object', http:{ source: 'query'} }
            ], //ryan was here
            // so was Orym the Dragon Slayer
            returns: {
                arg: 'fileObject', type: 'object', root: true
            },
            http: {verb: 'post'}
        }
    );
};
