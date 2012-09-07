(function(d){
	function C(a){if(d.getElementsByClassName){return d.getElementsByClassName(a);}else{var b=d.all;var c=[];if(b){for(var i=0,n=b.length;i<n;i++){if(b[i].className==a)c.push(b[i]);}}return c;}}
	function E(a,b,c){if(a.addEventListener){a.addEventListener(b,c,false)}else if(a.attachEvent){if(c.call){a.attachEvent("on"+b,function(){c.call(a,window.event)},false)}}}
	function isElement(obj){try{return obj instanceof HTMLElement;}catch(e){return (typeof obj==="object")&&(obj.nodeType===1)&&(typeof obj.style==="object")&&(typeof obj.ownerDocument==="object");}}
	
	/**
	 * XMLエレメントから指定されたノード名の値を取得
	 * @param {xmlelement} xml
	 * @param {string} name
	 * @return {string}
	 */
	function getNodeValue(xml,name){
		if(xml){
			var _name=name.toLowerCase();
			var nodes=xml.childNodes;
			var n=nodes.length;
			for(var i=0;i<n;i++){
				if(nodes.item(i).nodeName.toLowerCase()==_name){
					return nodes.item(i).firstChild.nodeValue;
				}
			}
		}
		return null;
	}
	
	/**
	 * 指定された日時を現在の時間軸からの視点に変換
	 * @param {string} pubDate
	 */
	function relativeTime(pubDate){
		var origStamp=Date.parse(pubDate);
		var curDate=new Date();
		var currentStamp=curDate.getTime();
		var difference=parseInt((currentStamp-origStamp)/1000);
		if(difference<0) return false;
		if(difference<=5) return "いまさっき";
		if(difference<=20) return "数秒前";
		if(difference<=60) return "1分以内";
		if(difference<3600) return parseInt(difference/60)+" 分前";
		if(difference<=1.5*3600) return "約1時間前";
		if(difference<23.5*3600) return Math.round(difference/3600)+" 時間前";
		if(difference<1.5*24*3600) return "1日前";
		var dateArr=pubDate.split(' ');
		return (parseInt(difference/86400)).toString()+'日前';
	}
	
	/**
	 * notesfeedオブジェクトを設定
	 * @param {HTMLElement} container 
	 */
	var notesfeed=function(container){
		var self=this;
		
		//インスタンス生成
		self.content=d.createElement('div');
		self.content.className='fb-notesfeed-content';
		
		self.prev_btn=d.createElement('a');
		self.next_btn=d.createElement('a');
		self.prev_disable=d.createElement('span');
		self.next_disable=d.createElement('span');
		
		self.content.style.display="none";
		container.appendChild(self.content);
		
		//要素を取り出す
		var id=container.getAttribute('data-id');
		var viewer=container.getAttribute('data-viewer');
		var key=container.getAttribute('data-key');
		var max=container.getAttribute('data-max');
		
		//feed読み込み
		var url='http://www.facebook.com/feeds/notes.php?';
		url+='id='+id+'&';
		url+='viewer='+viewer+'&';
		url+='key='+key+'&';
		url+='format=rss20';
		var feed=new google.feeds.Feed(url);
		if(max)feed.setNumEntries(max);
		feed.setResultFormat(google.feeds.Feed.XML_FORMAT);
		feed.load(function(result){
			if(!result.error){
				//console.log(result.xmlDocument);
				var channel=result.xmlDocument.getElementsByTagName("channel")[0];
				var title=(result.xmlDocument.getElementsByTagName("author")[0].firstChild)?result.xmlDocument.getElementsByTagName("author")[0].firstChild.nodeValue:"";
				var managingeditor=getNodeValue(channel,"managingeditor");
				self.__caption='<a href="'+managingeditor+'" title="'+title+'" target="_blank"><strong>'+title+'</strong> on Facebook</a>';
				self.__items=result.xmlDocument.getElementsByTagName("item");
				if(self.__items.length>0){
					self.__current_page=0;
					self.__show();
					self.content.style.display="block";
				}else{
					//エラー発生
					self.content.innerHTML='<p>[Error] '+result.error.code+' : '+result.error.message+'</p>';
				}
			}
		});
		
		//ページ生成
		var pager=d.createElement('div');
		pager.className='fb-notesfeed-pager';
		container.appendChild(pager);
		
		//ページ送り（前へ）
		self.prev_btn.innerHTML=self.prev_disable.innerHTML='前へ';
		self.prev_btn.style.display=self.prev_disable.style.display="none";
		pager.appendChild(self.prev_btn);
		pager.appendChild(self.prev_disable);
		self.prev_btn.onclick=function(event){
			self.__current_page--;
			self.__show();
			return false;
		}
		
		//ページ送り（次へ）
		self.next_btn.innerHTML=self.next_disable.innerHTML='次へ';
		self.next_btn.style.display=self.next_disable.style.display="none";
		pager.appendChild(self.next_btn);
		pager.appendChild(self.next_disable);
		self.next_btn.onclick=function(event){
			self.__current_page++;
			self.__show();
			return false;
		}
	}
	
	/**
	 * 表示されているページ数
	 */
	notesfeed.prototype.__current_page=0;
	
	/**
	 * 読み込まれたitemオブジェクト
	 */
	notesfeed.prototype.__items=null;
	
	/**
	 * 見出し
	 */
	notesfeed.prototype.__caption=null;
	
	/**
	 * 現在のページから記事を表示
	 */
	notesfeed.prototype.__show=function(){
		var self=this;
		
		if(self.__current_page<0){
			self.__current_page=0;
			return;
		}
		if(self.__current_page>self.__items.length-1){
			self.__current_page=self.__items.length-1;
			return;
		}
		self.prev_btn.style.display=(self.__current_page>0)?"inline":"none";
		self.prev_disable.style.display=(self.__current_page>0)?"none":"inline";
		self.next_btn.style.display=(self.__current_page<self.__items.length-1)?"inline":"none";
		self.next_disable.style.display=(self.__current_page<self.__items.length-1)?"none":"inline";
		var data=self.__items[self.__current_page];
		if(!data)return;
		//console.log(data);
		
		var obj={};
		obj.title=(data.getElementsByTagName("title")[0].firstChild)?data.getElementsByTagName("title")[0].firstChild.nodeValue:"";
		obj.link=(data.getElementsByTagName("link")[0].firstChild)?data.getElementsByTagName("link")[0].firstChild.nodeValue:"";
		obj.pubDate=(data.getElementsByTagName("pubDate")[0].firstChild)?data.getElementsByTagName("pubDate")[0].firstChild.nodeValue:"";
		obj.description=(data.getElementsByTagName("description")[0].firstChild)?data.getElementsByTagName("description")[0].firstChild.nodeValue:"";
		obj.author=(data.getElementsByTagName("author")[0].firstChild)?data.getElementsByTagName("author")[0].firstChild.nodeValue:"";
		
		//表示開始
		self.__show2(obj,true);
	};
	
	/**
	 * 指定されたデータから記事を表示
	 * @param {object} data 記事オブジェクト
	 * @param {boolean} abbreviation 真（ture）の場合、ある一定の行数を超えたら省略されます。
	 */
	notesfeed.prototype.__show2=function(data,abbreviation){
		var self=this;
		
		//タイトル
		var title=data.title;
		
		//パーマリンク
		var link=data.link;
		
		//投稿日時
		var pubDate=data.pubDate;
		
		//投稿内容
		var description=data.description;
		
		//投稿者
		var author=data.author;
		
		if(abbreviation){
			var _description=description;
			_description=_description.replace(/^<div>/,'').replace(/<\/div>$/,'');
			_description=_description.replace(/^<p>/,'').replace(/<\/p>$/,'');
			var d_temp=_description.split(/<\/p>[^<]*<p>/g);
			
			if(d_temp.length>6){
				description='<div>'+d_temp.slice(0,6).join('</p><p>')+'</div>';
			}else{
				abbreviation=false;
			}
		}else{
			abbreviation=false;
		}
		
		var uid=Math.floor(Math.random()*10000000);
		var more_id=null;
		var value='<div>';
		value+='<div class="feed_head">';
		value+='<p class="feed_title"><a href="'+link+'">'+title+'</a></p>';
		value+='<p class="feed_caption">'+self.__caption+'</p>';
		value+='</div>';
		value+='<div class="feed_description">'+description;
		if(abbreviation){
			more_id="more_"+uid;
			value+='<p>...</p>';
			value+='<p><a href="#" id="'+more_id+'">続きを読む</a></p>';
		}
		value+='</div>';
		value+='<div class="feed_info">';
		value+='<span><a href="'+link+'">'+relativeTime(pubDate)+'</a></span> | ';
		value+='<span>'+author+'</span>';
		value+='</div>';
		
		self.content.innerHTML=value;
		
		if(more_id){
			d.getElementById(more_id).onclick=function(event){
				self.__show2(data,false);
				return false;
			};
		}
	};
	
	/**
	 * 初期設定：読み込み開始
	 */
	function initialize(){
		var obj=C("fb-notesfeed");
		if(!obj)return;
		for(var e in obj){
			if(isElement(obj[e])){
				new notesfeed(obj[e]);
			}
		}
	}
	
	google.load("feeds","1");
	google.setOnLoadCallback(initialize);
})(document);
