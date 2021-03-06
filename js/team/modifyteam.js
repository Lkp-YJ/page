// 定义全局变量
var $;
layui.use(['form', 'table', 'layer', 'laydate'], function() {
	$ = layui.jquery;
	var form = layui.form,
		table = layui.table,
		layer = layui.layer,
		laydate = layui.laydate;
	// 延时加载（否则可能查询不到--条件没有准备好）
	setTimeout(function() {
		// 初始化表格 
		table.render({
			// 设置ID
			id : 'teamMemberTable',
			// 指定原始 table 容器
			elem: '#teamMemberTableId',
			// 异步数据接口
			url: 'FindStudentInfoServlet?status=findstuinfosbyteamid',
			where:{teamid:$('#teamid').val()},
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
					width: 120,
					title: '学号',
					align: "center"
				}, {
					field: 'stuname',
					width: 120,
					title: '姓名',
					align: "center"
				}, {
					field: 'sex',
					width: 100,
					title: '性别',
					align: "center"
				}, {
					field: 'mobile',
					width: 130,
					title: '联系方式',
					align: "center"
				}, {
					field: 'classname',
					width: 130,
					title: '班级',
					align: "center"
				}, {
					field: 'majorname',
					width: 130,
					title: '专业',
					align: "center"
				}, {
					field: 'deptname',
					width: 130,
					title: '院系',
					align: "center"
				}, {
					field: 'grade',
					width: 100,
					title: '年级',
					align: "center"
				}, {
					title: '操作',
					minWidth: 150,
					templet: '#currentTableBar',
					fixed: "right",
					align: "center"
				}]
			],
			 done: function(res, curr, count){
				 console.log("表格刷新了~");
				 // 刷新组长下拉列表
				 findLeader();
			 },
			// 是否开启分页
			page: false
		});
	}, 50);
	
	//自定义验证规则
	form.verify({
		teamgroup: function(value) {
			if (value == '') {
				return '请填写团队组别';
			}
		},
		teamname: function(value) {
			if (value == '') {
				return '请填写团队名称';
			}
		},
		competition: function(value) {
			if (value == '') {
				return '请选择参与的赛事';
			}
		},
		phonenumber: function(value) {
			if (value == '') {
				return '成员少于1人,请添加';
			}
		},
		leader: function(value) {
			if (value == '') {
				return '请选择组长';
			}
		},
		adviser: function(value) {
			if (value == '') {
				return '请填写指导老师';
			}
		},
		award: function(value) {
			if (value == '') {
				return '请选择获奖情况';
			}
		}
	});
	// 添加团队成员
	$('body').on('click', '.data-add-btn', function() {
		// 修改班级弹出框
		var othis = $(this),
			method = othis.data('method');
		active[method] ? active[method].call(this, othis) : '';
	});
	// 监听表格编辑、删除按钮
	table.on('tool(teamMemberTableFilter)', function(obj) {
		var param = obj.data;
		console.log(param);
		if (obj.event === 'edit') {
			// 修改班级弹出框
			var othis = $(this),
				method = othis.data('method');
			active[method] ? active[method].call(this, othis, param) : '';
		} else if (obj.event === 'delete') {
			layer.confirm('真的删除该成员吗?', function(index) {
				removemember(param);
				layer.close(index);
			});
		}
	});
	// 定义触发事件弹出厨框
	var active = {
		addmember: function(othis) {
			layer.open({
				id: 'addstudent_iframe', // 防止重复弹出
				title: '添加成员',
				type: 2,
				offset: ['2%', '25%'],
				area: ['37%', '96%'],
				content: ['views/team/addmember.html'], // no：弹窗不要滑动条
				skin: 'layui-layer-molv',
				//							btn: '关闭全部',
				//							btnAlign: 'c' ,//按钮居中
				//							yes: function() {
				//								layer.closeAll();
				//							}
				shade: 0.3, //不显示遮罩
				maxmin: true, //开启最大化按钮
				anim: 3, // 过渡效果（3或者4）
				resize: false, // 禁止窗体拉伸
				//							time : 1000,//定时关闭
				success: function(layero, index) { //弹出层弹出后的回调函数
					console.log(layero, index);
					var body = layer.getChildFrame('body', index);
				    var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
				    //console.log(body.html()) //得到iframe页的body内容
				    body.find('#teamid').val($('#teamid').val());

	    		    // 渲染页面表单，否则不显示数据
	    		    iframeWin.layui.form.render();
				}
			});
		},
		modifymember: function(othis, param) {
			layer.open({
				id: 'modifyuser_iframe', // 防止重复弹出
				title: '修改成员',
				type: 2,
				offset: ['2%', '25%'],
				area: ['37%', '96%'],
				content: ['views/team/modifymember.html'], // no：弹窗不要滑动条
				skin: 'layui-layer-molv',
				//							btn: '关闭全部',
				//							btnAlign: 'c' ,//按钮居中
				//							yes: function() {
				//								layer.closeAll();
				//							}
				shade: 0.3, //不显示遮罩
				maxmin: true, //开启最大化按钮
				anim: 3, // 过渡效果（3或者4）
				resize: false, // 禁止窗体拉伸
				//							time : 1000,//定时关闭
				success: function(layero, index) { //弹出层弹出后的回调函数
					console.log(param);
					var body = layer.getChildFrame('body', index);
				    var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
				    //console.log(body.html()) //得到iframe页的body内容
				    body.find('#teamid').val($('#teamid').val());
	    			body.find('#stuid').val(param.stuid);
	    			body.find('#oldstuid').val(param.stuid);
	    			body.find('#stuname').val(param.stuname);
	    			body.find('input[name=sex][value=女]').attr("checked",param.sex=="女" ? true : false);
					body.find('input[name=sex][value=男]').attr("checked",param.sex=="男" ? true : false);
	    			body.find('#mobile').val(param.mobile);
	    			body.find('#grade').val(param.grade);
	    			
	    			getDepartments(body, iframeWin,param);
	    			getMajors(body, iframeWin, param);
    			    getClasses(body, iframeWin, param);
	    		    // 渲染页面表单，否则不显示数据
	    		    iframeWin.layui.form.render();
				}
			});
		}
	};
	//监听提交
	form.on('submit(form)', function(data) {
		console.log(data);
		param = data.field;
		console.log(param);
		// 修改团体
		modifyTeamReal(param);
		return false;
	});
	// 退出按钮
	$('#exit').on('click',  function() {
		// 关闭自身窗口，刷新父窗口
		var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
		parent.layer.close(index); //再执行关闭
		parent.layui.table.reload('teamTable');//重新加载父页面中的数据表格
	});
});

