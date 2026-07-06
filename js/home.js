$(function() {
    // 배경 영상이 재생이 되지 않을때 이미지로 대체

    // 비디오 요소를 담은 변수
    const $video = $('#backgroundContainer > video');
    const videoElement = $video[0];

    // 재생 시도 함수
    function attemptPlay() {
        // 재생 시도, 성공시 영상을 보이고 실패 시 영상을 숨김
        if($video.length > 0) videoElement.play().then(() => { $video.show(); }).catch(() => { $video.hide(); });
    }

    // 초기 페이지 로드 시 재생 시도
    attemptPlay();

    // 페이지가 캐시에서 복원되었거나 처음 로드되었을 때 실행
    $(window).on('pageshow', function(event) { attemptPlay(); });

    // --------------------------

    // 슬라이드 이미지 기능

    // 변수 선언
    const $tab = $('#contentTabList > li');         // 탭 메뉴
    const $image = $('#contentImageList > li');     // 이미지
    const $shortcut = $('#contentImageList + a');   // 바로가기

    // 탭 클릭 시
    $tab.on('click', function() {
        // 클릭한 탭이 이미지 활성화 되어있거나 이미지가 애니메이션 중이라면 함수를 종료
        if($(this).hasClass('on') || $image.is(':animated')) return;

        // 클릭한 탭의 인덱스 저장
        const index = $(this).index();

        // 클릭한 탭에 on 클래스를 추가하고 나머지 탭들의 on 클래스를 제거
        $(this).addClass('on').siblings().removeClass('on');

        // 이미지를 1초에 걸쳐 페이드 아웃, 탭 메뉴 인덱스에 맞는 이미지를 1초에 걸쳐 페이드인
        $image.fadeOut(1000).eq(index).delay(500).fadeIn(1000);

        // 바로가기의 링크를 탭 메뉴에 맞게 변경
        $shortcut.attr('href', $image.eq(index).children().attr('href'));
    });
});