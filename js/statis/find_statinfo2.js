// 定义全局变量
var $;
layui.use(['form', 'table', 'layer', 'laydate'], function() {
	$ = layui.jquery;
	var form = layui.form,
		table = layui.table,
		layer = layui.layer,
		laydate = layui.laydate;
	//日期
	laydate.render({
		elem: '#grade',
		type: 'year'
	});
	
	// 延时一下，等待数据赋值上在使用
	setTimeout(function() {
		// 初始化表格 
		table.render({
			// 设置ID
			id : 'ststInfoTable',
			// 指定原始 table 容器
			elem: '#ststInfoTableId',
			// 异步数据接口
			url: 'FindStatInfoServlet?status=findstatinfo',
			where:{stuid: $('#stuid').val(),
				classid:$('#classid').val(),
				majorid:$('#major').val(),
				grade:$('#grade').val(),
				competitionid:$('#competition').val(),
				adviser:$('#adviser').val(),
				award:$('#award').val(),
				daterange:$('#daterange').val()
			},
			// 设置导出按钮
			toolbar: '#tablebar',
			//设置表头。值是一个二维数组
			cols: [
				[{
					type:'numbers',
					width: 50,
					title: '序号',
					fixed: "left"
				}, {
					field: 'stuid',
					width: 110,
					title: '学号',
					sort: true
				}, {
					field: 'stuname',
					width: 100,
					title: '姓名'
				},{
					field: 'classid',
					width: 100,
					title: '班级'
				}, {
					field: 'majorname',
					width: 120,
					title: '专业'
				},{
					field: 'grade',
					width: 80,
					title: '年级'
				}, {
					field: 'teamname',
					width: 120,
					title: '所在团队'
				}, {
					field: 'sturole',
					width: 80,
					title: '角色'
				},{
					field: 'competitionname',
					width: 120,
					title: '参与赛事'
				}, {
					field: 'competitiondate',
					width: 120,
					title: '举办时间'
				}, {
					field: 'adviser',
					width: 160,
					title: '指导老师'
				}, {
					field: 'award',
					minWidth: 100,
					title: '获奖情况'
				}]
			],
			// 每页条数的选择项
			limits: [10, 15, 20, 25, 50, 100],
			// 每页显示的条数
			limit: 15,
			// 是否开启分页
			page: true
		});
	}, 50);
	$(document).ready(function() {       
		console.log('准备数据参数....');
	});
	// 监听搜索操作
	form.on('submit(data-search-btn)', function(data) {
		var param = data.field;
		console.log(param);
		//执行搜索重载
		table.reload('ststInfoTable', {
			page: {
				curr: 1
			},
			where: {
				stuid:param.stuid,
				classid:param.classid,
				majorid:param.major,
				grade:param.grade,
				competitionid:param.competition,
				adviser:param.adviser,
				award:param.award
			}
		}, 'data');
		return false;
	});

});

/* 通过Servlet获得专业下拉列表 */
function getMajors(deptid){
	clearMajorHtml();
    var param = {
    	'deptid':deptid,
        'ram' : Math.random()
    };
	$.getJSON("FindMajorServlet",param,function(data){
		//console.log(data);
		$.each(data, function(index, item) {
			if(item.majorname == 'xxx'){
				var op = $("<option>").val(item.majorid).text(item.majorname).prop('selected',true);
			} else {
				var op = $("<option>").val(item.majorid).text(item.majorname);
			}
			$("#major").append(op);
		});
		// 渲染页面表单，否则不显示数据
		layui.form.render('select');
	});
}
