# Day 11 — PWM RGB (mode FSM + PWM duty)

FSM + PWM 실습. 버튼 펄스로 4단계 밝기(OFF/DIM/MID/BRT)를 순환, 각 모드의 duty 로
RGB LED 한 채널을 PWM 점등. **Visualizer 파형** + **duty 측정 self-checking TB** 양쪽으로 검증.

## 프로젝트 구조 (권장 구조 준수)

```
pwm_rgb/
├─ rtl/
│  └─ pwm_rgb.v            설계 RTL (sim 대상, parameter CLK_HZ·PWM_HZ)
├─ testbench/
│  └─ tb_pwm_rgb.sv        duty 측정 self-checking TB
├─ sim/
│  ├─ Makefile             comp → opt → sim → wave
│  └─ flist.f              컴파일 파일리스트 (pwm_rgb + tb)
└─ fpga/
   └─ arty.xdc             보드 핀 (clk create_clock · rst · btn_p · rgb)
```

생성물(work·design.bin·qwave.db 등)은 `sim/` 에만 — 소스(rtl·tb)는 깨끗하게 유지.

## 보드 기준 — PWM 주파수와 RGB duty 상한 (중요)

- **메인 클럭 100MHz**, PWM 주파수는 **200Hz~1kHz** 권장(상태표시 LED 디밍 대역).
  기본 `PWM_HZ=1000` → 주기 `PERIOD = CLK_HZ/PWM_HZ = 100,000` 클럭(1ms).
  - 200Hz 미만: 눈 이동 시 잔상(스트로보) · 1kHz 초과: 불필요(단순 표시 LED).
  - (8비트 자유카운터 방식은 100MHz/256 ≈ 390kHz로 이 대역 밖)
- **RGB LED 는 매우 밝아 눈부심** → 최대 duty **50% 상한**(= `PERIOD/2`).
  단색 User LED 디밍이면 같은 구조로 100%(`PERIOD`)까지 사용 가능.

## 설계 — 모드 → duty (RGB 50% 상한)

| 모드 | duty (count) | 평균 밝기 |
|:----:|:------------:|:---------:|
| OFF  | 0          | 0 % |
| DIM  | PERIOD/8   | 12.5 % |
| MID  | PERIOD/4   | 25 % |
| MAX  | PERIOD/2   | **50 % (RGB 상한)** |

- `btn_p` 1펄스마다 `mode` 가 OFF→DIM→MID→MAX→OFF 순환(2비트 wrap).
- PWM 카운터 `cnt` 가 0..PERIOD-1 반복, `rgb = (cnt < duty)` → duty 비율만큼 ON.
- PWM 주파수 1kHz(1ms 주기)면 눈에는 깜빡임 없이 연속 밝기로 보임.

## self-checking

시뮬은 `CLK_HZ=256, PWM_HZ=1` 로 override(`PERIOD=256`) → 한 PWM 주기(`cnt==0` 경계
정렬)동안 `rgb` HIGH 클럭 수를 세어 기대 duty(0 / P/8 / P/4 / P/2)와 비교, 불일치 시
`$error`. 버튼 펄스로 OFF→DIM→MID→MAX→OFF(wrap)까지 측정 — **MAX 측정값이 정확히
PERIOD/2(=50%)** 인지로 RGB 상한도 확인. reset 중 `rgb` HIGH 면 `$error`.
콘솔 끝 `RESULT: PASS (0 mismatch)` = 모든 모드 duty 일치.

## 실행 (sim/ 에서)

```bash
cd sim
make            # = make sim (comp→opt→sim 자동)
make wave       # Visualizer 로 design.bin + qwave.db 오픈
make clean
```

## 보드 구현 (참고)

- **시뮬**: `pwm_rgb.v` + `tb_pwm_rgb.sv` (TB 가 btn_p 1펄스를 직접 구동, XDC 불필요).
- **보드 합성**: Vivado 에서 `pwm_rgb.v` 컴파일, `fpga/arty.xdc` 사용 —
  clk(100MHz, create_clock) · rst(BTN0) · btn_p(BTN1) · rgb(LD0 Green).
- `btn_p` 는 1-clk 펄스 — 실제 보드는 Day10 디바운서+상승엣지 검출 출력을 연결.
  raw 버튼을 직접 받으면 누르는 동안 mode 폭주.
