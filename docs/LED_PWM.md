LED 디밍(Dimming)을 위한 PWM 제어 시, 기준 주파수(Frequency)는 보통 **200Hz에서 20kHz 사이**로 설정하며, 이에 따른 기준 주기(Period)는 **5ms에서 50µs**가 됩니다.

사용 목적과 구동 환경에 따라 최적의 주파수가 달라지며, 일반적으로 다음의 3가지 대역 중 하나를 선택합니다.

### 1. 목적에 따른 PWM 주파수 및 주기 설정

* **200Hz ~ 1kHz (주기: 5ms ~ 1ms)**
* **용도:** 상태 표시용 일반 LED, 단순 조명
* **특징:** 사람의 눈은 약 60Hz 이상이면 깜빡임(Flicker)을 거의 느끼지 못하지만, 눈을 빠르게 움직이거나 물체가 이동할 때 발생하는 '스트로보스코프 효과(잔상)'를 방지하기 위해 최소 200Hz 이상을 권장합니다.


* **1kHz ~ 10kHz (주기: 1ms ~ 100µs) - 가장 표준적인 대역**
* **용도:** 실내 조명, 디스플레이 백라이트, 고급 전자기기
* **특징:** 카메라로 촬영할 때 화면에 검은 줄이 생기는 플리커링 현상을 줄일 수 있고, 눈의 피로도를 최소화합니다. 가장 보편적으로 사용되는 기준 대역입니다.


* **20kHz 이상 (주기: 50µs 이하)**
* **용도:** 방송용 조명, 머신 비전(Machine Vision) 조명, 고성능 드라이버 회로
* **특징:** 인간의 가청 주파수(20Hz ~ 20kHz)를 벗어난 대역입니다. LED 자체는 소리가 나지 않지만, PWM 스위칭 과정에서 전원부의 인덕터(Inductor)나 캐패시터(Capacitor)가 떨리며 발생하는 고주파 소음(Coil Whine)을 원천 차단할 때 사용합니다.



---

### 2. 하드웨어 로직에서의 구현 기준

단순 소프트웨어 제어가 아닌 하드웨어(FPGA/ASIC)에서 레지스터와 카운터를 이용해 로직을 설계할 때는, 시스템 클럭(System Clock)을 기준으로 주기를 나눕니다.

목표 PWM 주파수가 정해지면, 카운터가 도달해야 할 최댓값(Top Value)은 다음과 같이 계산합니다.

$$MAX\_VAL = \frac{f_{sys}}{f_{pwm}} - 1$$

예를 들어, 시스템 클럭이 **100MHz**이고 목표 PWM 주파수가 **1kHz**(주기 1ms)라면, 카운터는 0부터 99,999까지 반복해야 합니다. Duty cycle은 이 100,000번의 카운트 내에서 High 상태를 유지할 카운트 값을 조절하여 설정합니다.

**하드웨어 로직 예시 (Verilog)**

```verilog
// Target PWM Frequency: 1kHz
// System Clock: 100MHz
// Period: 1ms (100,000 clock cycles)

localparam integer MAX_VAL = 100000 - 1;
reg [16:0] counter = 0;
reg [16:0] duty_cycle_val = 50000; // 50% duty cycle

always @(posedge clk) begin
    if (reset) begin
        counter <= 0;
        pwm_out <= 0;
    end else begin
        if (counter >= MAX_VAL) begin
            counter <= 0;
        end else begin
            counter <= counter + 1;
        end
        
        // Output logic based on duty cycle
        pwm_out <= (counter < duty_cycle_val) ? 1'b1 : 1'b0;
    end
end

```

---

### 💡 추가 설계 고려사항: 시각적 밝기의 비선형성

PWM Duty Cycle을 선형적(10%, 20%, 30%...)으로 증가시키면, 기계적인 출력 에너지는 선형으로 증가하지만 **사람의 눈은 밝기 변화를 로그(Log) 함수 형태로 인식**합니다.

즉, Duty Cycle을 50%로 설정하면 사람은 실제보다 훨씬 밝은 70~80% 수준으로 느끼게 됩니다. 따라서 자연스러운 디밍 제어를 원한다면, 선형적인 Duty Cycle 증가가 아닌 감마 보정(Gamma Correction)이 적용된 Look-Up Table(LUT)을 구성하여 저휘도 구간에서는 Duty 값을 미세하게 증가시키고, 고휘도 구간에서는 폭을 넓게 증가시키는 방식을 사용하는 것이 좋습니다.