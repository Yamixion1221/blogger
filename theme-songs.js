        const playButtonImage = '/images/oped-play-circle.svg';
        const stopButtonImage = '/images/oped-stop-circle.svg';
        var nowPlaying = '';
        function controlPreview(oped_id) {
          const preview = document.querySelector("#preview_" + oped_id);
          if (nowPlaying == oped_id) {
            preview.pause();
            preview.currentTime = 0;
            nowPlaying = '';
            // 再生アイコン変更
            $('.oped-preview-button-' + oped_id).css('background-image', `url('${playButtonImage}')`);
            $('.oped-popup-preview-play').css('background-image', `url('${playButtonImage}')`);
            $('.oped-video-popup-preview-play').css('background-image', `url('${playButtonImage}')`);
            const circle = document.getElementById('preview-circle');
            if (circle !== undefined) {
              circle.remove();
            }
          } else {
            if (nowPlaying !== '') {
              const preview2 = document.querySelector("#preview_" + nowPlaying);
              preview2.pause();
              preview2.currentTime = 0;
              $('.oped-preview-button-' + nowPlaying).css('background-image', `url('${playButtonImage}')`);
              $('.oped-popup-preview-play').css('background-image', `url('${playButtonImage}')`);
              $('.oped-video-popup-preview-play').css('background-image', `url('${playButtonImage}')`);
              const circle = document.getElementById('preview-circle');
              if (circle !== undefined) {
                circle.remove();
              }
            }

            nowPlaying = oped_id;

            // 再生アイコン変更
            if ($('#js-oped-popup').css('visibility') == 'visible') {
              $('.oped-popup-preview-play').css('background-image', `url('${stopButtonImage}')`);
              $("#oped-popup-preview-play-inner").html('<circle id="preview-circle" fill="none" stroke="#4fa8df" stroke-width="10" stroke-mitterlimit="0" cx="50" cy="50" r="47" stroke-dasharray="360" stroke-dashoffset="360" stroke-linecap="round" transform="rotate(-90) translate(-100 0)"></circle>');
            } else {
              $('.oped-preview-button-' + oped_id).css('background-image', `url('${stopButtonImage}')`);
              $("#oped-preview-button-inner-" + oped_id).html('<circle id="preview-circle" fill="none" stroke="#4fa8df" stroke-width="10" stroke-mitterlimit="0" cx="50" cy="50" r="47" stroke-dasharray="360" stroke-dashoffset="360" stroke-linecap="round" transform="rotate(-90) translate(-100 0)"></circle>');
            }
            preview.volume = 0.3;
            preview.play();

            // アニメーション開始
            drawProgress();

            preview.onended = function() {
              preview.currentTime = 0;
              if ($('#js-oped-popup').css('visibility') == 'visible') {
                $('.oped-popup-preview-play').css('background-image', `url('${playButtonImage}')`);
              } else if ($('#js-oped-video-popup').css('visibility') == 'visible') {
                $('.oped-video-popup-preview-play').css('background-image', `url('${playButtonImage}')`);
              } else {
                $('.oped-preview-button-' + nowPlaying).css('background-image', `url('${playButtonImage}')`);
              }
              nowPlaying = '';
            }
          }
        }

        function drawProgress() {
          const circle = document.getElementById('preview-circle');
          if (!circle) {
            return false;
          }
          if (!nowPlaying) {
            circle.setAttribute('stroke-dashoffset', 74);
            circle.remove();
            return false;
          }
          const preview = document.querySelector("#preview_" + nowPlaying);
          if (!preview) {
            circle.remove();
            return false;
          }

          const currentTime = Math.floor(preview.currentTime * 10);
          const pathLength = 355 - Math.floor((280/300) * currentTime);
          if (pathLength < 70) {
            circle.remove();
            return false;
          }
          circle.setAttribute('stroke-dashoffset', pathLength);
          setTimeout(drawProgress, 100);
        }

        function playPreview(oped_id, spotify_id) {
          const previewApiUrl = '/spotify/get_preview_url/' + spotify_id;
          const preview = document.querySelector("#preview_" + oped_id);
          $.ajax({
            url: previewApiUrl,
            type: "GET",
            timeout: 10000,
            success: function(data) {
              if (data.preview_url) {
                preview.src = data.preview_url;
                controlPreview(oped_id);
              } else {
                  if (!confirm('This song cannot be previewed. Do you want to open this song on Spotify?')) {
                      // キャンセル時の処理
                      return false;
                  } else {
                      // OK時の処理
                      window.open($('#spotify_url_' + oped_id).val());
                  }
              }
            }
          });
        }

        $(function(){
          // 再生ボタンセット
          $('.oped-preview-button').css('background-image', `url('${playButtonImage}')`);
          $('.oped-preview-button').css('background-image', `url('${playButtonImage}')`);

          // Dialog Close
          const blackBg = document.getElementById('js-oped-black-bg');
          blackBg.addEventListener('click', function() {
            closeMusicLinkPopup();
          });
          const closeBtn = document.getElementById('js-oped-close-btn');
          closeBtn.addEventListener('click', function() {
            closeMusicLinkPopup();
          });
        });

        function openMusicLinkPopup(oped_id, title, artist, spotify_id) {
          const popup = document.getElementById('js-oped-popup');
          if(!popup) return;

          // 再生中の場合は停止
          if (nowPlaying !== '') {
            const preview2 = document.querySelector("#preview_" + nowPlaying);
            preview2.pause();
            preview2.currentTime = 0;
            $('.oped-preview-button-' + nowPlaying).css('background-image', `url('${playButtonImage}')`);
            $('.oped-popup-preview-play').css('background-image', `url('${playButtonImage}')`);
            const circle = document.getElementById('preview-circle');
            if (circle !== undefined) {
              circle.remove();
            }
            nowPlaying = '';
          }

          $(".oped-popup-title").html(title);
          if (artist) {
            $(".oped-popup-artist").html("Artist: " + artist);
          }
          // preview
          $(".oped-popup-preview-play").off();

          if (spotify_id) {
            $(".oped-popup-preview-play").on('click', function(){
              playPreview(oped_id, spotify_id);
            });
            $(".oped-popup-preview-play").css({ opacity: "1.0", cursor: "pointer" });
          } else {
            $(".oped-popup-preview-play").css({ opacity: "0.4", cursor: "unset" });
          }

          // data-ga-click-paramの設定
          if (oped_id) {
            $("#oped-popup-preview-play-inner").attr("data-ga-click-param",`sid:${oped_id}`);
          }

          // buttons
          $(".oped-popup-button").off();

          if ($('#spotify_url_' + oped_id).val()) {
            $(".oped-popup-spotify").on('click', function () {
              window.open($('#spotify_url_' + oped_id).val());
            });
            $(".oped-popup-spotify").css({ opacity: "1.0", cursor: "pointer" });

          } else {
            $(".oped-popup-spotify").css({ opacity: "0.4", cursor: "unset" });
          }
          if ($('#apple_url_' + oped_id).val()) {
            $(".oped-popup-apple").on('click', function () {
              window.open($('#apple_url_' + oped_id).val());
            });
            $(".oped-popup-apple").css({ opacity: "1.0", cursor: "pointer" });
          } else {
            $(".oped-popup-apple").css({ opacity: "0.4", cursor: "unset" });
          }
          if ($('#amazon_url_' + oped_id).val()) {
            $(".oped-popup-amazon").on('click', function () {
              window.open($('#amazon_url_' + oped_id).val());
            });
            $(".oped-popup-amazon").css({ opacity: "1.0", cursor: "pointer" });
          } else {
            $(".oped-popup-amazon").css({ opacity: "0.4", cursor: "unset" });
          }
          if ($('#youtube_url_' + oped_id).val()) {
            $(".oped-popup-youtube").on('click', function () {
              window.open($('#youtube_url_' + oped_id).val());
            });
            $(".oped-popup-youtube").css({ opacity: "1.0", cursor: "pointer" });
          } else {
            $(".oped-popup-youtube").css({ opacity: "0.4", cursor: "unset" });
          }

          popup.classList.add('is-show');
        }

        function closeMusicLinkPopup() {
          const popup = document.getElementById('js-oped-popup');
          if(!popup) return;
          popup.classList.remove('is-show');

          if (nowPlaying !== '') {
            const preview = document.querySelector("#preview_" + nowPlaying);
            preview.pause();
            preview.currentTime = 0;
            $('.oped-popup-preview-play').css('background-image', `url('${playButtonImage}')`);
            const circle = document.getElementById('preview-circle');
            if (circle !== undefined) {
              circle.remove();
            }
            nowPlaying = '';
          }
        }
