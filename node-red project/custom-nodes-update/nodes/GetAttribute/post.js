var post = function (string) {
    var request=require('request');
    var options = {
        method: 'post',
        body: string,
        url: 'http://10.45.16.204:8080/associationmapper-app/rest/incidents/addIncidentEnrichment',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
    }
    request(options, function (err, res, body) {
        if (err) {
            console.log('Error :', err)
            return
        }
        console.log(' Body :', body)
    });

};

module.exports.post = post;
