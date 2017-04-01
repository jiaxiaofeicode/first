/**
 * 房型图离线数据上传部分.
 * 文件读取为异步方法,为保证顺序上传房型图,每个房型图相关信息上传完成后,
 */
/**
 * 已完成上传的房型图对象集合
 */
var updatedProPicMap=new Map();
//本地房型图对象集合
var localProPicsMap = new Map();
var proPicsObjectList=null;
var proPicIndex = 0 ;
var localUploadTask=null;
var type=0;
							
function localHasData(checkItemIds){
	var localHasData = {
		flag:false,
		localIds:[],
		names:[]
	};
	for(var i=0;i<checkItemIds.length;i++){
		var checkItemId=checkItemIds[i];
		var localProItemStr = decodeURI( localStorage.getItem("localProPic"+checkItemId));
		if(localProItemStr!=undefined&&localProItemStr!=null&&localProItemStr!="null"){
			console.log("本地有数据,返回true");
			localHasData.flag= true;
			(localHasData.localIds).push(checkItemId);
		}
	}
	console.log(localHasData.localIds);
	localHasData.names=getNamesByids(localHasData.localIds);
	//console.log("无本地数据;返回false");
	return localHasData;
}
function getNamesByids(ids){
	var names = [];
	for(i in ids){
		var li = $("li[value='"+ids[i]+"']");
		var stmDiv = li.find(".mui-media-body");
		names.push(stmDiv.html());
	}
	return names;
}
function submintByIds(submittype,ids){
		type = submittype;
		var localResult =  localHasData(ids);
		if(localResult.flag){
			if(ids.length==1){
				var itemIdToUpdate = ids[0];
				localDataUpdate(itemIdToUpdate);
				return null;
			}else{
				mui.alert("以下项目本地数据未同步,请单独提交:\n"+localResult.names);
			}
			return localResult;
		}else{
			if(type==1){
				doBatchSubmit(ids);
			}else{
				submit();
			}
			
			return localResult;
		}
		
		
	
}

function localDataUpdate(itemIdToUpdate){
	plus.nativeUI.showWaiting("保存中...");
	if(!itemIdToUpdate){
		itemIdToUpdate = 0;	
	}
	var proPicsJsonStr = decodeURI(localStorage.getItem("localProPic"+itemIdToUpdate));
	if(proPicsJsonStr&&proPicsJsonStr!="{}"){
		localProPicsMap = thereJsonStrToDeepMap(proPicsJsonStr);
		//var proPicsKeys = localProPicsMap.keys();
		proPicsObjectList = localProPicsMap.values();
		everyProPicUpload(proPicIndex,proPicsObjectList,itemIdToUpdate);
	}else{
		mui.alert("数据已上传");
		//无本地数据则可以提交
	}
}
function everyProPicUpload(i,proPicsObjectList,itemIdToUpdate){
			console.log("***********上传第"+i+"张房型图");
	
			var proPicPath = proPicsObjectList[i].get("picPath");
			var spotPicsList = proPicsObjectList[i].get("spotPics");
			var proPicsObject=proPicsObjectList[i];
			console.log("spotPicsList:"+spotPicsList);
			if(proPicPath.indexOf("http")<0){
				plus.io.resolveLocalFileSystemURL(proPicPath,function(entry){
					// Read data from file
					var reader = null;
					entry.file( function ( file ) {
						reader = new plus.io.FileReader();
						reader.onloadend = function ( e ) {
							console.log( "Read success"+ proPicsObject);
							uploadLocalProPic(e.target.result,proPicsObject,itemIdToUpdate);
							// Get data
						};
						reader.readAsDataURL( file );
					}, function ( e ) {
						alert( e.message );
					} );
				});
			}
			//如果是服务器上的照片
			else{
				var data = {};
				data.url=proPicPath;
				data.picId=proPicsObject.get("picId");
        		localProPicUploadFinish(data,proPicsObject,itemIdToUpdate);
				i++;
				
				/*if(i<proPicsObjectList.length){
					 everyProPicUpload(i,proPicsObjectList,itemIdToUpdate);
				}
				else{
								
				}*/
			}
			//uploadcropedProPic(dataURL)
}
/**
 * 上传base64的图片内容
 * @param {Object} dataURL
 * proPicsObject 本地对应上传的房型图对象
 */
