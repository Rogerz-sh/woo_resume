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
            personData.web_id = $('ul.meta li:eq(0)').text().trim().split('：')[1];
            $('.resume-block').each(function (r, block) {
                var title = $(block).find('h4').text().trim();
                if (title == '个人信息') {
                    var text = [];
                    $(block).find('.panel-tags:eq(0) li').each(function (i, li) {
                        text.push($(li).text().replace(/\s+/g, '').trim());
                    });
                    text.forEach(function (txt) {
                        var arr = txt.split('：');
                        switch(arr[0]) {
                            case "姓名":
                                personData.name = arr[1];
                                break;
                            case "性别":
                                personData.sex = arr[1];
                                break;
                            case "手机号码":
                                personData.tel = arr[1];
                                break;
                            case "年龄":
                                personData.age = parseInt(arr[1]);
                                break;
                            case "电子邮件":
                                personData.email = arr[1];
                                break;
                            case "教育程度":
                                personData.degree = arr[1];
                                break;
                            case "工作年限":
                                personData.year = parseInt(arr[1]);
                                break;
                            case "婚姻状况":
                                personData.marry = arr[1];
                                break;
                            case "所在地":
                                personData.location.c = arr[1];
                                break;
                            case "户口":
                                personData.belong.c = arr[1];
                                break;
                        }
                    });
                }
                if (title == '自我评价') {
                    personData.appraise = $(block).find('.text-block').text().trim();
                }
                if (title == '工作经历') {
                    personData.companys = [];
                    $(block).find('.panel-tags').each(function (i, item) {
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
                        var header = $(item).find('header').get(0).childNodes;
                        var times = header[0].data.match(/\d{4}\.\d{2}/g);
                        company.start_time = times[0].match(/\d+/g).join('-');
                        company.end_time = times[1] ? times[1].match(/\d+/g).join('-') : '';
                        company.company_name = header[1].innerText;
                        $(item).find('li').each(function(i, li) {
                            var arr = $(li).text().replace(/\s+/g, '').split('：');
                            if (arr[0] == '职位') company.job = arr[1];
                            if (arr[0] == '工作职责') company.description = arr[1];
                        });
                        personData.companys.push(company);
                    });
                    personData.company = personData.companys[0].company_name;
                    personData.job = personData.companys[0].job;
                }
                if (title == '教育经历') {
                    personData.schools = [];
                    $(block).find('.edu-block').each(function (i, item) {
                        var school = {
                            "school_name": "",
                            "start_time": "",
                            "end_time": "",
                            "degree": "",
                            "profession": "",
                            "is_usual": "是"
                        };
                        var header = $(item).find('header').get(0).childNodes;
                        school.school_name = header[0].innerText;
                        var times = header[1].data.match(/\d{4}\.\d{2}/g);
                        school.start_time = times[0].match(/\d+/g).join('-');
                        school.end_time = times[1] ? times[1].match(/\d+/g).join('-') : '';
                        $(item).find('li').each(function(i, li) {
                            var arr = $(li).text().replace(/\s+/g, '').split('：');
                            if (arr[0] == '专业') school.profession = arr[1];
                            if (arr[0] == '学历') school.degree = arr[1];
                        });
                        personData.schools.push(school);
                    });
                }
                if (title == '项目经历') {
                    personData.trainings = [];
                    $(block).find('.panel-tags').each(function (i, item) {
                        var training = {
                            "train_name": "",
                            "start_time": "",
                            "end_time": "",
                            "company_name": "",
                            "description": ""
                        };
                        var header = $(item).find('header').get(0).childNodes;
                        var times = header[0].data.match(/\d{4}\.\d{2}/g);
                        training.start_time = times[0].match(/\d+/g).join('-');
                        training.end_time = times[1] ? times[1].match(/\d+/g).join('-') : '';
                        training.train_name = header[1].innerText;
                        var text = [];
                        $(item).find('li').each(function(i, li) {
                            var arr = $(li).text().replace(/\s+/g, '').split('：');
                            text = text.concat(arr);
                        });
                        training.description = text.join('\n');
                        personData.trainings.push(training);
                    });
                }
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