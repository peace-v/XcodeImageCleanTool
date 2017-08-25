'use strict';

$(document).ready(function() {
    $('#project-path').focus();

    $(".image").height($(".image").width());

    $('#search-repeat-images').on('click', function() {
        $(".progress-bar").addClass("active");
        var projectPath = $('#project-path').val();
        var ignorePaths = $('#ignore-path').val();
        $.get("/searchRepeatImages",{projectPath:projectPath, ignorePaths:ignorePaths})
        .success(function() {
            window.location.reload();
         })
        .error(function(error) {
            $(".progress-bar").removeClass("active");
            alert(error.responseJSON.message);
         })
        .complete(function() {
            $(".progress-bar").removeClass("active");
         });
    });

    $('#search-similar-images').on('click', function() {
        $(".progress-bar").addClass("active");
        var projectPath = $('#project-path').val();
        var ignorePaths = $('#ignore-path').val();
        $.get("/searchSimilarImages",{projectPath:projectPath, ignorePaths:ignorePaths})
        .success(function() {
            window.location.reload();
         })
        .error(function(error) {
            $(".progress-bar").removeClass("active");
            alert(error.responseJSON.message);
         })
        .complete(function() {
            $(".progress-bar").removeClass("active");
         });
    });

        $('#search-unused-images').on('click', function() {
        $(".progress-bar").addClass("active");
        var projectPath = $('#project-path').val();
        var ignorePaths = $('#ignore-path').val();
        $.get("/searchUnusedImages",{projectPath:projectPath, ignorePaths:ignorePaths})
        .success(function() {
            window.location.reload();
         })
        .error(function(error) {
            $(".progress-bar").removeClass("active");
            alert(error.responseJSON.message);
         })
        .complete(function() {
            $(".progress-bar").removeClass("active");
         });
    });

    $('#choose-all').on('click', function() {
        var title = $('#choose-all').text();
        if (title == "全选") {
            $.each($("input[name=cbx]"), function(i) {
                $(this).prop("checked",true);
            });
            $('#choose-all').text("取消全选");
        } else {
            $.each($("input[name=cbx]"), function(i) {
                $(this).removeAttr("checked",false);
            });
            $('#choose-all').text("全选");
        }
    });

    $('#delete').on('click', function() {
        $(".progress-bar").addClass("active");
        var index = new Array();
        $.each($("input[name=cbx]"), function(i) {
                if($(this).is(':checked')) {
                    index.push($(this).attr('id'));
                }
            });
        $.post("/deleteImages",{index:index})
        .success(function(data) {
            alert(data);
            window.location.reload();
         })
        .error(function(error) {
            $(".progress-bar").removeClass("active");
            alert(error.responseJSON.message);
         })
        .complete(function() {
            $(".progress-bar").removeClass("active");
         });
    });
});