function uploadLocalProPic(dataURL,proPicsObject,itemIdToUpdate){
	 mui.ajax(ip+"/proPic.do",{
        data:{
        	command:"uploadCropPic",
        	baseStr:(dataURL.split(","))[1],
        },
		type:'post',//HTTP请求类型
		timeout:15000,//超时时间设置为15秒；
		dataType:"json",
		async:false,
        success:function(data){
        	localProPicUploadFinish(data,proPicsObject,itemIdToUpdate);
        },
		error:function(e){
			updateNetError();
		},
    });
}
/**
 * 房型图上传完成,后续处理
 * @param {Object} data
 * proPicsObject 本地保存的房型图对象
 */
function localProPicUploadFinish(data,proPicsObject,itemIdToUpdate){
		if(isJson(data)){
			
			
		}else{
			data = eval("("+data+")")
		}
				var stmpicId=data.picId;
				//最后显示图片路径
				var stmlast = data.url;
				var remark = proPicsObject.get("remark");
				var spots = proPicsObject.get("spots");
				//总map中加入新房型图元素
				var updatedProPicObject= new Map();
				updatedProPicObject.put("picPath",stmlast);
				updatedProPicObject.put("picId",stmpicId);
				updatedProPicObject.put("spots",spots);
				updatedProPicObject.put("remark",remark);
				updatedProPicObject.put("spotPics",new Map());
				updatedProPicMap.remove(stmpicId);
				updatedProPicMap.put(stmpicId,updatedProPicObject);
				var spotPicsObject = proPicsObject.get("spotPics");
				//问题点照片类型存在就进行上传操作
				if((spotPicsObject.keys()).length>0){
					createLocalSpotPicUpload(spotPicsObject,proPicsObject,0,0,stmpicId,itemIdToUpdate);
				}
				//没有点照片就进行后续截图上传
				else{
            		//点照片上传结束,上传截图后保存整体
            		var Propicpath = updatedProPicMap.get(stmpicId).get("picPath");
            		var stmfileName = (Propicpath.split("spot_img/"))[1];
            		localShotUpload(proPicsObject,stmfileName,stmpicId,itemIdToUpdate);
				}
}
// 创建上传问题点照片任务,参数为文件绝对路径
/**
 * 
 * @param {Object} spotPicsObject点照片map
 * @param {Object} proPicsObject 本地房型图对象
 * @param {Object} keyIndex 点照片key的下标
 * @param {Object} valueIndex 点照片列表的下标
 * @param {Object} stmpicId 处理的房型图对应的网上id
 */
