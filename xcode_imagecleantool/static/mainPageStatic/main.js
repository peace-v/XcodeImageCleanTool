'use strict';

$(document).ready(function() {
    $('#project-path').focus();

    $('.image').height($('.image').width());

    $('#search-repeat-images').on('click', function() {
        $('.search-results').remove()
        $('.searching').css('display', 'block');
        var projectPath = $('#project-path').val();
        var imagePath = $('#image-path').val();
        var ignorePaths = $('#ignore-path').val();
        $.get('/searchRepeatImages',{projectPath:projectPath, imagePath:imagePath, ignorePaths:ignorePaths})
        .success(function() {
            window.location.reload();
         })
        .error(function(error) {
            $('.searching').css('display', 'none');
            alert(error.responseJSON.message);
         })
        .complete(function() {
            $('.searching').css('display', 'none');
         });
    });

    $('#search-similar-images').on('click', function() {
        $('.search-results').remove()
        $('.searching').css('display', 'block');
        var projectPath = $('#project-path').val();
        var imagePath = $('#image-path').val();
        var ignorePaths = $('#ignore-path').val();
        $.get('/searchSimilarImages',{projectPath:projectPath, imagePath:imagePath, ignorePaths:ignorePaths})
        .success(function() {
            window.location.reload();
         })
        .error(function(error) {
            $('.searching').css('display', 'none');
            alert(error.responseJSON.message);
         })
        .complete(function() {
            $('.searching').css('display', 'none');
         });
    });

    $('#search-unused-images').on('click', function() {
        $('.search-results').remove()
        $('.searching').css('display', 'block');
        var projectPath = $('#project-path').val();
        var imagePath = $('#image-path').val();
        var ignorePaths = $('#ignore-path').val();
        $.get('/searchUnusedImages',{projectPath:projectPath, imagePath:imagePath, ignorePaths:ignorePaths})
        .success(function() {
            window.location.reload();
         })
        .error(function(error) {
            $('.searching').css('display', 'none');
            alert(error.responseJSON.message);
         })
        .complete(function() {
            $('.searching').css('display', 'none');
         });
    });

    $('#choose-all').on('click', function() {
        var title = $('#choose-all').text();
        if (title == '全选') {
            $.each($('input[name=cbx]'), function(i) {
                $(this).prop('checked',true);
            });
            $('#choose-all').text('取消全选');
        } else {
            $.each($('input[name=cbx]'), function(i) {
                $(this).removeAttr('checked', false);
            });
            $('#choose-all').text('全选');
        }
    });

    $('#delete').on('click', function() {
        var index = new Array();
        $.each($('input[name=cbx]'), function(i) {
                if($(this).is(':checked')) {
                    index.push($(this).attr('id'));
                }
            });
        $.post('/deleteImages',{index:index})
        .success(function(data) {
            alert(data);
            window.location.reload();
         })
        .error(function(error) {
            alert(error.responseJSON.message);
         })
        .complete(function() {
         });
    });

    $('#export').on('click', function() {
        var results = '';
        $('li').each(function(){
            results = results + $(this).text() + '\n';
        });
        $.get('/export',{results:results})
        .success(function() {
         })
        .error(function(error) {
            alert(error.responseJSON.message);
         })
        .complete(function() {
         });
    });

    $(function(){
        $('a').click(function(){
            openFile($(this).text());
        });
    });

    function openFile(path) {
        $.get('/openFile',{path:path})
        .success(function() {
         })
        .error(function(error) {
            alert(error.responseJSON.message);
         })
        .complete(function() {
         });
    };
});
