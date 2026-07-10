# tb_layered — 계층화 재사용 Testbench (driver / monitor / scoreboard)

Day12 의 모놀리식 `tb_uart_loop.sv` 를 역할별 모듈로 분해한 재사용 TB.
DUT 는 Day12 `uart_loop` **원본을 상대참조** — RTL 사본 없음.

```
tb_top (조립 + 시나리오)
 ├─ u_drv : uart_driver     자극 주입 — send_byte(b) → rx_pin frame 구동   [구현 대상]
 ├─ dut   : uart_loop       Day12 echo 루프백 (baud_gen×2 + rx + tx)
 ├─ u_mon : uart_monitor    관찰 — tx_pin 디코드 → got/got_valid/frame_err  [제공]
 └─ u_sb  : uart_scoreboard 판정 — 기대값 queue 비교 · errors · report()    [제공]
```

## 역할 분리 원칙

| 컴포넌트 | 하는 일 | 하지 않는 일 |
|----------|---------|--------------|
| driver | 트랜잭션(바이트) → 핀 파형 | 관찰·판정 |
| monitor | 핀 파형 → 트랜잭션 복원 | 자극·판정 |
| scoreboard | 기대값 비교·집계·판정 | 핀 접근 |
| tb_top | 조립 + 시나리오(무엇을 보낼지) | 프로토콜 세부 |

- DUT 교체 시 driver/monitor 만 교체 — scoreboard·시나리오 재사용.
- 시나리오 추가 = `push_exp` + `send_byte` 호출 나열 — 프로토콜 코드 무수정.
- 동일 개념이 UVM 의 agent(driver/monitor)·scoreboard 구조로 이어짐.

## 실행

```bash
cd sim
make            # comp → opt → sim — RESULT: PASS (8 bytes, 0 mismatch)
make wave       # Visualizer: rx_pin/tx_pin + u_mon.got 파형
make clean
```
