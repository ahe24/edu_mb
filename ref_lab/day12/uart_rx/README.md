# Day 12 — UART RX (16× oversample · 비트 중앙 샘플)

UART 수신기. 16× oversample 로 start 하강엣지 검출 후 각 비트 **중앙**에서 샘플, 입력은
**2FF 동기화**. **Visualizer 파형** + **프레임 주입 self-checking TB** 양쪽으로 검증.

## 프로젝트 구조 (권장 구조 준수)

```
uart_rx/
├─ rtl/
│  ├─ baud_gen.v           tick16 생성 (TB·통합에서 의존)
│  └─ uart_rx.v            설계 RTL (sim 대상)
├─ testbench/
│  └─ tb_uart_rx.sv        rx_in bit-bang 주입 self-checking TB
├─ sim/
│  ├─ Makefile             comp → opt → sim → wave
│  └─ flist.f              컴파일 파일리스트 (baud_gen + uart_rx + tb)
└─ fpga/
   └─ arty.xdc             clk·rst (시뮬 전용 — uart_loop 에서 통합)
```

생성물(work·design.bin·qwave.db 등)은 `sim/` 에만 — 소스(rtl·tb)는 깨끗하게 유지.

## 설계 — 수신 흐름

- `rx_in` 비동기 입력 → 2FF(`s0`,`s1`) 동기화로 metastability 방어.
- IDLE 에서 `rx==0`(start) 검출 → START 중앙(os_cnt==7)에서 진입 확정.
- DATA 는 16틱마다(os_cnt==15) 비트 **중앙** 샘플, LSB first 시프트.
- STOP 후 `data` 확정 + `valid` 1클럭 펄스.

## self-checking

시뮬 가속: `baud_gen CLK_HZ=160, BAUD=160 → DIV=1 → tick16 매 클럭`, ∴ 1비트=16클럭.
TB 가 `rx_in` 을 비트당 16클럭 유지로 프레임(start+8 data+stop) bit-bang → 알려진 바이트
주입 → `valid` 가 1회 펄스 + `data` 가 보낸 바이트와 일치하는지 자동 판정. 2FF 효과로
입력 변화 시점이 클럭과 비정렬이어도 정상 수신. 불일치 시 `$error`. 콘솔 끝
`RESULT: PASS (0 mismatch)` = 전 바이트 일치.

## 실행 (sim/ 에서)

```bash
cd sim
make            # = make sim (comp→opt→sim 자동)
make wave       # Visualizer 로 design.bin + qwave.db 오픈
make clean
```

## 보드 (참고)

- **시뮬**: `baud_gen.v` + `uart_rx.v` + `tb_uart_rx.sv` (XDC 불필요).
- **보드 합성**: 단독보다 `uart_loop` top 통합 사용. rx_in 은 USB-UART RXD(A9) 에 매핑.
