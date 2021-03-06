$(function() {

  function user_signed_in () {if($('#options').length>0) return true}

  if(user_signed_in()) {

    var url = window.location.pathname

    // matching threads
    if(url.match(/\/f([0-9]+)\/(.+)-([0-9]+)/)) {

      // add class to user profile cell
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

      // adding classes to tags in user profile
      $('.user_info div a[href*=tags]').parent().addClass('tag')

      // clear and insert tag counting inside tag anchor
      $('.user_info div.tag').each(function(){
        var tag = $(this).children('a').text();
        var anchor = $(this).children('a').attr('href');
        var tag_count = $(this).text().replace(tag,'').match(/\d+/g);
        $(this).empty();
        $(this).append('<a href="'+anchor+'"><span class="name">'+tag+'</span></a>');
        $(this).children('a').append('<span class="count">'+tag_count+'</span>');
      })

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
      $('.row_post_options td:nth-child(2) a[href*=editpost]').addClass('post_option_link edit_post').attr('title','Editar');
      $('.row_post_options td:nth-child(2) a[href*=newreply]').addClass('post_option_link quote_post').attr('title','Citar');
      $('.row_post_options td:nth-child(2) a[href*=newreply] img[src*=multiquote]').parent().addClass('multi').attr('title','Seleccionar para multicita');;
      $('.row_post_options td:nth-child(2) a[href*=newreply] img[src*=quickreply]').parent().addClass('fast').attr('title','Respuesta rápida');

      // ocultar "este mensaje me gustó" (ya está el +1)
      $('.row_post_options div.smallfont > a[id^=fdwvotepos_like]').parent().hide();

      // añadir clase al +1
      $('.row_post_options td:nth-child(2)>div>div>span[id^=fdwvotepos_]').parent().parent().addClass('others');
      $('.row_post_options td:nth-child(2)>div[style="float:right;margin-left:4px"]').addClass('love');

      // adding ids to top tables
      $('#poststop + table').attr('id','response_button_container');
      $('#poststop ~ table.tborder').attr('id','thread_header_options');
      var unreaded_posts = $('table#thread_header_options tr td.tcat div.smallfont').html();
      $('table#thread_header_options tr td:first-child').remove()
      $('#response_button_container').parent().parent().parent().attr('id','global_thread_header')

      // extract and create post header
      $('body > br + div[align=center]').attr('id','post_page_header')
      post_title_link = $('#navbits_finallink_ltr')[0].outerHTML
      post_title_text = $('#navbits_finallink_ltr').next('strong').html();
      post_forum = $('#navbits_finallink_ltr').parent().parent().prev().children().eq(2).children().last().html();
      $('#post_page_header').children('div').children('div').children('table').eq(0).empty()
      $('#post_page_header').children('div').children('div').children('.tborder').eq(0).empty()
      $('#posts').before('<div id="post_title">'+post_forum.replace(/»/,'') + post_title_link+'</div>');
      $('#navbits_finallink_ltr').prepend(post_title_text);


      // copy thread tags somewhere in the header section
      var thread_tags = $('#tag_list_cell').html()
      $('#post_title').after('<div id="thread_tags">'+thread_tags+'</div>')

      // move thread options into thread_tags
      $('#thread_header_options').prependTo('#thread_tags')

      // change 'iniciado por' for 'escribió'
      $('.quote_text_container > span').html(function(index,html){
        return html.replace('Iniciado por','escribió:');
      });
      
      // reescribir post para enlazar @menciones (experimental, falta aprobación de FB(aka0))
      // aprobado por la FB!
      var post = document.getElementsByClassName('post_content'), mnt = /\B@\w+\b/g, text, iter;
      for(var ix = 0, ln = post.length; ix < ln; ix++){
      iter = document.createTreeWalker(post[ix], NodeFilter.SHOW_ELEMENT + NodeFilter.SHOW_TEXT,
          function (a){
          if (/code|pre|style/i.test(a.nodeName)) return NodeFilter.FILTER_REJECT;
          return (a.nodeType == Node.ELEMENT_NODE && NodeFilter.FILTER_SKIP) || NodeFilter.FILTER_ACCEPT; 
      }, false);
      
          while (text = iter.nextNode()){
          var user = mnt.exec(text.data);
          if (!user) continue;
          text.splitText(mnt.lastIndex); text.splitText(user.index);
          text = iter.nextNode();
          var link = document.createElement('a'); link.href = '/miembros/' +text.data.substring(1)+ '/'; link.className = 'mention';
          link.appendChild(text.parentNode.replaceChild(link, text));
          mnt.lastIndex = 0;
          }
      }
      // #### COSITAS ######
      // mostrar/ocultar citas
      //$('.quote_text_container').click(function(e){
      //  $(this).children('.quote-text').slideToggle();
      //  $(this).toggleClass('open');
      //  e.stopPropagation();
      //})

      // mark multiquote on click
      $('.row_post_options a.quote_post.multi').click(function(){
        $(this).toggleClass('selected');
      })

      // mark multiquotes saved in cookie
      var multiquote = Cookie.query().vbulletin_multiquote;
        if (multiquote){
        multiquote = multiquote.split(",");
        for (var idx = 0, len = multiquote.length; idx < len; idx++) $("#mq_"+ multiquote[idx]).parent().addClass("selected");
      }

      // Marcar post como seleccionado (mods)
      $('.post_links input').click(function(){
        $(this).parent().parent().parent().parent().toggleClass('mod_selected')
      })

    }

    // matching forums
    if(url.match(/\/f([0-9]+)\//)) {

      // killing thread row title titles
      $('tbody[id^=threadbits_forum] tr td:nth-child(3)').removeAttr('title')

      // change triangle/heart
      where_is_my_heart = /Firefox/i.test(navigator.userAgent) ? 'http://i.imgur.com/EFKwJ4F.gif' : 'chrome-extension://'+chrome.runtime.id+'/data/images/heart.gif'
      $('img[src="http://static.forosdelweb.com/fdwtheme/images/buttons/up.png"]').attr('src',where_is_my_heart)

      // activity indicator
      $('a[href^="http://www.forosdelweb.com/misc.php?do=whoposted&t="]').each(function() {
        var count = $(this).text().replace('.','')
        var parent = $(this).parent().prev()
        if(count>39) parent.addClass('burn')
        else if(count>19) parent.addClass('hot')
        else if(count>9) parent.addClass('warm')
      });

      // views in friendly format
      $('tbody[id^=threadbits_forum] tr td:nth-child(6)').each(function() {
        var friendly_views = abbrNum($(this).text().replace('.',''),0)
        $(this).empty().text(friendly_views)
      });

      // check if thread is a post-it
      $('tbody[id^=threadbits_forum] tr').each(function(){
        if ($(this).find('img[src$="/images/misc/sticky.gif"]').length) {
          $(this).addClass('postit');
        }
      })
      $('tr.postit:last').addClass('last_postit')


      // add spacers
      $('tbody[id^=threadbits_forum] tr').before('<tr class="spacer"><td colspan="6"><div></div></td></tr>')

    }

    // ALL WEB JS:

    // parallax
      $(window).scroll(function () {
        var s = $(window).scrollTop();
        $("body").css("backgroundPosition","-200px " +(s/4)+"px");
      })

    // fix scrolling to hash
      var hash = window.location.hash
      if(hash) $(window).scrollTop($(hash).offset().top-40)
    
    // Mostrar body
    $('body').addClass('skinned')

  } else {
    $('body').addClass('skinned')
    $('#loginform_menu').addClass('force_login')
  }

});

function abbrNum(number, decPlaces) {
  decPlaces = Math.pow(10,decPlaces);
  var abbrev = [ "k", "m", "b", "t" ];
  for (var i=abbrev.length-1; i>=0; i--) {
    var size = Math.pow(10,(i+1)*3);
    if(size <= number) {
      number = Math.round(number*decPlaces/size)/decPlaces;
      if((number == 1000) && (i < abbrev.length - 1)) {
        number = 1;
        i++;
      }
      number += abbrev[i];
      break;
    }
  }
  return number;
}