function createLocalSpotPicUpload(spotPicsObject,proPicsObject,keyIndex,valueIndex,stmpicId,itemIdToUpdate) {
	
	var spotPicsKeys = spotPicsObject.keys();
	var spotPicList = spotPicsObject.get(spotPicsKeys[keyIndex]);
	if(spotPicList.length<1){
		valueIndex=0;
		keyIndex++;
    	if(keyIndex<spotPicsKeys.length){
    		createLocalSpotPicUpload(spotPicsObject,proPicsObject,keyIndex,valueIndex,stmpicId,itemIdToUpdate);
    	}else{
    		//点照片上传结束,上传截图后保存整体
    		var Propicpath = updatedProPicMap.get(stmpicId).get("picPath");
    		//服务器用于合成描点图的房型图照片名称
    		var stmfileName = (Propicpath.split("spot_img/"))[1];
    		localShotUpload(proPicsObject,stmfileName,stmpicId,itemIdToUpdate);
    	}
	}else{
		
		var filename = spotPicList[valueIndex];
		var proItemId = itemIdToUpdate;
		if(filename.indexOf("http")<0){
		    var task = plus.uploader.createUpload( ip+'/proPic.do?command=uploadSpotPic&proItemId='+proItemId,
		        { method:"POST",blocksize:204800,priority:100,timeout:10 },//timeout为响应超时时间不是上传时间
		        function ( t, status ) {
		            // 上传完成
		            if ( status == 200 ) {
		            	clearTimeout(localUploadTask);
		            	localUploadSitePicFineshed(t.responseText,proPicsObject,spotPicsKeys[keyIndex],stmpicId);
		            	valueIndex++;
		            	if(valueIndex>=spotPicList.length){
		            		valueIndex=0;
		            		keyIndex++;
		            	}else{
		            		
		            	} 
		            	if(keyIndex<spotPicsKeys.length){
		            		createLocalSpotPicUpload(spotPicsObject,proPicsObject,keyIndex,valueIndex,stmpicId,itemIdToUpdate);
		            	}else{
		            		//点照片上传结束,上传截图后保存整体
		            		var Propicpath = updatedProPicMap.get(stmpicId).get("picPath");
		            		//服务器用于合成描点图的房型图照片名称
		            		var stmfileName = (Propicpath.split("spot_img/"))[1];
		            		localShotUpload(proPicsObject,stmfileName,stmpicId,itemIdToUpdate);
		            	}
		            } else {
		                plus.nativeUI.alert( "Upload failed: " + status );
		            }
		        }
		    );
		    task.addFile(filename, {key:"commonsMultipartFile"} );
		    //增加十秒上传未完成就取消,认为失败了
		    updateStartWithTimeOut(task,15000,filename);
		    //task.start();
			
		}else{
						console.log("网上点图保存");
						var stmRes = {
							url:filename
						}
		            	localUploadSitePicFineshed(stmRes,proPicsObject,spotPicsKeys[keyIndex],stmpicId);
		            	valueIndex++;
		            	if(valueIndex>=spotPicList.length){
		            		valueIndex=0;
		            		keyIndex++;
		            	}else{
		            		
		            	} 
		            	if(keyIndex<spotPicsKeys.length){
		            		createLocalSpotPicUpload(spotPicsObject,proPicsObject,keyIndex,valueIndex,stmpicId,itemIdToUpdate);
		            	}else{
		            		//点照片上传结束,上传截图后保存整体
		            		var Propicpath = updatedProPicMap.get(stmpicId).get("picPath");
		            		//服务器用于合成描点图的房型图照片名称
		            		var stmfileName = (Propicpath.split("spot_img/"))[1];
		            		console.log("点照片上传结束,上传截图");
		            		localShotUpload(proPicsObject,stmfileName,stmpicId,itemIdToUpdate);
		            	}
			
		}
	}
    
}
function localShotUpload(proPicsObject,stmFileName,proPicId,itemIdToUpdate){
        var shotPath= proPicsObject.get("localShotpic");
        if(shotPath!=undefined&&shotPath!=null&&shotPath!="null"&&shotPath!=""){
			console.log("读取截图ing:"+shotPath);
        	plus.io.resolveLocalFileSystemURL(shotPath,function(entry){
				// Read data from file
				
				var reader = null;
				entry.file( function ( file ) {
					reader = new plus.io.FileReader();
					reader.onloadend = function ( e ) {
						var url=e.target.result;
						console.log("截图上传iNg");
						mui.ajax( ip+'/proPic.do',{
						data:{
		                	command:"savePicWithSpots",
		                	baseStr:(url.split(","))[1],
		                	fileName:stmFileName,
		                	proPic:proPicId
		                },
		                type:'post',//HTTP请求类型
						timeout:10000,//超时时间设置为10秒；
						dataType:"json",
						async:false,
						success:function(data){
							var stmObject = updatedProPicMap.get(proPicId);
							var stmMap = new Map();
							stmMap.put(proPicId,stmObject);
							var requestJson = thereMapToJson(stmMap);
							var stmJsonStr = JSON.stringify(requestJson);
							localDataNetWorkSave(stmJsonStr,proPicsObject,itemIdToUpdate);
							
		                },
						error:function(){
							updateNetError();
						},
					});
					
							
						// Get data
					};
					reader.readAsDataURL( file );
				}, function ( e ) {
					alert( e.message );
				} );
			}, function ( e ) {
				alert( "Resolve file URL failed: " + e.message );
				plus.nativeUI.closeWaiting();
			});
        }else{
				var stmObject = updatedProPicMap.get(proPicId);
				
				var stmMap = new Map();
				stmMap.put(proPicId,stmObject);
				var requestJson = thereMapToJson(stmMap);
				var stmJsonStr = JSON.stringify(requestJson);
				localDataNetWorkSave(stmJsonStr,proPicsObject,itemIdToUpdate);
        	
        }
		
					
}
function localDataNetWorkSave(stmJson,proPicsObject,itemIdToUpdate){
	console.log("截图上传结束,保存整体");
	mui.ajax( ip+'/proPic.do',{
		data:{
			command:"saveProPics",
			itemId:itemIdToUpdate,
			proJson:stmJson
		},
		type:'post',//HTTP请求类型
		timeout:15000,//超时时间设置为10秒；
		dataType:"json",
		async:false,
		success:function(data){
			if(data.success=="1"){
				var localId = proPicsObject.get("picId");
				
				var proPicsJsonStr = decodeURI(localStorage.getItem("localProPic"+itemIdToUpdate));
				localProPicsMap = thereJsonStrToDeepMap(proPicsJsonStr);
				localProPicsMap.remove(proPicsObject.get("picId"));
				console.log("#####删除后的的json"+JSON.stringify(thereMapToJson(localProPicsMap)));
				var requestJson = thereMapToJson(localProPicsMap);
				var stmJson = JSON.stringify(requestJson);
				localStorage.setItem("localProPic"+itemIdToUpdate,encodeURI(stmJson));
				if(stmJson=="{}"){
					localStorage.removeItem("localProPic"+itemIdToUpdate);
					plus.nativeUI.closeWaiting();
					if(type==1){
						doBatchSubmit([itemIdToUpdate]);
					}else{
						submit();
					}
					//mui.alert("离线数据已上传");
				}else{
					proPicIndex++;
					if(proPicIndex<proPicsObjectList.length){
								 everyProPicUpload(proPicIndex,proPicsObjectList,itemIdToUpdate);
					}else{
						
					}
				}
			}
		},
	    error:function(xhr,type,errorThrown){
			//异	常处理；
			updateNetError();
			//updateNetError();
    	},
	});
}
/**
 * 点照片上传完成回调
 * @param {Object} t
 * @param {Object} proPicsObject 本地房型图对象
 */
