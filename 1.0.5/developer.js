function dartMainRunner(main){
    main();
	var listClients,selectProvider,clientForm, createClient, deleteClient;
	selectProvider=function(providers,parent){
		var i,j,option,selects;
		if(parent){
			selects=window.WS.queryAll('select[name="provider"]',parent);			
		}else{
			selects=window.WS.queryAll('select[name="provider"]');			
		}

		for(j=0;j<selects.length;j++){
			for(i=0;i<providers.length;i++){
				option=document.createElement("option");
				option.text=providers[i].name;
				option.value=providers[i].key;
				selects[j].appendChild(option);
				if(providers[i].key==selects[j].getAttribute("data-value")){
					option.selected=true;
				}
			}	
		}			
	};
	createClient=function(client,load){
        //json content-type is required for ws reclisource post
		window.WS.ajax("/api/core/clients", {
			"method" : "POST",
			"data":client,
			"headers":{
				"Content-Type":"application/json"
			}
		}, load);			
	};
	deleteClient=function(clientKey,load){
		window.WS.ajax("/api/core/clients/"+clientKey, {
			"method" : "DELETE"
		}, load);				
	};
	listClients=function(providers){
		window.WS.ajax("/api/core/clients", {
			"method" : "GET",
			"data":{"owner":window.getUser().key}
		}, function(req) {
			window.WS.hideMessage();
			var ul,clients,i,html,li;
			clients = JSON.parse(req.responseText);
			ul=window.WS.query('ul.clients');
			var addClient=function(client){
				li=document.createElement("li");
				html ="<div><span class='label'>Key:</span><span>"+client.key+"</span></div>";
				html+="<div><span class='label'>Provider:</span><select name='provider' data-value="+client.provider+"></select></div>";			
				html+="<div><span class='label'>Client ID:</span><span>"+client.clientId+"</span></div>";
				html+="<div><span class='label'>Client Secret:</span><span>***********</span></div>";
				html+="<div><span class='label'>Redirection Endpoint:</span><span>"+client.redirectionEndpoint+"</span></div>";					
				html+="<div><span class='label'>Domains:</span><span>"+client.domains+"</span></div>";				
				html+="<div><span class='label'>Description:</span><span>"+client.description+"</span></div>";
				html+="<div><span class='label'>Updated At:</span><span>"+new Date(client.updatedAt)+"</span></div>";
				html+="<div><span class='label'>BatchedAt:</span><span>"+new Date(client.batchedAt)+"</span></div>";
				html+="<div><span class='label'>CreatedAt:</span><span>"+new Date(client.createdAt)+"</span></div>";
				html+="<br/><a class='button delete' data-key='"+client.key+"'><span>Delete</span></a>";
				li.innerHTML=html;
				ul.appendChild(li);
			};
			for(i=0;i<clients.length;i++){
				addClient(clients[i]);
			}
			selectProvider(providers,ul);
			window.WS.query('a.button.delete',ul).addEventListener('click',function(event){
				deleteClient(this.getAttribute("data-key"),function(req){
					location.reload();
				});
			},false);			
		});				
	};
	
	window.WS.ajax("/api/core/providers", {
		"method" : "GET"
	}, function(req) {
		var providers;
		providers = JSON.parse(req.responseText);
		selectProvider(providers);
		listClients(providers);
	});	
	clientForm=window.WS.query("form.client");

	window.WS.query('a.button.create',clientForm).addEventListener('click',function(event){
		var data=window.form2js(clientForm);
		createClient(data,function(req){
			location.reload();
		});
	},false);
}