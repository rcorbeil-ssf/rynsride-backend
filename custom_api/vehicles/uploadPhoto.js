module.exports = function(Vehicles) {
    //instantiates what the method is
    var CONTAINERS_URL = '/api/containers/common/download/';
    Vehicles.observe('after save', function(ctx, next) {
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
    Vehicles.remoteMethod(
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
    //what it actually does    
    
    Vehicles.upload = function(ctx, options, cb) {
        if(!options) options = {};
        ctx.req.params.container = 'common';
        Vehicles.app.models.container.upload(ctx.req,ctx.result,options,function (err,fileObj) {
            if(err) {
                cb(err);
            } else {
                var userId = (fileObj.fields.userId[0]);
                var fileInfo = fileObj.files.file[0];
                var URI = "https://" + ctx.req.headers.host + CONTAINERS_URL+fileInfo.name;
                Vehicles.update({driverId: userId}, {
                    photo: URI
                }, function(err, affected, resp) {
                });
                
                cb(null, fileObj);
            }
        });  
    };
};