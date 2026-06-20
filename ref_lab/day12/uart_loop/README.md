# Day 12 — UART loopback (TX + RX echo · scoreboard)

UART echo 루프백 top. `baud_gen ×2` + `uart_rx` + `uart_tx` 통합 — RX `valid` 를 TX
`start` 로 연결해 수신 바이트를 즉시 재전송. **Visualizer 파형** + **scoreboard
self-checking TB**(큐 기반 송수신 일치) 양쪽으로 검증.

## 프로젝트 구조 (권장 구조 준수)

```
uart_loop/
├─ rtl/
│  ├─ baud_gen.v           1× / 16× tick (서브모듈)
│  ├─ uart_rx.v            수신기 (서브모듈)
│  ├─ uart_tx.v            송신기 (서브모듈)
│  └─ uart_loop.v          보드 top — RX valid → TX start echo
├─ testbench/
│  └─ tb_uart_loop.sv      scoreboard 큐 self-checking TB
├─ sim/
│  ├─ Makefile             comp → opt → sim → wave
│  └─ flist.f              컴파일 파일리스트 (서브모듈 → top → tb)
└─ fpga/
   └─ arty.xdc             clk·rst·rx_pin(A9)·tx_pin(D10) USB-UART
```

생성물(work·design.bin·qwave.db 등)은 `sim/` 에만 — 소스(rtl·tb)는 깨끗하게 유지.

## 설계 — echo 경로

- `u_b1` = 1× tick(TX 비트 타이밍), `u_b16` = 16× tick(RX oversample, `BAUD×16`).
- `uart_rx` 가 `rx_pin` 수신 → `valid` 1클럭 펄스 + `rdata`.
- `valid` 를 `uart_tx.start` 로 직결 → 받은 바이트를 `tx_pin` 으로 즉시 재전송.
- `CLK_HZ/BAUD` 는 parameter — 기본값 실제(100MHz/115200), 시뮬은 TB 에서 override.

## self-checking — scoreboard

시뮬 가속: `uart_loop #(.CLK_HZ(160), .BAUD(10))` → 1× DIV=16, 16× DIV=1 → 1비트=16클럭.
TB 가 `rx_pin` 으로 N 바이트 프레임 주입 + 기대 바이트를 큐(`sb`)에 push, `tx_pin` echo
프레임을 bit-center 디코드해 큐와 pop·비교. 프레임/순서/값 불일치 시 `$error`. 4000-클럭
대기 없이 빠르게 완료. 콘솔 끝 `RESULT: PASS (0 mismatch)` = 전 바이트 echo 일치.

## 실행 (sim/ 에서)

```bash
cd sim
make            # = make sim (comp→opt→sim 자동)
make wave       # Visualizer 로 design.bin + qwave.db 오픈
make clean
```

## 보드 구현 (참고)

- **시뮬**: 서브모듈 4개 + `tb_uart_loop.sv` (작은 baud override, XDC 불필요).
- **보드 합성**: Vivado 에서 4개 RTL 컴파일, `fpga/arty.xdc`(uart_loop) 사용 —
  clk(100MHz, create_clock) · rst(BTN0) · rx_pin(USB-UART RXD, A9) · tx_pin(USB-UART
  TXD, D10). 호스트 터미널에서 친 문자가 그대로 echo 되어 돌아옴.
- **신호명 주의**: Arty 마스터의 `uart_txd_in`(호스트→FPGA)이 FPGA 입력 `rx_pin`,
  `uart_rxd_out`(FPGA→호스트)이 출력 `tx_pin`.
