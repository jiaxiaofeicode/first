var nameToTag = "DD"; 
    var moved = false, longPress = false;
    var touchVector = {'x': 0, 'y': 0};
    var picFrame = {'x': 0, 'y': 0, 'width': 0, 'height': 0};
    var taggd = null;
    var ls = "lslsls";
    /**
     * 初始化描点工具
     */
    function init() {
        document.addEventListener('touchstart', onTouchStart, false);
        document.addEventListener('touchend', onTouchEnd, false);
        document.addEventListener('touchmove', onTouchMove, false);
        //初始化描点范围
        picFrame = {
            x: $('#example').offset().left,
            y: $('#example').offset().top,
            width: $('#example').width(),
            height: $('#example').height()
            
        };
		//console.log("picFrame:"+JSON.stringify(picFrame));
        //input json str
        $("#input").bind("click",
                function () {
                    loadTags($("#jsonStr").val())
                });

        //out put json str
        $("#output").bind("click",
                function () {
                    plus.nativeUI.alert(saveTags(taggd));
                });
        $("#output").bind("click",
                function () {
                    plus.nativeUI.alert(saveTags(taggd));
                });
    }

    //touch events
    var time = null;
    function onTouchStart(event) {
        moved = false;
        longPress = true;
        time = setTimeout(function () {
            if (longPress) {
                //long press

            }
        }, 300);
    }
    function onTouchMove(event) {
        clearTimeout(time);
        moved = true;
        if ($('#select').val() == "move") {
            handle($('#select').val(), event, null);
        }
    }
    function onTouchEnd(event) {
        clearTimeout(time);
        console.log(touchVector.x, touchVector.y);
        
        if (!moved) {
            //tap event
            if ($('#select').val() != "move") {
                handle($('#select').val(), event, $("#description").val());
            }
        }
        moved = false;
    }

    /**
     * addTag
     * @param touchVector
     * @param descriptionStr
     */
    function addTag(touchVector, descriptionStr) {
        //prepare data
        var image = document.getElementById('example');
        var options = {
            show: 'mouseenter',
            hide: 'mouseleave'
        };
		if(tagName.id=="D"||tagName.id==null||tagName.id==undefined){
			mui.toast("未选问题类型");
			return;
		}
        var data = [
            Taggd.Tag.createFromObject({
                position: {x: touchVector.x, y: touchVector.y},
                //text: descriptionStr,
                text: "",
                id:tagName
            })
        ];

        //add tag
        taggd = taggd ? taggd.addTag(data.shift()) : new Taggd(image, options, data);
    }

    /**
     * remove tag
     * @param descriptionStr
     * @returns {deleted taggd instance} or null
     */
    function removeTag(descriptionStr) {
        //deal descriptionStr
        return ls__deleteTag(ls__getIndex(descriptionStr));
    }

    /**
     * show all tags description text
     * @param taggd taggd instance
     */
    function showAllTags(taggd) {
        if (taggd) {
            ls__showAll(taggd);
        }
    }

    /**
     * hide all tags description text
     * @param taggd instance
     */
    function hideAllTags(taggd) {
        if (taggd) {
            ls__hideAll(taggd);
        }
    }
        /**
     * private func
     * show description text of all tags
     * @param taggd instance
     */
    function ls__showAll(taggd) {
        tagsArr = taggd.tags;
        for (i = 0; i < tagsArr.length; i++) {
            tagsArr[i].show();
        }
    }

    /**
     * private func
     * hide description text of all tags
     * @param taggd
     */
    function ls__hideAll(taggd) {
        tagsArr = taggd.tags;
        for (i = 0; i < tagsArr.length; i++) {
            tagsArr[i].hide();
        }
    }
    /**
     * pic shot with tags
     */
    function shot() {
        //step 1: show description text of all tags
        showAllTags(taggd);
        //step 2: shot pic with tags
        html2canvas($("#mydiv"), {
        	height:$("#mydiv").innerHeight(),
            onrendered:function (canvas) {
            	var stmFileName = getProPicName();
                var url = canvas.toDataURL();
                mui.post(ip+"/proPic.do",{
                	command:"savePicWithSpots",
                	baseStr:(url.split(","))[1],
                	fileName:stmFileName,
                	proPic:proPic
                },function(data){
                },"json");
            /*    console.log(url);
            	console.log($("#mydiv").html());
                var triggerDownload = $("<a>").attr("href", url).attr("download", Date.parse(new Date())+".png").appendTo("body");
                triggerDownload[0].click();
                triggerDownload.remove();
               */
            }
        });
        //step 3: hide description text of all tags
        hideAllTags(taggd);
    }

    function saveTags(taggd) {
        var jsonStr = "";
        var arr = taggd.getTags();
        for (i = 0; i < arr.length; i++) {
            jsonStr += "#LSSEGMENTATION#" + JSON.stringify(arr[i].toJSON());
        }
        return jsonStr;
    }

    function loadTags(jsonStr) {
        var strArr = jsonStr.split("#LSSEGMENTATION#");
        for (i = 0; i < strArr.length; i++) {
            if (strArr[i].length) {
                ls__addTagFromJson(JSON.parse(strArr[i]));
            }
        }
    }

    /**
     * private func
     * add Tag From JsonObj
     */
    function ls__addTagFromJson(jsonObj) {
        //prepare data
        var image = document.getElementById('example');
        var options = {
           
            show: 'mouseenter',
            hide: 'mouseleave'
        };
        var data = [
            Taggd.Tag.createFromObject({
                position: {x: jsonObj.position.x, y: jsonObj.position.y},
                text: jsonObj.text,
                id:jsonObj.buttonAttributes
            })
        ];

        //add tag
        taggd = taggd ? taggd.addTag(data.shift()) : new Taggd(image, options, data);
    }
