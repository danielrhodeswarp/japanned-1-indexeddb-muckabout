var globalDb;

if(!window.indexedDB)
{
	window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
}

var idbOpenDbRequest = window.indexedDB.open('indexed-edict-5', 1);

idbOpenDbRequest.onerror = function(event)
{
	alert("Why didn't you allow my web app to use IndexedDB?!");
};

idbOpenDbRequest.onsuccess = function(event)
{
	globalDb = event.target.result;
};

// This event is only implemented in recent browsers
idbOpenDbRequest.onupgradeneeded = function(event)
{
	alert('triggering upgrade');
	//var db = event.target.result;
	globalDb = event.target.result;

	// Create an objectStore for this database
	//var objectStore = globalDb.createObjectStore("name", { keyPath: "myKey" });

	//----create object store (and fill with data)----------------

// Create an objectStore to hold information about our customers. We're
  // going to use "ssn" as our key path because it's guaranteed to be
  // unique - or at least that's what I was told during the kickoff meeting.
  
  //var objectStore = globalDb.createObjectStore("words", { keyPath:"kanji" });
  var objectStore = globalDb.createObjectStore("kanji", { autoIncrement:true });

  // Create an index to search customers by name. We may have duplicates
  // so we can't use a unique index.
  //objectStore.createIndex("kanji", "kanji", { unique: false });	//uniqueness?

  // Create an index to search customers by email. We want to ensure that
  // no two customers have the same email, so use a unique index.
  objectStore.createIndex("autocomplete", "autocomplete", { unique: false });	//uniqueness?

  //objectStore.createIndex("definition", "definition", { unique: false });	//uniqueness?

  // Use transaction oncomplete to make sure the objectStore creation is 
  // finished before adding data into it.
  objectStore.transaction.oncomplete = function(event) {
    // Store values in the newly created objectStore.
    var wordObjectStore = globalDb.transaction("kanji", "readwrite").objectStore("kanji");
    for (var index in dictionaryData) {
    	
    	//console.log('adding ' + dictionaryData[index].kanji + ' to objectStore');
      	
    	//add all autocomplete terms (which includes *self* word)
    	var terms = getAutoCompleteTerms(dictionaryData[index].kanji);
      	for(var termIndex in terms)
      	{
      		//add autocomplete term to dictionary object
      		dictionaryData[index].autocomplete = terms[termIndex];

      		console.log('adding ' + terms[termIndex] + ' to objectStore');
      		wordObjectStore.add(dictionaryData[index]);
      	}

    }

  };



var objectStore = globalDb.createObjectStore("kana", { autoIncrement:true });

  // Create an index to search customers by name. We may have duplicates
  // so we can't use a unique index.
  //objectStore.createIndex("kanji", "kanji", { unique: false });	//uniqueness?

  // Create an index to search customers by email. We want to ensure that
  // no two customers have the same email, so use a unique index.
  objectStore.createIndex("autocomplete", "autocomplete", { unique: false });	//uniqueness?

  //objectStore.createIndex("definition", "definition", { unique: false });	//uniqueness?

  // Use transaction oncomplete to make sure the objectStore creation is 
  // finished before adding data into it.
  objectStore.transaction.oncomplete = function(event) {
    // Store values in the newly created objectStore.
    var wordObjectStore = globalDb.transaction("kana", "readwrite").objectStore("kana");
    for (var index in dictionaryData) {
    	
    	//console.log('adding ' + dictionaryData[index].kanji + ' to objectStore');
      	
    	//add all autocomplete terms (which includes *self* word)
    	var terms = getAutoCompleteTerms(dictionaryData[index].kana);
      	for(var termIndex in terms)
      	{
      		//add autocomplete term to dictionary object
      		dictionaryData[index].autocomplete = terms[termIndex];

      		console.log('adding ' + terms[termIndex] + ' to objectStore');
      		wordObjectStore.add(dictionaryData[index]);
      	}

    }

  };



//----/end create object store (and fill with data)----------------
};

/*
globalDb.onerror = function(event)
{
	// Generic error handler for all errors targeted at this database's
	// requests!
	alert("Database error: " + event.target.errorCode);
};
*/


console.log(globalDb);







//get a specific key from the objectStore
/*
function doSearch()
{
	var term = document.getElementById('idb-search-term').value;

	globalDb.transaction("words").objectStore("words").get(term).onsuccess = function(event) {
		//alert("result for " + term + " is: " + event.target.result.definition);
		console.log(event.target.result);
	};
}
*/

//get a specific index from the objectStore
function doSearch()
{
	var term = document.getElementById('idb-search-term').value;

	var index = globalDb.transaction("words").objectStore("words").index("kana");

	index.get(term).onsuccess = function(event) {
		//alert("result for " + term + " is: " + event.target.result.definition);
		console.log(event.target.result);
	};
}

function doSearchKanji()
{
	var term = document.getElementById('idb-search-term').value;

	var index = globalDb.transaction("kanji").objectStore("kanji").index("autocomplete");

	index.get(term).onsuccess = function(event) {
		//alert("result for " + term + " is: " + event.target.result.definition);
		console.log(event.target.result);
	};
}

function doSearchKana()
{
	var term = document.getElementById('idb-search-term').value;

	var index = globalDb.transaction("kana").objectStore("kana").index("autocomplete");

	index.get(term).onsuccess = function(event) {
		//alert("result for " + term + " is: " + event.target.result.definition);
		console.log(event.target.result);
	};
}

function doRefresh()
{
	var listDiv = document.getElementById('idb-contents');
	listDiv.innerHTML = '';

	var objectStore = globalDb.transaction("words").objectStore("words");

	objectStore.openCursor().onsuccess = function(event) {
	  var cursor = event.target.result;
	  if (cursor) {
	    //alert("Name for SSN " + cursor.key + " is " + cursor.value.name);
	    console.log(cursor.value);
	    listDiv.innerHTML += cursor.value.kanji + ', ' + cursor.value.kana + ', ' + cursor.value.definition;
	    listDiv.innerHTML += "<br><br>";
	    cursor.continue();
	  }
	  else {
	    console.log("No more entries!");
	  }
	};
}



function doGetChars()
{
	var input = document.getElementById('idb-search-term').value;

	console.log(getCharsInWord(input));
}

function doGetWords()
{
	var input = document.getElementById('idb-search-term').value;

	console.log(getWordsInSentence(input));
}

function doIsSentence()
{
	var input = document.getElementById('idb-search-term').value;

	console.log(stringIsSentence(input));
}