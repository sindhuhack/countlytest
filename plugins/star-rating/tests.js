var request = require('supertest');
var should = require('should');
var testUtils = require("../../test/testUtils");
request = request(testUtils.url);

var API_KEY_ADMIN = "";
var APP_ID = "";
var APP_KEY = "";
var DEVICE_ID = "123456789";
var WIDGET_ID = "";
describe('Testing Rating plugin', function() {

    describe('Get empty widget list', function() {
        it('should return 200 and empty widget list', function(done) {
            API_KEY_ADMIN = testUtils.get("API_KEY_ADMIN");
            APP_ID = testUtils.get("APP_ID");
            request.get('/o/feedback/widgets?app_id=' + APP_ID + '&api_key=' + API_KEY_ADMIN)
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }
                    var ob = JSON.parse(res.text);
                    ob.length.should.eql(0);
                    done();
                });
        });
    });

    describe('Try to get single widget which not exist', function() {
        it('should return single widget', function(done) {
            API_KEY_ADMIN = testUtils.get("API_KEY_ADMIN");
            APP_ID = testUtils.get("APP_ID");
            request.get('/o/feedback/widget?app_id=' + APP_ID + '&api_key=' + API_KEY_ADMIN + '&widget_id=1')
                .expect(404)
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }
                    var ob = JSON.parse(res.text);
                    ob.should.have.property('result', 'Widget not found.');
                    done();
                });
        });
    });

    describe('Try to get widgets with empty array parameter', function() {
        it('should return empty array', function(done) {
            API_KEY_ADMIN = testUtils.get('API_KEY_ADMIN');
            APP_ID = testUtils.get("APP_ID");
            WIDGET_ID = testUtils.get('WIDGET_ID');
            var array4query = [WIDGET_ID];
            request.get('/o/feedback/multiple-widgets-by-id?app_id=' + APP_ID + '&api_key=' + API_KEY_ADMIN + '&widgets=[]')
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }
                    var ob = JSON.parse(res.text);
                    ob.length.should.eql(0);
                    done();
                });
        });
    });

    describe('Try to get feedback data', function() {
        it('should return 200 and empty object', function(done) {
            APP_ID = testUtils.get("APP_ID") || APP_ID;
            var data;
            request.get('/o?method=star&period=60days&api_key=' + API_KEY_ADMIN + '&app_id=' + APP_ID)
                .expect(200)
                .end(function(err, res) {
                    var ob = JSON.parse(res.text);
                    ob.should.eql({});
                    done();
                });
        });
    });

    describe('Creating widget', function() {
        it('should success', function(done) {
            API_KEY_ADMIN = testUtils.get("API_KEY_ADMIN");
            APP_ID = testUtils.get("APP_ID");
            request.get('/i/feedback/widgets/create?api_key=' + API_KEY_ADMIN + '&app_id=' + APP_ID + '&popup_header_text=Widget which generated by test&popup_comment_callout=Leave comment&popup_email_callout=Leave email&popup_button_callout=Submit&popup_thanks_message=Thanks for feedback&trigger_position=mleft&trigger_bg_color=#123456&trigger_font_color=#122333&trigger_button_text=Leave feedback&target_devices={desktop:false,phone:true,tablet:true}&target_page=selected&target_pages=["/"]&is_active=true&hide_sticker=false')
                .expect(201)
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }
                    var ob = JSON.parse(res.text);
                    ob.result.should.match(/^Successfully created [0-9a-f]{24}$/);
                    setTimeout(done, 10 * testUtils.testScalingFactor);
                });
        });
    });

    describe('Get widget list', function() {
        it('should return 200 and widget list', function(done) {
            API_KEY_ADMIN = testUtils.get("API_KEY_ADMIN");
            APP_ID = testUtils.get("APP_ID");
            request.get('/o/feedback/widgets?app_id=' + APP_ID + '&api_key=' + API_KEY_ADMIN)
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }
                    var ob = JSON.parse(res.text);
                    testUtils.set('WIDGET_ID', ob[0]._id);
                    ob.length.should.above(0);
                    done();
                });
        });
    });

    describe('Get single widget', function() {
        it('should return single widget', function(done) {
            API_KEY_ADMIN = testUtils.get("API_KEY_ADMIN");
            APP_ID = testUtils.get("APP_ID");
            WIDGET_ID = testUtils.get("WIDGET_ID");
            request.get('/o/feedback/widget?app_id=' + APP_ID + '&api_key=' + API_KEY_ADMIN + '&widget_id=' + WIDGET_ID)
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }
                    done();
                });
        });
    });

    describe('Get widgets by array parameter', function() {
        it('should return widgets array', function(done) {
            API_KEY_ADMIN = testUtils.get('API_KEY_ADMIN');
            APP_ID = testUtils.get("APP_ID");
            WIDGET_ID = testUtils.get('WIDGET_ID');
            var array4query = [WIDGET_ID];
            request.get('/o/feedback/multiple-widgets-by-id?app_id=' + APP_ID + '&api_key=' + API_KEY_ADMIN + '&widgets=' + JSON.stringify(array4query))
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }
                    var ob = JSON.parse(res.text);
                    ob.length.should.eql(1);
                    done();
                });
        });
    });

    describe('Editing widget', function() {
        it('should success', function(done) {
            API_KEY_ADMIN = testUtils.get("API_KEY_ADMIN");
            APP_ID = testUtils.get("APP_ID");
            WIDGET_ID = testUtils.get('WIDGET_ID');
            request.get('/i/feedback/widgets/edit?api_key=' + API_KEY_ADMIN + '&app_id=' + APP_ID + '&widget_id=' + WIDGET_ID + '&popup_header_text=Widget which edited by test&popup_comment_callout=Leave to us a comment&popup_email_callout=Contact me by email&popup_button_callout=Submit Feedback&popup_thanks_message=Thank you for great feedback!&trigger_position=mright&trigger_bg_color=#345678&trigger_font_color=#111222&trigger_button_text=Feedback Trigger Text&target_devices={desktop:true,phone:true,tablet:true}&target_page=selected&target_pages=["/home"]&is_active=false&hide_sticker=false')
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }
                    var ob = JSON.parse(res.text);
                    ob.should.have.property('result', 'Success');
                    setTimeout(done, 10 * testUtils.testScalingFactor);
                });
        });
    });

    describe('Get edited widget', function() {
        it('should return widget with new values', function(done) {
            API_KEY_ADMIN = testUtils.get("API_KEY_ADMIN");
            APP_ID = testUtils.get("APP_ID");
            WIDGET_ID = testUtils.get("WIDGET_ID");
            request.get('/o/feedback/widget?app_id=' + APP_ID + '&api_key=' + API_KEY_ADMIN + '&widget_id=' + WIDGET_ID)
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }
                    var ob = JSON.parse(res.text);
                    ob.should.have.property('popup_header_text', 'Widget which edited by test');
                    done();
                });
        });
    });

    describe('Creating feedback event with widget_id', function() {
        it('should success', function(done) {
            API_KEY_ADMIN = testUtils.get("API_KEY_ADMIN");
            APP_ID = testUtils.get("APP_ID");
            APP_KEY = testUtils.get("APP_KEY");
            WIDGET_ID = testUtils.get("WIDGET_ID");

            var events = [{
                "key": "[CLY]_star_rating",
                "count": 1,
                "sum": 1,
                "segmentation": {
                    "contactMe": true,
                    "email": "someone@gmail.com",
                    "comment": "It's a test comment.",
                    "rating": 5,
                    "app_version": "1.23",
                    "platform": "iOS",
                    "widget_id": WIDGET_ID
                }
            }];

            request.get('/i?app_key=' + APP_KEY + '&device_id=' + 1 + "&events=" + JSON.stringify(events))
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }
                    var ob = JSON.parse(res.text);
                    ob.should.have.property('result', 'Success');
                    setTimeout(done, 100 * testUtils.testScalingFactor);
                });
        });
    });

    describe('Creating feedback event without widget_id', function() {
        it('should success', function(done) {
            API_KEY_ADMIN = testUtils.get("API_KEY_ADMIN");
            APP_ID = testUtils.get("APP_ID");
            APP_KEY = testUtils.get("APP_KEY");
            WIDGET_ID = testUtils.get("WIDGET_ID");

            var events = [{
                "key": "[CLY]_star_rating",
                "count": 1,
                "sum": 1,
                "segmentation": {
                    "contactMe": true,
                    "email": "someone@gmail.com",
                    "comment": "It's a test comment.",
                    "rating": 5,
                    "app_version": "1.23",
                    "platform": "iOS"
                }
            }];

            request.get('/i?app_key=' + APP_KEY + '&device_id=' + 1 + "&events=" + JSON.stringify(events))
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }
                    var ob = JSON.parse(res.text);
                    ob.should.have.property('result', 'Success');
                    setTimeout(done, 100 * testUtils.testScalingFactor);
                });
        });
    });

    describe('Request to validate feedback input for ratings', function() {
        it('should success', function(done) {
            API_KEY_ADMIN = testUtils.get("API_KEY_ADMIN");
            APP_ID = testUtils.get("APP_ID");
            APP_KEY = testUtils.get("APP_KEY");
            WIDGET_ID = testUtils.get("WIDGET_ID");

            var events = [{
                "key": "[CLY]_star_rating",
                "count": 1,
                "timestamp": 1419432000000,
                "hour": 10,
                "dow": 2,
                "segmentation": {
                    "contactMe": true,
                    "email": "someone@gmail.com",
                    "comment": "It's a test comment.",
                    "rating": 5,
                    "app_version": "1.23",
                    "platform": "iOS",
                    "widget_id": WIDGET_ID
                }
            }];

            request.get('/i/feedback/input?app_key=' + APP_KEY + '&device_id=' + 1 + "&events=" + JSON.stringify(events))
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }
                    var ob = JSON.parse(res.text);
                    ob.should.have.property('result', 'Success');
                    setTimeout(done, 100 * testUtils.testScalingFactor);
                });
        });
    });

    describe('Removing widget', function() {
        it('should success', function(done) {
            API_KEY_ADMIN = testUtils.get("API_KEY_ADMIN");
            APP_ID = testUtils.get("APP_ID");
            WIDGET_ID = testUtils.get("WIDGET_ID");
            request.get('/i/feedback/widgets/remove?api_key=' + API_KEY_ADMIN + '&app_id=' + APP_ID + '&widget_id=' + WIDGET_ID)
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }
                    var ob = JSON.parse(res.text);
                    ob.should.have.property('result', 'Success');
                    setTimeout(done, 10 * testUtils.testScalingFactor);
                });
        });
    });

    describe('Creating widget before reset', function() {
        it('should success', function(done) {
            API_KEY_ADMIN = testUtils.get("API_KEY_ADMIN");
            APP_ID = testUtils.get("APP_ID");
            request.get('/i/feedback/widgets/create?api_key=' + API_KEY_ADMIN + '&app_id=' + APP_ID + '&popup_header_text=Widget which generated by test&popup_comment_callout=Leave comment&popup_email_callout=Leave email&popup_button_callout=Submit&popup_thanks_message=Thanks for feedback&trigger_position=mleft&trigger_bg_color=#123456&trigger_font_color=#122333&trigger_button_text=Leave feedback&target_devices={desktop:false,phone:true,tablet:true}&target_page=selected&target_pages=["/"]&is_active=true&hide_sticker=false')
                .expect(201)
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }
                    var ob = JSON.parse(res.text);
                    ob.result.should.match(/^Successfully created [0-9a-f]{24}$/);
                    setTimeout(done, 10 * testUtils.testScalingFactor);
                });
        });
    });

    describe('Verify rating', function() {
        it('should return 200 for request platform info', function(done) {
            APP_ID = testUtils.get("APP_ID") || APP_ID;
            var data;
            request.get('/o?method=star&period=60days&api_key=' + API_KEY_ADMIN + '&app_id=' + APP_ID).end(function(err, res) {
                res.statusCode.should.equal(200);
                data = JSON.parse(res.text);
                should(data.iOS && data.iOS.indexOf('1:23') >= 0).equal(true);
                done();
            });
        });
    });

    describe('Reset app', function() {
        it('should reset data', function(done) {
            var params = {
                app_id: APP_ID,
                period: "reset"
            };
            request.get('/i/apps/reset?api_key=' + API_KEY_ADMIN + "&args=" + JSON.stringify(params)).expect(200).end(function(err, res) {
                if (err) {
                    return done(err);
                }
                var ob = JSON.parse(res.text);
                ob.should.have.property('result', 'Success');
                setTimeout(done, 500 * testUtils.testScalingFactor);
            });
        });
    });

    describe('Try to get widget list after reset app', function() {
        it('should return 200 and empty widget list', function(done) {
            API_KEY_ADMIN = testUtils.get("API_KEY_ADMIN");
            APP_ID = testUtils.get("APP_ID");
            request.get('/o/feedback/widgets?app_id=' + APP_ID + '&api_key=' + API_KEY_ADMIN)
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }
                    var ob = JSON.parse(res.text);
                    ob.length.should.eql(0);
                    done();
                });
        });
    });

    describe('Try to get single widget with created widget\'s id after reset', function() {
        it('should return 404', function(done) {
            API_KEY_ADMIN = testUtils.get("API_KEY_ADMIN");
            APP_ID = testUtils.get("APP_ID");
            WIDGET_ID = testUtils.get("WIDGET_ID");
            request.get('/o/feedback/widget?app_id=' + APP_ID + '&api_key=' + API_KEY_ADMIN + '&widget_id=' + WIDGET_ID)
                .expect(404)
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }
                    done();
                });
        });
    });


    describe('Try to get widgets by array parameter with created widget\'s id after reset', function() {
        it('should return widgets array', function(done) {
            API_KEY_ADMIN = testUtils.get('API_KEY_ADMIN');
            APP_ID = testUtils.get("APP_ID");
            WIDGET_ID = testUtils.get('WIDGET_ID');
            var array4query = [WIDGET_ID];
            request.get('/o/feedback/multiple-widgets-by-id?app_id=' + APP_ID + '&api_key=' + API_KEY_ADMIN + '&widgets=' + JSON.stringify(array4query))
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }
                    var ob = JSON.parse(res.text);
                    ob.length.should.eql(0);
                    done();
                });
        });
    });

    describe('Try to get feedback data after reset', function() {
        it('should return 200 and empty object', function(done) {
            APP_ID = testUtils.get("APP_ID") || APP_ID;
            var data;
            request.get('/o?method=star&period=60days&api_key=' + API_KEY_ADMIN + '&app_id=' + APP_ID)
                .expect(200)
                .end(function(err, res) {
                    var ob = JSON.parse(res.text);
                    ob.should.eql({});
                    done();
                });
        });
    });
});