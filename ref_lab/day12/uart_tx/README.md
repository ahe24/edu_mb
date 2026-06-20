# Day 12 — UART TX (송신 FSM · shift register)

UART 송신기. `start→data→stop` FSM 이 baud `tick` 마다 한 비트씩 직렬 출력, 시프트로
LSB first 전송. **Visualizer 파형** + **프레임 재조립 self-checking TB** 양쪽으로 검증.

## 프로젝트 구조 (권장 구조 준수)

```
uart_tx/
├─ rtl/
│  ├─ baud_gen.v           tick 생성 (TB·통합에서 의존)
│  └─ uart_tx.v            설계 RTL (sim 대상)
├─ testbench/
│  └─ tb_uart_tx.sv        tx 프레임 캡처·재조립 self-checking TB
├─ sim/
│  ├─ Makefile             comp → opt → sim → wave
│  └─ flist.f              컴파일 파일리스트 (baud_gen + uart_tx + tb)
└─ fpga/
   └─ arty.xdc             clk·rst (시뮬 전용 — uart_loop 에서 통합)
```

생성물(work·design.bin·qwave.db 등)은 `sim/` 에만 — 소스(rtl·tb)는 깨끗하게 유지.

## 설계 — 제어 동작

| state | tx | 전이 |
|:------|:--:|:-----|
| IDLE  | 1 | start → START (data 래치, busy=1) |
| START | 0 | tick → DATA (idx=0) |
| DATA  | sh[0] | tick 마다 시프트, idx==7 → STOP |
| STOP  | 1 | tick → IDLE (busy=0) |

- `tx` idle=1. 프레임 = start(0) + 8 data(LSB first) + stop(1).

## self-checking

시뮬 가속: `baud_gen CLK_HZ=160, BAUD=10 → DIV=16`. TB 가 `start+data` 구동 후 `tick`
시점마다 `tx` 를 10비트 프레임으로 캡처 → start(0)·stop(1)·data(LSB first) 재조립해
보낸 바이트와 비교. `busy` 가 idle 복귀 시 deassert 되는지도 확인. 프레이밍/값 불일치 시
`$error`. 콘솔 끝 `RESULT: PASS (0 mismatch)` = 전 바이트 일치.

## 실행 (sim/ 에서)

```bash
cd sim
make            # = make sim (comp→opt→sim 자동)
make wave       # Visualizer 로 design.bin + qwave.db 오픈
make clean
```

## 보드 (참고)

- **시뮬**: `baud_gen.v` + `uart_tx.v` + `tb_uart_tx.sv` (XDC 불필요).
- **보드 합성**: 단독보다 `uart_loop` top 통합 사용. tx 는 USB-UART TXD(D10) 에 매핑.
