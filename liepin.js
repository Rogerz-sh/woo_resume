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

    function getValidText(flag) {
        return getTrimedText($('td:contains("'+flag+'")').text().split('：').pop());
    }

    function getTrimedText(str) {
        return str.replace(/^\s+/, '').replace(/\s+$/, '');
    }

    chrome.runtime.onMessage.addListener(function (req, sender, sendResponse) {
        if (req.method === 'read') {
            personData.web_id = getTrimedText($('span[data-nick="res_id"]').text());
            personData.name = getValidText("姓名");
            personData.sex = getValidText("性别");
            personData.age = getValidText("年龄");
            personData.degree = getValidText("学历");
            personData.year = parseInt(getValidText("工作年限"));
            personData.marry = getValidText("婚姻状况");
            var location = getValidText("所在地");
            if (location) {
                personData.location = {"p": location, "c": location};
            }
            personData.company = getValidText("公司名称");
            personData.job = getValidText("所任职位");
            personData.appraise += getTrimedText($('.resume-comments td').text());

            personData.companys = [];
            $('.resume-work .resume-job-title').each(function (i, item) {
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
                company.company_name = getTrimedText($(item).find('em.compony:eq(0)').children().remove().end().text());
                var times = getTrimedText($(item).find('.work-time').text()).split(' - ');
                company.start_time = times[0].replace('.', '-');
                company.end_time = times[1] == '至今' ? '' : times[1].replace('.', '-');
                company.job = getTrimedText($(item).next('.resume-indent').find('.job-list-title:eq(0) strong').text());
                company.description += getTrimedText($(item).next('.resume-indent').find('th:contains("工作职责和业绩：")').next('td').text()) + '\n';
                //company.description += getTrimedText($(item).next('.resume-indent').find('th:contains("工作业绩：")').next('td').text());
                personData.companys.push(company);
            });

            personData.trainings = [];
            $('.resume-project .project-list').each(function (i, item) {
                var training = {
                    "train_name": "",
                    "start_time": "",
                    "end_time": "",
                    "company_name": "",
                    "description": ""
                };
                training.train_name = getTrimedText($(item).find('.project-list-title strong').text());
                var times = $(item).find('.project-list-title span').text().match(/\d{4}\.\d{2}/g);
                training.start_time = times[0].replace('.', '-');
                if (times[1]) training.end_time = times[1].replace('.', '-');
                training.company_name = getTrimedText($(item).find('th:contains("所在公司：")').next('td').text());
                training.description = getTrimedText($(item).find('tr:gt(0)').text()).replace(/\s+/g, '|').replace(/：\|/g, '：').replace(/\|/g, '\n');
                personData.trainings.push(training);
            });

            personData.schools = [];
            $('.resume-education .edu-ul').each(function (i, item) {
                var school = {
                    "school_name": "",
                    "start_time": "",
                    "end_time": "",
                    "degree": "",
                    "profession": "",
                    "is_usual": "是"
                };
                var text1 = /^(.*)（(\d{4}\.\d{2})-(\d{4}\.\d{2})）$/.exec($(item).find('.info p').eq(0).text().replace(/\s+/g, ''));
                school.school_name = text1[1]
                school.start_time = text1[2].replace('.', '-');
                school.end_time = text1[3].replace('.', '-');
                var text2 = $(item).find('.info p').eq(1).text().replace(/\s+/g, '').split('|');
                school.profession = text2[1];
                school.degree = text2[0];
                school.is_usual = $(item).find('.info p').eq(2).text().replace(/\s+/g, '').indexOf('统招') < 0 ? '否' : '是'
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