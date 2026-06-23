# Day 11 — PWM RGB (2버튼 밝기 ±5% · 모듈 분해)

밝기 조절 PWM 실습. **증가/감소 버튼 2개**로 밝기 pct 를 **±5% (0~100%)** 조절하고,
그 duty 로 RGB LED 녹색 + 단색 User LED 를 PWM 점등. 설계를 **top·pwm_gen·debounce·
led_driver 로 분해**해 계층/통합을 학습하고, **`pwm_gen` 만 직접 구현**(나머지 제공).
**duty 측정 self-checking TB** 로 0→100→0% 전 구간을 검증.

## 프로젝트 구조 (권장 구조 준수)

```
pwm_rgb/
├─ rtl/
│  ├─ pwm_gen.v           ★ 직접 구현 ★ 밝기 ±5% saturating + PWM 비교 (sim 대상)
│  ├─ led_driver.v        제공 — PWM → RGB 녹색 + 단색 LED 분배
│  └─ pwm_top.v           제공 — 보드 top (debounce 2개 + 엣지검출 + 인스턴스)
├─ testbench/
│  └─ tb_pwm_gen.sv       duty 측정 self-checking TB (pwm_gen 단독)
├─ sim/
│  ├─ Makefile            comp → opt → sim → wave (+define+FUNC_SIM)
│  └─ flist.f             시뮬 파일리스트 (pwm_gen + tb)
└─ fpga/
   ├─ arty.xdc            보드 핀 (clk · rst · btn_up · btn_dn · rgb_r/g/b · mono)
   └─ board_flist.f       합성 파일리스트 (debounce 재사용 + pwm_gen + led_driver + pwm_top)
```

`debounce.v` 는 **사본을 만들지 않고** `seq_detect/rtl/debounce.v` 원본을
`board_flist.f` 에서 상대참조(`../../seq_detect/rtl/debounce.v`)로 재사용.
생성물(work·design.bin·qwave.db 등)은 `sim/` 에만 — 소스(rtl·tb)는 깨끗하게 유지.

## 모듈 분해 (구성요소 4단계)

```
BTN1(raw) ─►[① debounce]─► up_lvl ─►[② edge]─► up_p ┐
BTN2(raw) ─►[① debounce]─► dn_lvl ─►[② edge]─► dn_p ┤►[③ pwm_gen]─► pwm ─►[④ led_driver]─► RGB+단색 LED
```

| 모듈 | 역할 | 구현 |
|------|------|:----:|
| `debounce` ① | 버튼 채터링 제거 + 2FF 동기화 (Day10 재사용) | 제공 |
| `pwm_top` ②  | 보드 top — 디바운서 2개 인스턴스 + 상승엣지 검출 + 배선 | 제공 |
| `pwm_gen` ③  | 밝기 pct ±5% saturating(0~100%) + PWM 카운터/비교 | **직접** |
| `led_driver` ④ | PWM 1비트를 RGB 녹색 + 단색 User LED 에 분배 | 제공 |

## 보드 기준 — PWM 주파수와 밝기 (50% 상한 제거)

- **메인 클럭 100MHz**, PWM 주파수는 **200Hz~1kHz** 권장(상태표시 LED 디밍 대역).
  `PWM_HZ=1000` → 주기 `PERIOD = CLK_HZ/PWM_HZ = 100,000` 클럭(1ms).
  - 200Hz 미만: 잔상(스트로보) · 1kHz 초과: 단순 표시 LED 엔 불필요.
- **밝기 0~100% ±5%** — duty **상한 없음**. 버튼 1회당 `STEP=5%`, 0/100% 에서 포화.
  RGB 가 100%에서 눈부시면 **단색 User LED** 로 풀레인지를 편하게 확인(둘 다 같은 PWM).
- up·dn **동시 입력 시 변화 없음**(`pwm_gen` 에서 서로 가드).

## 설계 — pct(%) → duty

`pct` 0..100 을 `STEP=5` 단위 saturating up/down → `duty = pct*PERIOD/100`.
PWM 카운터 `cnt` 가 0..PERIOD-1 반복, `pwm = (cnt < duty)` → duty 비율만큼 ON.
PWM 1kHz(1ms 주기)면 눈에는 깜빡임 없이 연속 밝기로 보임.

## self-checking

시뮬은 `+define+FUNC_SIM` 으로 `pwm_gen` 의 `PERIOD=100`(100의 배수 → % 가 정확).
TB 가 `up_p/dn_p` 펄스로 밝기를 **0→100→0% 까지 ±5%** 쓸어내며, 각 단계에서 한 PWM
주기(`cnt==0` 경계 정렬) 동안 `pwm` HIGH 클럭 수를 세어 기대 `pct(%)` 와 비교, 불일치 시
`$error`. **0%·100% 포화**, **up·dn 동시입력 무변화**, **reset 중 `pwm`=0** 도 확인.
콘솔 끝 `RESULT: PASS (0 mismatch)` = 전 구간 duty 일치.

## 실행 (sim/ 에서)

```bash
cd sim
make            # = make sim (comp→opt→sim 자동, +define+FUNC_SIM)
make wave       # Visualizer 로 design.bin + qwave.db 오픈
make clean
```

## 보드 구현 (참고)

- **시뮬**: `pwm_gen.v` + `tb_pwm_gen.sv` (TB 가 up_p/dn_p 펄스를 직접 구동, XDC 불필요).
- **보드 합성**: Vivado 에서 `board_flist.f`(debounce + pwm_gen + led_driver + pwm_top)
  컴파일, `fpga/arty.xdc` 사용 — clk(100MHz) · rst(BTN0) · btn_up(BTN1) · btn_dn(BTN2) ·
  RGB LD0 녹색(밝기) · 단색 User LED(동일 밝기).
- `btn_up`/`btn_dn` 은 raw 버튼 — `pwm_top` 이 내부에서 디바운스+상승엣지로 1펄스 생성.
  raw 를 직접 받으면 누르는 동안 밝기 폭주.