//点击后判断操作并执行
    function handle(handleId, event, descriptionStr) {
    	
    	picFrame = {
            x: $('#example').offset().left,
            y: $('#example').offset().top,
            width: $('#example').width(),
            height: $('#example').height()
        };
       	var tmpX = ((event.changedTouches[0].clientX - picFrame.x)) / picFrame.width;
        //var tmpX = (event.changedTouches[0].clientX - picFrame.x) / picFrame.width;
		var tmpY = (event.changedTouches[0].clientY - picFrame.y) / picFrame.height;
		
	/*	console.log("event.changedTouches[0].clientX="+event.changedTouches[0].clientX);
		console.log("event.changedTouches[0].clientY="+event.changedTouches[0].clientY);
		console.log("picFrame.x="+picFrame.x);
		console.log("picFrame.y="+picFrame.y);
		console.log("picFrame.width="+picFrame.width);
		console.log("picFrame.height="+picFrame.height);
		console.log("tmpX="+tmpX);
		console.log("tmpY="+tmpY);
		console.log("("+event.changedTouches[0].clientX+"-"+picFrame.x+")/"+picFrame.width+"="+tmpX);
		console.log("("+event.changedTouches[0].clientY+"-"+picFrame.y+")/"+picFrame.height+"="+tmpX);*/
        touchVector.x = (tmpX > 1 ? null : tmpX)<0 ? null :(tmpX > 1 ? null : tmpX);
        touchVector.y = (tmpY > 1 ? null : tmpY)<0 ? null :(tmpY > 1 ? null : tmpY);
        if( touchVector.y==null|| touchVector.x==null){
        	return;
        }
        switch (handleId) {
            case "point": {
                var index = taggd ? taggd.getTags().length : 0;
                addTag(touchVector, "#LSSTRAT#" + index + "#LSEND#" + touchVector.x + "," + touchVector.y);
                break;
            }
            case "remove": {
                if (taggd) {
                    var index = ls__isNotHide();
                    if (index != null) {
                        ls__deleteTag(index);
                    }
                }
                break;
            }
            case "move": {
                if (taggd) {
                    var index = ls__isNotHide();
                    if (index != null) {
                        taggd.getTag(index).setPosition(touchVector.x, touchVector.y);
                    }
                }
                break;
            }
            case "edit": {
                if (taggd) {
                    if (descriptionStr) {
                        var index = ls__isNotHide();
                        if (index != null) {
                            var header = taggd.getTag(index).text.substring(0, taggd.getTag(index).text.indexOf("#LSEND#") + 7);
                            //taggd.getTag(index).setText(header + descriptionStr);
                            taggd.getTag(index).setText(descriptionStr);// 添加注释信息
                        }
                    }
                }
                break;
            }
        }
    }

    /**
     * private func
     * get index num from string
     * @param descriptionStr
     * @returns {number} or null
     */
    function ls__getIndex(descriptionStr) {
        var arrForTags = taggd.tags;
        var indexTmp = null;
        for (i = 0; i < arrForTags.length; i++) {
            if (arrForTags[i].text == descriptionStr) {
                indexTmp = i;
                break;
            }
        }
        return indexTmp;
    }

    /**
     * private func
     * del tag from taggd instance
     * @param index
     * @returns {deleted taggd instance} or null
     */
    function ls__deleteTag(index) {
        var tmp = taggd ? taggd.deleteTag(index) : null;
        return tmp;
    }

    /**
     * private func
     * witch tag is not hide
     * @returns tag index in array of tagged.tags
     */
    function ls__isNotHide() {
        var index = null;
        tagsArr = taggd.tags;
        for (i = 0; i < tagsArr.length; i++) {
            if (!tagsArr[i].isHidden()) {
                index = i;
                break;
            }
        }
        return index;
    }
/**
 * 
曹灿 
* */
		/**
		 * 问题点照片集合
		 */
		var spotPicMap = new Map();
		/**
		 * 保留选择过的房型图本地文件绝对路径列表
		 */
		var lfs = new Array(); // 保留选择过的房型图本地文件绝对路径列表
		/**
		 * 建筑物ID
		 */
		var itemId = localStorage.getItem("editId");
		var editFlag = false;
		if(itemId==null){
			console.log("未保存建筑物");
		}
		
		var itemDrawing={
			itemId:itemId,//项目本地ID
			picNum :0 ,//房型图数量
			spotPics:[],//选择的问题点图片路径
			lastSpotPic:[]
		}
		/**
		 * 房型图id
		 */
		var proPic = "";
		
        var tagName = new Object();
        tagName.id = "D";
        /**
         * 报告对象
         */
        var proItem={
        	proPics:new Map(),
        }
        var urlToId = new Map();
        /**
         * 最后一个房型图文件名
         */
		var last = null;//最后一个房型图文件名
		
        /**
         * 离线模式标志
         */
        var localFlag = false;
        /**
		 * 图片操作对象
		 */
        var bitmap = new plus.nativeObj.Bitmap("test");
        /*******************************/
		$(function(){
			//init();
			//如果获取itemId失败,则不是编辑模式,否则置editFlag为TRUE
			if(itemId==null||itemId==undefined){
				itemId = localStorage.getItem("itemId");
			}else{
				editFlag=true;
			}
			var shotBot = document.getElementById("shot");
			shotBot.addEventListener("tap",shot,false);
			//绑定添加图片按钮
			bindSpotPicDelete();
			//绑定房型图选图事件
			initFileChangeEvent();
			//绑定预览问题点时的隐藏方法
			bindHindPicPre();
			//绑定预览图左右滑动事件
			bindPicPreSwipe();
			//绑定房型图原图按钮事件
			bindOriginPic();
			//绑定房型图取消按钮事件
			bindCancelClipBtn();
			
			if(editFlag){
				initNavigationEdit();
				mui.plusReady(function(){
					plus.nativeUI.showWaiting("加载中...");
					var localProItemStr = getLocalProitem();
					if(localProItemStr!=undefined&&localProItemStr!=null&&localProItemStr!="null"){
						localFlag=true;
						mui.alert("加载本地数据");
					}else{
						localFlag=false;
					}
					if(localFlag){
						console.log("加载本地保存的数据,itemId:"+itemId);
						plus.nativeUI.closeWaiting();
						initPage(localProItemStr);
					}else{
						mui.ajax( ip+'/proPic.do',{
							
							data:{command:"getInfo",
								itemId:itemId,},
							type:'post',//HTTP请求类型
							timeout:10000,//超时时间设置为10秒；
							dataType:"json",
							success:function(data){
									//console.log("通讯成功");
									//clearTimeout(stmLoading);
									plus.nativeUI.closeWaiting();
									initPage(data);
								},
							error:function(){
								networkErrorToLocal();
							}
						});
						
					}
				});
			}else{
				initNavigationAdd();
			}
			
			
			var addSpotPic = document.getElementById("addSpotPic");
			addSpotPic.addEventListener("tap",function(){
				seclectOrTakePhoto();//添加图片信息
			})
			
			/*var addPic = document.getElementById("addProPic");
			addPic.addEventListener("tap",function(){
				galleryImgsSelected();	//添加图片信息	
			});*/
			
			var deleteProPic = document.getElementById("deleteProPic");
			deleteProPic.addEventListener("tap",deletePic,false);
			
			mui('.mui-scroll-wrapper').scroll({
				deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
			});
			if(itemId==null){
				//itemId=0;
			}
			//loadPics();
			mui.init({
				gestureConfig:{
				tap: true, //默认为true
				doubletap: true, //默认为false
				longtap: true, //默认为false
				swipe: true, //默认为true
				drag: true, //默认为true
				hold:false,//默认为false，不监听
				release:false//默认为false，不监听
				}
				}
			);
			var img_my = document.getElementById('my_img_id');
			var lis  = document.getElementsByClassName("typeName");
			for (var i=0;i<lis.length;i++) {
				
				lis[i].addEventListener("tap",function(){
				dangerLiOnclick(this);
			})
		}
			$('#shouye').click(function(){
				location.href="index_Report.html";
			});

})
		/**
		 * 获取离线模式时保存的数据
		 */
function getLocalProitem(){
					
	var localStmJsonStr =decodeURI( localStorage.getItem("localProPic"+itemId));
	console.log("localStmJSon:"+localStmJsonStr);
	return localStmJsonStr;
}

