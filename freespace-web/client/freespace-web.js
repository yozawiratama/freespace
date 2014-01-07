
Template.tmp_msg_line.msg = function(){
    return Messages.find({},{sort:{Sort_by_Date:-1}});
};
Template.tmp_msg_box.events({
    'submit' : function(){
        var jkt = moment().tz("Asia/Jakarta").format('MMMM Do YYYY, h:mm:ss a');
        console.log("dari update" + Session.get(Lookup.Session.activeUserName));
        var un = Session.get(Lookup.Session.activeUserName);
        Messages.insert({Username:un, Message: $('#tbxMsg').val(),Created_Date : jkt, Sort_by_Date : Date.now()});
        $('#tbxMsg').val("");
    }

});

Template.tmp_auth_signup.events({
    'submit' : function(){

        var newId =  Users.insert({Username : $('#tbxSignupUsername').val(), Email : $('#tbxSignupUserEmail').val(), Gender : $('#tbxSignupUserGender').val(), Password : $('#tbxSignupUserPwd').val()});
        console.log(newId);
        if(newId !== undefined){
            $('#modalSignUp').modal('hide');
        }
    }
});

Template.tmp_auth_signin.events({
    'submit' : function(){

        var us = Users.findOne({Username: $('#tbxSigninUsername').val(), Password : $('#tbxSigninUserPwd').val()});
        console.log(us.Username);
        console.log(us._id);
        if(us !== undefined){
            Session.set(Lookup.Session.isSessionActive, true);
            Session.set(Lookup.Session.activeUserId, us._id);
            Session.set(Lookup.Session.activeUserName, us.Username);
            $('#tbxMsg').removeAttr('disabled');
            $('#btnUpdate').removeAttr('disabled');
            $('#ddlStatusType').removeAttr('disabled');
            $('#modalSignIn').modal('hide');
        }
    }
});

//Template.tmp_navbar.Username = function(){
//    return Session.get(Lookup.Session.activeUser);
//}

Template.tmp_navbar.loggedInUser = function(){
    var us = Users.findOne(Session.get(Lookup.Session.activeUserId));
    console.log(this._id);
    console.log(this.Username);
    return us && us.Username;
}

Template.tmp_navbar.events({
    'click #btnSignOut' : function(e){
        e.preventDefault();
        location.reload();
    }
});

$( "form" ).live( "submit", function(e) {
    e.preventDefault();
});

Meteor.startup(function () {
    var isSessionActive = Session.get(Lookup.Session.isSessionActive);
    if(isSessionActive === undefined || isSessionActive === false){
        $('#tbxMsg').attr('disabled','disabled');
        $('#btnUpdate').attr('disabled','disabled');
        $('#ddlStatusType').attr('disabled','disabled');
    }
});
