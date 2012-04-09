function render(path){
    var $wordmorph = $("#wordmorph");
    $wordmorph.empty();
    var $word_base = $("#wordmorph-word");
    var i, path_len = path.length;
    var timeouts = [];

    function animate_word($word){
        $word.animate({opacity: 1.0}, 800);
    }

    function render_word(this_word, last_word){
        var $word = $word_base.clone();
        var pos_diff = diff_pos(this_word, last_word);
        var word_str;

        if (pos_diff === false)
            word_str = this_word;
        else
            word_str = this_word.slice(0,pos_diff) +
                "<strong class='changed-letter'>"+this_word[pos_diff]+"</strong>" +
                this_word.slice(pos_diff+1, this_word.length);
        $word.html(word_str);
        $wordmorph.append($word);
        timeouts[timeouts.length] = setTimeout(animate_word, i*500, $word);
    }

    render_word(path[0], path[0]);

    for (i=1; i<path_len; i++){
        render_word(path[i], path[i-1])
    }
}

function get_path(start_word, end_word){
    $.ajax({
        type: "GET",
        url: "/wordmorph/get_path",
        data: {start_word: start_word,
               end_word: end_word},
        dataType: "json",
        success: function(json){
            if (json.status == "success")
                render(json.path);
        }
    });
    //return ['art', 'ant', 'and', 'end'];
}

function diff_pos(word1, word2){
    var i, word_len = word1.length;
    for (i=0; i<word_len; i++)
        if (word1[i] != word2[i])
            return i;
    return false;
}

$(document).ready(function(){
    $("#start-button").click(function(){
        var start_word = $("#start-word").val();
        var end_word = $("#end-word").val();
        get_path(start_word, end_word);
    });
});