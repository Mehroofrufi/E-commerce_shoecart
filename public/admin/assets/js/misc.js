(function($) {
  'use strict';
  $(function() {
    var body = $('body');
    var contentWrapper = $('.content-wrapper');
    var scroller = $('.container-scroller');
    var footer = $('.footer');
    var sidebar = $('.sidebar');

    //Add active class to nav-link based on url dynamically
    //Active class can be hard coded directly in html file also as required

    function addActiveClass(element) {
      if (current === "") {
        //for root url
        if (element.attr('href').indexOf("index.html") !== -1) {
          element.parents('.nav-item').last().addClass('active');
          if (element.parents('.sub-menu').length) {
            element.closest('.collapse').addClass('show');
            element.addClass('active');
          }
        }
      } else {
        //for other url
        if (element.attr('href').indexOf(current) !== -1) {
          element.parents('.nav-item').last().addClass('active');
          if (element.parents('.sub-menu').length) {
            element.closest('.collapse').addClass('show');
            element.addClass('active');
          }
          if (element.parents('.submenu-item').length) {
            element.addClass('active');
          }
        }
      }
    }

    var current = location.pathname.split("/").slice(-1)[0].replace(/^\/|\/$/g, '');
    $('.nav li a', sidebar).each(function() {
      var $this = $(this);
      addActiveClass($this);
    })

    $('.horizontal-menu .nav li a').each(function() {
      var $this = $(this);
      addActiveClass($this);
    })

    //Close other submenu in sidebar on opening any

    sidebar.on('show.bs.collapse', '.collapse', function() {
      sidebar.find('.collapse.show').collapse('hide');
    });

    $(".aside-toggler").on("click", function () {
      $(".mail-sidebar,.chat-list-wrapper").toggleClass("menu-open");
    });


    //Change sidebar and content-wrapper height
    applyStyles();

    function applyStyles() {
      //Applying perfect scrollbar
      if (!body.hasClass("rtl")) {
        if ($('.settings-panel .tab-content .tab-pane.scroll-wrapper').length) {
          const settingsPanelScroll = new PerfectScrollbar('.settings-panel .tab-content .tab-pane.scroll-wrapper');
        }
        if ($('.chats').length) {
          const chatsScroll = new PerfectScrollbar('.chats');
        }
        if (body.hasClass("sidebar-fixed")) {
          var fixedSidebarScroll = new PerfectScrollbar('#sidebar .nav');
        }
      }
    }

    $('[data-toggle="minimize"]').on("click", function() {
      if ((body.hasClass('sidebar-toggle-display')) || (body.hasClass('sidebar-absolute'))) {
        body.toggleClass('sidebar-hidden');
      } else {
        body.toggleClass('sidebar-icon-only');
      }
    });

    //checkbox and radios
    $(".form-check label,.form-radio label").append('<i class="input-helper"></i>');

    //fullscreen
    $("#fullscreen-button").on("click", function toggleFullScreen() {
      if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
        if (document.documentElement.requestFullScreen) {
          document.documentElement.requestFullScreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullScreen) {
          document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (document.documentElement.msRequestFullscreen) {
          document.documentElement.msRequestFullscreen();
        }
      } else {
        if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    })
  });
})(jQuery);

// for update the order status 

function updateOrder(id,data) {
  // console.log("the data is :"+data);
      $.ajax({
        method: 'post',
        url: '/admin/update_sts', 
        data: JSON.stringify({data:data,id:id}),
        contentType: 'application/json',
        success: function (response) {
            if(response.result === true){
              $('#ordersMain').load('/admin/orders #ordersMain'); 
            }else{
                Swal.fire({
                    title: 'error',
                    text: 'something wrong',
                    icon: 'failed',
                    confirmButtonText: 'OK'
                  });
            }
        },
        error: function (error) {

            console.error(error);
        }
    });
}

// for cancel order 

function cancelOrder(id){
  $.ajax({
    method: 'post',
    url: '/admin/cancel_order', 
    data: JSON.stringify({id:id}),
    contentType: 'application/json',
    success: function (response) {
        if(response.result === true){
          Swal.fire({
            title: 'success',
            text: 'Order cancelled successfully',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          $('#ordersMain').load('/admin/orders #ordersMain');
          window.location.href = "/admin/orders"; 
        }else{
            Swal.fire({
                title: 'error',
                text: 'something wrong',
                icon: 'failed',
                confirmButtonText: 'OK'
              });
        }
    },
    error: function (error) {

        console.error(error);
    }
});
}

// for set the payment method

function previewImage(imageNumber) {
  const input = document.getElementById(`image${imageNumber}`);
  const imagePreview = document.getElementById(`imagePreview${imageNumber}`);

  const file = input.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = function(e) {
      imagePreview.src = e.target.result;
    };

    reader.readAsDataURL(file);
  } else {
    // If no file is selected, clear the image preview
    imagePreview.src = '';
  }
}