function initPage(data){
	{
						console.log("获取信息结果:"+JSON.stringify(data));
						if(isJson(data)){
							proItem.proPics = thereJsonStrToDeepMap(JSON.stringify(data));
						}else{
							
							proItem.proPics = thereJsonStrToDeepMap(data);
						}
						
						var keys = proItem.proPics.keys();
						var stmArray = new Array();
						for(var i in keys){
							urlToId.put(((proItem.proPics).get(keys[i])).get("picPath"),(proItem.proPics).get(keys[i]).get("picId"));
							stmArray.push(((proItem.proPics).get(keys[i])).get("picPath"));
							//保存瞄点信息至本地
							localStorage.setItem(((proItem.proPics).get(keys[i])).get("picPath"),((proItem.proPics).get(keys[i])).get("spots"))
						}
						if(stmArray.length>0){
							initProPics(stmArray);
						}
					}
}
/**
 *危险项点击事件响应:显示对应内容,修改标记点名称 
 */
function dangerLiOnclick(ele){
	dangerTypeName = $(ele).children("a").html();
	nameToTag = dangerTypeName;
	var historySpotType =  tagName.id ;
    tagName.id = nameToTag;
	$("#dangerDescriptive").html(dangerList[dangerTypeName])
	if(historySpotType!=tagName.id){
		loadSpotPics();
 }else{
 	
 }
	
	
}

function loadSpotPics(){
	
		//清空缩略图
		//console.log("清空缩略图");
		$("#spotPicDiv").empty();
		
	    /**
		 * 判断map里是否存问题类型图片列表,有就加载出来,无不进行操作
		 */
		
			var spotPics = getSpotPics();
			for(var i=0;i<spotPics.length;i++){
				
			$("#spotPicDiv").append('<div class="Thumbnails_item Thumbnails_bg1"><img src="'+spotPics[i]+'" class="Thumbnails_item spot_pic" data-preview-src="" data-preview-group="1"/></div>');
		}
			//初始化点击放大功能
				//mui.previewImage();
				initPicPre();
				bindSpotPicDelete();
}
function getSpotPics(){
	var picSelect= document.getElementById("picSelect");
			
			//console.log(picSelect.value);
			var stmPicId = urlToId.get(picSelect.value);
			//console.log(stmPicId);
			var spotPics = [];
			if(stmPicId!=undefined&&((proItem.proPics).get(stmPicId)).get("spotPics").containsKey(tagName.id )){
				spotPics = ((proItem.proPics).get(stmPicId)).get("spotPics").get(tagName.id);
				
			}
			return spotPics;
}
function sleep(n) {
    var start = new Date().getTime();
    while(true)  {
    	if(new Date().getTime()-start > n) {
    		break;
    	}
    }
}
	/**
	 * 选择问题点照片
	 */
	function galleryImgsSelectedForSite() {
		
		if(tagName.id=="D"||tagName.id==null||tagName.id==undefined){
			//未选问题类型
			mui.toast("请先选择问题类型");
			return;
		}
		// 从相册中选择图片
		plus.gallery.pick(function(e) {
			if(localFlag){
				var t = {
						url:e.files[0]
					};
				uploadSitePicFineshed(t)
			}else{
				createSpotPicUpload(e.files[0]);
			}
			
		}, function(e) {
			//outSet("取消选择图片");
		}, {
			filter: "image",
			multiple: true,
			maximum: 1,
			selected: lfs,
			system: false,
			onmaxed: function() {
				plus.nativeUI.alert('每次只能选择1张图片');
			}
		}); // 最多选择3张图片
		}
	
	function operatePicUpload(pics){
		
			var picSelect= document.getElementById("picSelect");
			var stmPicId = urlToId.get(picSelect.value);
			console.log(pics[0]);
			if(tagName.id=="D"||tagName.id==null||tagName.id==undefined){
				//未选问题类型
				plus.nativeUI.alert("未选问题类型");
			}else{
				console.log("显示缩略图");
				if(($.inArray(proPic+tagName.id+pics[0], itemDrawing.spotPics))<0){
					//1.1-判断是否存在问题类型,决定新生成问题类型对应map或取得map
					var spotPicMap = ((proItem.proPics).get(stmPicId)).get("spotPics");
					if(spotPicMap.containsKey(tagName.id)){
						var files = spotPicMap.get(tagName.id);
						files.push(pics[0]);	
						((proItem.proPics).get(stmPicId)).get("spotPics").put(tagName.id,files);
					}else{
						var files = new Array();
						for(var i=0;i<pics.length;i++){
							files.push(pics[i]);
						}
						((proItem.proPics).get(stmPicId)).get("spotPics").put(tagName.id,files);
					}
					itemDrawing.spotPics.push(proPic+tagName.id+pics[0]);
					$("#spotPicDiv").append('<div class="Thumbnails_item Thumbnails_bg1"><img src="'+pics[0]+'" class="Thumbnails_item spot_pic" data-preview-src="" data-preview-group="1"/></div>');
					bindSpotPicDelete();
					//$("#spotPicDiv").append('<div class="Thumbnails_item .Thumbnails_bg1" style="background:url('+pics[0]+') top center no-repeat; background-size: cover;"></div>');
					if(itemDrawing[tagName.id]!=undefined){
						itemDrawing[tagName.id];
					}else{
						itemDrawing[tagName.id] =[];
					}
				}else{
					///以有图,无操作
				}
				/*
				 * 初始化图片预览功能后,input选图失效
				 */
				initPicPre();
			}
	}
	
/**
 * 选择拍照或选图
 */
function seclectOrTakePhoto() {
	var stmFileName = getProPicName();
	if(stmFileName==""||stmFileName==undefined){
			plus.nativeUI.alert("未选房型图");
				return;
	}
	
	if(tagName.id=="D"||tagName.id==null||tagName.id==undefined){
				plus.nativeUI.alert("未选问题类型");
				return;
			}
				var btnArray = [{
					title: "拍照"
				}, {
					title: "选取现有的"
				}];
				plus.nativeUI.actionSheet({
					//title:"选择照片",
					cancel: "取消",
					buttons: btnArray
				}, function(e) {
					var index = e.index;
					var text = "你刚点击了\"";
					switch(index) {
						case 0:
							//text += "取消";
							break;
						case 1:
							//text += "拍照或录像";
							getImage();
							break;
						case 2:
							galleryImgsSelectedForSite();
							//text += "选取现有的";
							break;
					}
					//info.innerHTML = text + "\"按钮";
				});
			}
/*
 * 拍照
 */
function getImage() {
				var cmr = plus.camera.getCamera();
				cmr.captureImage(function(path) {
					plus.gallery.save(path);
					 plus.io.resolveLocalFileSystemURL(path, function(entry) {
					 	
					 	console.log("虚拟路径:"+path);
			            console.log("真实路径："+entry.fullPath);  
			            path = "file://" + entry.fullPath;
			            var pics = new Array();
			            pics.push(path);
			            createSpotPicUpload(pics[0]);
			            //operatePicUpload(pics);
			        }, function(e) {  
			            plus.nativeUI.alert(e.message);  
			        });  
					//console.log(path);
					//outSet("照片已成功保存到系统相册");
				}, function(e) {
					//outSet("取消拍照");
				}, {
					filename: "_doc/gallery/",
					index: 1
				});
			}

