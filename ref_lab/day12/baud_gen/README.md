# Day 12 — baud generator (DIV 분주 · 1× / 16× tick)

UART 비트 타이밍 기반. 시스템 클럭을 `DIV = CLK_HZ/BAUD` 분주해 1클럭 폭 `tick` 펄스 생성.
**Visualizer 파형** + **self-checking TB**(주기·폭 자동 판정) 양쪽으로 검증.

## 프로젝트 구조 (권장 구조 준수)

```
baud_gen/
├─ rtl/
│  └─ baud_gen.v           설계 RTL (sim 대상)
├─ testbench/
│  └─ tb_baud_gen.sv       tick 주기(=DIV)·폭(1클럭) self-checking TB
├─ sim/
│  ├─ Makefile             comp → opt → sim → wave
│  └─ flist.f              컴파일 파일리스트 (baud_gen + tb)
└─ fpga/
   └─ arty.xdc             clk·rst (시뮬 전용 — uart_loop 에서 통합)
```

생성물(work·design.bin·qwave.db 등)은 `sim/` 에만 — 소스(rtl·tb)는 깨끗하게 유지.

## 설계 — 동작

- `DIV = CLK_HZ / BAUD`. 100MHz / 115200 ≈ 868. `cnt` 가 0..DIV-1 순환.
- `cnt==DIV-1` 마다 `tick` 1클럭 HIGH → 다음 클럭 LOW (1클럭 폭).
- 클럭을 분주해 새 클럭을 만들지 **않음** — 단일 clk 카운터(단일 클럭 도메인).
- TX 는 1× tick, RX 는 16× tick(`BAUD×16`)으로 비트 중앙 샘플.

## self-checking

시뮬 가속: `CLK_HZ=160, BAUD=10 → DIV=16` (실제 868 대신 작은 값). TB 가 `tick` 펄스
간격을 클럭으로 세어 `DIV` 와 비교, `tick` 이 2클럭 이상 HIGH 면 폭 위반으로 `$error`.
콘솔 끝 `RESULT: PASS (0 mismatch)` = 주기·폭 모두 기대값과 일치.

## 실행 (sim/ 에서)

```bash
cd sim
make            # = make sim (comp→opt→sim 자동)
make wave       # Visualizer 로 design.bin + qwave.db 오픈
make clean
```

## 보드 (참고)

- **시뮬**: `baud_gen.v` + `tb_baud_gen.sv` (작은 파라미터로 빠른 회귀).
- **보드 합성**: `baud_gen` 은 내부 tick 만 출력 → 단독 핀 없음. `uart_loop` top 에서
  실제 파라미터(100MHz/115200)로 인스턴스해 사용.
