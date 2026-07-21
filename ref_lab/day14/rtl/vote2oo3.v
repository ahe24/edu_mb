// =============================================================================
// vote2oo3.v ― 3중 redundant 센서 2-out-of-3 다수결 (조합 로직)
//   trip_top 의 서브모듈 #1 ― condition/expression 커버리지 예시 소재.
//   3개 곱항의 OR 로 구성 : 어느 두 센서가 겹쳐도 vote 성립.
//
//   의도된 홀(base TB, sensor=3'b111 고정 인가 기준) :
//   [HOLE] 곱항 3개가 항상 동시에 참으로만 관찰 ― 개별 곱항이 서로 다른 값으로
//          분리 평가된 적이 없음(condition coverage). 1개 이하 센서 인가 조합도 미인가.
// =============================================================================
module vote2oo3 (
    input  wire [2:0] sensor,   // {c,b,a} 3중 redundant 초과-임계 플래그
    output wire       vote      // 2-of-3 다수결 성립
);

    assign vote = (sensor[0] & sensor[1]) |
                  (sensor[1] & sensor[2]) |
                  (sensor[0] & sensor[2]);

endmodule