//先保存描点.再切换图片.再加载对应描点
function changPic(ele){
	$("#picRemark").unbind("load",ProPicLoad);
        showAllTags(taggd);
        //step 2: shot pic with tags
        console.log("sleep1000");
		//sleep(1000);
		console.log("change截图");
		console.log("mydiv高度:"+$("#mydiv").innerHeight());
	
		plus.nativeUI.showWaiting( "保存描点信息..." );
		if($("#mydiv").innerHeight()>0){
			
	        html2canvas($("#mydiv"), {
	        	height:$("#mydiv").innerHeight(),
	        	logging:false,
	            onrendered:function (canvas) {
	            	
					console.log("change截图准备好");
	            	var stmFileName = getProPicName();
	                var url = canvas.toDataURL();
			        //step 3: hide description text of all tags
			        hideAllTags(taggd);
			        if(localFlag){
						savePicTags();
			        	saveShotPicToLocal(url);
		                ShotBeforChangPicFinished();
			        	
			        }else{
			        	mui.ajax(ip+"/proPic.do",{
		                	data:{
			                	command:"savePicWithSpots",
			                	baseStr:(url.split(","))[1],
			                	fileName:stmFileName,
			                	proPic:proPic
		                	},
							type:'post',//HTTP请求类型
							timeout:10000,//超时时间设置为10秒；
							dataType:"json",
		                	success:function(data){
								savePicTags();
		                		ShotBeforChangPicFinished();
			                },
		                	error:function(e){
		                		alert(e.message);
								networkErrorToLocal();
		                	},
	            		});
			        }
	                
	            }
	        });
		}else{
						mui.alert("房型图加载异常,未能保存描点截图");
						savePicTags();
		                ShotBeforChangPicFinished();
		}
	
}
/**
 * save shotpic to local
 * @param {Object} shotUrl
 */
function saveShotPicToLocal(shotUrl){
	console.log('保存图片到本地：');
	var fileName = (new Date()).getTime()+".jpg"
	var dir ="doc/spot_img/";
	var filePath = "_"+dir+fileName;
  	bitmap.loadBase64Data(shotUrl,function(){
	console.log("saveShotPicToLocal 图片加载完成");
		
	bitmap.save(filePath,{quality:50},function(i){
		console.log('保存图片成功：'+JSON.stringify(i));
		bitmap.recycle();
		var localPicID = getIdFromExample();
		//保存描点截图到对应map
		((proItem.proPics).get(localPicID)).remove("localShotpic");
		(proItem.proPics.get(localPicID)).put("localShotpic",i.target);
		console.log("local:proPics::---"+JSON.stringify(proItem.proPics));
		plus.nativeUI.closeWaiting();
		},function(e){
			console.log('保存图片失败：'+JSON.stringify(e));
		});
    },function (e){
    	alert("load base64 error");
    });
}
		
function ShotBeforChangPicFinished(){
	
    		plus.nativeUI.closeWaiting();
        	var stmPicId = urlToId.get(picSelect.value);
//			console.log("stmPicId"+stmPicId);
			//加载点照片
			loadSpotPics();
			$("#example").attr('src',picSelect.value);
			
			console.log(JSON.stringify("现在所有图片信息:"+JSON.stringify(proItem.proPics)));
			$("#picRemark").val(((proItem.proPics).get(stmPicId)).get("remark"));
			proPic = stmPicId;
			last = picSelect.value;
			var tages = localStorage.getItem(picSelect.value);
			if(taggd!=null){
				taggd.destroy();
			}
				//console.log("selct值改变,销毁描点并重新加载"+tages);
			$("#example").load(function(){
			});
			if(tages!=null&&tages.indexOf("LSSEGMENTATION">=0)){
				loadTags(tages);
			}else{
				init();
				//console.log("加载描点和图片,无点信息");
			}
}
$("#next").click(function(event,path){
	
	var picSelectVal = $("#picSelect").val();
	if(picSelectVal==null||picSelectVal==undefined){
		setTimeout(function(){
			window.location.href="survey_information.html";
		},300);
	}else{
		var pageHref="survey_information.html";
		savePicTags();
		saveToNext(pageHref,path);
	}
});
function editSaveAndJump(pageHref){
	
	var picSelectVal = $("#picSelect").val();
	if(picSelectVal==null||picSelectVal==undefined){
		setTimeout(function(){
			window.location.href=pageHref;
		},300);
	}else{
		savePicTags();
		saveToNext(pageHref);
		
	}
}
/**
 *本地下一步前保存截图,完成后跳转
 * @param {Object} shotUrl
 */
function saveShotPicBeforNext(pageHref,path,shotUrl){
	//保存描点截图
	console.log('保存图片到本地：');
	var fileName = (new Date()).getTime()+".jpg"
	var dir ="doc/spot_img/";
	var filePath = "_"+dir+fileName;
  	bitmap.loadBase64Data(shotUrl,function(){
	console.log("saveShotPicBeforNext图片加载完成");
	console.log("filePath:"+filePath);
	
		
	bitmap.save(filePath,{quality:100},function(i){
		console.log('保存图片成功：'+JSON.stringify(i));
		bitmap.recycle();
		var localPicID = getIdFromExample();
		//保存描点截图到对应map
		((proItem.proPics).get(localPicID)).remove("localShotpic");
		(proItem.proPics.get(localPicID)).put("localShotpic",i.target);
		console.log("local:proPics::---"+JSON.stringify(proItem.proPics));
		saveLocalStorage();
		if(path==null){
    			window.location.href=pageHref;//"authentication_report.html";
    	}else{
    			window.location.href=path;
    	}
    	
		plus.nativeUI.closeWaiting();
//		submintByIds([itemId])
//		localDataUpdate(itemId);
		},function(e){
			console.log('保存图片失败：'+JSON.stringify(e));
		});
    },function (e){
    	alert("load base64 error");
    });
}
function saveLocalStorage(){
	
		var requestJson = thereMapToJson(proItem.proPics);
		console.log("保存的json:"+JSON.stringify(requestJson));
		console.log("保存的itemId:"+itemId);
		var stmJson = JSON.stringify(requestJson);
		localStorage.setItem("localProPic"+itemId,encodeURI(stmJson));
		if(stmJson=="{}"){
			localStorage.removeItem("localProPic"+itemId);
		}
}


function saveToNext(pageHref,path){
	plus.nativeUI.showWaiting("保存中...");
	if(localFlag){
		localSave(pageHref,path);
				
	}else{
		var requestJson = thereMapToJson(proItem.proPics);
		var stmJson = JSON.stringify(requestJson);
		netWorkSavetoNext(pageHref,path,stmJson);
		console.log("保存的json:"+JSON.stringify(requestJson));
		console.log("保存的itemId:"+itemId);
	}
}
function localSave(pageHref,path){
	 showAllTags(taggd);
		        //step 2: shot pic with tags
		        html2canvas($("#mydiv"), {
		        	height:$("#mydiv").innerHeight(),
		            onrendered:function (canvas) {
		            	var stmFileName = getProPicName();
		                var url = canvas.toDataURL();
		                saveShotPicBeforNext(pageHref,path,url);
					}
				});
		        //step 3: hide description text of all tags
				hideAllTags(taggd);
}
/**
 * 网络版保存并跳转
 * @param {Object} pageHref
 * @param {Object} path
 * @param {Object} stmJson
 */
