$(function() {

  var url = window.location.pathname

  // matching threads
  if(url.match(/\/f([0-9]+)\/(.+)-([0-9]+)/)) {

    // añadir clases
    $('div[id^=postmenu_]').parent().addClass('user_profile');

    // añadir clases para cuadro de usuario
    $('div[id^=postmenu_] ~ .smallfont').each(function(){
      if ($(this).children().length<1) {
        $(this).addClass('cartelito_modcol');
        $(this).parent().addClass('is_modcol');
        if($(this).text().match('Colaborador')) $(this).parent().addClass('is_col')
        if($(this).text().match('(Desactivado)')) $(this).parent().addClass('is_banned')
      }
      if ($(this).children('a[href*=miembros]').length>0) {
        $(this).addClass('user_avatar');
        $(this).parent().addClass('has_avatar');
      }
      if ($(this).children('strong').length>0) $(this).addClass('user_info');
    });

    // añadir clases para filas del post
    $('.user_profile table[id^=post] tbody tr:nth-child(1)').addClass('row_post_info');
    $('.user_profile table[id^=post] tbody tr:nth-child(2)').addClass('row_post_content');
    $('.user_profile table[id^=post] tbody tr:nth-child(3)').addClass('row_post_options');

    // añadir clases para contenedor de las citas
    $('.quote-text').parent().addClass('quote_text_container');

    // PIRULAS
    // Cambiar fecha de post hacia celda del post
    $('tr.row_post_info').each(function() {
      var post_link, post_input = ''
      var link = $(this).children('td:last-child').children('a')
      if(link.length>0) post_link = link[0].outerHTML
      var input = $(this).children('td:last-child').children('input')
      if(input.length>0) post_input = input[0].outerHTML
      var post_permalink = $(this).children('td:last-child').children('b').html().replace("permalink","#")
      var post_links = '<div class=post_links>' + post_input + post_link  + post_permalink + '</div>';
      var post_date = '<div class=date_info>' + $(this).children('td:first-child').html() + '</div>';
      var post_header = '<div class="post_header cf">' + post_date + post_links + '</div>';
      $(this).next().children('td[id^=td_post_]').children('.post_content').prepend(post_header);
      $(this).children('td').empty();
    });

    // Quitar las rayas de la firma (?)
    $('.post_content + div').html(function(index,html){
      return html.replace(/(__________________)/,'');
    });

    // añadir clases a los numeritos del autor
    $('.user_profile .user_info > *').each(function() {
      if($(this).text().match(/^(Mensajes)/)) $(this).addClass('user_stats_posts');
      if($(this).text().match(/^(Ubicación)/)) $(this).addClass('user_stats_localization');
      if($(this).text().match(/^(Antigüedad)/)) $(this).addClass('user_stats_age');
      if($(this).text().match(/^(Puntos)/)) $(this).addClass('user_stats_points');
    });

    // añadir clases a los enlaces de las opciones (citar, editar, etc)
    $('.row_post_options td:nth-child(2) a[href*=editpost]').addClass('edit_post');
    $('.row_post_options td:nth-child(2) a[href*=newreply]').addClass('quote_post');
    $('.row_post_options td:nth-child(2) a[href*=newreply] img[src*=multiquote]').parent().addClass('multi');
    $('.row_post_options td:nth-child(2) a[href*=newreply] img[src*=quickreply]').parent().addClass('fast');

    // ocultar "este mensaje me gustó" (ya está el +1)
    $('.row_post_options div.smallfont > a[id^=fdwvotepos_like]').parent().hide();

    // añadir clase al +1
    $('.row_post_options td:nth-child(2)>div>div>span[id^=fdwvotepos_]').parent().parent().addClass('love');

    // extract and create post header
    $('body > br + div[align=center]').attr('id','post_page_header')
    post_title_link = $('#navbits_finallink_ltr')[0].outerHTML
    post_title_text = $('#navbits_finallink_ltr').next('strong').html();
    post_forum = $('#navbits_finallink_ltr').parent().parent().prev().children().eq(2).children().last().html();
    $('#post_page_header').children('div').children('div').children('table').eq(0).empty()
    $('#post_page_header').children('div').children('div').children('.tborder').eq(0).empty()
    $('#posts').prepend('<div id="post_title">'+post_forum.replace(/»/,'') + post_title_link+'</div>');
    $('#navbits_finallink_ltr').prepend(post_title_text);
    
    // #### COSITAS ######
    // mostrar/ocultar citas
    $('.quote_text_container').click(function(e){
      $(this).children('.quote-text').slideToggle();
      e.stopPropagation()
    })

    // Marcar multicita
    // TODO: no funciona
    $('.row_post_options a.quote_post.multi').click(function(){
      $(this).toggleClass('active');
    })

    // Marcar post como seleccionado (mods)
    $('.post_links input').click(function(){
      $(this).parent().parent().parent().parent().toggleClass('mod_selected')
    })

  }

  // Mostrar body
  $('body').css('opacity', '1');

});