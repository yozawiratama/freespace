/**
 * Created by handre on 12/29/13.
 */
Router = {
    uri: _.compact(window.location.pathname.split("/")),
    routes: [],

    addRoute: function(route, template, session) {
        var segments =  _.compact(route.split("/"));

        var placeholders = _.reduce(segments, function(currentArr, piece, index) {
            if (piece.substr(0, 1) === ":") {
                currentArr.push(index);
                segments[index] = piece.substr(1);
            }
            return currentArr;
        }, []);

        this.routes.push({
            segments: segments,
            template: template,
            placeholderIndexes: placeholders,
            session : session
        });
    },
    getMatchingRoute: function(){
        for (var i in this.routes) {
            var route = this.routes[i];
            var data = {};

            if (route.segments.length === this.uri.length) {
                var match = _.every(route.segments, function(seg, i){
                    if (_.contains(route.placeholderIndexes, i)) {
                        data[seg] = this.uri[i];
                        return true;
                    } else {
                        return seg === this.uri[i];
                    }
                }, this);

                if (match) {
                    return {
                        data: data,
                        template: route.template,
                        session: route.session
                    }
                }
            }
        }
        //no matches (add 404 or default template maybe?)
        return false;
    },
    run: function(){
        var route = this.getMatchingRoute();
        if (route) {
            var fragment = Meteor.render(function() {
                if (Template[route.template] !== undefined) {
                    return Template[route.template](route.data);
                }
            });
                document.body.appendChild(fragment);
        } else {

            var fragment = Meteor.render(function() {

                    return Template["ex_frontend_404"](route.data);
            });

            document.body.appendChild(fragment);
        }
    },
    go: function(template){
        var route = this.getMatchingRoute();
        var fragment = Meteor.render(function() {
            if (Template[template] !== undefined) {
                return Template[template](route.data);
            }
        });
        $('body').empty();
        document.body.appendChild(fragment);

    }
};