function netWorkSavetoNext(pageHref,path,stmJson){
	mui.ajax( ip+'/proPic.do',{
		data:{
			command:"saveProPics",
			itemId:itemId,
			proJson:stmJson
		},
		type:'post',//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；
		dataType:"json",
		success:function(data){
			console.log("保存信息结果:"+data.success);
			if(data.success=="1"){
				saveLastShotThenJump(pageHref,path);
			}
		},
	    error:function(xhr,type,errorThrown){
			//异	常处理；
			networkErrorToLocal();
			localSave(pageHref,path);
    	},
	});
}
function saveLastShotThenJump(pageHref,path){
	 showAllTags(taggd);
    //step 2: shot pic with tags
    html2canvas($("#mydiv"), {
    	height:$("#mydiv").innerHeight(),
        onrendered:function (canvas) {
        	var stmFileName = getProPicName();
            var url = canvas.toDataURL();
            mui.ajax(ip+"/proPic.do",{
                data:{
                	command:"savePicWithSpots",
                	baseStr:(url.split(","))[1],
                	fileName:stmFileName,
                	proPic:proPic
                },
				type:'post',//HTTP请求类型
				timeout:5000,//超时时间设置为10秒；
				dataType:"json",
                success:function(data){
                	plus.nativeUI.closeWaiting();
                	if(path==null){
                			window.location.href=pageHref;//"authentication_report.html";
                	}else{
                			window.location.href=path;
                	}
				
                },
				error:function(e){
					console.log("1152:"+e.message);
					networkErrorToLocal();
				},
            });
		}
	});
    //step 3: hide description text of all tags
	hideAllTags(taggd);
}

	/**
	 * 保存描点
	 */
	function savePicTags(){
		
		plus.nativeUI.showWaiting( "保存描点信息..." );
		var tageds = "";
		if(taggd!=null){
			tageds = saveTags(taggd);
		}
		
//		console.log(itemId+"保存描点和图片,图片url为:"+lfs);
		console.log("保存描点和图片,最终描点信息为:"+tageds);
		localStorage.setItem(itemId,lfs);
		localStorage.setItem(last,tageds);
		
		/*var picSelect= document.getElementById("picSelect");
		console.log("picSelect.value:"+picSelect.value);
		var stmPicId = urlToId.get(picSelect.value);*/
		var test = $("#example").attr("src");
		var stmPicId = urlToId.get($("#example").attr("src"));
		console.log("value"+test);
		console.log(tageds);
		
		console.log("line1052:"+stmPicId);
		var remark = document.getElementById("picRemark");
		console.log("line1054:"+JSON.stringify(((proItem.proPics).get(stmPicId))));
		//js模拟的map无法覆盖原来的值,需要先remove掉该键再重新赋值
		((proItem.proPics).get(stmPicId)).remove("spots");
		((proItem.proPics).get(stmPicId)).remove("remark");
		((proItem.proPics).get(stmPicId)).put("spots",tageds);
		((proItem.proPics).get(stmPicId)).put("remark",remark.value);
		console.log(JSON.stringify(((proItem.proPics).get(stmPicId))));
		plus.nativeUI.closeWaiting();
		console.log("备注"+remark.value);
		return tageds;
		
	}
	/**
	 * 保存房型图对象详细信息到项目对象
	 * @param {Object} tageds 点信息
	 * @param {Object} last	文件路径
	 * @param {Object} picId 房型图id
	 * @param {Object} stmSpotPicMap 点照片集合
	 */
	function addProPicObjectToItem(tageds,last,picId,stmSpotPicMap){
		console.log("保存房型图对象到项目对象");
		var stmProPic = new Map();
		stmProPic.put("spots",tageds);
		stmProPic.put("picPath",last);
		stmProPic.put("picId",picId);
		var remark = $("#picRemark").val();
		stmProPic.put("remark",remark);
		var json = {};
		var stmMapAdd = new Map();
		var keys = stmSpotPicMap.keys();
		console.log("切图是取得spotMap长度:"+keys.length);
		for(var i=0;i<keys.length;i++){ 
			stmMapAdd.put(keys[i],stmSpotPicMap.get(keys[i]));
		}
		json = mapToJson(stmMapAdd);
		console.log("保存的spotJson:"+JSON.stringify(json));
		console.log("保存的spotMap:"+JSON.stringify(stmMapAdd));
		stmProPic.put("spotPics",stmMapAdd); 
		//项目对象里的房型图对象数组是否已有该对象,有则重新赋值
		proItem.proPics.put(picId,stmProPic);
		var testJson = thereMapToJson(proItem.proPics);
		console.log("testJson"+JSON.stringify(testJson));
		
		
		console.log("保存房型图对象到项目对象.picId:"+stmProPic.picId);
		console.log("保存房型图对象到项目对象propics:"+proItem.proPics);
	}
	/**
	 * 传图后增加ProItem中对应内容
	 * @param {Object} last
	 * @param {Object} picId
	 */
		function addProPicObjectToProItem(last,picId){
		console.log("保存房型图对象到项目对象");
		var stmProPic = new Map();
		var stmMapAdd = new Map();
		stmProPic.put("spots","");
		stmProPic.put("picPath",last);
		stmProPic.put("picId",picId);
		stmProPic.put("remark","");
		stmProPic.put("spotPics",stmMapAdd); 
		proItem.proPics.put(picId,stmProPic);
	}
	/**
 *本地版-----初始化页面显示,获取pics将第一个加载至画布 
 */
function loadPics(){
	//localStorage.clear();
	console.log("加载描点和图片,itemId:"+itemId);
	var picStr= localStorage.getItem(itemId);
	var files = null;
	if(picStr!=null){
		files = picStr.split(",");
		console.log("加载PICS:"+files);
		lfs = files;
		last = files[0];
	}else{
		
		console.log("加载描点和图片,图片url为null");
	}

	if(files!=null){
		initProPics(files);
		
	}

}

/**
 * 初始化瞄点和选择图片
 */

function initProPics(files){
	for(var i=0;i<files.length;i++){
		$("#example").attr("src",files[0]);
		
		$("#example").attr("src",files[0]);
		$("#example").css("display","block");
				//console.log("(itemDrawing.picNum);"+itemDrawing.picNum);
		itemDrawing.picNum++;
		//		console.log("(itemDrawing.picNum);"+itemDrawing.picNum);
		$("#picSelect").append("<option class='picOption' value="+files[i]+">图"+itemDrawing.picNum+"</option>");
		document.getElementById("picSelect").value=files[i];
	}
	proPic = urlToId.get(files[0]);
	last=files[0];
	document.getElementById("picSelect").value=files[0];
	$("#example").load(function(){
		init();
	//	console.log("描点初始化完成!!")
	})
	var stmPicId = urlToId.get(files[0]);
	$("#picRemark").val(((proItem.proPics).get(stmPicId)).get("remark"));
	var tages = localStorage.getItem(files[0]);
	var picTagsjson = {};
	picTagsjson[files[0]] = tages;
	//console.log(JSON.stringify(picTagsjson));
	if(tages.indexOf("LSSEGMENTATION">=0)){
		
		loadTags(tages);
	}else{
		console.log("加载描点和图片,无点信息");
	}
}
/**
 * 图片加载完成后执行描点初始化
 */
