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
        while (element.nextAll(':eq('+idx+')>td').hasClass('cvtitle')) {
            idx++;
        }
        return element.nextAll(':lt('+idx+')');
    }

    chrome.runtime.onMessage.addListener(function (req, sender, sendResponse) {
        if (req.method === 'read') {
            var tbMain = $('#divResume>tbody>tr>td>table:eq(2)'),
                tbHead1 = $('#divResume table:eq(6)'),
                tbHead2 = $('#divResume table:eq(8)');

            personData.web_id = tbHead1.find('tr:eq(1) table:eq(0)>tbody>tr:eq(0)>td:eq(1)').text().trim().match(/\d+/) + '';
            personData.name = tbHead1.find('tr:eq(0)>td>span:visible').text().trim();
            personData.tel = tbHead1.find('tr:eq(1) table:eq(0)>tbody>tr:eq(2)').text().trim().match(/\d+/)+'';
            personData.email = tbHead1.find('tr:eq(1) table:eq(0)>tbody>tr:eq(3)').text().trim().split('：')[1];

            var text = tbHead1.find('tr:eq(1) table:eq(0)>tbody>tr:eq(0)>td:eq(0)').text().trim(1).split('|');
            personData.sex = text[1];
            personData.age = parseInt(text[2]);
            personData.degree = tbHead2.find('table:eq(1)>tbody>tr:eq(1)').text().split('：')[1];
            personData.year = parseInt(text[0]);
            personData.marry = text[3];

            personData.company = tbHead2.find('table:eq(0)>tbody>tr:eq(1)').text().split('：')[1];
            personData.job = tbHead2.find('table:eq(0)>tbody>tr:eq(3)').text().split('：')[1];
            personData.appraise += $('#divResume table:eq(13)>tbody>tr:eq(3)').text().trim();

            personData.companys = [];

            try {
                var contentCom = $('#divResume table:eq(16)>tbody>tr:contains("工作经验")').nextAll('tr:eq(2)'), rowsCom = contentCom.find('tbody:eq(0)>tr').length;
                for (var i = 0; i < rowsCom; i += 5) {
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
                    company.company_name = contentCom.find('tbody:eq(0)>tr').eq(i).text().trim(1).split('：')[1].split(/\(\d+/)[0];
                    company.job = contentCom.find('tbody:eq(0)>tr').eq(i+2).find('td:eq(1)').text();
                    company.depart = contentCom.find('tbody:eq(0)>tr').eq(i+2).find('td:eq(0)').text();

                    var times = contentCom.find('tbody:eq(0)>tr').eq(i).text().trim(1).split('：')[0].split('--');
                    company.start_time = times[0].split('/')[0] + '-' + (('0' + times[0].split('/')[1]).substr(-2));
                    company.end_time = times[1] == '至今' ? '' : times[1].split('/')[0] + '-' + (('0' + times[1].split('/')[1]).substr(-2));

                    company.description = contentCom.find('tbody:eq(0)>tr').eq(i+3).text().trim(1);
                    personData.companys.push(company);
                }

                var contentEdu = $('#divResume table:eq(16)>tbody>tr:contains("教育经历")').nextAll('tr:eq(2)'), rowsCom = contentEdu.find('tbody:eq(0)>tr').length;

                for (var i = 0; i < rowsCom; i += 3) {
                    var school = {
                        "school_name": "",
                        "start_time": "",
                        "end_time": "",
                        "degree": "",
                        "profession": "",
                        "is_usual": "是"
                    };
                    school.school_name = contentEdu.find('tbody:eq(0)>tr').eq(i).find('td:eq(1)').text();

                    var times = contentEdu.find('tbody:eq(0)>tr').eq(i).text().trim(1).match(/\d+/g);
                    school.start_time = times[0] + '-' + (('0' + times[1]).substr(-2));
                    school.end_time = times[2] + '-' + (('0' + times[3]).substr(-2));

                    school.profession = contentEdu.find('tbody:eq(0)>tr').eq(i).find('td:eq(2)').text();
                    school.degree = contentEdu.find('tbody:eq(0)>tr').eq(i).find('td:eq(3)').text();
                    personData.schools.push(school);
                }
            } catch (e) {
                alert('详细信息读取失败!');
            }


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