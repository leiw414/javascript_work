/*************************************
 Lei Wang 
**************************************/
$(document).ready(function() {
    
	TodoItem.generate();
	$('#sort').on('change', sortList);
	$('#check-complete').on('change', showComplete);
});

//list TodoItems
var printItem = function(item){

	var finish ='';
	var dueDate = '';
	var collapse = $('<div class="collapse"></div>');
    var expand = $('<div class="expand hidden"></div>');
    var Edit = $('<div class="edit hidden"></div>');
	
	//test whether the todoitem is completed
    if(item.complete){
		finish="complete";
    	collapse.addClass('completed');
    	expand.addClass('completed');
    }
	else finish='not completed';
	
	//test whether the todoitem is overdue
    if(item.due_date!=null){
    	dueDate = item.due_date;
    	if(dueDate< new Date().getTime()){
			collapse.addClass("overdue");	
			expand.addClass("overdue");
		}
    }
	
	//append collapse appearance in #list
    collapse.attr('id',item.id+'collapse');
    collapse.append('<li><a onclick="expand('+item.id+')" ><span class="title">'+item.title+'</span></a></li>');
	$('#list').prepend(collapse);
	
	//append expand appearance in #list(hidden)
    expand.attr('id',item.id+'expand');
    expand.append('<a onclick="collapse('+item.id+')"><h3> '+ item.title + '</h3></a><strong> Item ID:</strong>' + item.id+ '<br> <strong> Project: </strong>' + item.project+'<br> <strong> Due Date: </strong>' + dueDate +'<br> <strong> Priority: </strong>' + item.priority + '<br> <strong> Complete: </strong>'+ finish + ' <br> <strong> Note: </strong>' + item.note + '<br>');
    expand.append('<button type="button" onclick="Edit('+item.id+')">Edit</button>');
	expand.append('<button type="button" onclick="collapse('+item.id+')">Collapse</button>');
     $('#list').prepend(expand);
	 
	//append edit appearance in #list(hidden)
    Edit.attr('id',item.id+'edit');
	if(item.due_date!=null){
       due_date = item.due_date.toISOString().substring(0,19);
	 }
	else{
		due_date="";
	}
    Edit.append('<h3> <strong> ID: </strong>'+ item.id + '</h3><form> Title: <input name="title" type="text" value="'+ item.title +'"><br> Project: <input name="project" type="text" value="'+ item.project +'"> <br> Due Date: <input name="due" type="datetime-local" value="'+ due_date +'"> <br> Priority: <input name="priority" type="number" min="1" max="10" value="' + item.priority+'"><br> Complete: <input id="complete" name="complete" type="checkbox" '+isChecked(item)+'><br> Notes: <br> <textarea name="notes" rows="5" columns="35" >'+item.note+'</textarea> </form> ');
    Edit.append('<button type="button" onclick="updateItem('+item.id+')">Save</button>');
    Edit.append('<button type="button" onclick="expand('+item.id+')">Cancel</button>');
	$('#list').prepend(Edit);
    
    
}

// to test if the todoitem is completed
var isChecked= function(item){
	if(item.complete){
		return 'checked';
	}
	return '';
}

//expand the todoitem
var expand = function(id){

	$("#"+id+"collapse").addClass('hidden');
	$("#"+id+"expand").removeClass('hidden');
	$("#"+id+"edit").addClass('hidden');
}

//edit the todoitem
var Edit = function(id){

	$("#"+id+"collapse").addClass('hidden');
	$("#"+id+"expand").addClass('hidden');
	$("#"+id+"edit").removeClass('hidden');
}

//collapse the todoitem
var collapse = function(id){
	
	$("#"+id+"collapse").removeClass('hidden');
	$("#"+id+"expand").addClass('hidden');
	$("#"+id+"edit").addClass('hidden');
}

//find item that need to update
var findItem = function(id){
	for(var i=0;i<TodoItem.all.length;i++){
		if(TodoItem.all[i].id==id){
			return TodoItem.all[i];
		}
	}
}

//update the todoitem
var updateItem = function(id){
	var thisItem = findItem(id);
	var item = $("#"+id+'edit');
	thisItem.title = item.find('[name="title"]').val();
	thisItem.note = item.find('[name="notes"]').val();
	thisItem.priority = item.find('[name="priority"]').val();
	thisItem.project = item.find('[name="project"]').val();
	thisItem.complete = item.find('[name="complete"]').is(':checked');
	refreshItems();
	expand(id);
}

// The create function will be called when users click Todo button
var createItem = function(){
	if($("#new").length==0){
		var create = $("<div id='new'></div>");
		create.append('<form> Title: <input name="title" type="text"><br> Project: <input name="project" type="text"> <br> Due Date: <input name="due" type="datetime-local"><br> Priority: <input name="priority" type="number" min="1" max="10" value="1"><br> Complete: <input name="complete" type="checkbox"><br> Notes: <br> <textarea name="notes" rows="5" columns="75" ></textarea> </form>');
		create.append('<button type="button" onclick="pushItem()">Save</button>');
		create.append('<button type="button" onclick="$(\'#new\').remove();">Cancel</button>');
		$("#list").prepend(create);
	}
}
// Create a TodoItem 
var pushItem = function(){

	var create = $("#new");
	var title = create.find('[name="title"]').val();
	var note = create.find('[name=notes]').val();
	var due_date = create.find('[name="due"]').val();
	var priority = create.find('[name="priority"]').val();
	var project = create.find('[name="project"]').val();
	var complete = create.find('[name="complete"]').is(':checked');
	
	var Item = new TodoItem(title, note, project, new Date(), priority, complete);//how to convert it to string and then convert to datetime-local formart?
	create.remove();
	expand(Item.id);
	
}

// Sort functions 
var sortList = function(e) {
	if($('#sort').val() == "TITLE"){
		TodoItem.all.sort(function(a,b){
			var y = a.title.toLowerCase();
			var x = b.title.toLowerCase();
			return x < y ? -1 : x > y ? 1 : 0;
		   });
	};
	
	if($('#sort').val() == "PROJECT"){
		TodoItem.all.sort(function(a,b){
			var y = a.project.toLowerCase();
			var x = b.project.toLowerCase();
		return x < y ? -1 : x > y ? 1 : 0;
		});
	};
	
	if($('#sort').val() == "PRIORITY"){
		TodoItem.all.sort(function(a,b){
		return a.priority-b.priority
		});
	};
	
	if($('#sort').val() == "DUEDATE") {
		TodoItem.all.sort(function(a,b){
			var y = a.due_date;
			var x = b.due_date;
			if(x==null && y==null){
				return 0;
			}
			else if(x==null){
				return 1;
			}
			else if(y==null){
				return -1;
			}
			return x < y ? -1 : x > y ? 1 : 0;
		});
	};
	
	refreshItems();
};

//print items if something changed
var refreshItems = function(){
	
	$('#list').empty();
	for(var i=0;i<TodoItem.all.length;i++){
		printItem(TodoItem.all[i]);
	}
}

//hide/show completed Todoitems
var showComplete = function(e) {
	if($('#check-complete').is(':checked')){
		$(" .completed").each(function(){
			$(this).removeClass("hidden");
			});
	} 
	else {
		$(" .completed").each(function(){
			$(this).addClass("hidden");	
		});
	}
};