function ProPicLoad(){  
	init();
	console.log("重置remark");
	//console.log("描点初始化完成!!");
}

// 创建上传问题点照片任务,参数为文件绝对路径
function createSpotPicUpload(filename) {
	console.log(filename);
	plus.nativeUI.showWaiting( "图片上传中..." );
	var proItemId = localStorage.getItem("itemId");
    var task = plus.uploader.createUpload( ip+'/proPic.do?command=uploadSpotPic&proItemId='+proItemId,
        { method:"POST",blocksize:204800,priority:100,timeout:10 },//timeout为响应超时时间不是上传时间
        function ( t, status ) {
            // 上传完成
            if ( status == 200 ) {
            	console.log("t:"+t.responseText);
            	uploadSitePicFineshed(t.responseText);
            } else {
                plus.nativeUI.alert( "Upload failed: " + status );
                networkErrorToLocal();
                var t = {
						url:filename
					};
				uploadSitePicFineshed(t)
            }
        }
    );
    task.addFile(filename, {key:"commonsMultipartFile"} );
    //增加十秒上传未完成就取消,认为失败了
    uploaderStartWithTimeOut(task,10000,filename);
    //task.start();
    
}
/**
 * 点照片上传或离线完成回调
 * @param {Object} t
 */
function uploadSitePicFineshed(t){
	var data;
	if(isJson(t)){
		data = t;
	}else{
		data= eval("("+t+")");
	}
	console.log(JSON.stringify(data));
	
	var stmArry = new Array();
	stmArry[0] = data.url;
	operatePicUpload(stmArry);
	console.log(data.url);
    plus.nativeUI.closeWaiting();
	return data.url;
            
}
		
/**
 * 绑定删除按钮
 */
function deletePic(){
	var picSelectVal = $("#picSelect").val();
	if(picSelectVal==null||picSelectVal==undefined){
		plus.nativeUI.alert("无房型图");
		return;
	}
	var stmSrc = $("#example").attr("src");
	var stmPicId = urlToId.get(stmSrc);
	var btnArray = ['否', '是'];
	mui.confirm("确认删除此房型图?删除后不可恢复!", '提示', btnArray, function(e) {
		if(e.index == 1) {
			if(localFlag){
				//删除本地数据
				console.log("stmPicId:"+stmPicId);
				var spotPicsMap = proItem.proPics.get(stmPicId).get("spotPics");
				console.log("spotPicsMap:"+JSON.stringify(spotPicsMap));
				var spotPicsList = spotPicsMap.values();
				console.log("spotKeyslist:"+spotPicsMap.keys());
				console.log("spotPiclist:"+spotPicsList);
				//删除点照片,先获取所有(点照片数组)的数组
				for(var i=0;i<spotPicsList.length;i++){
					//再遍历每个点下面的照片数组,逐个删除
					for(var j=0;j<spotPicsList[i].length;j++){
						deleteLocalBitMap((spotPicsList[i])[j]);
					}
				}
				//删除截图
				var stmShotPic = proItem.proPics.get(stmPicId).get("localShotpic");
				if(stmShotPic!=undefined){
						deleteLocalBitMap(stmShotPic);
				}else{
					
				}
				//删除房型图
				deleteLocalBitMap(stmSrc);
				//删除完成
				deletePicFineshed();
				saveLocalStorage();
				if(!isNaN(stmPicId)){
					console.log(stmPicId+"stmPicId删除服务端");
					deleteServerProPic(stmPicId);
				}else{
					
					console.log(stmPicId+"stmPicId未删除服务端");
				}
			}else{
				deleteServerProPic(stmPicId);
				
			}
		}
	});
}
function deleteServerProPic(stmPicId){
	//删除数据库数据
				mui.ajax(ip+"/proPic.do",{
				data:{
					command:"deletProPic",
					picId:stmPicId
					
				},
				type:'post',//HTTP请求类型
				timeout:5000,//超时时间设置为10秒；
				dataType:"json",
				success:function(data){
					if(data.success==true){
						deletePicFineshed();
					}
				},
				error:function(){
					networkErrorToLocal();
					mui.alert("网络异常,删除服务端数据失败,请稍后重试");
				}
			});
}
function deleteLocalBitMap(stmSrc){
			if(stmSrc.indexOf("http")>-1){
				console.log("服务器端图片,本地无需删除");
			}else{
				plus.io.resolveLocalFileSystemURL( stmSrc, function( entry ) {
					// 可通过entry对象操作test.html文件 
					entry.remove(function(){
						console.log("本地图片删除成功:"+stmSrc);
					},function ( e ) {
						{
							alert( "delete file failed: "+stmSrc + e.message );
						}
					});
				}, function ( e ) {
					alert( "Resolve file URL failed: " +stmSrc+ e.message );
				
				});
			}
	
}
/**
 * 删除房型图回调,清除本地map内对应数据,初始化显示房型图
 */
function deletePicFineshed(){
	var pa = document.getElementById("picSelect");
	var stmPicId = urlToId.get(pa.value);
	proItem.proPics.remove(stmPicId);
	for(var i = 0; i < pa.options.length; i++)
   {
      	if(pa.options[i].selected == true)
      	{
	         pa.options.remove(i);
	         console.log(lfs);
	         console.log(pa.value);
	         removeAllByValue(lfs,pa.value);
	         
			console.log("remove:"+stmPicId);
	         if(i>0&&pa.options.length>0){
	         	i--;
	         }
	         if(pa.options.length>0){
	         	
		         pa.options[i].selected = true
				$("#example").attr('src',pa.value);
				var stmPicId = urlToId.get(pa.value);
				console.log("stmPicId:"+stmPicId);
				$("#picRemark").val(((proItem.proPics).get(stmPicId)).get("remark"));
				var tages = localStorage.getItem(pa.value);
				if(taggd!=null){
					taggd.destroy();
				}else{
					
				}
				console.log("selct值改变,销毁描点并重新加载"+tages);
				if(tages!=null&&tages.indexOf("LSSEGMENTATION">=0)){
					loadTags(tages);
				}else{
					console.log("加载描点和图片,无点信息");
				}
		         break;
	         }else{
	         	last = null;
	         	$("#example").attr('src',"");
	         	 $("#example").css("display","none");
	         	if(taggd!=null){
					taggd.destroy();
				}else{
					
				}
		         break;
	         }
      	}
   }//加载点照片
	loadSpotPics();

}
/**
 * 初始化长按删除点照片功能
 */
function bindSpotPicDelete(){
	var picSelect= document.getElementById("picSelect");
	var stmPicId = urlToId.get(picSelect.value);
	var spotPics = document.getElementsByClassName("spot_pic");
	for (var i=0;i<spotPics.length;i++) {
			spotPics[i].addEventListener("longtap",function(ele){
				console.log(this.src);
				var stmFileSrc= this.src;
				var btnArray = ['否', '是'];
					mui.confirm('是否确认删除选中对象？', '提示', btnArray, function(e) {
						if(e.index == 1) {
							var spotPicMap = ((proItem.proPics).get(stmPicId)).get("spotPics");
							if(spotPicMap.containsKey(tagName.id)){
								var files = [];
								//获取对应问题类型对的点照片列表
								files = spotPicMap.get(tagName.id);
								console.log("files"+files[0]);
								var stmValue = stmFileSrc+"";
								removeAllByValue(files,stmValue);
								console.log("removeAllByValue success"+files.length);
								((proItem.proPics).get(stmPicId)).get("spotPics").put(tagName.id,files);
							}
							removeAllByValue(itemDrawing.spotPics,(proPic+tagName.id+stmFileSrc));
							loadSpotPics();
						}
					});
			})
		}
}
/**
 * 删除数组第一个指定值的元素
 * @param {Object} arr
 * @param {Object} val
 */