/* 获得组长下拉列表 */
function findLeader(){
	clearLeaderHtml();
    var param = {teamid:$('#teamid').val(), 'ram':Math.random()};
    console.log(param);
	$.getJSON("FindStudentInfoServlet?status=addTeamLater",param,function(data){
		console.log(data.data);
		$.each(data.data, function(index, item) {
			if(item.stuname == $('#oldleader').val()){
				var op = $("<option>").val(item.stuid).text(item.stuname).prop('selected',true);
			} else {
				var op = $("<option>").val(item.stuid).text(item.stuname);
			}
			$("#leader").append(op);
		});
		// 渲染页面表单，否则不显示数据
		layui.form.render('select');
	});
}
/* 清除组长下拉列表 */
function clearLeaderHtml() {
	$("#leader").html("");//empty()
    var pleaseOption = $("<option>").val("").text("请选择").prop('selected',true);
    $("#leader").append(pleaseOption);
}

/* 修改团队 */
function modifyTeamReal(param){
	$.getJSON('AddTeamServlet?status=modify', param, function(data){
		console.log(data);
		if(data == true){
		    // 修改成员团队中的组长
		    modifyTeamLeader(param);
			// 提示信息
			layer.msg('修改成功！', {anim: 3, icon: 6, time: 2000, shade: 0.1});
			// 关闭自身窗口，刷新父窗口
			setTimeout(function() {
				var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
				parent.layer.close(index); //再执行关闭
				parent.layui.table.reload('teamTable');//重新加载父页面中的数据表格
			}, 1000);
		} else {
			layer.msg('提交失败！', {anim: 6, icon: 5, time: 1500, shade: 0.1});
		}
	});
}
/* 修改团队组长 */
function modifyTeamLeader(srcparam){
	var param = {
			teamid:srcparam.teamid
	};
	$.getJSON('FindStuTeamRelationServlet?status=findteamleader', param, function(data){
		if(data != null){
			console.log("查找的组长信息");
			var param2 = {
				teamid:srcparam.teamid,
				oldstuid:data.stuid,
				stuid:srcparam.leader
			};
			console.log(param2);
			if(data.stuid != srcparam.leader){
				console.log("准备修改队长");
				$.getJSON('ModifyStuTeamRelationServlet?status=modifysturole', param2, function(data){
					if(data == true){
						console.log("修改队长成功！");
					} else {
						console.log("修改队长失败！");
					}
				});
			}
		}
	});
}
/* 通过Servlet获得院系下拉列表 */
function getDepartments(body, iframeWin, srcparam){
	body.find("#department").html("");//empty()
    var pleaseOption = $("<option>").val("").text("请选择").prop('selected',true);
    body.find("#department").append(pleaseOption);
    
    var param = {
        'ram' : Math.random()
    };
	$.getJSON("FindDepartmentServlet",param,function(data){
		//console.log(data);
		$.each(data, function(index, item) {
			if(item.deptid == srcparam.deptid){
				var op = $("<option>").val(item.deptid).text(item.deptname).prop('selected',true);
			} else {
				var op = $("<option>").val(item.deptid).text(item.deptname);
			}
			body.find("#department").append(op);
		});
		// 渲染页面表单，否则不显示数据
		iframeWin.layui.form.render('select');
	});
}