function localUploadSitePicFineshed(t,proPicsObject,tagKey,stmpicId){
			
	var data;
	if(isJson(t)){
		data = t;
	}else{
		data= eval("("+t+")");
	}
	var stmArry = new Array();
	stmArry[0] = data.url;
	operateLocalPicUpload(stmArry,proPicsObject,tagKey,stmpicId);
	
}

function operateLocalPicUpload(pics,proPicsObject,tagKey,stmpicId){
			var updatedProPicObject = updatedProPicMap.get(stmpicId);
			var spotPicMap = updatedProPicObject.get("spotPics");
			var files = new Array();
			//1.1-判断是否存在问题类型,决定新生成问题类型对应map或取得map
			if(spotPicMap.containsKey(tagKey)){
				files = spotPicMap.get(tagKey);
			}else{
			}
			for(var i=0;i<pics.length;i++){
				if(pics[i]!=""){
					files.push(pics[i]);	
				}
			}
			
			updatedProPicObject.get("spotPics").put(tagKey,files);
			updatedProPicMap.put(stmpicId,updatedProPicObject);
	}
	function updateNetError(){
		mui.alert("网络异常,已上传完成"+proPicIndex+"张房型图");
		plus.nativeUI.closeWaiting();
	}

function updateStartWithTimeOut(task,timeOut,filename){
		//console.log("设置定时任务:"+parseInt(timeOut));
		task.start();
		localUploadTask = window.setTimeout(function(){
			var stmState = task.state;
			if(stmState!=4){
					updateNetError();
			}
		},parseInt(timeOut));
		
		
}