function render(){
    var $wordmorph = $("#wordmorph");
    var $words = $wordmorph.find(".wordmorph-word");
    var word_height = $words.eq(0).height();
    var timeouts = [];

    var dur = 900;

    function animate_word($word, i){
        $word.animate({
            opacity: 1.0
        }, {duration: dur, queue: false, complete: function(){
                $words.slice(i+1).animate({
                    top: (i+1)*word_height+"px"
                },dur);
        }});
    }

    $wordmorph.find(".wordmorph-word").each(function(i){
        timeouts[timeouts.length] = setTimeout(animate_word, i*dur, $(this), i);
        i++;
    });
}

function diff_pos(word1, word2){
    var i, word_len = word1.length;
    for (i=0; i<word_len; i++)
        if (word1[i] != word2[i])
            return i;
    return false;
}

$(document).ready(function(){
    render();
});