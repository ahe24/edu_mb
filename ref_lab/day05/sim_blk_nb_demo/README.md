# Day 05 — Blocking / Non-Blocking SIM Mismatch Demo

슬라이드 *Blocking vs Non-Blocking 오용 4 패턴* (P1 / P2 / P4) 을
시뮬레이션 파형으로 직접 입증하는 실습.

## 목적

Lint 만으로는 "왜 mismatch 인지" 가 잘 와닿지 않는다. 동일 stimulus 로
`_bad` / `_good` DUT 를 병렬 구동, **Visualizer 파형** 으로 두 결과 차이를
직접 비교한다.

## 검증 시나리오

| 패턴 | 모듈 | 관찰 신호 | _bad 거동 | _good 거동 |
|------|------|-----------|-----------|-----------|
| P1 (CP17) | `pipe2_bad` / `pipe2_good` | `q2_bad`, `q2_good` | d 와 동일 (0 cycle) | d 보다 2 cycle 지연 |
| P4 (CP18) | `mac_bad` / `mac_good`      | `out_bad`, `out_good` | a+b 결과 1 cycle 후 | 2 cycle 후 (정상 파이프) |

→ 합성기는 어느 쪽이든 동일 RTL 로 인식, latency 가 다르게 나옴.
   이게 곧 **sim/synth mismatch** 의 정체.

## P2 (CP15) — sim demo 미포함 사유

P2 는 *Combo 블록에서 NB 사용* 이지만 **시뮬레이터 scheduling 의존** 이라
파형으로 일관되게 재현되지 않는다:

- 순수 combo→combo 체인 : 두 번째 always 가 y sensitivity 로 재트리거되어
  결국 동일 값으로 수렴 → 시간축 파형 차이 없음
- combo NB → seq sample : race 발생하지만 Questa 는 seq always 를 testbench
  프로세스보다 먼저 실행 → bad/good 모두 옛 y 읽음 → 결과 동일
- 다른 시뮬레이터는 다르게 행동 가능 → **sim-vs-sim mismatch** 위험

**결론**: 이 *비결정성 자체* 가 CP15 가 lint 규칙인 이유. 시뮬이 잡아준다고
보장 못함 → lint 단계에서 차단해야 안전. broken_rtl.v `fifo_ctrl.stage2`
에서 lint 검출됨 (slide 5-P2).

## 실행

```bash
make            # = make sim
make sim        # qrun batch — qrun.out/qwave.db 생성
make gui        # Visualizer GUI 로 파형 오픈
make live       # qrun + Visualizer 한 번에
make clean
```

## 파형 비교 팁

Visualizer Wave 창에서 다음을 위/아래로 묶어서 시각 비교:

```
clk
d
q2_bad   ── q2_good        ← 슬라이드 P1
out_bad  ── out_good       ← 슬라이드 P4
z_bad    ── z_good         ← 슬라이드 P2  (zoom-in 필요, delta 단위)
```

콘솔 `$monitor` 출력으로도 동일 시점 두 값 비교 가능.

## 파일

- `dut.v` — 6 개 모듈 (`pipe2_bad/good`, `chain_bad/good`, `mac_bad/good`)
- `tb_blk_nb_demo.sv` — 공통 stimulus + 양측 인스턴스 + `$monitor`
- `Makefile` — qrun + Visualizer 흐름