/* 通过Servlet获得专业下拉列表 */
function getMajors(body, iframeWin, srcparam){
	body.find("#major").html("");//empty()
    var pleaseOption = $("<option>").val("").text("请选择").prop('selected',true);
    body.find("#major").append(pleaseOption);
    
    var param = {
    	'deptid':srcparam.deptid,
        'ram' : Math.random()
    };
	$.getJSON("FindMajorServlet",param,function(data){
		//console.log(data);
		$.each(data, function(index, item) {
			if(item.majorid == srcparam.majorid){
				var op = $("<option>").val(item.majorid).text(item.majorname).prop('selected',true);
			} else {
				var op = $("<option>").val(item.majorid).text(item.majorname);
			}
			body.find("#major").append(op);
		});
		// 渲染页面表单，否则不显示数据
		iframeWin.layui.form.render('select');
	});
}

/* 查找班级 */
function getClasses(body, iframeWin, srcparam){
	body.find("#clase").html("");//empty()
    var pleaseOption = $("<option>").val("").text("请选择").prop('selected',true);
    body.find("#clase").append(pleaseOption);
    
	var param = {
		majorid:srcparam.majorid,
		grade:srcparam.grade
	}
	console.log(param);
	$.getJSON("FindClassByMajorServlet",param,function(data){
		//console.log(data);
		$.each(data, function(index, item) {
			if(item.classid == srcparam.classid){
				var op = $("<option>").val(item.classid).text(item.classname).prop('selected',true);
			} else {
				var op = $("<option>").val(item.classid).text(item.classname);
			}
			body.find("#clase").append(op);
		});
		// 渲染页面表单，否则不显示数据
		iframeWin.layui.form.render('select');
	});
}

/* 获取团队ID */
function getTeamID(){
	var param = {'ram' : Math.random()};
	$.getJSON("FindTeamServlet?status=addteambefor",param,function(data){
		$('#teamid').val(data.teamid);
		console.log(data[0].teamid);
	})
}
/* 删除成员 */
function removemember(param){
	$.getJSON("RemoveStudentServlet?status=single", param, function(data){
		if(data == true){
			// 删除成员团队关系
			removestuteamrelation(param);
		} else {
			layer.msg('删除失败，请刷新查看该学生是否存在！', {anim: 6, icon: 5, time: 1500, shade: 0.1});
		}
	});
}
/* 删除成员团队关系 */
function removestuteamrelation(srcparam){
	var param = {
		stuid:srcparam.stuid,
		stuname:srcparam.stuname,
		teamid:$('#teamid').val(),
        'ram' : Math.random()
	}
	console.log(param);
	$.getJSON('RemoveStuTeamRelationServlet?status=single', param, function(data){
		console.log("删除对应关系表结果："+data);
		if(data == true){
			// 提示信息
			layer.msg('删除成功！', {anim: 3, icon: 6, time: 1500, shade: 0.1});		
			// 刷新table
			setTimeout(function() {
				layui.table.reload('teamMemberTable');
			}, 500);
		}else {
			layer.msg('成员删除成功，关系删除失败！', {anim: 6, icon: 5, time: 1500, shade: 0.1});
		}
	})
}
/* 删除团队成员 */
function removememberAll(){
	var param = {
		teamid:$('#teamid').val(),
        'ram' : Math.random()
	}
	$.getJSON("RemoveStudentServlet?status=multiple", param, function(data){
		if(data == true){
			// 删除成员团队关系
			removestuteamrelationAll();
			// 刷新table
			layui.table.reload('teamMemberTable');
		} else {
			layer.msg('重置失败！[status:1]', {anim: 6, icon: 5, time: 1500, shade: 0.1});
		}
	});
}
/* 删除该团队所有成员团队关系 */
function removestuteamrelationAll(){
	var param = {
		teamid:$('#teamid').val(),
        'ram' : Math.random()
	}
	console.log(param);
	$.getJSON('RemoveStuTeamRelationServlet?status=multiple', param, function(data){
		console.log("删除对应关系表结果："+data);
		if(data == true){
			// 提示信息
			layer.msg('重置成功！', {anim: 3, icon: 6, time: 1500, shade: 0.1});						
		}else {
			layer.msg('重置失败！[atatus:2]', {anim: 6, icon: 5, time: 1500, shade: 0.1});
		}
	})
}

