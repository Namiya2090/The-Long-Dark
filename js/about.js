$(function() {
    // 슬라이드 기능
    function slide(list, button, time) {
        // 이전 버튼을 눌렀을때
        if(button === 'prev') {
            // 이전 이미지를 보여줌
            list.stop(true, true).css({marginLeft: '-100%'}).prepend(list.children().last())
                .animate({marginLeft: 0}, time, 'swing');
        }
        // 다음 버튼을 눌렀을때
        else if(button === 'next') {
            // 다음 이미지를 보여줌
            list.stop(true, true).animate({marginLeft: '-100%'}, time, 'swing', function() {
                $(this).append($(this).children().first()).removeAttr('style');
            });
        }
    }

    // ------------------------------

    // 인디케이터 추가기능
    function add(length, indicator, container) {
        // 각 갯수에 맞게 불릿을 생성
        for(let i = 0; i < length; i++) indicator.append($('<li>').addClass('bullet'));

        // 첫 번째 인디케이터에 on 클래스를 주고 인디케이터 목록을 container 변수에 들어있는 요소의 다음 형제 요소로 추가
        indicator.children().first().addClass('on').parent().insertAfter(container);
    }

    // 인디케이터 활성화 기능
    let infoIndicatorIndex = 0;     // 게임정보 이미지 슬라이드 인덱스
    let textIndicatorIndex = 0;     // 서바이벌 모드 설명 텍스트 슬라이드 인덱스

    function move(type, button, length, indicator) {
        // type 변수의 값이 'info'라면 button 변수값에 따라 인덱스를 변경
        if(type === 'info') {
            if(button === 'prev') infoIndicatorIndex = (infoIndicatorIndex - 1 + length) % length;
            else infoIndicatorIndex = (infoIndicatorIndex + 1) % length;
        }
        // type 변수의 값이 'text'라면 button 변수값에 따라 인덱스를 변경
        else if(type === 'text') {
            if(button === 'prev') textIndicatorIndex = (textIndicatorIndex - 1 + length) % length;
            else textIndicatorIndex = (textIndicatorIndex + 1) % length;
        }

        // 인디케이터의 모든 불릿들의 on 클래스 제거 후 인덱스에 맞는 불릿에 on 클래스 부여
        indicator.children().removeClass('on').eq(type === 'info' ? infoIndicatorIndex : textIndicatorIndex).addClass('on');
    }

    // 인디케이터 슬라이드 기능
    function indicatorSlide(type, clickIndex, length, list, bullet) {
        // 현재 인덱스와 클릭한 인덱스의 거리
        let diff;

        if(type === 'info') diff = Math.abs(infoIndicatorIndex - clickIndex);
        else if(type === 'text') diff = Math.abs(textIndicatorIndex - clickIndex);

        // 반복문을 사용할 횟수(최단거리)
        const loopCount = diff > (length / 2) ? length - diff : diff;

        // 슬라이드 기능의 방향을 나타내는 변수
        let direction;

        if(type === 'info') {
            // 현재 인덱스의 값이 클릭한 인덱스보다 작으면 순방향, 하지만 역방향이 최단거리라면 역방향
            if(infoIndicatorIndex < clickIndex) direction = diff > (length / 2) ? 'prev' : 'next';
            // 현재 인덱스의 값이 클릭한 인덱스보다 크면 역방향, 하지만 순방향이 최단거리라면 순방향
            else direction = diff > (length / 2) ? 'next' : 'prev';
        } else if(type === 'text') {
            if(textIndicatorIndex < clickIndex) direction = diff > (length / 2) ? 'prev' : 'next';
            else direction = diff > (length / 2) ? 'next' : 'prev';
        }

        // 반복횟수만큼 슬라이드 기능을 수행
        for(let i = 0; i < loopCount; i++) slide(list, direction, 200);

        // type 변수값에 따라 클릭한 인덱스 값을 현재 인덱스값에 대입
        type === 'info' ? infoIndicatorIndex = clickIndex : textIndicatorIndex = clickIndex;

        // 모든 bullet 변수의 on 클래스를 제거하고 클릭한 인덱스에 해당하는 bullet 변수에 on 클래스 추가
        bullet.removeClass('on').eq(clickIndex).addClass('on');
    }

    // ------------------------------

    // 게임정보 이미지 슬라이드
    const $infoContainer = $('#infoImageSlide');                        // 이미지 목록 컨테이너
    const $infoList = $infoContainer.children('ul');                    // 이미지 목록
    const infoLength = $infoList.children().length;                     // 이미지 갯수
    const $prevInfo = $('#infoImageSlide > button:first-child');        // 이전 버튼
    const $nextInfo = $('#infoImageSlide > button:last-child');         // 다음 버튼
    const $infoIndicator = $('<ul>').addClass('indicator');             // 인디케이터 목록
    
    // 게임정보 이미지 슬라이드 인디케이터 추가
    add(infoLength, $infoIndicator, $infoContainer);
    
    // 게임정보 이미지 슬라이드 기능
    $prevInfo.on('click', function() {
        // 슬라이드가 진행 중이라면 이 함수를 종료
        if($infoList.is(':animated')) return;
        
        move('info', 'prev', infoLength, $infoIndicator);
        slide($infoList, 'prev', 500);
    });
    
    $nextInfo.on('click', function() {
        if($infoList.is(':animated')) return;
        
        move('info', 'next', infoLength, $infoIndicator);
        slide($infoList, 'next', 500);
    });
    
    // 게임정보 인디케이터 이동 기능
    const $infoBullet = $infoIndicator.children();  // 인디케이터 불릿

    $infoBullet.on('click', function() {
        // 슬라이드 기능이 진행 중이라면 이 함수를 종료
        if($infoList.is(':animated')) return;

        // 클릭한 불릿의 인덱스
        const index = $(this).index();

        // 현재 인덱스와 클릭한 인덱스의 값이 같으면 이 함수를 종료
        if(infoIndicatorIndex === index) return;

        indicatorSlide('info', index, infoLength, $infoList, $infoBullet);
    });

    // ------------------------------

    // 서바이벌 모드 설명 텍스트 슬라이드
    const $textAllContainer = $('#survival > div');                         // 텍스트 슬라이드 컨테이너
    const $textContainer = $('<div>').attr('id', 'textContainer');          // 텍스트 목록 컨테이너
    const $textList = $('<ul>').attr('id', 'textList').addClass('flex');    // 텍스트 목록
    const $prevText = $textAllContainer.children('button:first-child');     // 이전 버튼
    const $nextText = $textAllContainer.children('button:last-child');      // 다음 버튼
    const $textIndicator = $('<ul>').addClass('indicator');                 // 인디케이터 목록

    // 이전 버튼의 다음 형제 요소로 텍스트 목록 컨테이너를 추가
    $prevText.after($textContainer);

    // 텍스트 목록 컨테이너의 자식 요소로 텍스트 목록을 추가
    $textContainer.append($textList);
    
    // 텍스트 목록 가져오기
    $.ajax({
        // 해당 경로에서 json 파일 가져오기
        url: 'js/slideText.json',
        // 데이터 타입
        dataType: 'json',
        // 가져오기 성공 시 실행하는 함수
        success: function(data) {
            // 텍스트 요소를 담을 변수 생성
            let textList = "";

            // json 파일에 있는 데이터의 수만큼 생성해서 변수에 대입
            $.each(data, function(index, item) {
                textList += `
                    <li class="flex">
                        <div>
                            <p class="marginB_30">${item.title}</p>
                            <p>${item.content}</p>
                        </div>
                    </li>
                `
            });

            // 만들어진 텍스트들을 텍스트 목록의 자식 요소로 추가
            $textList.append(textList);

            // 텍스트 갯수
            const textLength = $textList.children().length;   

            // 텍스트 슬라이드 인디케이터 추가
            add(textLength, $textIndicator, $textAllContainer);

            // 텍스트 슬라이드 기능
            $prevText.on('click', function() {
                // 슬라이드가 진행 중이라면 이 함수를 종료
                if($textList.is(':animated')) return;

                move('text', 'prev', textLength, $textIndicator);
                slide($textList, 'prev', 500);
            });

            $nextText.on('click', function() {
                if($textList.is(':animated')) return;

                move('text', 'next', textLength, $textIndicator);
                slide($textList, 'next', 500);
            });

            // 텍스트 인디케이터 이동 기능
            const $textBullet = $textIndicator.children();  // 인디케이터 불릿

            $textBullet.on('click', function() {
                // 슬라이드 기능이 진행 중이라면 이 함수를 종료
                if($textList.is(':animated')) return;

                // 클릭한 불릿의 인덱스
                const index = $(this).index();

                // 현재 인덱스와 클릭한 인덱스의 값이 같으면 이 함수를 종료
                if(textIndicatorIndex === index) return;

                indicatorSlide('text', index, textLength, $textList, $textBullet);
            });
        },
        // 가져오기 실패 시 실행하는 함수
        error: function(xhr, status, error) { console.error("AJAX 실패 원인:", error); }
    });

    // ------------------------------

    // 챌린지 모드 이미지 슬라이드
    const $challengeList = $('#challengeImageSlide > div > ul');            // 이미지 목록
    const $prevChallenge = $('#challengeImageSlide > button:first-child');  // 이전 버튼
    const $nextChallenge = $('#challengeImageSlide > button:last-child');   // 다음 버튼

    // 이전 버튼을 누르면
    $prevChallenge.on('click', function() {
        // 이미지 목록이 애니메이션 중이라면 이 함수를 종료
        if($challengeList.is(':animated')) return;

        // 이전 이미지를 보여줌
        $challengeList.css({marginLeft: '-25%'}).prepend($challengeList.children().last())
            .animate({marginLeft: 0}, 300, 'swing');
    });

    // 다음 버튼을 누르면
    $nextChallenge.on('click', function() {
        if($challengeList.is(':animated')) return;

        // 다음 이미지를 보여줌
        $challengeList.animate({marginLeft: '-25%'}, 300, 'swing', function() {
            $(this).append($(this).children().first()).removeAttr('style');
        });
    });
});