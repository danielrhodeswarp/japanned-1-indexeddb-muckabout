
function getCharsInWord(word)
{
	return word.split('');
}

function getAutoCompleteTerms(singleWord)
{
	var terms = [];
	var charsInWord = getCharsInWord(singleWord);


	//stick each subsequent char to all the previous ones

	for(var loop = 0; loop < charsInWord.length; loop++)
	{
		var thisTerm = charsInWord.slice(0, loop + 1).join('');

		terms.push(thisTerm);
	}

	return terms;
}

//split on one or more whitespace chars
function getWordsInSentence(sentence)
{
	return sentence.split(new RegExp(/\s+/, 'i'));
}

//check for non-whitespace,whitespace,non-whitespace
function stringIsSentence(string)
{
	//return string.search(new RegExp(/\S+\s+\S+/, 'i')) !== -1;
	//return string.test(new RegExp(/\S+\s+\S+/, 'i'));	//nope
	return new RegExp(/\S+\s+\S+/, 'i').test(string);

}

function trim(string)
{

}