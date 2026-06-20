# Day 10 — Button Debouncer (2FF 동기 + STABLE 카운터)

비동기 버튼의 메타안정 방지(2FF) + 채터링 제거(STABLE 카운터).
**Visualizer 파형** + **directed self-checking TB** 로 검증.

## 프로젝트 구조

```
debounce/
├─ rtl/debounce.v            설계 RTL
├─ testbench/tb_debounce.sv  directed self-checking TB (STABLE override)
├─ sim/{Makefile, flist.f}   comp → opt → sim → wave
└─ fpga/arty.xdc             clk(create_clock) · rst · btn_in · btn_out
```

## 동작

1. **2FF 동기화** — `btn_in` 은 클럭과 무관한 비동기 입력 → `s0/s1` 2단 FF 로
   먼저 동기화(메타안정 방지). Day 07~08 CDC 가 요구하는 패턴.
2. **STABLE 카운터** — `s1` 이 `btn_out` 과 다른 상태를 `STABLE` 클럭 동안 유지하면
   `btn_out` 에 반영. 짧은 글리치는 카운터가 리셋되어 흡수.

## self-checking

- 짧은 글리치(STABLE 미만) → `btn_out` 불변
- 지속 입력(STABLE 초과) → `btn_out` 반영
- `expect_out()` 자동 판정, 콘솔 끝 `RESULT: PASS (0 mismatch)`.

## 실행

```bash
cd sim
make            # comp→opt→sim + self-check
make wave       # Visualizer
make clean
```

## 보드 구현 (참고)

Vivado 합성·보드 구현 시 `fpga/arty.xdc` — clk(100MHz, create_clock) · rst(BTN1) ·
btn_in(BTN0) · btn_out(LD4). STABLE 은 합성 시 실제 값(1_000_000 ≈ 10ms).
