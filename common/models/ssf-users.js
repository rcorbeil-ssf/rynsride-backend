var CONTAINERS_URL = '/api/containers/common/download/'; //maps to ../server/storage/common

var loopback = require('loopback');
var path = require('path');
var fs = require('fs');

var app = module.exports = loopback();

module.exports = function(SSFUsers) {
    
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
    
    // This function receives an uploaded photo file to the ../server/storage/common
    // folder, then updates the SSFUsers instance with a FQDN URL, so that later
    // we will be able to load the photo from HTML using the URL
    SSFUsers.upload = function (ctx,options,cb) {
        if(!options) options = {};
        ctx.req.params.container = 'common';
        SSFUsers.app.models.container.upload(ctx.req,ctx.result,options,function (err,fileObj) {
            if(err) {
                cb(err);
            } else {
                var userId = (fileObj.fields.userId[0]);
                var fileInfo = fileObj.files.file[0];
                var URI = "https://" + ctx.req.headers.host + CONTAINERS_URL+fileInfo.name;
                SSFUsers.update({id: userId}, {
                    photo: URI
                }, function(err, affected, resp) {
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
            ], 
            returns: {
                arg: 'fileObject', type: 'object', root: true
            },
            http: {verb: 'post'}
        }
    );
};