function removeByValue(arr, val) {
  for(var i=0; i<arr.length; i++) {
    if(arr[i] == val) {
      arr.splice(i, 1);
      break;
    }
  }
}
/**
 * 删除数组所有指定值的元素
 * @param {Object} arr
 * @param {Object} val
 */
function removeAllByValue(arr, val) {
  for(var i=0; i<arr.length; i++) {
    if(arr[i] == val) {
		arr.splice(i, 1);
		i--;
    }
  }
}
/**
 * 获取显示图片文件名
 */
function getProPicName(){
	var stmsrc = $("#example").attr("src");
	var fileName = (stmsrc.split("spot_img/"))[1];
	
	return fileName;
	
}
function uploaderStartWithTimeOut(task,timeOut,filename){
		//console.log("设置定时任务:"+parseInt(timeOut));
		task.start();
		var uploadTask = window.setTimeout(function(){
			var stmState = task.state;
			if(stmState!=4){
				if(!localFlag){
					console.log("网络异常,请稍后重试");
					task.abort();
					plus.uploader.clear();
					networkErrorToLocal();
	                var t = {
							url:filename
						};
					uploadSitePicFineshed(t)
					
				}else{
					mui.alert("照片上传失败,请在网络稳定时重试");
				}
			}
		},parseInt(timeOut));
		
}
function clipPic(){
	var clipArea = new bjj.PhotoClip("#clipArea", {
	size: [619, 585],
	outputSize:[ 619, 585],
	file: "#file",
	view: "#view",
	ok: "#clipBtn",
	loadStart: function() {
		plus.nativeUI.showWaiting("图片加载中");
		$("#bottom-form").hide();
	},
	loadComplete: function() {
		plus.nativeUI.closeWaiting();
	},
	clipFinish: function(dataURL) {
			var fileUrl =dataURL;
			saveBeforUploadCropPic(fileUrl);
			setTimeout(function(){
				$("#bottom-form").show();
			},500);
	}
});

}
/**
 * 初始化房型图选择事件
 */
function initFileChangeEvent(){
	var fileInput = document.getElementById("file");
	$(fileInput).on("change", function(){
		$("#main_div").css("display","none");
		$("#proPicCrop").css("display","block");
		console.log("proPicCrop")
	});
	clipPic();
}
/**
 * 将file 的input内容存至本地文件夹
 */
function base64InputToJpg(){
	  var resultFile = document.getElementById("file").files[0];
	var newarr = null;
    if (resultFile) {
        var reader = new FileReader();                
        reader.readAsDataURL(resultFile);
        reader.onload = function (e) {
           	newarr = (this.result);
           	saveSitMap(newarr);
        }; 
    }
}
function saveSitMap(dataurl){
	/**
		 * 图片操作对象
		 */
          	bitmap.loadBase64Data(dataurl,function(){
				var fileName = (new Date()).getTime()+".jpg"
				var dir ="doc/spot_img/";
				var filePath = "_"+dir+fileName;
            	bitmap.save(filePath,{},function(i){
					console.log('保存图片成功：'+JSON.stringify(i));
					bitmap.recycle();
					//img标签用
					//filePath="../../"+dir+fileName;
					var fakeData = {picId:i.target,url:i.target};
					console.log('保存图片成功i.target：'+i.target);
					proPicUploadFinish(fakeData);
					console.log('保存图片成功src：'+$("#example").attr("src"));
				},function(e){
					console.log('保存图片失败：'+JSON.stringify(e));
					return null;
				});
            },function (e){
            	alert("load base64 error");
					return null;
            });
}
function readFile(fileName){
	plus.io.resolveLocalFileSystemURL("_doc/", function(entry) {
		if (entry.isDirectory) {
			entry.getFile(fileName,
				{
					create: true
				},
				function(fileEntry) {
					
					// Read data from file
					var reader = null;
					fileEntry.file( function ( file ) {
						reader = new plus.io.FileReader();
						reader.onloadend = function ( e ) {
							plus.console.log( "Read success" );
							// Get data
						};
						reader.readAsText( file );
						reader.onload = function(e){ 
					       var stmdata = ((this.result));
					      // 	uploadcropedProPic(stmdata);
					    } 
					}, function ( e ) {
						alert( e.message );
					} );
			}, 
			function(e) {
				alert('getFile error!');
			});
		}
	}, 
	function(e) {
		alert('resolve URL error!');
	});
	}
//截图取消按钮
function bindCancelClipBtn(){
	var  cancelClipBtn = document.getElementById("cancelClipBtn");
	cancelClipBtn.addEventListener("tap",function(){
		$("#proPicCrop").css("display","none");
		$("#main_div").css("display","block");
			setTimeout(function(){
				$("#bottom-form").show();
			},500);
	});
	
}
//截图原图按钮
function bindOriginPic(){
	var originEle = document.getElementById("originPic");
	
	originEle.addEventListener("tap",function(){
		
			var fileUrl =( $("#clipArea").find("img")).attr("src");
			saveBeforUploadCropPic(fileUrl);
			setTimeout(function(){
				$("#bottom-form").show();
			},500);
	});
}
/**
 * 网络版保存
 * @param {Object} url 描点截图的base64数据
 * @param {Object} fileUrl 房型图的base64数据
 */
function netWorkSave(url,fileUrl){
		var requestJson = thereMapToJson(proItem.proPics);
		var stmJson = JSON.stringify(requestJson);
		console.log("保存的json:"+JSON.stringify(requestJson));
		console.log("保存的itemId:"+itemId);
		var picSelect= document.getElementById("picSelect");
		var stmPicId = urlToId.get(picSelect.value);
		mui.ajax( ip+'/proPic.do',{
			data:{
				command:"saveProPics",
				itemId:itemId,
				proJson:stmJson
			},
			type:'post',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			dataType:"json",
			success:function(data){
			var stmTags = savePicTags();
				console.log("保存信息结果:"+data.success);
				if(data.success=="1"){
	            	var stmFileName = getProPicName();
					mui.ajax( ip+'/proPic.do',{
						data:{
		                	command:"savePicWithSpots",
		                	baseStr:(url.split(","))[1],
		                	fileName:stmFileName,
		                	proPic:proPic
		                },
		                type:'post',//HTTP请求类型
						timeout:10000,//超时时间设置为10秒；
						dataType:"json",
						success:function(data){
		                	console.log(stmTags);
		                	plus.nativeUI.closeWaiting();
							var remark = document.getElementById("picRemark");
							var stmTags = savePicTags();
							((proItem.proPics).get(stmPicId)).put("spots",stmTags);
							((proItem.proPics).get(stmPicId)).put("remark",remark.value);
							//上传图片
							uploadcropedProPic(fileUrl);
		                },
						error:function(){
							networkErrorToLocal();
						},
					});
				}
			},
		    error:function(xhr,type,errorThrown){
				//异	常处理；
					//先存截图到本地,再保存新房型图到本地
				var stmTags = savePicTags();
					saveShotPicToLocal(url);
					saveSitMap(fileUrl);
				networkErrorToLocal();
	    	},
	});
}
/**
 * 
 * @param {Object} fileUrl 要保存的房型图的base64串
 */
