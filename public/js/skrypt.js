/*jshint jquery: true, devel: true, esnext: true */
$(function () {
    
    let $size  = $('#size'),
        $dim   = $('#dim'),
        $max   = $('#max'),
        $ruchy = $('#ruchy'),
        $wynik = $('#wynik');
    
    $('#graj').click(() => 
    {        
        $.get('./play/size/'+$size.val()+'/dim/'+$dim.val()+'/' + ( $max.val()>0? 'max/'+ $max.val()+'/' : ''), () => {
            
            $ruchy.empty(); 
            $wynik.empty();
            
            let $table = $('<table border="1">');
            let $tr = $('<tr>').appendTo($table);
            for(let i=0; i < $size.val() ; i++)
                $tr.append('<td><input class="mark" type="number" value="0" min="0" max="'+$dim.val()+'" /></td>');
            
            $tr.append('<td><input id="zgadnij" value="zgadnij" type="button"/></td>');
            
            $ruchy.append($table);
            $ruchy.append('<p id="liczbaRuchow"> liczba ruchow: ' + ($max.val() >0? $max.val(): "nieskonczonosc"));
        });
        
        
    });
    
    $ruchy.on('click', '#zgadnij', () => {
        
        let marks = '';
        $('.mark').toArray().forEach((e) => {
            marks += e.value + '/';
        });
        $.get('./mark/'+marks, (response) => {
            
            let movesToEnd = response.retVal.movesToEnd,
                blackCount = response.retVal.blackCount,
                whiteCount = response.retVal.whiteCount, 
                $zgadnij   = $('#zgadnij');
            

            $wynik.empty();
            $wynik.append('<p> liczba trafionych czarnych: '+ blackCount);
            $wynik.append('<p> liczba trafionych białych: '+ whiteCount);
            if(movesToEnd != undefined)
                $('#liczbaRuchow').text('liczba ruchow: ' + movesToEnd);

            if(blackCount == $size.val() || movesToEnd == 0) {
                $zgadnij.unbind('click');
                $zgadnij.attr('disabled', 'true');
                if(blackCount == $size.val())
                    $wynik.append('<p> Koniec Gry! Wygrales!');
                else
                    $wynik.append('<p> Koniec Gry! Przegrales!')
            }
 
        });
    });
});
