var globalDb;

if(!window.indexedDB)
{
	window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
}

var idbOpenDbRequest = window.indexedDB.open('japanned-raw', 1);



idbOpenDbRequest.onerror = function(event)
{
	alert("Why didn't you allow my web app to use IndexedDB?!");
};

idbOpenDbRequest.onsuccess = function(event)
{
	globalDb = event.target.result;

  /*
  globalDb.onerror = function(event) {
    // Generic error handler for all errors targeted at this database's
    // requests!
    alert("Database error: " + event.target.errorCode);
  };
  */
};

idbOpenDbRequest.onblocked = function(event)
{
  alert('database blocked');
};

// This event is only implemented in recent browsers
idbOpenDbRequest.onupgradeneeded = function(event)
{
	alert('TRIGGERING DATABASE CREATION / UPGRADE');
	//var db = event.target.result;
	globalDb = event.target.result;

	// Create an objectStore for this database
	//var objectStore = globalDb.createObjectStore("name", { keyPath: "myKey" });


  //delete pre-existing object stores (catching an exception for initial creation)
  try
  {
    globalDb.deleteObjectStore('kanji');
    globalDb.deleteObjectStore('kana');
  }

  catch(exception)
  {
    //NOP
    alert(exception);
  }
  //globalDb.deleteObjectStore('kana');

	//----create object store (and fill with data)----------------


  
  
  
  




var kanaObjectStore = globalDb.createObjectStore("kana", { autoIncrement:true });

  // Create an index to search customers by name. We may have duplicates
  // so we can't use a unique index.
  //objectStore.createIndex("kanji", "kanji", { unique: false });	//uniqueness?

  // Create an index to search customers by email. We want to ensure that
  // no two customers have the same email, so use a unique index.
  kanaObjectStore.createIndex("autocomplete", "autocomplete", { unique: false });	//uniqueness?

  //objectStore.createIndex("definition", "definition", { unique: false });	//uniqueness?

  // Use transaction oncomplete to make sure the objectStore creation is 
  // finished before adding data into it.
  kanaObjectStore.transaction.oncomplete = function(event) {
    // Store values in the newly created objectStore.
    var wordObjectStore = globalDb.transaction("kana", "readwrite").objectStore("kana");
    for (var index in testDictionaryData) {
    	
    	//console.log('adding ' + dictionaryData[index].kanji + ' to objectStore');
      	
    	//add all autocomplete terms (which includes *self* word)
    	var terms = getAutoCompleteTerms(testDictionaryData[index].kana);
      	for(var termIndex in terms)
      	{
      		//add autocomplete term to dictionary object (?)
      		testDictionaryData[index].autocomplete = terms[termIndex];

      		console.log('adding ' + terms[termIndex] + ' to kana objectStore');
      		var objectStoreRequest = wordObjectStore.add(testDictionaryData[index]);

          objectStoreRequest.onsuccess = function(event) {
            // report the success of our new item going into the database
            //note.innerHTML += '<li>New item added to database.</li>';
            console.log('objectStore.add() OK');
          };
      	}

    }

  };
  


  //var objectStore = globalDb.createObjectStore("words", { keyPath:"kanji" });
  var kanjiObjectStore = globalDb.createObjectStore("kanji", { autoIncrement:true }/*{keyPath:"autocomplete"}*/);

  // Create an index to search customers by name. We may have duplicates
  // so we can't use a unique index.
  //objectStore.createIndex("kanji", "kanji", { unique: false }); //uniqueness?

  // Create an index to search customers by email. We want to ensure that
  // no two customers have the same email, so use a unique index.
  kanjiObjectStore.createIndex("autocomplete", "autocomplete", { unique: false }); //uniqueness?

  //objectStore.createIndex("definition", "definition", { unique: false }); //uniqueness?

  // Use transaction oncomplete to make sure the objectStore creation is 
  // finished before adding data into it.
  kanjiObjectStore.transaction.oncomplete = function(event) {
    // Store values in the newly created objectStore.
    var wordObjectStore = globalDb.transaction("kanji", "readwrite").objectStore("kanji");
    //console.log(dictionaryData);
    for (var index in testDictionaryData) {
      
      //console.log('adding ' + dictionaryData[index].kanji + ' to objectStore');
        
      //add all autocomplete terms (which includes *self* word)
      var terms = getAutoCompleteTerms(testDictionaryData[index].kanji);
      //console.log(terms);
        for(var termIndex in terms)
        {
          //add autocomplete term to dictionary object
          testDictionaryData[index].autocomplete = terms[termIndex];

          console.log('adding ' + terms[termIndex] + ' to kanji objectStore');
          var objectStoreRequest = wordObjectStore.add(testDictionaryData[index]);

          objectStoreRequest.onsuccess = function(event) {
            // report the success of our new item going into the database
            //note.innerHTML += '<li>New item added to database.</li>';
            console.log('objectStore.add() OK');
          };
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

function doSearchKanji_WORKS_BUT_ONLY_RETURNS_A_SINGLE_MATCH()
{
	var term = document.getElementById('idb-search-term').value;

	var index = globalDb.transaction("kanji").objectStore("kanji").index("autocomplete");

	index.get(term).onsuccess = function(event) {
		//alert("result for " + term + " is: " + event.target.result.definition);
		console.log(event.target.result);
	};
}

function doSearchKanji()
{
  var term = document.getElementById('idb-search-term').value;

  var index = globalDb.transaction("kanji").objectStore("kanji").index("autocomplete");

  /*
  index.get(term).onsuccess = function(event) {
    //alert("result for " + term + " is: " + event.target.result.definition);
    console.log(event.target.result);
  };
  */
 
  var otherResults = [];
  var exactResults = [];

   // Only match *term*
  var singleKeyRange = IDBKeyRange.only(term);

    index.openCursor(singleKeyRange).onsuccess = function(event) {
      var cursor = event.target.result;
      if (cursor) {
        console.log(cursor.value);
        
        /*

        if(cursor.value.kanji == term)
        {
          exactResults.push(cursor.value);
        }
        else
        {
          otherResults.push(cursor.value);
        }
        */

        cursor.continue();
      }
    };

    //console.log(exactResults);
    //console.log(otherResults);
  
  /*  
otherResults.forEach(function(item, index, array) {
  console.log(item, index);
});
*/
    
    //console.log(exactResults.concat(otherResults)); //nope, this not work with an array of *objects*
    //displayResults(exactResults);
}

function doSearchKana_WORKS_BUT_ONLY_RETURNS_A_SINGLE_MATCH()
{
	var term = document.getElementById('idb-search-term').value;

	var index = globalDb.transaction("kana").objectStore("kana").index("autocomplete");

	index.get(term).onsuccess = function(event) {
		//alert("result for " + term + " is: " + event.target.result.definition);
		console.log(event.target.result);
	};
}

function doSearchKana()
{
  var term = document.getElementById('idb-search-term').value;

  var index = globalDb.transaction("kana").objectStore("kana").index("autocomplete");

  /*
  index.get(term).onsuccess = function(event) {
    //alert("result for " + term + " is: " + event.target.result.definition);
    console.log(event.target.result);
  };
  */
 
 // Only match *term*
var singleKeyRange = IDBKeyRange.only(term);

  index.openCursor(singleKeyRange).onsuccess = function(event) {
    var cursor = event.target.result;
    if (cursor) {
      console.log(cursor.value);
      cursor.continue();
    }
  };
}

//nope, this not happy (summat to do with the passed results not being a proper array ?!?!?!?!? [length is always 0])
function displayResults(results)
{
  //exact first, then other
  var listDiv = document.getElementById('idb-contents');
  listDiv.innerHTML = '';
console.log(results);
console.log(results.length);


results.forEach(function(item, index, array) {
  console.log(item, index);
});

  
  //for(var loop = 0; loop < results.length; loop++)  //why this not work?
  for(var index in results)
  {
    listDiv.innerHTML += results[index].kanji + ', ' + results[index].kana + ', ' + results[index].definition;
      listDiv.innerHTML += "<br><br>";
  }

  
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