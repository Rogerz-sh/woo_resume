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
        while (element.nextAll(':eq('+idx+')').hasClass('resume-preview-dl')) {
            idx++;
        }
        return element.nextAll(':lt('+idx+')');
    }

    chrome.runtime.onMessage.addListener(function (req, sender, sendResponse) {
        if (req.method === 'read') {
            personData.web_id = $('.resume-left-tips-id:eq(0)').text().split(':')[1].trim();
            personData.name = $('#userName').text().trim();
            personData.tel = $('#feedbackD02 b').text().trim();
            personData.email = $('#feedbackD02 i.mail').text().trim();

            var text = $('.summary-top').text().trim().split(/\s+/);
            personData.sex = text[0];
            personData.age = parseInt(text[1]);
            personData.degree = text[3];
            personData.year = parseInt(text[2]);
            personData.marry = text[4];

            personData.company = $('.workExperience h2:eq(0)').text().split(/\s+/)[3].trim();
            personData.job = $('.workExperience h2:eq(0)').next('h5').text().trim(true).split('|').splice(-2,1)[0].trim();
            personData.appraise += $('.resume-preview-all:contains(自我评价) .resume-preview-dl').html().replace(/<br>/g, '\n');

            personData.companys = [];
            $('.workExperience h2').each(function (i, item) {
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
                var head = $(item).text().split(/\s+/), head2 = $(item).next('h5').text().trim(true).split('|');
                company.company_name = head[3].trim();
                company.job = head2.length === 3 ? head2[1] : head2[0];
                company.depart = head2.length === 3 ? head2[0] : '';
                company.start_time = head[0].trim().replace('.', '-');
                company.end_time = head[2].trim() === '至今' ? '' : head[2].trim().replace('.', '-');
                company.description = getGroup($(item).next('h5')).text().trim().replace(/\s+/g, '|').replace(/\|/g, '\n');
                personData.companys.push(company);
            });

            personData.trainings = [];
            $('.resume-preview-all h3:contains(项目经历)').nextAll('h2').each(function (i, item) {
                var training = {
                    "train_name": "",
                    "start_time": "",
                    "end_time": "",
                    "company_name": "",
                    "description": ""
                };
                var head = $(item).text().split(/\s+/);
                training.train_name = head[3].trim();
                training.start_time = head[0].trim().replace('.', '-');
                training.end_time = head[2].trim() === '至今' ? '' : head[2].trim().replace('.', '-');
                //training.company_name = '';
                training.description = getGroup($(item)).text().trim().replace(/\s+/g, '|').replace(/\|/g, '\n');
                personData.trainings.push(training);
            });

            personData.schools = [];
            $.each($('.educationContent').html().trim().split('<br>'), function (i, item) {
                if (item === '') return;
                var school = {
                    "school_name": "",
                    "start_time": "",
                    "end_time": "",
                    "degree": "",
                    "profession": "",
                    "is_usual": "是"
                };
                var text = item.replace(/&nbsp;/g, ' ').split(/\s+/);
                school.school_name = text[3].trim();
                school.start_time = text[0].trim().replace('.', '-');
                school.end_time = text[2].trim() === '至今' ? '' : text[2].trim().replace('.', '-');
                school.profession = text[4].trim();
                school.degree = text[5].trim();
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