



function testAll()
{
	var results = {};

	//algo / function testing
	//results.stringIsSentence = testStringIsSentence();
	//results.getWordsInSentence = testGetWordsInSentence();
	//results.getAutoCompleteTerms = testGetAutoCompleteTerms();
	//results.getCharsInWord = testGetCharsInWord();
	results.hiroka_is_mb = testHirokaIsMb();


	//results.inputDetection = testInputDetection();

	results.searchByKana = testSearchByKana();
	results.searchByKanji = testSearchByKanji();


	return results;
}

function testHirokaIsMb(detailedReturn)
{
	//allow nothing to be passed in (as well as false) for detailedReturn
	if(typeof detailedReturn == 'undefined')
	{
		detailedReturn = false;
	}

	var results = [];

	var inputs = [
		//----kanji (or at least zenkaku)
		'漢数字ゼロ',	//kanji with katakana
		'ＲＳ２３２ケーブル',	//zenkaku alpha with katakana
		'明かん',	//kanji with hiragana
		'馬酔木',	//kanji
		//----kana
		'きゅうきゅう',	//hiragana
		'ギスギス',	//katakana
		'ぎゃくセクハラ',	//hira and kata
		//----alpha
		'nihongo',	//romaji
		'money',	//english
		'laser beam'	//sentence

	];

	var expectations = [
		true,
		true,
		true,
		true,
		true,
		true,
		true,
		false,
		false,
		false,
		
	];

	var allPassed = true;
	//loop through and test each input against expectation
	for(var loop = 0; loop < inputs.length; loop++)
	{
		var result = is_mb(inputs[loop]);

		var passed = true;
		if(result != expectations[loop])
		{
			passed = false;
		}

		if(!passed)
		{
			allPassed = false;
		}

		results.push({input:inputs[loop], expectation:expectations[loop], result:result, passed:passed});
	}

	if(detailedReturn)
	{
		return results;
	}

	else
	{
		return allPassed;
	}
}

function testStringIsSentence()
{
	return true;
}

function testGetWordsInSentence()
{
	return true;
}

function testGetAutoCompleteTerms()
{
	return true;
}

//not working due to array equality checking woes
function testGetCharsInWord(detailedReturn)
{
	//allow nothing to be passed in (as well as false) for detailedReturn
	if(typeof detailedReturn == 'undefined')
	{
		detailedReturn = false;
	}

	var results = [];

	var inputs = [
		//----kanji (or at least zenkaku)
		'漢数字ゼロ',	//kanji with katakana
		'ＲＳ２３２ケーブル',	//zenkaku alpha with katakana
		'明かん',	//kanji with hiragana
		'馬酔木',	//kanji
		//----kana
		'きゅうきゅう',	//hiragana
		'ギスギス',	//katakana
		'ぎゃくセクハラ',	//hira and kata
		//----alpha
		'nihongo',	//romaji
		'money',	//english
		'laser beam'	//sentence

	];

	var expectations = [
		['漢','数','字','ゼ','ロ'],
		['Ｒ','Ｓ','２','３','２','ケ','ー','ブ','ル'],
		['明','か','ん'],
		['馬','酔','木'],
		['き','ゅ','う','き','ゅ','う'],
		['ギ','ス','ギ','ス'],
		['ぎ','ゃ','く','セ','ク','ハ','ラ'],
		['n','i','h','o','n','g','o'],
		['m','o','n','e','y'],
		['l','a','s','e','r',' ','b','e','a','m']
		
	];

	var allPassed = true;
	//loop through and test each input against expectation
	for(var loop = 0; loop < inputs.length; loop++)
	{
		var result = getCharsInWord(inputs[loop]);

		var passed = false;
		if(result === expectations[loop])
		{
			passed = true;
			console.log('match');
		}

		if(!passed)
		{
			allPassed = false;
		}

		results.push({input:inputs[loop], expectation:expectations[loop], result:result, passed:passed});
	}

	if(detailedReturn)
	{
		return results;
	}

	else
	{
		return allPassed;
	}
}


function testInputDetection()
{
	return true;	//FTTB (might not need such drastic input detection)

	var results = [];

	var inputs = [
		//----kanji (or at least zenkaku)
		'漢数字ゼロ',	//kanji with katakana
		'ＲＳ２３２ケーブル',	//zenkaku alpha with katakana
		'明かん',	//kanji with hiragana
		'馬酔木',	//kanji
		//----kana
		'きゅうきゅう',	//hiragana
		'ギスギス',	//katakana
		'ぎゃくセクハラ',	//hira and kata
		//----alpha
		'nihongo',	//romaji
		'money',	//english
		'laser beam'	//sentence

	];

	var expectations = [
		'kanji',
		'kanji',
		'kanji',
		'kanji',
		'kana',
		'kana',
		'kana',
		'alpha',
		'alpha',
		'alpha',
		
	];

	//loop through and test each input against expectation
	for(var loop = 0; loop < inputs.length; loop++)
	{
		var result = getInputType(inputs[loop]);

		var passed = true;
		if(result != expectation[loop])
		{
			passed = false;
		}

		results.push({input:inputs[loop], expectation:expectations[loop], result:result, passed:passed});
	}

	return results;
}


function testSearchByKana()
{
	return false;

}






function testSearchByKanji()
{
	return false;
}