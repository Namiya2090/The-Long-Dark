$(function() {
    // 오버레이 기능

    // 변수 선언
    const $overlay = $('.background:last-child');   // 오버레이
    const $windowHeight = $(window).height();       // 뷰포트의 높이
    let isOverlayVisible = false;                   // 오버레이의 상태

    // 스크롤 이벤트 발생 시
    $(window).on('scroll', function() {
        // 스크롤 바 위치를 변수에 대입
        let scrollTop = $(window).scrollTop();

        // 스크롤 바의 위치가 뷰포트의 높이만큼 내려가고 오버레이가 숨겨져 있으면 500ms에 걸쳐 나타나게함
        if(scrollTop >= $windowHeight && !isOverlayVisible) {
            $overlay.fadeIn(500);
            isOverlayVisible = true;
        }
        // 스크롤 바의 위치가 0이고 오버레이가 표시되어 있으면 500ms에 걸쳐 서서히 사라지게 함
        else if(scrollTop === 0 && isOverlayVisible) {
            $overlay.fadeOut(500);
            isOverlayVisible = false;
        }
    });

    // --------------------------

    // 이메일 기능

    // 변수 선언
    const $form = $('#emailBox');               // 이메일 박스
    const $inputEmail = $('#emailBox > input'); // 이메일 입력
    const $submit = $('#emailBox > button');    // 이메일 제출
    const $alert = $('#alert');                 // 이메일 경고 메시지

    // 제출 이벤트 발생 시
    $form.on('submit', function(e) {
        // 기본 이벤트 제거
        e.preventDefault();

        // 이메일 입력창에 입력된 데이터를 변수에 대입
        const inputValue = $inputEmail.val().trim();

        // 올바른 이메일 형식인지 검사하는 변수
        const emailTest = /^[a-zA-Z0-9]+@[a-zA-Z]+\.(com|net)$/;

        // 이메일이 입력되지 않았다면 경고 문구를 표시
        if(inputValue.length === 0) $alert.text('You must enter your email').css('color', 'crimson')
            .fadeIn(500).delay(1000).fadeOut(500);
        // 이메일 형식이 맞지 않다면 경고 문구를 표시
        else if(!emailTest.test(inputValue)) $alert.text('Please enter an email in the correct format').css('color', 'crimson')
            .fadeIn(500).delay(1000).fadeOut(500);
        // 모든 조건 통과 시 성공 문구를 표시
        else $alert.text('Email input successful').css('color', 'greenYellow')
            .fadeIn(500).delay(1000).fadeOut(500);
        
        // 모든 일이 끝나면 입력한 텍스트를 제거
        $inputEmail.val('');
    });

    // --------------------------

    // 사이드 메뉴 기능
    
    // 변수 선언
    const $sideExpand = $('#hContainer > button');                      // 사이드 메뉴 확장버튼
    const $sideClose = $('#navMenuList > li:first-child > button');     // 사이드 메뉴 닫기버튼
    const $sideMenu = $('nav');                                         // 사이드 메뉴
    const $platformMenu = $('#navMenuList > li:last-child');            // 플랫폼 메뉴
    const $platformArrow = $platformMenu.children('svg');               // 플랫폼 메뉴 화살표
    const $platformList = $('#sidePlatformList');                       // 플랫폼 리스트
    const $platform = $('#sidePlatformList > li');                      // 플랫폼

    // 플랫폼 리스트 메뉴 항목 화살표 방향
    const platformArrowDown = '<path d="M.3.3H.3c.4-.4,1-.4,1.3,0l10.8,10L23.3.3c.4-.4,1-.4,1.3,0,.4.4.4.9,0,1.2l-11.5,10.7h0c-.4.4-1,.4-1.3,0L.3,1.5H.3c-.4-.3-.4-.9,0-1.2"/>'
    const platformArrowUp = '<path d="M.3,12.2c-.4-.3-.4-.9,0-1.2H.3L11.8.3c.3-.4.9-.4,1.3,0h0l11.5,10.7c.4.3.4.8,0,1.2-.3.4-.9.4-1.3,0L12.4,2.2,1.6,12.2c-.3.4-.9.4-1.3,0H.3"/>'

    // 사이드 메뉴 확장버튼 클릭 시
    $sideExpand.on('click', function(event) {
        // body 요소의 클릭 이벤트 방지
        event.stopPropagation();
        $sideMenu.addClass('on');
    });

    $sideClose.on('click', function() { $sideMenu.removeClass('on'); });

    // 사이드 메뉴 안에서 클릭이 일어날 시 body 요소의 클릭 이벤트 방지
    $sideMenu.on('click', function(event) { event.stopPropagation(); });

    // 사이드 메뉴를 제외한 아무 곳이나 클릭 시
    $('body').on('click', function() {
        // 플랫폼 메뉴가 보인다면 플랫폼 메뉴를 숨긴 후에 그렇지 않으면 바로 사이드 메뉴를 숨김
        if($platformList.is(':visible')) {
            $platformList.slideUp(200, function() { $sideMenu.removeClass('on'); });
            $platformArrow.html(platformArrowDown);
        }
        else $sideMenu.removeClass('on');
    });

    // 플랫폼 메뉴 클릭 시
    $platformMenu.on('click', function(event) {
        // body 요소의 클릭 이벤트 방지
        event.stopPropagation();

        // 만약 플랫폼 리스트가 애니메이션중이라면 함수를 종료
        if($platformList.is(':animated')) return;

        // 플랫폼 리스트가 보이는지 확인하는 변수
        const visible = $platformList.is(':visible');

        // 플랫폼 리스트 슬라이드 토글
        $platformList.slideToggle(200);

        // 플랫폼 리스트가 보인다면 위쪽, 보이지 않는다면 아래쪽 화살표
        $platformArrow.html(visible ? platformArrowDown : platformArrowUp);
    });

    // 플랫폼 메뉴의 클릭 이벤트 방지
    $platform.on('click', function(event) { event.stopPropagation(); });
});