function saveBeforUploadCropPic(fileUrl){
				if(last!=null){
					console.log("清空spotPicMap");
					var picSelect= document.getElementById("picSelect");
					var stmPicId = urlToId.get(picSelect.value);
					//要保存描点截图,先显示再上传剪裁照片
					$("#main_div").css("display","block");
					$("#proPicCrop").css("display","none");
					 showAllTags(taggd);
			        //step 2: shot pic with tags
					console.log("截图"+$("#mydiv").innerHeight());
					//保存现在描点为截图照片,房型图确认加载出来了才截图
					if($("#mydiv").innerHeight()>0){
						html2canvas(
				        	$("#mydiv"),
					        {
					        	height:$("#mydiv").innerHeight(),
					            onrendered:function (canvas) {
								plus.nativeUI.showWaiting( "保存描点信息..." );
				                var url = canvas.toDataURL();
								if(localFlag){
									//先存截图到本地,再保存新房型图到本地
								var stmTags = savePicTags();
									saveShotPicToLocal(url);
									saveSitMap(fileUrl);
								}else{
					                netWorkSave(url,fileUrl);
								}
				            }
			       		 });
					}
					//否则直接保存新图然后显示
					else{
						mui.alert("房型图加载异常,未能保存描点截图");
						if(localFlag){
							
							//先存截图到本地,再保存新房型图到本地
						var stmTags = savePicTags();
							//saveShotPicToLocal(url);
							saveSitMap(fileUrl);
						}else{
			                netWorkSave(url,fileUrl);
						}
					}
			        
				        //step 3: hide description text of all tags
				    hideAllTags(taggd);
								
				}else{
					if(localFlag){
						//先存截图到本地,再保存新房型图到本地
						//saveShotPicToLocal(url);
						saveSitMap(fileUrl);
					}else{
		                uploadcropedProPic(fileUrl);
					}
				}
	}
/**
 * 上传base64的图片内容
 * @param {Object} dataURL
 */
function uploadcropedProPic(dataURL){
	plus.nativeUI.showWaiting("保存中...");
	 mui.ajax(ip+"/proPic.do",{
        data:{
        	command:"uploadCropPic",
        	baseStr:(dataURL.split(","))[1],
        },
		type:'post',//HTTP请求类型
		timeout:15000,//超时时间设置为15秒；
		dataType:"json",
        success:function(data){
        	plus.nativeUI.closeWaiting();
        	proPicUploadFinish(data);
        },
		error:function(e){
			networkErrorToLocal();
			saveSitMap(dataURL);
			console.log(JSON.stringify(proItem));
			localFlag = true;
		},
    });
}
/**
 * 房型图上传完成,后续处理
 * @param {Object} data
 */
function proPicUploadFinish(data){
		$("#main_div").css("display","block");
		$("#proPicCrop").css("display","none");
		//清空缩略图
		$("#spotPicDiv").empty();
		if(isJson(data)){
			
		}else{
			data = eval("("+data+")")
		}
				proPic=data.picId;
				//最后显示图片路径
				last = data.url;
				//总map中加入新房型图元素
				addProPicObjectToProItem(last,proPic);
				//将url和图片id绑定
				urlToId.put(last,proPic);
				if(taggd!=null){
					taggd.destroy();
					console.log("选择新图,描点销毁"+taggd)
				}else
					console.log("选择新图,描点未销毁"+taggd)
				//图片路径存入历史记录数组
				lfs.push(data.url);
				$("#example").attr('src',last);
				//console.log("选择新图:"+$("#example").attr('src'));
				$("#example").css("display","block");
				$("#picRemark").val("");
				$("#example").bind("load",ProPicLoad);
				//console.log("(itemDrawing.picNum);"+itemDrawing.picNum);
				itemDrawing.picNum++;
				//console.log("(itemDrawing.picNum);"+itemDrawing.picNum);
				$("#picSelect").append("<option  name="+proPic+" class='picOption' value="+last+">图"+itemDrawing.picNum+"</option>");
				document.getElementById("picSelect").value=last;
				plus.nativeUI.closeWaiting();
}
/**
 * 绑定点击预览图片,预览图隐藏
 */
function bindHindPicPre(){
	var picPre = document.getElementById("picPreDiv");
	picPre.addEventListener("tap",function(){
		//预览隐藏
		$("#picPreDiv").css("display","none");
		//基础页面显示
		$("#main_div").css("display","block");
	})
}

/*
 初始化图片预览
 */
function initPicPre(){
		/*获取缩略图元素列表*/		
	var imgLis  = document.getElementsByClassName("spot_pic");
	if(imgLis!=undefined){
		for (var i=0;i<imgLis.length;i++) {
			//为每个缩略图绑定点击放大事件
			imgLis[i].addEventListener("tap",function(){
				
				console.log("点击图片:"+$(this).attr("src"));
				$("#main_div").css("display","none");
				$("#picPre").attr("src",$(this).attr("src"));
				//table-cell样式为了竖直方向居中
				$("#picPreDiv").css("display","table-cell");
				
			});
		}
	}
}
/**
 * 绑定预览滑动事件
 */
function bindPicPreSwipe(){
	bindSwipeleft();
	bindSwiperight();
}
/**
 * 绑定预览滑动事件
 */
function bindSwipeleft(){
	var picPreDiv = document.getElementById("picPreDiv");
	
	picPreDiv.addEventListener("swipeleft",function(){
		
		console.log("预览图地址:"+($(picPreDiv).find("img").attr("src")));
		var stmSrc = $(picPreDiv).find("img").attr("src");
		var spotPics = getSpotPics();
		var index = spotPics.indexOf(stmSrc);
		index++;
		if(index>=spotPics.length){
			index=0;
		}else{
			
		}
		console.log("图片序号:"+index);
		$(picPreDiv).find("img").attr("src",spotPics[index]);
	});
}
/**
 * 绑定预览滑动事件
 */
function bindSwiperight(){
	var picPreDiv = document.getElementById("picPreDiv");
	
	picPreDiv.addEventListener("swiperight",function(){
		
		console.log("预览图地址:"+($(picPreDiv).find("img").attr("src")));
		var stmSrc = $(picPreDiv).find("img").attr("src");
		var spotPics = getSpotPics();
		var index = spotPics.indexOf(stmSrc);
		index--;
		if(index<0){
			index=spotPics.length-1;
		}else{
			
		}
		console.log("图片序号:"+index);
		$(picPreDiv).find("img").attr("src",spotPics[index]);
	});
}
/**
 * 根据example元素的src获取map对应里ID
 */
function getIdFromExample(){
	var url = $("#example").attr("src");
	console.log("picurl:"+url);
	var id = urlToId.get(url);
	return id;
}
								