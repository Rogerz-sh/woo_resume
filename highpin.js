/**
 * Created by zhe.zhang on 2016/7/13.
 */
$(function () {
    var personData = {
        "web_id": "",
        "type": "basic",
        "name": "",
        "sex": "",
        "age": "",
        "year": "",
        "email": "",
        "tel": "",
        "degree": "",
        "marry": "",
        "job": "",
        "company": "",
        "location": {"p": "", "c": ""},
        "belong": {"p": "", "c": ""},
        "companys": [],
        "schools": [],
        "trainings": [],
        "keywords": "",
        "appraise": "",
        "file_path": ""
    };

    String.prototype.trim = function (flag) {
        if (flag) {
            return this.replace(/\s+/g, '');
        } else {
            return this.replace(/^\s+/, '').replace(/\s+$/, '');
        }
    };

    function getGroup (element) {
        var idx = 0;
        while (element.nextAll(':eq('+idx+')').hasClass('detail-lists-two')) {
            idx++;
        }
        return element.nextAll(':lt('+idx+')');
    }

    chrome.runtime.onMessage.addListener(function (req, sender, sendResponse) {
        if (req.method === 'read') {
            personData.web_id = $('p.public-set').text().match(/：([A-Z0-9]+)/)[1];
            var userInfo = $('div.user-info:eq(1)');
            personData.name = userInfo.children().eq(0).text().trim();
            personData.tel = userInfo.children().eq(3).text().match(/：(\d+)/)[1];
            personData.email = userInfo.children().eq(4).find('a').text().trim();
            var text = userInfo.children().eq(1).text().trim(true).split('|');
            var text2 = userInfo.children().eq(2).text().trim(true).split('|');
            text = text.concat(text2);
            personData.sex = text.shift();
            text.shift();
            personData.age = parseInt(text.shift());
            personData.degree = text.pop();
            personData.year = parseInt(text.pop());
            var belong, location;
            text.forEach(function (t) {
                if (t.indexOf('婚') >= 0) {
                    personData.marry = t;
                } else if (t.indexOf('户口') >= 0) {
                    belong = t.split('：')[1].split(' ');
                } else if (t.indexOf('居住地') >= 0) {
                    location = t.split('：')[1].split(' ');
                }
            });
            if (belong) {
                personData.belong = {"p": belong[0], "c": belong[1] || ''};
            }
            if (location) {
                personData.location = {"p": location[0], "c": location[1] || ''};
            }
            personData.appraise += $('.self-assessment-area').find('p.text').html().replace(/<br>/g, '\n');

            personData.companys = [];
            $('.work-experience-area').find('.content').each(function (i, item) {
                var company = {
                    "company_name": "",
                    "start_time": "",
                    "end_time": "",
                    "salary": "",
                    "job": "",
                    "depart": "",
                    "master": "",
                    "slave": "",
                    "description": ""
                };
                var company_name = $(item).find('.company-name').text().trim().split('（');
                if (company_name.length > 1) company_name.pop();
                company.company_name = company_name.join('');
                company.job = $(item).find('.company-post').text().trim();
                company.depart = '';
                var times = $('span.work-time:eq(0)').text().trim().match(/\d{4}年\d+月/g);
                company.start_time = times[0].match(/\d+/g).join('-');
                company.end_time = times[1] ? times[1].match(/\d+/g).join('-') : '';
                company.description = $(item).find('.desc-content').text().trim();
                personData.companys.push(company);
            });
            personData.company = personData.companys[0].company_name;
            personData.job = personData.companys[0].job;

            personData.trainings = [];
            $('.training-area').find('.content').each(function (i, item) {
                var training = {
                    "train_name": "",
                    "start_time": "",
                    "end_time": "",
                    "company_name": "",
                    "description": ""
                };
                var info = $(item).find('.training-info').text().trim().split('|')
                training.company_name = info[0].trim();
                training.train_name = info[1].trim();
                var times = info[2].trim().match(/\d{4}年\d+月/g);
                training.start_time = times[0].match(/\d+/g).join('-');
                training.end_time = times[1] ? times[1].match(/\d+/g).join('-') : '';
                training.description = $(item).find('.detail-desc').text().trim(true);
                personData.trainings.push(training);
            });

            personData.schools = [];
            $('.education-area').find('.content').each(function (i, item) {
                var school = {
                    "school_name": "",
                    "start_time": "",
                    "end_time": "",
                    "degree": "",
                    "profession": "",
                    "is_usual": "是"
                };
                var info = $(item).text().trim().split('|');
                school.school_name = info[1].trim();
                var times = info[0].trim().match(/\d{4}年\d+月/g);
                school.start_time = times[0].match(/\d+/g).join('-');
                school.end_time = times[1] ? times[1].match(/\d+/g).join('-') : '';
                school.profession = info[2].trim();
                school.degree = info[3].trim();
                personData.schools.push(school);
            });

            chrome.runtime.sendMessage({method: 'post', data: JSON.stringify(personData)}, function (res) {
                //res is the status of save action
                if (res) {
                    alert('数据读取成功!');
                } else {
                    alert('数据读取失败!');
                }
            });
        }
    });
});