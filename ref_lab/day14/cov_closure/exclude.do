# =============================================================================
# exclude.do ― 커버리지 클로저 : 도달불가 홀을 "사유와 함께" 제외(waiver)
#   Coverage View 모드(vsim -viewcov <ucdb>)에서 실행. -comment 는 view 모드에서만 지원.
#   제외는 UCDB 에 저장되고, -comment 사유는 HTML 리포트 툴팁으로 표시 → 심사 증적.
#
#   클로저 원칙 : 남은 홀은 반드시 셋 중 하나로 판정
#     (1) 테스트 추가로 커버      (실습2에서 수행)
#     (2) 도달불가 → 사유 남기고 제외   ← 이 파일
#     (3) 설계 결함 발견 → 설계 수정
#   사유 없는 미달로 검증을 끝내지 않는다.
# =============================================================================
transcript on

# [도달불가] trip_ctrl.v:69  default: state <= MONITOR;
#   state 는 2비트 전수 열거(MONITOR/WARN/TRIP_S/LATCH = 0~3)라 case default 는
#   원천 도달불가. 방어적 코딩 관행으로 코드는 유지하되 커버리지에서는 제외.
coverage exclude -srcfile trip_ctrl.v -linerange 69 \
    -comment "UNREACH: state 2-bit fully-enumerated; default is defensive/unreachable"

# 적용 결과 확인
coverage report
