
var TodoItem = function(title, note, project, due_date, priority, complete) {
    this.id = TodoItem.generateId();
    this.title = title;
    this.note = note;
    this.project = project;
    this.due_date = due_date;
    this.priority = priority;
    this.complete = complete;
    
    TodoItem.all.push(this);
    printItem(this);
};

TodoItem.all = new Array();

TodoItem.last_id = 0;

TodoItem.generateId = function () {
    TodoItem.last_id += 1 + Math.floor(Math.random()*10);
    return TodoItem.last_id;
};

TodoItem.generate = function() {
    var project_names = ["COMP 416", "COMP 426", "Scalable Display", "Telepresence", "Graduate Admissions"];
    var title_part1 = ["Write", "Consider", "Develop", "Assess", "Delete", "Read"];
    var title_part2 = ["preliminary", "primary", "secondary", "penultimate", "backup", "final"];
    var title_part3 = ["report", "proposal", "plan", "manual", "book", "article"];
    var title_part4 = ["notes", "outline", "index", "table of contents", "references", "footnotes"];

	for(var i=0; i<100; i++) {
		var title = title_part1[Math.floor(6*Math.random())] + " " +
            title_part2[Math.floor(6*Math.random())] + " " +
            title_part3[Math.floor(6*Math.random())] + " " +
            title_part4[Math.floor(6*Math.random())] + ".";
		var project = project_names[Math.floor(5*Math.random())];
		var complete = false;
		
		if (Math.random() < 0.10) {
	    	complete = true;
		}
		
		var note = "This is a note for item id " + title + ". The rest of this text is";
		note += " here just to make it a little longer. I thought about creating a ";
		note += "note generator, but then got tired.";

		var due_date = null;
		var now = new Date();
		var rnd = Math.random();
		if (rnd < 0.25) {
	    	due_date = now;
	    	due_date.setDate(due_date.getDate()-(Math.floor(Math.random()*10)+1));
		} else if (rnd < 0.75) {
	    	due_date = now;
	    	due_date.setDate(due_date.getDate()+(Math.floor(Math.random()*200)+1));
		}
	
		var priority = (Math.floor(Math.random()*10)+1);
		new TodoItem(title, note, project, due_date, priority, complete);
	}
};
