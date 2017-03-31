 //FYI this is how Japxlate searches:
 /*
 * There are two search routes based on if the search term is in Japanese
 * or English.
 * If English then we try the following match priorities (stopping
 * when we get at least one match):
 * [1] term matches an edict definition fragment EXACTLY
 * [2] term is included in an edict definition fragment
 * [3] term assumed to be romaji, converted to hiragana, matches exactly an
 *     edict "kana" field entry
 * If Japanese then:
 * [1] term matches an edict "kanji" field entry EXACTLY
 * [2] term matches an edict "kana" field entry EXACTLY
 */

//string could be one or more words
function getInputType(string)
{
	return 'kanji';	//FTTB (might not need such drastic input detection)
}

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