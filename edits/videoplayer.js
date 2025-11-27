'use strict';
{
  document.addEventListener('DOMContentLoaded', function() {
    Fancybox.bind('[data-fancybox]', {
      fullscreen: {
        autoStart: true,
      },
      groupAttr: false,
    });
  });
}

// data-fancybox data-src="https://vk.com/video_ext.php?oid=-94010172&id=456251080&hd=2" data-type="iframe" data-preload="false" data-height="360"
// data-fancybox="video-gallery" href="https://www.youtube.com/watch?v=uMFOSvXz80I"