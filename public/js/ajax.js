function getSizes(id,idColor){
    $.ajax({
        url:"/product/details/"+id,
        method:"POST",
        contentType:"application/json",
        data: JSON.stringify({idColor:idColor}),
        success:function(result){
            $("#sizes").html(result.html)
        }

    });
}